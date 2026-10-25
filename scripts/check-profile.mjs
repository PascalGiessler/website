import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const entity = await readFile(new URL('../src/data/entity.ts', import.meta.url), 'utf8');
const role = entity.match(/export const ROLE = "([^"]+)";/)?.[1];
if (!role) throw new Error('Shared profile role is missing.');
const profile = JSON.parse(entity.match(/export const PROFILE = ([\s\S]*?) as const;/)?.[1] ?? 'null');
if (!profile) throw new Error('Shared profile descriptions are missing.');
const output = new URL('../dist/', import.meta.url);
const files = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}
await visit(output.pathname);
if (!files.length) throw new Error('Build the website before checking its public profile.');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  if (named[entity]) return named[entity];
  return String.fromCodePoint(entity.startsWith('&#x') ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10));
});
const normalise = text => decode(text).replace(/\s+/g, ' ').trim();
const issues = [];
for (const path of files) {
  const label = relative(output.pathname, path);
  const html = await readFile(path, 'utf8');
  const visible = normalise(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' '));
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
  const nodes = blocks.flatMap(block => Array.isArray(block) ? block : block['@graph'] ?? [block]);
  const people = nodes.filter(node => node['@type'] === 'Person' && node['@id']?.endsWith('/#person'));
  if (people.length !== 1 || people[0].jobTitle !== role) issues.push(`${label}: inconsistent Person identity`);
  const lang = html.match(/<html\b[^>]*lang=["'](en|de)["']/i)?.[1];
  if (!lang || people[0]?.description !== profile[lang].description) issues.push(`${label}: Person description differs from the shared profile`);
  if (!visible.includes(normalise(role))) issues.push(`${label}: current role is not visible`);
  if (lang && !visible.includes(normalise(profile[lang].entrepreneurialLine))) issues.push(`${label}: entrepreneurial profile is not visible`);
  for (const faq of nodes.filter(node => node['@type'] === 'FAQPage')) {
    for (const question of faq.mainEntity ?? []) {
      if (!visible.includes(normalise(question.name)) || !visible.includes(normalise(question.acceptedAnswer.text))) issues.push(`${label}: FAQ schema differs from visible content`);
    }
  }
  if (['index.html', 'de/index.html', 'about/index.html', 'de/about/index.html'].includes(label)) {
    if (/architect against Cognitive Debt|Architekt gegen Cognitive Debt/.test(visible)) issues.push(`${label}: outdated front-page positioning`);
  }
}
if (issues.length) throw new Error(issues.join('\n'));
console.log(`Consistent profile and visible FAQ verified across ${files.length} pages.`);
