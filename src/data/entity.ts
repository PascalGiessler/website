// Shared public identity for the website. Role and responsibility confirmed by Pascal
// on 2026-10-25. These current facts take precedence over older Brand-OS bios.
// Keep visible copy, metadata and structured data on this shared profile.

export const SITE = "https://pascal-giessler.de";

export const ROLE = "Principal AI & AI Lead";
export const PROFILE = {
  "en": {
    "siteTitle": "Dr. Pascal Giessler | Principal AI & AI Lead",
    "description": "Dr. Pascal Giessler is Principal AI & AI Lead at Haufe Akademie, responsible for organisational AI transformation. He is also a mentor, strategic advisor and Stealth CEO, with prior CTO experience. Based in Freiburg, Germany.",
    "roleLine": "Principal AI & AI Lead · Mentor & Strategic Advisor",
    "intro": "At Haufe Akademie, I lead organisational AI transformation, work closely with the CTO and support strategic initiatives. I connect technical decisions with the changes needed in how an organisation works.",
    "bio": [
      "My work covers AI transformation and the engineering of agentic systems. I focus on how teams choose useful applications, evaluate results and take responsibility for systems in operation.",
      "As a mentor and strategic advisor, I help people work through technical and organisational decisions. I have previously worked as a CTO and founded a company. I hold a PhD in Computer Science from KIT and am based in Freiburg, Germany.",
      "Alongside my AI Lead role, I work as a Stealth CEO on other projects that are not yet public."
    ],
    "contactTitle": "Discuss AI leadership and transformation",
    "contactBody": "For a conversation about an AI leadership role, strategic advisory or mentoring, contact me on LinkedIn or by email.",
    "contactLabel": "Contact me",
    "entrepreneurialLine": "Ex-CTO · Stealth CEO"
  },
  "de": {
    "siteTitle": "Dr. Pascal Giessler | Principal AI & AI Lead",
    "description": "Dr. Pascal Giessler ist Principal AI & AI Lead bei der Haufe Akademie und verantwortet die organisatorische AI-Transformation. Er ist außerdem Mentor, strategischer Berater und Stealth CEO mit früherer CTO-Erfahrung. Er lebt in Freiburg.",
    "roleLine": "Principal AI & AI Lead · Mentor & Strategischer Berater",
    "intro": "Bei der Haufe Akademie verantworte ich die organisatorische AI-Transformation, arbeite eng mit dem CTO zusammen und betreue strategische Initiativen. Dabei verbinde ich technische Entscheidungen mit den Veränderungen in der Arbeitsweise der Organisation.",
    "bio": [
      "Ich beschäftige mich mit AI-Transformation und dem Engineering agentischer Systeme. Mich interessiert, wie Teams geeignete Anwendungen auswählen, Ergebnisse prüfen und Verantwortung für den Betrieb übernehmen.",
      "Als Mentor und strategischer Berater begleite ich technische und organisatorische Entscheidungen. Zuvor war ich als CTO tätig und habe ein Unternehmen gegründet. Ich habe in Informatik am KIT promoviert und lebe in Freiburg.",
      "Neben meiner Arbeit als AI Lead arbeite ich als Stealth CEO an weiteren Projekten, die noch nicht öffentlich sind."
    ],
    "contactTitle": "Über AI Leadership und Transformation sprechen",
    "contactBody": "Für einen Austausch über eine AI-Führungsrolle, strategische Beratung oder Mentoring erreichen Sie mich auf LinkedIn oder per E-Mail.",
    "contactLabel": "Kontakt aufnehmen",
    "entrepreneurialLine": "Ex-CTO · Stealth CEO"
  }
} as const;

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
  "AI Leadership",
  "Agent Evaluation",
  "Deterministic Automation",
  "Strategic Advisory",
  "Mentoring",
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
    tagline: "AI-Transformation, agentische Systeme und technische Führungsentscheidungen.",
  },
  en: {
    name: "The Principal Stack",
    url: "https://principalstack.substack.com/",
    tagline:
      "AI transformation, agentic engineering and technical leadership. Architecture decisions and how to evaluate their consequences.",
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
  en: PROFILE.en.description,
  de: PROFILE.de.description,
};

export function personSchema(lang: "en" | "de" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: "Dr. Pascal Giessler",
    url: SITE,
    image: `${SITE}/assets/images/og-card.png`,
    jobTitle: ROLE,
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
// Shared public-profile FAQ, based on the current confirmed positioning.
// The SAME answers must appear on every surface; that is the whole point.
// ---------------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
}

export const canonicalFaq: Record<"en" | "de", Faq[]> = {
  "en": [
    {
      "q": "Who is Pascal Giessler?",
      "a": "Dr. Pascal Giessler is Principal AI & AI Lead at Haufe Akademie, responsible for organisational AI transformation. He is also a mentor, strategic advisor and Stealth CEO, with prior CTO experience. Based in Freiburg, Germany."
    },
    {
      "q": "What does his work as an AI Lead involve?",
      "a": "At Haufe Akademie, Pascal is responsible for organisational AI transformation. He works closely with the CTO and supports strategic initiatives. His writing connects this role with technical questions about agentic systems, evaluation and automation."
    },
    {
      "q": "When is an agent useful, and when is a workflow enough?",
      "a": "A workflow fits steps with known rules and transitions. An agent can help where the next step requires interpretation or exploration. Permissions and business rules still need to be enforced by the surrounding system. The choice depends on the task and the required reliability."
    },
    {
      "q": "Why evaluate an agent again after a model change?",
      "a": "A different model can change tool selection, error patterns and when the agent asks for help. The evaluation cases can remain, but the new system needs its own measured results. Compare task quality and rule violations as well as cost and human rework."
    },
    {
      "q": "What is Cognitive Debt?",
      "a": "Cognitive Debt describes a loss of the ability to assess decisions when a team relies on AI results it can no longer explain or check. Pascal uses the concept to discuss evaluation, retained expertise and responsibility for AI systems."
    }
  ],
  "de": [
    {
      "q": "Wer ist Pascal Giessler?",
      "a": "Dr. Pascal Giessler ist Principal AI & AI Lead bei der Haufe Akademie und verantwortet die organisatorische AI-Transformation. Er ist außerdem Mentor, strategischer Berater und Stealth CEO mit früherer CTO-Erfahrung. Er lebt in Freiburg."
    },
    {
      "q": "Was umfasst seine Arbeit als AI Lead?",
      "a": "Bei der Haufe Akademie verantwortet Pascal die organisatorische AI-Transformation. Er arbeitet eng mit dem CTO zusammen und betreut strategische Initiativen. In seinen Texten verbindet er diese Aufgabe mit technischen Fragen zu agentischen Systemen, Evaluation und Automatisierung."
    },
    {
      "q": "Wann hilft ein Agent, und wann genügt ein Workflow?",
      "a": "Ein Workflow eignet sich für Schritte mit bekannten Regeln und Zustandsübergängen. Ein Agent kann dort helfen, wo der nächste Schritt Interpretation oder Erkundung erfordert. Berechtigungen und fachliche Regeln muss das umgebende System weiterhin durchsetzen. Die Wahl hängt von der Aufgabe und der nötigen Verlässlichkeit ab."
    },
    {
      "q": "Warum braucht ein Agent nach einem Modellwechsel eine neue Evaluation?",
      "a": "Ein anderes Modell kann die Tool-Auswahl, Fehlermuster und das Rückfrageverhalten verändern. Die Eval-Fälle können bleiben, doch das neue System braucht eigene Messergebnisse. Neben fachlicher Güte und Regelverstößen gehören Kosten und menschliche Nacharbeit in den Vergleich."
    },
    {
      "q": "Was ist Cognitive Debt?",
      "a": "Cognitive Debt beschreibt den Verlust der Fähigkeit, Entscheidungen zu beurteilen, wenn ein Team sich auf KI-Ergebnisse verlässt, die es nicht mehr erklären oder prüfen kann. Pascal nutzt den Begriff, um über Evaluation, erhaltenes Fachwissen und Verantwortung für AI-Systeme zu sprechen."
    }
  ]
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
