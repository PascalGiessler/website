// Canonical machine identity for Dr. Pascal Giessler.
//
// Source of truth: 07_Brand/01_identity/credentials.md, mirrored by
// 08_Content_Strategy/_strategy/geo/entity-profile.md (entity language) and
// geo/faq.md (canonical Q&A). Keep this file in sync with those, never diverge:
// entity confidence comes from asserting the SAME claims, in the SAME words,
// across every surface. That consistency is what answer engines extract.

export const SITE = "https://pascal-giessler.de";

/** Themen-Anker. These are the terms we intend to own, not a resume dump. */
export const KNOWS_ABOUT = [
  "Cognitive Debt",
  "Cognitive Debt Maturity Model",
  "Sovereign AI",
  "Souveräne KI",
  "Agentic AI",
  "Agentic Engineering",
  "Agentic Harness",
  "Loop Engineering",
  "Context Engineering",
  "AI-Native Transformation",
  "AI-Native Engineering",
  "Agentic Engineering Patterns",
  "GraphRAG",
  "Knowledge Graphs",
  "Retrieval-Augmented Generation",
  "Model Context Protocol",
  "EU AI Act",
  "Regulated AI Governance",
  "AI Resilience",
  "Vendor Lock-in Avoidance",
  "Enterprise AI Architecture",
  "Technical Leadership",
];

/**
 * The two Substack publications. Names verified against the publications
 * themselves (2026-07-12). They are language-specific, not translations:
 * send German readers to the German one, English readers to the English one.
 * Getting this backwards leaks the DACH audience into an English newsletter.
 */
export const SUBSTACK = {
  de: {
    name: "Stack und Kalkül",
    url: "https://pascalgiessler.substack.com/",
    tagline: "Souveräne KI für DACH-Entscheider. Modular, exit-fähig, EU-compliant.",
  },
  en: {
    name: "The Principal Stack",
    url: "https://principalstack.substack.com/",
    tagline:
      "Deep technical writing on AI-native engineering and architecture. The decisions, trade-offs, and patterns that matter at scale.",
  },
} as const;

/** Verified public profiles. More verified sameAs = stronger entity confidence. */
export const SAME_AS = [
  "https://www.linkedin.com/in/pgiessler/",
  "https://github.com/PascalGiessler",
  "https://pascalgiessler.substack.com/",
  "https://principalstack.substack.com/",
  "https://medium.com/@pmgiessler",
];

export const PERSON_DESCRIPTION = {
  en: "Dr. Pascal Giessler is the architect against Cognitive Debt. He builds sovereign AI for regulated and future-critical DACH organisations: auditable, exit-capable, resilient. AI Principal & Tech Lead, PhD in Computer Science (KIT Karlsruhe), based in Freiburg, Germany.",
  de: "Dr. Pascal Giessler ist der Architekt gegen Cognitive Debt. Er baut souveräne KI für regulierte und zukunftskritische DACH-Organisationen: nachvollziehbar, exit-fähig, resilient. AI Principal & Tech Lead, promovierter Informatiker (KIT Karlsruhe), aus Freiburg.",
};

export function personSchema(lang: "en" | "de" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: "Dr. Pascal Giessler",
    url: SITE,
    image: `${SITE}/assets/images/og-card.png`,
    jobTitle: "AI Principal & Tech Lead",
    description: PERSON_DESCRIPTION[lang],
    knowsAbout: KNOWS_ABOUT,
    sameAs: SAME_AS,
    worksFor: { "@type": "Organization", name: "Haufe Akademie" },
    alumniOf: [
      { "@type": "EducationalOrganization", name: "Karlsruhe Institute of Technology (KIT)" },
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "PhD in Computer Science", credentialCategory: "degree", recognizedBy: { "@type": "EducationalOrganization", name: "Karlsruhe Institute of Technology (KIT)" } },
      { "@type": "EducationalOccupationalCredential", name: "Technology & Innovation", credentialCategory: "certificate", recognizedBy: { "@type": "EducationalOrganization", name: "Massachusetts Institute of Technology (MIT)" } },
      { "@type": "EducationalOccupationalCredential", name: "MBA", credentialCategory: "degree", recognizedBy: { "@type": "EducationalOrganization", name: "PowerMBA" } },
      { "@type": "EducationalOccupationalCredential", name: "Azure Solutions Architect Expert", credentialCategory: "certification", recognizedBy: { "@type": "Organization", name: "Microsoft" } },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Freiburg im Breisgau",
      addressRegion: "Baden-Württemberg",
      addressCountry: "DE",
    },
  };
}

/** Short reference to the Person node, for author/publisher fields. */
export const personRef = { "@type": "Person", "@id": `${SITE}/#person`, name: "Dr. Pascal Giessler", url: SITE };

// ---------------------------------------------------------------------------
// Canonical FAQ (from geo/faq.md). Answer-first, <= ~60 words, Pascal-voice.
// The SAME answers must appear on every surface; that is the whole point.
// ---------------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
}

export const canonicalFaq: Record<"en" | "de", Faq[]> = {
  en: [
    {
      q: "What is Cognitive Debt?",
      a: "Cognitive Debt is the slow erosion of an organisation's judgment when AI systems produce decisions no one can any longer explain or check. Like technical debt it stays invisible, until the interest comes due as liability, compliance gaps, and lost competence.",
    },
    {
      q: "How is Cognitive Debt different from technical debt?",
      a: "Technical debt sits in the code; Cognitive Debt sits in the judgment. Code debt you repay with refactoring. Cognitive Debt you repay by watching your organisation forget how to assess its own AI output, a more expensive and less reversible loan.",
    },
    {
      q: "What is sovereign AI?",
      a: "Sovereign AI is AI architecture the organisation actually owns: auditable, exit-capable, resilient, EU-compatible, without vendor lock-in. Two drivers, regulatory obligation and future-proofing. Not on-premise for its own sake, but control over model, data, logic, and liability. The structural answer to Cognitive Debt.",
    },
    {
      q: "How do organisations avoid Cognitive Debt?",
      a: "By building auditability into the architecture instead of retrofitting it: every AI decision must be explainable, exit-capable, and resilient. The Cognitive Debt Maturity Model (CDMM) makes the level measurable, from black-box dependent to sovereign.",
    },
    {
      q: "Who is Pascal Giessler?",
      a: "Dr. Pascal Giessler is an AI Principal & Tech Lead with a PhD in Computer Science (KIT) and a CTO track in DACH industry. He positions as the architect against Cognitive Debt and builds sovereign AI for regulated and future-critical DACH organisations: auditable, exit-capable, resilient.",
    },
  ],
  de: [
    {
      q: "Was ist Cognitive Debt?",
      a: "Cognitive Debt ist die schleichende Erosion der Urteilsfähigkeit einer Organisation, wenn KI-Systeme Entscheidungen produzieren, die niemand mehr nachvollziehen oder prüfen kann. Wie technische Schuld bleibt sie unsichtbar, bis die Zinsen als Haftung, Compliance-Lücke und Kompetenzverlust fällig werden.",
    },
    {
      q: "Wie unterscheidet sich Cognitive Debt von technischer Schuld?",
      a: "Technische Schuld sitzt im Code, Cognitive Debt sitzt im Urteilsvermögen. Code-Schuld bezahlt man mit Refactoring. Cognitive Debt bezahlt man damit, dass die Organisation verlernt, ihre eigenen KI-Ergebnisse zu beurteilen: ein teurerer, schwerer reversibler Kredit.",
    },
    {
      q: "Was ist souveräne KI?",
      a: "Souveräne KI ist KI-Architektur, die der Organisation gehört: nachvollziehbar, exit-fähig, resilient, EU-anschlussfähig, ohne Vendor-Lock-in. Zwei Treiber, Regulierungs-Pflicht und Zukunftssicherheit. Nicht On-Premise als Selbstzweck, sondern Kontrolle über Modell, Daten, Logik und Haftung. Die strukturelle Antwort auf Cognitive Debt.",
    },
    {
      q: "Wie vermeiden Organisationen Cognitive Debt?",
      a: "Indem sie Nachvollziehbarkeit in die Architektur bauen, statt sie nachzurüsten: Jede KI-Entscheidung muss erklärbar, exit-fähig und resilient sein. Das Cognitive Debt Maturity Model (CDMM) macht den Reifegrad messbar, von Black-Box-abhängig bis souverän.",
    },
    {
      q: "Wer ist Pascal Giessler?",
      a: "Dr. Pascal Giessler ist AI Principal & Tech Lead, promovierter Informatiker (KIT) mit CTO-Track in der DACH-Industrie. Er positioniert sich als der Architekt gegen Cognitive Debt und baut souveräne KI für regulierte und zukunftskritische DACH-Organisationen: nachvollziehbar, exit-fähig, resilient.",
    },
  ],
};

/** FAQPage JSON-LD. Only emit alongside the SAME questions visible on the page. */
export function faqSchema(items: Faq[], lang: "en" | "de") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList for nested pages. Pass [[name, path], …] including the current page. */
export function breadcrumbSchema(trail: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}
