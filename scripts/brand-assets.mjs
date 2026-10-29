import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const assetDir = new URL("../public/assets/brand/", import.meta.url);
const master = readFileSync(new URL("pg-monogram.svg", assetDir), "utf8");
const viewBox = master.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
if (!viewBox) throw new Error("Logo master needs a zero-origin viewBox");
const width = Number(viewBox[1]);
const height = Number(viewBox[2]);
const side = Math.max(width, height);
const icon = master
  .replace(/viewBox="[^"]+"/, `viewBox="0 0 ${side} ${side}"`)
  .replace(/(<svg\b[^>]*>)/, `$1\n  <rect width="${side}" height="${side}" rx="${side / 5}" fill="#0D0C0A" stroke="none"/>\n  <g transform="translate(${(side - width) / 2} ${(side - height) / 2})">`)
  .replace("</svg>", "</g></svg>");
const ogTemplatePath = new URL("og-card-template.svg", import.meta.url);
const ogTemplate = readFileSync(ogTemplatePath, "utf8");
const markSlot = /<!-- brand-mark:start -->[\s\S]*?<!-- brand-mark:end -->/;
if (!markSlot.test(ogTemplate)) throw new Error("Identity card is missing its managed logo slot");
const ogMark = master.replace("<svg ", `<svg x="540" y="85" width="120" height="${120 * height / width}" `);
writeFileSync(ogTemplatePath, ogTemplate.replace(markSlot, `<!-- brand-mark:start -->\n  ${ogMark.trim()}\n  <!-- brand-mark:end -->`));
const favicon = new URL("../public/favicon.svg", import.meta.url);
writeFileSync(favicon, icon);
const monochrome = (colour) => master.replace(/#D19360|#EEE9E0/g, colour);
writeFileSync(new URL("pg-monogram-ink.svg", assetDir), monochrome("#1A1814"));
writeFileSync(new URL("pg-monogram-ivory.svg", assetDir), monochrome("#EEE9E0"));

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || "Logo raster export failed");
  }
}
const masterPath = fileURLToPath(new URL("pg-monogram.svg", assetDir));
const iconPath = fileURLToPath(favicon);
run("rsvg-convert", ["-w", "1024", masterPath, "-o", fileURLToPath(new URL("pg-monogram.png", assetDir))]);
const touchIconPath = fileURLToPath(new URL("apple-touch-icon.png", assetDir));
run("rsvg-convert", ["-w", "180", iconPath, "-o", touchIconPath]);
run("magick", [touchIconPath, "-define", "icon:auto-resize=48,32,16", fileURLToPath(new URL("../public/favicon.ico", import.meta.url))]);
console.log("Exported PG logo variants, transparent PNG, favicon and touch icon from one SVG master.");
