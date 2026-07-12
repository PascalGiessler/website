#!/usr/bin/env node
/**
 * Pulls raw events from the self-hosted OpenPanel instance and aggregates them
 * into the metrics that matter for this site's goal (DACH AI positioning).
 *
 * Why raw events instead of OpenPanel's chart endpoint: the chart API's query
 * schema is not publicly documented, and we want metrics it does not offer
 * anyway (DACH share, section funnels, Substack outbound clicks). Pulling raw
 * events and aggregating here is fully under our control and easy to extend.
 *
 * Credentials (a READ client; the default write client cannot export):
 *   env OPENPANEL_API_URL / OPENPANEL_CLIENT_ID / OPENPANEL_CLIENT_SECRET
 *   or  .claude/openpanel.local.json  { apiUrl, clientId, clientSecret }
 * Both are gitignored. The secret must never be committed.
 *
 * Usage:
 *   node openpanel-report.mjs --days 30
 *   node openpanel-report.mjs --days 30 --json out.json
 *   node openpanel-report.mjs --probe        # dump one raw event (schema discovery)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------- config

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1] ?? true;
};
const has = (name) => args.includes(`--${name}`);

const DAYS = Number(flag("days", 30));
const PROBE = has("probe");
const JSON_OUT = flag("json", null);

function loadConfig() {
  const local = resolve(process.cwd(), ".claude/openpanel.local.json");
  let file = {};
  try {
    file = JSON.parse(readFileSync(local, "utf8"));
  } catch {
    /* env-only is fine */
  }
  const cfg = {
    apiUrl: process.env.OPENPANEL_API_URL || file.apiUrl,
    clientId: process.env.OPENPANEL_CLIENT_ID || file.clientId,
    clientSecret: process.env.OPENPANEL_CLIENT_SECRET || file.clientSecret,
  };
  if (!cfg.apiUrl || !cfg.clientId || !cfg.clientSecret) {
    console.error(`
Missing OpenPanel READ credentials.

The tracking client on the site is a "write" client: it can send events but the
API refuses to export with it ("Client is not allowed to export"). You need a
client with READ access.

  1. OpenPanel dashboard -> your project -> Clients -> new client, mode: read
  2. Put it in .claude/openpanel.local.json (gitignored):

     {
       "apiUrl": "https://analytics.continental.extrain.io/api",
       "clientId": "...",
       "clientSecret": "..."
     }

     or export OPENPANEL_API_URL / OPENPANEL_CLIENT_ID / OPENPANEL_CLIENT_SECRET.
`);
    process.exit(1);
  }
  return cfg;
}

const cfg = loadConfig();

// ---------------------------------------------------------------- fetching

async function fetchEvents({ start, end }) {
  const events = [];
  const LIMIT = 500;
  for (let page = 1; page <= 100; page++) {
    const url = new URL(`${cfg.apiUrl.replace(/\/$/, "")}/export/events`);
    url.searchParams.set("limit", String(LIMIT));
    url.searchParams.set("page", String(page));
    if (start) url.searchParams.set("start", start);
    if (end) url.searchParams.set("end", end);

    const res = await fetch(url, {
      headers: {
        "openpanel-client-id": cfg.clientId,
        "openpanel-client-secret": cfg.clientSecret,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`\nAPI error ${res.status} on ${url.pathname}\n${body}\n`);
      if (res.status === 401) {
        console.error(
          'If this says "Client is not allowed to export", the client is write-mode.\n' +
            "Create a read-mode client and use its id/secret.\n",
        );
      }
      process.exit(1);
    }
    const body = await res.json();
    // The export shape is not documented; accept the common variants rather
    // than guessing one and breaking on the next release.
    const batch = Array.isArray(body) ? body : body.data ?? body.items ?? body.events ?? [];
    events.push(...batch);
    if (batch.length < LIMIT) break;
  }
  return events;
}

// ---------------------------------------------------------------- helpers

/** Events carry fields at top level or under properties; look in both. */
const pick = (ev, ...keys) => {
  for (const k of keys) {
    const v = ev?.[k] ?? ev?.properties?.[k] ?? ev?.properties?.[`__${k}`];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const pathOf = (ev) => {
  const raw = pick(ev, "path", "url", "screen", "__path");
  if (!raw) return undefined;
  try {
    return new URL(raw, "https://pascal-giessler.de").pathname;
  } catch {
    return String(raw).split("?")[0];
  }
};

const DACH = new Set(["DE", "AT", "CH"]);

/** Which part of the site a path belongs to. This is the funnel we care about. */
function section(path) {
  if (!path) return "other";
  const p = path.replace(/^\/de/, "") || "/";
  if (p === "/") return "home";
  if (p.startsWith("/cognitive-debt")) return "pillar";
  if (p.startsWith("/glossary")) return "glossary";
  if (p.startsWith("/tools")) return "tools";
  if (p.startsWith("/post/") || p.startsWith("/posts")) return "writing";
  if (p.startsWith("/series")) return "series";
  if (p.startsWith("/about")) return "about";
  return "other";
}

function channelOf(referrer, referrerName) {
  const r = `${referrerName ?? ""} ${referrer ?? ""}`.toLowerCase();
  if (!r.trim()) return "direct";
  if (/google|bing|duckduckgo|ecosia|search/.test(r)) return "search";
  if (/linkedin|lnkd/.test(r)) return "linkedin";
  if (/substack/.test(r)) return "substack";
  if (/github/.test(r)) return "github";
  if (/chatgpt|openai|perplexity|claude\.ai|gemini|copilot/.test(r)) return "ai-assistant";
  return "other-referral";
}

const inc = (m, k, n = 1) => k !== undefined && m.set(k, (m.get(k) ?? 0) + n);
const top = (m, n = 12) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : "0%");

// ---------------------------------------------------------------- main

const end = new Date();
const start = new Date(end.getTime() - DAYS * 864e5);
const iso = (d) => d.toISOString();

const events = await fetchEvents({ start: iso(start), end: iso(end) });

if (PROBE) {
  console.log(`Fetched ${events.length} events. First event, raw:\n`);
  console.log(JSON.stringify(events[0] ?? null, null, 2));
  console.log(`\nTop-level keys seen across sample:`);
  const keys = new Set();
  for (const e of events.slice(0, 200)) Object.keys(e ?? {}).forEach((k) => keys.add(k));
  console.log([...keys].sort().join(", "));
  process.exit(0);
}

if (!events.length) {
  console.log(
    `No events in the last ${DAYS} days.\n` +
      `If the site is deployed, check that the collector is receiving: tracking only\n` +
      `fires on pascal-giessler.de (the origin allowlist rejects other origins).`,
  );
  process.exit(0);
}

const views = events.filter((e) => /screen_view|page_view|pageview/i.test(e.name ?? ""));
const outbound = events.filter((e) => /link_out|outgoing|outbound/i.test(e.name ?? ""));

const sessions = new Set();
const visitors = new Set();
const byPath = new Map();
const bySection = new Map();
const byCountry = new Map();
const byChannel = new Map();
const byLang = new Map();
const entryBySession = new Map();
const viewsPerSession = new Map();

for (const ev of views) {
  const p = pathOf(ev);
  const sid = pick(ev, "sessionId", "session_id");
  const pid = pick(ev, "profileId", "profile_id", "deviceId", "device_id");
  const country = pick(ev, "country", "geo_country");
  const ts = new Date(pick(ev, "createdAt", "created_at", "timestamp") ?? 0).getTime();

  if (sid) sessions.add(sid);
  if (pid) visitors.add(pid);
  inc(byPath, p);
  inc(bySection, section(p));
  inc(byCountry, country);
  inc(byChannel, channelOf(pick(ev, "referrer"), pick(ev, "referrerName", "referrer_name")));
  inc(byLang, p?.startsWith("/de") ? "de" : "en");

  if (sid) {
    inc(viewsPerSession, sid);
    const cur = entryBySession.get(sid);
    if (!cur || ts < cur.ts) entryBySession.set(sid, { path: p, ts });
  }
}

// Entry pages + single-page-session rate per entry: which sections pull people
// in, and which ones fail to send them anywhere next.
const byEntry = new Map();
const bounceByEntry = new Map();
for (const [sid, { path }] of entryBySession) {
  inc(byEntry, path);
  if ((viewsPerSession.get(sid) ?? 1) === 1) inc(bounceByEntry, path);
}

const outboundTargets = new Map();
for (const ev of outbound) {
  const href = pick(ev, "href", "url", "link", "__href");
  if (!href) continue;
  let host = href;
  try {
    host = new URL(href).host.replace(/^www\./, "");
  } catch {
    /* keep raw */
  }
  inc(outboundTargets, host);
}

const dachViews = [...byCountry].filter(([c]) => DACH.has(c)).reduce((a, [, n]) => a + n, 0);
const totalViews = views.length;
const substackClicks = [...outboundTargets]
  .filter(([h]) => h.includes("substack"))
  .reduce((a, [, n]) => a + n, 0);

// ---------------------------------------------------------------- report

const L = [];
L.push(`# Analytics review — last ${DAYS} days`);
L.push(`_${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)} · ${events.length} events_\n`);

L.push(`## Reach`);
L.push(`- Page views: **${totalViews}**`);
L.push(`- Sessions: **${sessions.size}**`);
L.push(`- Unique visitors: **${visitors.size}**`);
L.push(`- Views per session: **${(totalViews / (sessions.size || 1)).toFixed(2)}**\n`);

L.push(`## Positioning KPIs`);
L.push(`These are the numbers the brand actually lives on.\n`);
L.push(`- **DACH share** (DE/AT/CH): **${pct(dachViews, totalViews)}** (${dachViews} of ${totalViews} views)`);
L.push(`- **German-page share**: ${pct(byLang.get("de") ?? 0, totalViews)}`);
L.push(`- **Substack outbound clicks**: **${substackClicks}** (the closest thing to a conversion this static site has)\n`);

const sec = (name) => bySection.get(name) ?? 0;
L.push(`## Funnel by section`);
L.push(`| Section | Views | Share |`);
L.push(`|---|---:|---:|`);
for (const [s, n] of top(bySection, 20)) L.push(`| ${s} | ${n} | ${pct(n, totalViews)} |`);
L.push("");

L.push(`## Acquisition channels`);
L.push(`| Channel | Views | Share |`);
L.push(`|---|---:|---:|`);
for (const [c, n] of top(byChannel)) L.push(`| ${c} | ${n} | ${pct(n, totalViews)} |`);
L.push(`\n_OpenPanel sees referrers, not search keywords. For the queries people`);
L.push(`actually typed, pair this with Search Console (docs/seo-setup.md)._\n`);

L.push(`## Top pages`);
L.push(`| Path | Views |`);
L.push(`|---|---:|`);
for (const [p, n] of top(byPath, 15)) L.push(`| ${p} | ${n} |`);
L.push("");

L.push(`## Entry pages (and whether they lead anywhere)`);
L.push(`A high single-page rate on an entry page means people arrive and leave: the`);
L.push(`page answered them but never offered a next step.\n`);
L.push(`| Entry page | Sessions | Single-page sessions |`);
L.push(`|---|---:|---:|`);
for (const [p, n] of top(byEntry, 15)) {
  const b = bounceByEntry.get(p) ?? 0;
  L.push(`| ${p} | ${n} | ${b} (${pct(b, n)}) |`);
}
L.push("");

if (outboundTargets.size) {
  L.push(`## Outbound clicks`);
  L.push(`| Destination | Clicks |`);
  L.push(`|---|---:|`);
  for (const [h, n] of top(outboundTargets, 12)) L.push(`| ${h} | ${n} |`);
  L.push("");
}

if (byCountry.size) {
  L.push(`## Countries`);
  L.push(`| Country | Views |`);
  L.push(`|---|---:|`);
  for (const [c, n] of top(byCountry, 12)) L.push(`| ${c} | ${n} |`);
  L.push("");
}

const report = L.join("\n");
console.log(report);

if (JSON_OUT) {
  writeFileSync(
    JSON_OUT,
    JSON.stringify(
      {
        window: { days: DAYS, start: iso(start), end: iso(end) },
        totals: { events: events.length, views: totalViews, sessions: sessions.size, visitors: visitors.size },
        dachShare: totalViews ? dachViews / totalViews : 0,
        substackClicks,
        sections: Object.fromEntries(bySection),
        channels: Object.fromEntries(byChannel),
        paths: Object.fromEntries(top(byPath, 50)),
        entries: Object.fromEntries(top(byEntry, 50)),
        singlePageByEntry: Object.fromEntries(bounceByEntry),
        countries: Object.fromEntries(byCountry),
        outbound: Object.fromEntries(outboundTargets),
      },
      null,
      2,
    ),
  );
  console.error(`\nWrote ${JSON_OUT}`);
}
