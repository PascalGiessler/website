// Homepage copy (EN + DE).
//
// The page follows the positioning ladder from 08_Content_Strategy/_strategy/
// positioning.md, in this order and no other:
//
//   Feindbild   -> Cognitive Debt. AI-native transformation makes judgment cheap
//                  to skip, and the organisation quietly stops being able to
//                  explain its own decisions.
//   Mechanismus -> Three levels of the same answer: transform the organisation
//                  around judgment, engineer the agentic harness where judgment
//                  actually lives (tools, context, termination), and own the
//                  architecture (auditable, independent, resilient).
//   Beweis      -> The tools. Shown, not claimed. Proof stays in the background;
//                  it is never the message.
//
// The name is the eyebrow, not the headline: nobody searches for a person, they
// search for the problem. Copy carries no em-dashes (Design Rule 3).

export interface HomeTile {
  num: string;
  title: string;
  body: string;
  tags: string[];
  href: string; // where the term is defined or argued
  hrefLabel: string;
}

export interface HomeContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  standfirst: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  credentials: string[];

  enemyLabel: string;
  enemyTitle: string;
  enemyTitleAccent: string;
  enemyBody: string;
  enemyFaces: Array<{ name: string; body: string }>;
  enemyCta: { label: string; href: string };

  mechanismLabel: string;
  mechanismIntro: string;
  tiles: HomeTile[];

  proofLabel: string;
  proofTitle: string;
  proofTitleAccent: string;
  proofIntro: string;
  proofCta: { label: string; href: string };

  writingLabel: string;
  writingCta: { label: string; href: string };
  glossaryCta: { label: string; href: string };
}

export const home: Record<"en" | "de", HomeContent> = {
  en: {
    eyebrow: "Dr. Pascal Giessler · AI Principal · Freiburg",
    titleLead: "The architect against",
    titleAccent: "Cognitive Debt",
    standfirst:
      "AI-native transformation is making judgment cheap to skip. Organisations adopt agentic systems they cannot explain, and quietly lose the ability to assess their own decisions. I build sovereign AI for regulated and future-critical DACH organisations, where the harness keeps the judgment inside the house: auditable, exit-capable, resilient.",
    ctaPrimary: { label: "What is Cognitive Debt?", href: "/cognitive-debt/" },
    ctaSecondary: { label: "Subscribe", href: "#newsletter" },
    credentials: [
      "PhD · KIT",
      "MIT · Innovation Management",
      "MBA",
      "Azure Solutions Architect Expert",
      "Former CTO · DACH consultancy",
    ],

    enemyLabel: "The problem",
    enemyTitle: "The interest comes due",
    enemyTitleAccent: "later",
    enemyBody:
      "Cognitive Debt is the slow erosion of an organisation's judgment when AI systems produce decisions no one can any longer explain or check. Like technical debt it stays invisible, until the interest falls due.",
    enemyFaces: [
      {
        name: "Liability",
        body: "In a regulated context you have to be able to justify every output. From August 2026 the EU AI Act makes traceability an obligation, not a comfort.",
      },
      {
        name: "Dependence",
        body: "Hand your judgment to a black box and you cannot get it back. The vendor owns the model, the logic, and eventually the decision.",
      },
      {
        name: "Fragility",
        body: "One provider outage, one price change, one deprecated model, and the organisation's ability to decide goes with it.",
      },
    ],
    enemyCta: { label: "The framework, and how to measure it →", href: "/cognitive-debt/" },

    mechanismLabel: "The answer",
    mechanismIntro:
      "Three levels of the same move. Judgment is not a policy you write, it is a property you build in.",
    tiles: [
      {
        num: "01",
        title: "AI-Native Transformation",
        body:
          "Rebuild how the organisation works around AI, rather than bolting AI onto how it already works. The tell is where the judgment sits: a bolted-on rollout buys tools and hopes for output. A native transformation redesigns the decision paths and the review that keeps those decisions explainable.",
        tags: ["decision paths", "governance", "enablement", "review"],
        href: "/glossary/#ai-native-transformation",
        hrefLabel: "Definition",
      },
      {
        num: "02",
        title: "Agentic Engineering & the Harness",
        body:
          "An agent is a model in a loop calling tools. The loop is the trivial part. The reliability, and the judgment, live in the harness: the tools you expose, the context you assemble, and the condition on which the loop stops. That is where the engineering belongs, not in the prompt.",
        tags: ["harness", "tool use", "context engineering", "evals", "termination"],
        href: "/glossary/#agentic-harness",
        hrefLabel: "Definition",
      },
      {
        num: "03",
        title: "Sovereign AI",
        body:
          "Architecture the organisation actually owns: auditable, so it holds up in front of a board and an auditor. Independent, so no vendor owns your exit. Resilient, so an outage or a deprecation does not take your decision-making with it. Not on-premise for its own sake, but control over model, data, logic, and liability.",
        tags: ["auditable", "exit-capable", "resilient", "EU AI Act"],
        href: "/glossary/#sovereign-ai",
        hrefLabel: "Definition",
      },
    ],

    proofLabel: "Proof",
    proofTitle: "Instruments, not",
    proofTitleAccent: "demos",
    proofIntro:
      "Two tools I built and use. Each is the same thesis in running code: valuable AI forces a decision instead of deferring it.",
    proofCta: { label: "All tools →", href: "/tools/" },

    writingLabel: "Latest writing",
    writingCta: { label: "All essays ↗", href: "/posts/" },
    glossaryCta: { label: "The vocabulary: agentic AI, in plain terms →", href: "/glossary/" },
  },

  de: {
    eyebrow: "Dr. Pascal Giessler · AI Principal · Freiburg",
    titleLead: "Der Architekt gegen",
    titleAccent: "Cognitive Debt",
    standfirst:
      "AI-native Transformation macht es billig, das Urteil zu überspringen. Organisationen führen agentische Systeme ein, die sie nicht erklären können, und verlieren still die Fähigkeit, ihre eigenen Entscheidungen zu beurteilen. Ich baue souveräne KI für regulierte und zukunftskritische DACH-Organisationen: Architektur, in der die Harness das Urteil im Haus hält, nachvollziehbar, exit-fähig, resilient.",
    ctaPrimary: { label: "Was ist Cognitive Debt?", href: "/de/cognitive-debt/" },
    ctaSecondary: { label: "Abonnieren", href: "#newsletter" },
    credentials: [
      "Promotion · KIT",
      "MIT · Innovation Management",
      "MBA",
      "Azure Solutions Architect Expert",
      "Ex-CTO · DACH-Beratung",
    ],

    enemyLabel: "Das Problem",
    enemyTitle: "Die Zinsen werden",
    enemyTitleAccent: "später fällig",
    enemyBody:
      "Cognitive Debt ist die schleichende Erosion der Urteilsfähigkeit einer Organisation, wenn KI-Systeme Entscheidungen produzieren, die niemand mehr nachvollziehen oder prüfen kann. Wie technische Schuld bleibt sie unsichtbar, bis die Zinsen fällig werden.",
    enemyFaces: [
      {
        name: "Haftung",
        body: "In regulierten Kontexten müssen Sie jede Ausgabe begründen können. Ab August 2026 macht die EU-KI-Verordnung Nachvollziehbarkeit zur Pflicht, nicht zum Komfort.",
      },
      {
        name: "Abhängigkeit",
        body: "Wer sein Urteil an eine Black Box abgibt, bekommt es nicht zurück. Dem Anbieter gehören Modell, Logik und am Ende die Entscheidung.",
      },
      {
        name: "Fragilität",
        body: "Ein Anbieter-Ausfall, eine Preisverdopplung, eine Modell-Abkündigung, und die Entscheidungsfähigkeit der Organisation geht mit.",
      },
    ],
    enemyCta: { label: "Das Framework, und wie man es misst →", href: "/de/cognitive-debt/" },

    mechanismLabel: "Die Antwort",
    mechanismIntro:
      "Drei Ebenen derselben Bewegung. Urteilsfähigkeit ist keine Richtlinie, die man schreibt, sondern eine Eigenschaft, die man baut.",
    tiles: [
      {
        num: "01",
        title: "AI-Native Transformation",
        body:
          "Die Arbeitsweise der Organisation um KI herum neu bauen, statt KI an die bestehende Arbeitsweise anzuschrauben. Der Unterschied zeigt sich daran, wo das Urteil sitzt: Ein angeschraubter Rollout kauft Tools und hofft auf Output. Eine native Transformation gestaltet die Entscheidungspfade und die Prüfung neu, die diese Entscheidungen erklärbar halten.",
        tags: ["Entscheidungspfade", "Governance", "Befähigung", "Prüfung"],
        href: "/de/glossary/#ai-native-transformation",
        hrefLabel: "Definition",
      },
      {
        num: "02",
        title: "Agentic Engineering & die Harness",
        body:
          "Ein Agent ist ein Modell in einer Schleife, das Tools aufruft. Die Schleife ist der triviale Teil. Die Verlässlichkeit, und das Urteil, sitzen in der Harness: in den Tools, die man freigibt, im Kontext, den man zusammenstellt, und in der Bedingung, unter der die Schleife stoppt. Dorthin gehört das Engineering, nicht in den Prompt.",
        tags: ["Harness", "Tool Use", "Context Engineering", "Evals", "Terminierung"],
        href: "/de/glossary/#agentic-harness",
        hrefLabel: "Definition",
      },
      {
        num: "03",
        title: "Souveräne KI",
        body:
          "Architektur, die der Organisation wirklich gehört: nachvollziehbar, damit sie vor Vorstand und Prüfer hält. Unabhängig, damit kein Anbieter Ihren Exit besitzt. Resilient, damit ein Ausfall oder eine Abkündigung nicht die Entscheidungsfähigkeit mitnimmt. Nicht On-Premise als Selbstzweck, sondern Kontrolle über Modell, Daten, Logik und Haftung.",
        tags: ["nachvollziehbar", "exit-fähig", "resilient", "EU AI Act"],
        href: "/de/glossary/#sovereign-ai",
        hrefLabel: "Definition",
      },
    ],

    proofLabel: "Beweis",
    proofTitle: "Instrumente, keine",
    proofTitleAccent: "Demos",
    proofIntro:
      "Zwei Werkzeuge, die ich gebaut habe und nutze. Jedes ist dieselbe These in laufendem Code: Wertvolle KI erzwingt eine Entscheidung, statt sie zu vertagen.",
    proofCta: { label: "Alle Werkzeuge →", href: "/de/tools/" },

    writingLabel: "Neueste Beiträge",
    writingCta: { label: "Alle Essays ↗", href: "/de/posts/" },
    glossaryCta: { label: "Das Vokabular: Agentic AI in Klartext →", href: "/de/glossary/" },
  },
};
