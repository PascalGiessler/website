import { PROFILE } from "./entity";

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
  "en": {
    "eyebrow": PROFILE.en.roleLine,
    "titleLead": "Leading AI transformation",
    "titleAccent": "with technical depth.",
    "standfirst": PROFILE.en.intro,
    "ctaPrimary": {
      "label": "About my work",
      "href": "/about/"
    },
    "ctaSecondary": {
      "label": "Contact me",
      "href": "mailto:info@pascal-giessler.de"
    },
    "credentials": [
      "PhD · KIT",
      "MIT · Technology & Innovation",
      "Azure Solutions Architect Expert"
    ],
    "enemyLabel": "Evaluation",
    "enemyTitle": "Keeping AI results",
    "enemyTitleAccent": "open to scrutiny",
    "enemyBody": "Teams using AI results still need the expertise to assess their quality. I use Cognitive Debt to describe what is lost when that ability weakens. In practice, this means choosing appropriate checks and deciding who acts when something goes wrong.",
    "enemyFaces": [
      {
        "name": "Evaluation",
        "body": "Each model variant needs its own measured results. A better final answer can hide unnecessary tool calls or new rule violations."
      },
      {
        "name": "API semantics",
        "body": "Tools need clear preconditions, effects and error states. The receiving system must enforce its business rules even when calls arrive in an unexpected order."
      },
      {
        "name": "Responsibility",
        "body": "A guardrail can report a failure. The next decision and the correction still need an agreed process and someone responsible for it."
      }
    ],
    "enemyCta": {
      "label": "Cognitive Debt and the maturity model",
      "href": "/cognitive-debt/"
    },
    "mechanismLabel": "Areas of work",
    "mechanismIntro": "My work connects organisational change with the design and evaluation of AI systems.",
    "tiles": [
      {
        "num": "01",
        "title": "AI transformation",
        "body": "I lead organisational AI transformation at Haufe Akademie. Working closely with the CTO, I support strategic initiatives and the technical and organisational decisions they involve.",
        "tags": [
          "AI Leadership",
          "Strategy",
          "Organisation"
        ],
        "href": "/about/",
        "hrefLabel": "Role and responsibility"
      },
      {
        "num": "02",
        "title": "Agentic Engineering",
        "body": "Agents need suitable context, bounded tools and results that can be checked. I focus on agent architectures, API semantics and deciding where a deterministic workflow already solves the task.",
        "tags": [
          "Evals",
          "APIs",
          "Workflows"
        ],
        "href": "/posts/",
        "hrefLabel": "Technical writing"
      },
      {
        "num": "03",
        "title": "Mentoring & strategic advisory",
        "body": "As a mentor and strategic advisor, I help people work through technical and organisational decisions: what to pursue, which approach fits and how a team can assess the result.",
        "tags": [
          "Mentoring",
          "Strategic Advisory"
        ],
        "href": "/about/#mentoring",
        "hrefLabel": "Working together"
      }
    ],
    "proofLabel": "Projects",
    "proofTitle": "Tools from",
    "proofTitleAccent": "my own work",
    "proofIntro": "AI Radar and Idea Assessor explore two practical questions: how to assess technical developments, and how evaluating an idea can lead to a decision.",
    "proofCta": {
      "label": "All tools",
      "href": "/tools/"
    },
    "writingLabel": "Latest writing",
    "writingCta": {
      "label": "All writing",
      "href": "/posts/"
    },
    "glossaryCta": {
      "label": "Agentic AI terms in the glossary",
      "href": "/glossary/"
    }
  },
  "de": {
    "eyebrow": PROFILE.de.roleLine,
    "titleLead": "AI-Transformation",
    "titleAccent": "technisch fundiert führen.",
    "standfirst": PROFILE.de.intro,
    "ctaPrimary": {
      "label": "Über meine Arbeit",
      "href": "/de/about/"
    },
    "ctaSecondary": {
      "label": "Kontakt aufnehmen",
      "href": "mailto:info@pascal-giessler.de"
    },
    "credentials": [
      "Promotion · KIT",
      "MIT · Technology & Innovation",
      "Azure Solutions Architect Expert"
    ],
    "enemyLabel": "Prüfbarkeit",
    "enemyTitle": "KI-Ergebnisse",
    "enemyTitleAccent": "überprüfbar halten",
    "enemyBody": "Wenn ein Team KI-Ergebnisse übernimmt, muss es deren fachliche Güte weiterhin beurteilen können. Mit Cognitive Debt beschreibe ich, was verloren geht, wenn diese Fähigkeit nachlässt. Praktisch geht es um geeignete Prüfungen und darum, wer bei einem Fehler handelt.",
    "enemyFaces": [
      {
        "name": "Evaluation",
        "body": "Jede Modellvariante braucht eigene Messergebnisse. Eine bessere Endantwort kann zusätzliche Tool-Aufrufe oder neue Regelverstöße verdecken."
      },
      {
        "name": "API-Semantik",
        "body": "Tools müssen Vorbedingungen, Wirkungen und Fehlerzustände verständlich beschreiben. Das Zielsystem muss seine fachlichen Grenzen auch bei ungewöhnlichen Aufrufreihenfolgen halten."
      },
      {
        "name": "Verantwortung",
        "body": "Ein Guardrail kann einen Fehler melden. Für die anschließende Entscheidung und die Korrektur braucht es einen festgelegten Ablauf und eine zuständige Person."
      }
    ],
    "enemyCta": {
      "label": "Cognitive Debt und das Reifegradmodell",
      "href": "/de/cognitive-debt/"
    },
    "mechanismLabel": "Arbeitsfelder",
    "mechanismIntro": "Meine Arbeit verbindet die Veränderung der Organisation mit dem technischen Entwurf und der Prüfung von AI-Systemen.",
    "tiles": [
      {
        "num": "01",
        "title": "AI-Transformation",
        "body": "Ich verantworte die organisatorische AI-Transformation bei der Haufe Akademie. In enger Zusammenarbeit mit dem CTO betreue ich strategische Initiativen und die damit verbundenen technischen und organisatorischen Fragen.",
        "tags": [
          "AI Leadership",
          "Strategie",
          "Organisation"
        ],
        "href": "/de/about/",
        "hrefLabel": "Rolle und Verantwortung"
      },
      {
        "num": "02",
        "title": "Agentic Engineering",
        "body": "Agenten brauchen geeigneten Kontext, begrenzte Werkzeuge und überprüfbare Ergebnisse. Ich beschäftige mich mit Agent-Architekturen, semantisch beschriebenen APIs und der Frage, wo deterministische Abläufe die Aufgabe bereits lösen.",
        "tags": [
          "Evals",
          "APIs",
          "Workflows"
        ],
        "href": "/de/posts/",
        "hrefLabel": "Technische Beiträge"
      },
      {
        "num": "03",
        "title": "Mentoring & strategische Beratung",
        "body": "Als Mentor und strategischer Berater begleite ich technische und organisatorische Entscheidungen. Dabei geht es um Ziele, die Auswahl geeigneter Ansätze und die Kriterien, an denen ein Team das Ergebnis beurteilen kann.",
        "tags": [
          "Mentoring",
          "Strategic Advisory"
        ],
        "href": "/de/about/#mentoring",
        "hrefLabel": "Zusammenarbeit"
      }
    ],
    "proofLabel": "Eigene Projekte",
    "proofTitle": "Werkzeuge aus",
    "proofTitleAccent": "meiner Arbeit",
    "proofIntro": "AI Radar und Idea Assessor machen zwei Fragestellungen praktisch untersuchbar: Wie lassen sich technische Entwicklungen einordnen, und wie kann die Bewertung einer Idee zu einer Entscheidung führen?",
    "proofCta": {
      "label": "Alle Werkzeuge",
      "href": "/de/tools/"
    },
    "writingLabel": "Neueste Beiträge",
    "writingCta": {
      "label": "Alle Beiträge",
      "href": "/de/posts/"
    },
    "glossaryCta": {
      "label": "Begriffe zu Agentic AI im Glossar",
      "href": "/de/glossary/"
    }
  }
};
