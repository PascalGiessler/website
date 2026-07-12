import { SITE, breadcrumbSchema } from "./entity";

// Tool catalogue for /tools and /de/tools.
// Each tool is fully bilingual (en/de). Facts verified against the live site +
// repo README (AI Radar) and the launch material (Idea Assessor) on 2026-07-11.
// Voice: dry, precise, no em-dashes (project Design Rule 3).

export interface ToolSection {
  heading: string;
  body: string;
}

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolContent {
  status: string; // short state label, e.g. "Live · Open Source (MIT)"
  tagline: string; // one line under the name
  intro: string; // hero paragraph
  thesis: string; // the Cognitive-Debt link
  sections: ToolSection[];
  faq: ToolFaq[];
  visitLabel?: string; // CTA label when demo/repo present
  noLinkNote?: string; // shown instead of links when nothing is public
}

// A tool shows either a still (screenshot) or a short looping clip, never both.
export interface ToolMedia {
  kind: "image" | "video";
  src: string; // /assets/... path
  poster?: string; // video only
  width: number;
  height: number;
  alt: string; // image alt / video aria-label
  caption: { en: string; de: string };
}

export interface Tool {
  slug: string;
  name: string;
  position: number;
  applicationCategory: string; // schema.org SoftwareApplication category
  operatingSystem: string;
  license?: string;
  demo?: string;
  repo?: string;
  stack: string[];
  media?: ToolMedia;
  en: ToolContent;
  de: ToolContent;
}

export const tools: Tool[] = [
  {
    slug: "ai-radar",
    name: "AI Radar",
    position: 1,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, Docker, Kubernetes",
    license: "MIT",
    demo: "https://pascal-giessler.github.io/ai-tech-radar/",
    repo: "https://github.com/pascal-giessler/ai-tech-radar",
    stack: ["Python 3.12", "FastAPI", "Postgres + pgvector", "UMAP", "HDBSCAN", "Next.js 16", "Docker"],
    media: {
      kind: "image",
      src: "/assets/images/tools/ai-radar-scope.webp",
      width: 1440,
      height: 960,
      alt: "AI Radar's live scope view: tool contacts plotted by category bearing and momentum, with emergent clusters listed in the sidebar",
      caption: {
        en: "The live scope. Every contact is a repository, placed by momentum and category bearing. The clusters in the sidebar, Harness, MCP server, Coding agent, were not defined by hand: they emerged from the embeddings.",
        de: "Der Live-Scope. Jeder Kontakt ist ein Repository, platziert nach Momentum und Kategorie-Peilung. Die Cluster in der Seitenleiste, Harness, MCP-Server, Coding-Agent, wurden nicht von Hand definiert: Sie sind aus den Embeddings emergiert.",
      },
    },
    en: {
      status: "Live · Open Source (MIT)",
      tagline: "A technology radar that keeps itself current.",
      intro:
        "The Thoughtworks radar is a strong mental model with a poor refresh rate. Twice a year is fine for JVM frameworks. For AI tooling the map is stale before the ink dries. AI Radar closes that gap by computing the map instead of curating it.",
      thesis:
        "When a landscape moves faster than your review cadence, curation turns into Cognitive Debt: the organisation stops forming its own judgment and starts deciding by noise. AI Radar keeps the judgment in-house and the map current.",
      sections: [
        {
          heading: "How it works",
          body:
            "Trending GitHub repositories are re-scanned every 30 minutes and streamed to open browsers over SSE. Categories are not hand-assigned: they emerge from the data through an embed, reduce, HDBSCAN, c-TF-IDF pipeline, and the Clusters view shows the exact steps that produced them. Adoption rings (Adopt, Trial, Assess, Hold) are computed from momentum and maturity, not voted on in a committee.",
        },
        {
          heading: "Sovereign by design",
          body:
            "Self-hosted in one docker compose up. The radar belongs to your organisation, not to a vendor. The observation scope is configurable: AI and dev tools out of the box, Rust or platform and DevOps as bundled presets, or your own areas added through the UI with no rebuild.",
        },
        {
          heading: "Why it matters",
          body:
            "A curated vendor PDF gives you a map you cannot audit, cannot extend, and cannot keep current. AI Radar is nachvollziehbar (the pipeline is open), unabhängig (self-hosted, MIT), and current (recomputed every 30 minutes). Those are three properties a hand-curated landscape cannot offer.",
        },
      ],
      faq: [
        {
          q: "What is AI Radar?",
          a: "AI Radar is an open-source, self-hosted technology radar that keeps itself current. It re-scans trending GitHub repositories every 30 minutes, clusters them by embedding, and plots them on adoption rings computed from momentum and maturity.",
        },
        {
          q: "How is it different from a Thoughtworks-style radar?",
          a: "A classic radar is curated by a committee and published twice a year. AI Radar is computed from data and recomputed every 30 minutes, so the map never lags the field it describes.",
        },
        {
          q: "Can I use it for domains other than AI?",
          a: "Yes. AI and dev tools ship as the default. Rust and platform/DevOps are bundled presets, and you can add your own observation areas through the UI without a rebuild.",
        },
      ],
      visitLabel: "Live demo",
    },
    de: {
      status: "Live · Open Source (MIT)",
      tagline: "Ein Technologie-Radar, der sich selbst aktuell hält.",
      intro:
        "Der Thoughtworks-Radar ist ein starkes Mentalmodell mit schlechter Aktualisierungsrate. Zweimal im Jahr genügt für JVM-Frameworks. Im AI-Tooling ist die Karte veraltet, bevor die Tinte trocken ist. AI Radar schließt diese Lücke, indem er die Karte berechnet statt sie zu kuratieren.",
      thesis:
        "Wenn sich ein Feld schneller sortiert als der eigene Review-Zyklus, wird Kuration zu Cognitive Debt: Die Organisation bildet kein eigenes Urteil mehr und entscheidet nach Lärm. AI Radar hält das Urteil im Haus und die Karte aktuell.",
      sections: [
        {
          heading: "Wie er funktioniert",
          body:
            "Trending GitHub-Repos werden alle 30 Minuten neu gescannt und live per SSE in offene Browser gestreamt. Kategorien werden nicht von Hand vergeben: Sie emergieren aus den Daten über eine Pipeline aus Embedding, Reduktion, HDBSCAN und c-TF-IDF, und die Cluster-Ansicht zeigt die exakten Schritte, die sie erzeugt haben. Adoption-Ringe (Adopt, Trial, Assess, Hold) werden aus Momentum und Reife berechnet, nicht in einem Gremium abgestimmt.",
        },
        {
          heading: "Souverän gebaut",
          body:
            "Self-hosted mit einem einzigen docker compose up. Der Radar gehört Ihrer Organisation, nicht einem Anbieter. Der Beobachtungsbereich ist konfigurierbar: AI und Dev-Tools ab Werk, Rust oder Platform und DevOps als mitgelieferte Presets, oder eigene Bereiche über die UI ganz ohne Rebuild.",
        },
        {
          heading: "Warum das zählt",
          body:
            "Ein kuratiertes Vendor-PDF liefert eine Karte, die Sie nicht prüfen, nicht erweitern und nicht aktuell halten können. AI Radar ist nachvollziehbar (die Pipeline liegt offen), unabhängig (self-hosted, MIT) und aktuell (alle 30 Minuten neu berechnet). Das sind drei Eigenschaften, die eine handkuratierte Landkarte nicht bietet.",
        },
      ],
      faq: [
        {
          q: "Was ist AI Radar?",
          a: "AI Radar ist ein quelloffener, self-hosted Technologie-Radar, der sich selbst aktuell hält. Er scannt trending GitHub-Repos alle 30 Minuten, clustert sie per Embedding und platziert sie auf Adoption-Ringen, die aus Momentum und Reife berechnet werden.",
        },
        {
          q: "Wie unterscheidet er sich von einem Thoughtworks-Radar?",
          a: "Ein klassischer Radar wird von einem Gremium kuratiert und zweimal im Jahr veröffentlicht. AI Radar wird aus Daten berechnet und alle 30 Minuten neu erzeugt, sodass die Karte dem Feld nie hinterherhinkt.",
        },
        {
          q: "Kann ich ihn für andere Bereiche als AI nutzen?",
          a: "Ja. AI und Dev-Tools sind der Standard. Rust und Platform/DevOps sind mitgelieferte Presets, und eigene Beobachtungsbereiche lassen sich ohne Rebuild über die UI ergänzen.",
        },
      ],
      visitLabel: "Live-Demo",
    },
  },
  {
    slug: "idea-assessor",
    name: "Idea Assessor",
    position: 2,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web (self-hosted)",
    stack: ["SvelteKit", "Postgres", "Drizzle", "Node worker", "LISTEN/NOTIFY → SSE"],
    media: {
      kind: "video",
      src: "/assets/video/idea-assessor-promo.mp4",
      poster: "/assets/images/tools/idea-assessor-poster.webp",
      width: 1080,
      height: 1080,
      alt: "Idea Assessor: five rounds, then a verdict. The rubric, the round budget, and the kill rule in motion.",
      caption: {
        en: "Five rounds, then a verdict. The round budget and the kill rule are not UX details, they are the product.",
        de: "Fünf Runden, dann ein Urteil. Das Runden-Budget und die Kill-Regel sind keine UX-Details, sie sind das Produkt.",
      },
    },
    en: {
      status: "Built · Code on request",
      tagline: "An instrument that forces judgment on ideas.",
      intro:
        "AI has made refining an idea free. Judging one has not become any easier. Every model release makes it cheaper to reword the pitch one more time, and the moment of deciding, or discarding, never arrives. Idea Assessor puts that decision on a clock.",
      thesis:
        "Deferred judgment that looks like work is Cognitive Debt in its most everyday form. The constraint is the product: without a deadline every iteration is free, so none of them count.",
      sections: [
        {
          heading: "How it works",
          body:
            "Every idea runs through a fixed YC-style rubric: Problem, Market and Timing, Solution, Moat, Distribution. You get exactly five rounds to sharpen the weakest dimension, and there is no sixth. The kill rule is hard: a composite score below four discards the idea automatically, and the kill screen has no try-again button.",
        },
        {
          heading: "Two reviewers, not one",
          body:
            "One model scores; a second model checks it adversarially. Consensus is not guaranteed, and that is deliberate. Every assessment is stored with full provenance: model, prompt version, tokens in and out, and the raw output, with a per-row audit trigger recording who caused each change.",
        },
        {
          heading: "Sovereign by design",
          body:
            "Local-first: your own Postgres, no telemetry, nothing leaves your infrastructure. A judgment you cannot reconstruct is a gut feeling with a better interface. Here every judgment can be reconstructed, down to the model and prompt that produced it.",
        },
      ],
      faq: [
        {
          q: "What is Idea Assessor?",
          a: "Idea Assessor is a local-first tool that pressure-tests product ideas against a fixed YC-style rubric in exactly five rounds, with a hard kill rule and dual-model adversarial review, storing every assessment with full provenance.",
        },
        {
          q: "Why only five rounds and a kill rule?",
          a: "Because a constraint is what turns iteration into a decision. Five rounds are a budget only if there is no sixth; a kill rule disciplines only if it actually fires. Remove either and the tool becomes another notebook where judgments go to die.",
        },
        {
          q: "Is the code available?",
          a: "The tool is built and running locally. The code is available on request while the repository is being prepared for public release.",
        },
      ],
      noLinkNote: "Code available on request. Public release in preparation.",
    },
    de: {
      status: "Gebaut · Code auf Anfrage",
      tagline: "Ein Instrument, das ein Urteil über Ideen erzwingt.",
      intro:
        "KI hat das Feilen an Ideen kostenlos gemacht. Das Urteilen nicht. Mit jedem Modell-Release wird es leichter, den Pitch noch einmal umzuformulieren, und der Moment, in dem man sich festlegt oder verwirft, kommt nie. Idea Assessor gibt diesem Urteil eine Frist.",
      thesis:
        "Vertagtes Urteil, das wie Arbeit aussieht, ist Cognitive Debt in seiner alltäglichsten Form. Die Begrenzung ist das Produkt: Ohne Frist ist jede Iteration umsonst, also zählt keine.",
      sections: [
        {
          heading: "Wie es funktioniert",
          body:
            "Jede Idee läuft durch ein festes YC-Raster: Problem, Markt und Timing, Lösung, Moat, Vertrieb. Es gibt genau fünf Runden, um die schwächste Dimension zu schärfen, und keine sechste. Die Kill-Regel ist hart: Ein Composite unter vier verwirft die Idee automatisch, und der Kill-Screen hat keinen Nochmal-Button.",
        },
        {
          heading: "Zwei Reviewer, nicht einer",
          body:
            "Ein Modell bewertet, ein zweites prüft adversarial dagegen. Konsens ist nicht garantiert, und das ist Absicht. Jede Bewertung wird mit voller Provenienz gespeichert: Modell, Prompt-Version, Tokens rein und raus, und die Roh-Ausgabe, mit einem Audit-Trigger pro Zeile, der protokolliert, wer welche Änderung verursacht hat.",
        },
        {
          heading: "Souverän gebaut",
          body:
            "Local-first: eigene Postgres, keine Telemetrie, nichts verlässt die eigene Infrastruktur. Ein Urteil, das man nicht rekonstruieren kann, ist ein Bauchgefühl mit besserem Interface. Hier lässt sich jedes Urteil rekonstruieren, bis zu Modell und Prompt, die es erzeugt haben.",
        },
      ],
      faq: [
        {
          q: "Was ist Idea Assessor?",
          a: "Idea Assessor ist ein local-first Werkzeug, das Produktideen in genau fünf Runden gegen ein festes YC-Raster prüft, mit harter Kill-Regel und adversarialem Doppel-Modell-Review, und jede Bewertung mit voller Provenienz speichert.",
        },
        {
          q: "Warum nur fünf Runden und eine Kill-Regel?",
          a: "Weil erst eine Begrenzung aus Iteration eine Entscheidung macht. Fünf Runden sind nur ein Budget, wenn es keine sechste gibt; eine Kill-Regel diszipliniert nur, wenn sie wirklich feuert. Nimm eines davon weg, und das Tool wird ein weiteres Notizbuch, in dem Urteile sterben.",
        },
        {
          q: "Ist der Code verfügbar?",
          a: "Das Tool ist gebaut und läuft lokal. Der Code ist auf Anfrage verfügbar, während das Repository für die Veröffentlichung vorbereitet wird.",
        },
      ],
      noLinkNote: "Code auf Anfrage verfügbar. Veröffentlichung in Vorbereitung.",
    },
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

// SoftwareApplication (+ FAQPage, VideoObject, BreadcrumbList) for a tool page.
// Returned as an array; pass straight to <Layout jsonLd={...}>.
export function toolJsonLd(tool: Tool, lang: "en" | "de", pageUrl: string) {
  const c = tool[lang];
  const de = lang === "de";
  const base = de ? "/de/tools/" : "/tools/";
  const app: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: tool.applicationCategory,
    operatingSystem: tool.operatingSystem,
    description: c.tagline,
    url: pageUrl,
    inLanguage: lang,
    author: { "@type": "Person", name: "Dr. Pascal Giessler", url: "https://pascal-giessler.de" },
  };
  if (tool.repo) app.codeRepository = tool.repo;
  if (tool.license) app.license = tool.license;
  // Only claim a (free) offer for tools that are actually obtainable publicly.
  if (tool.demo || tool.repo) {
    app.offers = { "@type": "Offer", price: "0", priceCurrency: "EUR" };
  }
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const blocks: Record<string, unknown>[] = [app, faq];

  // A promo clip is a citable media object in its own right.
  if (tool.media?.kind === "video") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: `${tool.name} — ${c.tagline}`,
      description: tool.media.caption[lang],
      contentUrl: `${SITE}${tool.media.src}`,
      thumbnailUrl: tool.media.poster ? `${SITE}${tool.media.poster}` : undefined,
      uploadDate: "2026-07-11",
      duration: "PT18S",
      inLanguage: lang,
      creator: { "@type": "Person", name: "Dr. Pascal Giessler", url: SITE },
    });
  }

  blocks.push(breadcrumbSchema([
    [de ? "Start" : "Home", de ? "/de/" : "/"],
    [de ? "Werkzeuge" : "Tools", base],
    [tool.name, `${base}${tool.slug}/`],
  ]));

  return blocks;
}
