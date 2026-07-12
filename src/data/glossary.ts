// Agentic-AI / Harness glossary for /glossary and /de/glossary.
// Definitions: answer-first, dry, precise, <= ~60 words, no em-dashes
// (project Design Rule 3). Terms anchor the site's knowsAbout entity set
// (Cognitive Debt, Sovereign AI, GraphRAG, MCP, …) for GEO + DACH search.

export type GlossaryCategory = "agentic" | "retrieval" | "sovereignty";

export interface GlossaryTerm {
  slug: string;
  term: string; // display term (EN; also used in DE unless term_de given)
  term_de?: string;
  category: GlossaryCategory;
  en: string;
  de: string;
  related: string[]; // slugs of related terms
  /** Where the term is argued at length. Turns the glossary into a hub, not a dead end. */
  reads?: Array<{ href: string; label: { en: string; de: string } }>;
}

/** Essays and pages a term can point at. */
const READS = {
  whileLoop: {
    href: "/post/your-coding-agent-is-just-a-while-loop/",
    label: { en: "Your Coding Agent Is Just a While-Loop", de: "Your Coding Agent Is Just a While-Loop" },
  },
  cdmm: {
    href: "/de/post/das-cognitive-debt-maturity-model/",
    label: { en: "Das Cognitive Debt Maturity Model (DE)", de: "Das Cognitive Debt Maturity Model" },
  },
  compliance: {
    href: "/de/post/compliance-by-design-dora-nis2-ai-act/",
    label: { en: "Compliance by Design (DE)", de: "Compliance by Design" },
  },
  pillar: {
    href: "/cognitive-debt/",
    label: { en: "Cognitive Debt: the framework", de: "Cognitive Debt: das Framework" },
  },
  aiRadar: {
    href: "/tools/ai-radar/",
    label: { en: "AI Radar", de: "AI Radar" },
  },
  ideaAssessor: {
    href: "/tools/idea-assessor/",
    label: { en: "Idea Assessor", de: "Idea Assessor" },
  },
};

export const glossaryCategoryLabels: Record<GlossaryCategory, { en: string; de: string }> = {
  agentic: { en: "Agentic core", de: "Agentic Core" },
  retrieval: { en: "Protocols & retrieval", de: "Protokolle & Retrieval" },
  sovereignty: { en: "Sovereignty & governance", de: "Souveränität & Governance" },
};

export const glossaryCategoryOrder: GlossaryCategory[] = ["agentic", "retrieval", "sovereignty"];

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "harness",
    term: "Harness",
    category: "agentic",
    en: "The code that surrounds a language model and turns it into a working system: the loop that calls the model, runs its chosen tools, feeds results back, and decides when to stop. The model reasons; the harness does everything else. Most of an agent's reliability lives here, not in the prompt.",
    de: "Der Code rund um ein Sprachmodell, der es zu einem funktionierenden System macht: die Schleife, die das Modell aufruft, seine Tools ausführt, Ergebnisse zurückspeist und entscheidet, wann Schluss ist. Das Modell denkt, die Harness erledigt den Rest. Der Großteil der Verlässlichkeit eines Agenten liegt hier, nicht im Prompt.",
    related: ["agentic-harness", "agentic-ai", "agent", "loop-engineering", "tool-use"],
    reads: [READS.whileLoop],
  },
  {
    slug: "agentic-harness",
    term: "Agentic Harness",
    category: "agentic",
    en: "The production-grade harness: not just the loop, but everything that makes an agent safe to run unattended. Tool permissions, sandboxing, retries, budget and step limits, logging, and the termination conditions. The harness is where an agent stops being a demo and becomes a system you can operate.",
    de: "Die produktionsreife Harness: nicht nur die Schleife, sondern alles, was einen Agenten sicher unbeaufsichtigt laufen lässt. Tool-Berechtigungen, Sandboxing, Retries, Budget- und Schrittgrenzen, Logging und die Abbruchbedingungen. Hier hört ein Agent auf, eine Demo zu sein, und wird ein System, das man betreiben kann.",
    related: ["harness", "guardrails", "loop-engineering", "agentic-engineering"],
    reads: [READS.whileLoop],
  },
  {
    slug: "agentic-engineering",
    term: "Agentic Engineering",
    category: "agentic",
    en: "The discipline of building systems where a model acts, not just answers. It moves the engineering effort off the prompt and onto the three things that decide outcomes: the tools you expose, the context you assemble, and the condition on which the loop stops. Prompting is a skill; agentic engineering is an architecture practice.",
    de: "Die Disziplin, Systeme zu bauen, in denen ein Modell handelt statt nur antwortet. Sie verlagert den Engineering-Aufwand weg vom Prompt hin zu den drei Dingen, die über das Ergebnis entscheiden: die Tools, die man freigibt, den Kontext, den man zusammenstellt, und die Bedingung, unter der die Schleife stoppt. Prompting ist eine Fertigkeit, Agentic Engineering eine Architektur-Praxis.",
    related: ["agentic-harness", "loop-engineering", "context-engineering", "eval", "agentic-ai"],
    reads: [READS.whileLoop],
  },
  {
    slug: "loop-engineering",
    term: "Loop Engineering",
    category: "agentic",
    en: "Designing the agent's control flow deliberately: how many steps it may take, what it does on a failed tool call, when it escalates to a human, and above all when it stops. Termination is a correctness property, not a detail. A loop with no robust exit is how you get runaway agents and token bills that scale with confusion.",
    de: "Den Kontrollfluss eines Agenten bewusst entwerfen: wie viele Schritte er nehmen darf, was bei einem fehlgeschlagenen Tool-Aufruf passiert, wann er an einen Menschen eskaliert, und vor allem wann er stoppt. Terminierung ist eine Korrektheits-Eigenschaft, kein Detail. Eine Schleife ohne robusten Ausgang erzeugt entlaufene Agenten und Token-Rechnungen, die mit der Verwirrung wachsen.",
    related: ["harness", "agentic-harness", "agentic-engineering", "guardrails", "human-in-the-loop"],
    reads: [READS.whileLoop],
  },
  {
    slug: "agentic-ai",
    term: "Agentic AI",
    category: "agentic",
    en: "AI that pursues a goal over multiple steps, choosing its own actions and tools along the way, rather than answering a single prompt. The shift from generate text to get something done. Autonomy is a spectrum, not a switch; most useful agentic systems keep a human at the decisive points.",
    de: "KI, die ein Ziel über mehrere Schritte verfolgt und dabei ihre Aktionen und Tools selbst wählt, statt nur einen Prompt zu beantworten. Der Wechsel von Text erzeugen zu etwas erledigen. Autonomie ist ein Spektrum, kein Schalter; nützliche agentische Systeme halten an den entscheidenden Punkten einen Menschen.",
    related: ["agent", "harness", "tool-use", "human-in-the-loop"],
  },
  {
    slug: "agent",
    term: "Agent",
    category: "agentic",
    en: "A system that takes a goal, plans steps toward it, acts through tools, observes the results, and repeats until done. An agent is a model plus a harness plus tools; none of the three alone is an agent.",
    de: "Ein System, das ein Ziel entgegennimmt, Schritte dorthin plant, über Tools handelt, die Ergebnisse beobachtet und wiederholt, bis es fertig ist. Ein Agent ist Modell plus Harness plus Tools; keines der drei allein ist ein Agent.",
    related: ["agentic-ai", "harness", "tool-use", "orchestration"],
  },
  {
    slug: "tool-use",
    term: "Tool Use",
    term_de: "Tool Use (Function Calling)",
    category: "agentic",
    en: "The mechanism by which a model invokes external functions, APIs, or code instead of only producing text. The model emits a structured call; the harness runs it and returns the result. Tool use is what lets an agent touch the real world: query a database, send an email, open a file.",
    de: "Der Mechanismus, mit dem ein Modell externe Funktionen, APIs oder Code aufruft, statt nur Text zu erzeugen. Das Modell gibt einen strukturierten Aufruf aus, die Harness führt ihn aus und liefert das Ergebnis zurück. Tool Use lässt einen Agenten die echte Welt berühren: eine Datenbank abfragen, eine Mail senden, eine Datei öffnen.",
    related: ["harness", "mcp", "agent", "guardrails"],
  },
  {
    slug: "orchestration",
    term: "Orchestration",
    category: "agentic",
    en: "Coordinating multiple models, tools, or agents into one reliable workflow: what runs when, what happens on failure, how state passes between steps. As soon as a system has more than one moving part, orchestration is where correctness is won or lost.",
    de: "Die Koordination mehrerer Modelle, Tools oder Agenten zu einem verlässlichen Ablauf: was wann läuft, was bei Fehlern passiert, wie Zustand zwischen Schritten übergeben wird. Sobald ein System mehr als ein bewegliches Teil hat, entscheidet sich hier die Korrektheit.",
    related: ["harness", "multi-agent-system", "model-router"],
  },
  {
    slug: "multi-agent-system",
    term: "Multi-Agent System",
    category: "agentic",
    en: "Several agents working on one problem, each with a role, passing work between them. Powerful when a task splits cleanly into independent parts, wasteful when it does not. More agents means more coordination cost, so the split has to earn it.",
    de: "Mehrere Agenten, die an einem Problem arbeiten, jeder mit einer Rolle, und die Arbeit untereinander weiterreichen. Stark, wenn sich eine Aufgabe sauber in unabhängige Teile zerlegt, verschwenderisch, wenn nicht. Mehr Agenten heißt mehr Koordinationskosten, also muss die Aufteilung sie rechtfertigen.",
    related: ["agent", "orchestration"],
  },
  {
    slug: "human-in-the-loop",
    term: "Human-in-the-Loop",
    category: "agentic",
    en: "A design where a person approves, corrects, or overrides the system at defined points instead of letting it run unattended. In regulated and high-stakes work this is not a fallback; it is the control that keeps judgment inside the organisation.",
    de: "Ein Design, in dem ein Mensch das System an definierten Punkten freigibt, korrigiert oder überstimmt, statt es unbeaufsichtigt laufen zu lassen. In regulierten und riskanten Kontexten ist das kein Notnagel, sondern die Kontrolle, die das Urteil in der Organisation hält.",
    related: ["guardrails", "cognitive-debt", "agentic-ai"],
  },
  {
    slug: "context-window",
    term: "Context Window",
    category: "agentic",
    en: "The maximum amount of text a model can consider at once, prompt and response together, measured in tokens. Everything the model knows in the moment must fit inside it. Run out of room and the earliest content falls away, so what you put in and leave out is a design decision.",
    de: "Die maximale Textmenge, die ein Modell auf einmal berücksichtigen kann, Prompt und Antwort zusammen, gemessen in Tokens. Alles, was das Modell im Moment weiß, muss hineinpassen. Ist der Platz erschöpft, fällt der früheste Inhalt weg, also ist die Auswahl eine Design-Entscheidung.",
    related: ["context-engineering", "embeddings", "rag"],
  },
  {
    slug: "context-engineering",
    term: "Context Engineering",
    category: "agentic",
    en: "Deciding what information reaches the model, in what form, at what moment. The successor discipline to prompt engineering: less about wording, more about assembling the right facts, tools, and history into a limited context window. Often the difference between a flaky agent and a dependable one.",
    de: "Die Entscheidung, welche Information das Modell erreicht, in welcher Form, zu welchem Zeitpunkt. Die Nachfolge-Disziplin des Prompt-Engineerings: weniger Formulierung, mehr das Zusammenstellen der richtigen Fakten, Tools und Historie in ein begrenztes Kontextfenster. Oft der Unterschied zwischen einem wackligen und einem verlässlichen Agenten.",
    related: ["context-window", "rag", "agentic-engineering", "harness"],
    reads: [READS.whileLoop],
  },
  {
    slug: "guardrails",
    term: "Guardrails",
    category: "agentic",
    en: "Constraints that keep a model's behaviour inside acceptable bounds: input filters, output validation, allowed-tool lists, policy checks. Guardrails do not make a model correct; they make its failures visible and contained.",
    de: "Constraints, die das Verhalten eines Modells in akzeptablen Grenzen halten: Eingabefilter, Ausgabe-Validierung, erlaubte Tool-Listen, Policy-Checks. Guardrails machen ein Modell nicht korrekt; sie machen seine Fehler sichtbar und eingrenzbar.",
    related: ["eval", "human-in-the-loop", "prompt-injection"],
  },
  {
    slug: "eval",
    term: "Eval",
    term_de: "Eval (Evaluation)",
    category: "agentic",
    en: "A repeatable test that measures whether a model or agent does its job, on cases you care about, with a score you can track over time. Without evals you are not engineering an AI system, you are guessing about one.",
    de: "Ein wiederholbarer Test, der misst, ob ein Modell oder Agent seine Aufgabe erfüllt, an Fällen, die zählen, mit einer Kennzahl, die man über die Zeit verfolgen kann. Ohne Evals baut man kein KI-System, man rät über eines.",
    related: ["guardrails", "provenance"],
  },
  {
    slug: "mcp",
    term: "Model Context Protocol (MCP)",
    category: "retrieval",
    en: "An open standard for connecting models to tools and data through a uniform interface, so a capability built once works across any compatible client. MCP is to agent tooling what a driver model was to hardware: it turns bespoke integrations into a plug.",
    de: "Ein offener Standard, um Modelle über eine einheitliche Schnittstelle mit Tools und Daten zu verbinden, sodass eine einmal gebaute Fähigkeit mit jedem kompatiblen Client funktioniert. MCP ist für Agenten-Tooling, was ein Treibermodell für Hardware war: Es macht aus Einzelintegrationen einen Stecker.",
    related: ["tool-use", "ai-gateway", "harness"],
    reads: [READS.compliance, READS.whileLoop],
  },
  {
    slug: "rag",
    term: "Retrieval-Augmented Generation (RAG)",
    category: "retrieval",
    en: "Fetching relevant documents at query time and placing them in the context window so the model answers from your data, not only its training. The standard way to ground a model in current, private, or citable facts without retraining it.",
    de: "Das Abrufen relevanter Dokumente zur Anfragezeit und ihr Einsetzen ins Kontextfenster, damit das Modell aus deinen Daten antwortet, nicht nur aus dem Training. Der Standardweg, ein Modell in aktuellen, privaten oder zitierbaren Fakten zu verankern, ohne es neu zu trainieren.",
    related: ["embeddings", "graphrag", "context-engineering", "knowledge-graph"],
  },
  {
    slug: "graphrag",
    term: "GraphRAG",
    category: "retrieval",
    en: "Retrieval that walks a knowledge graph instead of ranking loose text chunks, so the model gets connected facts and their relationships, not just nearby sentences. Stronger when the answer depends on how entities relate, weaker when a flat lookup would do.",
    de: "Retrieval, das einen Knowledge Graph durchläuft, statt lose Textstücke zu ranken, sodass das Modell verbundene Fakten und ihre Beziehungen erhält, nicht nur benachbarte Sätze. Stärker, wenn die Antwort von Beziehungen zwischen Entitäten abhängt, schwächer, wenn ein flaches Nachschlagen genügt.",
    related: ["rag", "knowledge-graph", "embeddings"],
  },
  {
    slug: "knowledge-graph",
    term: "Knowledge Graph",
    category: "retrieval",
    en: "A model of a domain as entities and the typed relationships between them, queryable as a graph. It gives an AI system a structured memory that can be inspected and corrected, rather than facts smeared across weights.",
    de: "Ein Modell einer Domäne als Entitäten und die typisierten Beziehungen zwischen ihnen, als Graph abfragbar. Es gibt einem KI-System ein strukturiertes Gedächtnis, das man prüfen und korrigieren kann, statt Fakten über Gewichte verschmiert.",
    related: ["graphrag", "rag", "provenance"],
  },
  {
    slug: "embeddings",
    term: "Embeddings",
    category: "retrieval",
    en: "Numeric vectors that place text, images, or code in a space where nearness means similar meaning. They power search, clustering, and retrieval. They are also the quietest lock-in: change the embedding model and every stored vector has to be recomputed.",
    de: "Numerische Vektoren, die Text, Bilder oder Code in einen Raum legen, in dem Nähe ähnliche Bedeutung heißt. Sie treiben Suche, Clustering und Retrieval. Sie sind auch der leiseste Lock-in: Wechselt das Embedding-Modell, muss jeder gespeicherte Vektor neu berechnet werden.",
    related: ["rag", "vendor-lock-in", "knowledge-graph"],
  },
  {
    slug: "ai-gateway",
    term: "AI Gateway",
    category: "retrieval",
    en: "A single controlled entry point between your applications and model providers, where routing, logging, rate limits, cost tracking, and provider swaps live. The gateway is where sovereignty over models becomes an architectural fact instead of a slide.",
    de: "Ein einzelner kontrollierter Eingangspunkt zwischen deinen Anwendungen und Modell-Anbietern, an dem Routing, Logging, Rate Limits, Kostenverfolgung und Anbieterwechsel sitzen. Das Gateway ist der Ort, an dem Souveränität über Modelle zur architektonischen Tatsache wird statt zur Folie.",
    related: ["model-router", "sovereign-ai", "provenance", "vendor-lock-in"],
    reads: [READS.compliance],
  },
  {
    slug: "model-router",
    term: "Model Router",
    category: "retrieval",
    en: "Logic that sends each request to the most suitable model by cost, capability, latency, or jurisdiction, behind one interface. A router turns which model from a lock-in decision into a runtime choice you can change without touching callers.",
    de: "Logik, die jede Anfrage hinter einer Schnittstelle an das passendste Modell schickt, nach Kosten, Fähigkeit, Latenz oder Jurisdiktion. Ein Router macht aus welches Modell statt einer Lock-in-Entscheidung eine Laufzeit-Wahl, die man ändern kann, ohne Aufrufer anzufassen.",
    related: ["ai-gateway", "sovereign-ai", "orchestration"],
  },
  {
    slug: "sovereign-ai",
    term: "Sovereign AI",
    term_de: "Souveräne AI",
    category: "sovereignty",
    en: "AI architecture the organisation actually owns: auditable, exit-capable, resilient, EU-compatible, without vendor lock-in. Not on-premise for its own sake, but control over model, data, logic, and liability. The structural answer to Cognitive Debt.",
    de: "KI-Architektur, die der Organisation wirklich gehört: nachvollziehbar, exit-fähig, resilient, EU-anschlussfähig, ohne Vendor-Lock-in. Nicht On-Premise als Selbstzweck, sondern Kontrolle über Modell, Daten, Logik und Haftung. Die strukturelle Antwort auf Cognitive Debt.",
    related: ["cognitive-debt", "ai-gateway", "vendor-lock-in", "provenance"],
    reads: [READS.pillar, READS.compliance],
  },
  {
    slug: "cognitive-debt",
    term: "Cognitive Debt",
    category: "sovereignty",
    en: "The slow erosion of an organisation's judgment when AI systems produce decisions no one can any longer explain or check. Like technical debt it is invisible until the interest comes due, as liability, compliance gaps, and lost competence.",
    de: "Die schleichende Erosion der Urteilsfähigkeit einer Organisation, wenn KI-Systeme Entscheidungen produzieren, die niemand mehr erklären oder prüfen kann. Wie technische Schuld unsichtbar, bis die Zinsen fällig werden, als Haftung, Compliance-Lücken und Kompetenzverlust.",
    related: ["sovereign-ai", "cognitive-debt-maturity-model", "ai-native-transformation", "provenance"],
    reads: [READS.pillar, READS.cdmm, READS.ideaAssessor],
  },
  {
    slug: "ai-native-transformation",
    term: "AI-Native Transformation",
    term_de: "AI-Native Transformation",
    category: "sovereignty",
    en: "Rebuilding how an organisation works around AI, rather than bolting AI onto how it already works. The tell is where the judgment sits: a bolted-on rollout buys tools and hopes for output; a native transformation redesigns the decision paths, the review, and the architecture that keeps those decisions explainable. Done badly, it is the fastest way to accumulate Cognitive Debt.",
    de: "Die Arbeitsweise einer Organisation um KI herum neu bauen, statt KI an die bestehende Arbeitsweise anzuschrauben. Der Unterschied zeigt sich daran, wo das Urteil sitzt: Ein angeschraubter Rollout kauft Tools und hofft auf Output; eine native Transformation gestaltet die Entscheidungspfade, die Prüfung und die Architektur neu, die diese Entscheidungen erklärbar hält. Schlecht gemacht ist sie der schnellste Weg, Cognitive Debt anzuhäufen.",
    related: ["cognitive-debt", "sovereign-ai", "cognitive-debt-maturity-model", "agentic-engineering"],
    reads: [READS.pillar, READS.cdmm],
  },
  {
    slug: "cognitive-debt-maturity-model",
    term: "Cognitive Debt Maturity Model (CDMM)",
    category: "sovereignty",
    en: "A proprietary framework that makes an organisation's AI judgment-readiness measurable, from Level 0 (black-box dependent) to Level 4 (sovereign). Each level is climbed by one architecture decision, not by adding models. A way to see the debt before the interest arrives.",
    de: "Ein proprietäres Framework, das die KI-Urteilsfähigkeit einer Organisation messbar macht, von Level 0 (Black-Box-abhängig) bis Level 4 (souverän). Jede Stufe wird durch eine Architektur-Entscheidung erklommen, nicht durch mehr Modelle. Ein Weg, die Schuld zu sehen, bevor die Zinsen kommen.",
    related: ["cognitive-debt", "sovereign-ai"],
    reads: [READS.pillar, READS.cdmm],
  },
  {
    slug: "provenance",
    term: "Provenance",
    category: "sovereignty",
    en: "The recorded origin of an AI output: which model, which prompt version, which inputs, which raw response. Provenance is what lets you reconstruct a decision months later. An assessment you cannot reconstruct is a gut feeling with a better interface.",
    de: "Die aufgezeichnete Herkunft einer KI-Ausgabe: welches Modell, welche Prompt-Version, welche Eingaben, welche Roh-Antwort. Provenienz ist, was eine Entscheidung Monate später rekonstruierbar macht. Eine Bewertung, die man nicht rekonstruieren kann, ist ein Bauchgefühl mit besserem Interface.",
    related: ["cognitive-debt", "sovereign-ai", "eval", "eu-ai-act"],
    reads: [READS.ideaAssessor, READS.compliance],
  },
  {
    slug: "vendor-lock-in",
    term: "Vendor Lock-in",
    category: "sovereignty",
    en: "The state where switching AI provider is so costly you effectively cannot, whether through proprietary APIs, embeddings, fine-tunes, or data gravity. Lock-in is not always wrong, but unpriced lock-in is a bill your successor pays.",
    de: "Der Zustand, in dem ein Anbieterwechsel so teuer ist, dass er praktisch ausfällt, ob durch proprietäre APIs, Embeddings, Fine-Tunes oder Data Gravity. Lock-in ist nicht immer falsch, aber unbezifferter Lock-in ist eine Rechnung, die dein Nachfolger zahlt.",
    related: ["sovereign-ai", "model-router", "embeddings"],
  },
  {
    slug: "eu-ai-act",
    term: "EU AI Act",
    category: "sovereignty",
    en: "The European Union's risk-based regulation of AI systems, with obligations that rise with the risk class. For builders the practical core is Article 12: high-risk systems must keep logs that make their operation traceable. Provenance stops being optional.",
    de: "Die risikobasierte KI-Regulierung der Europäischen Union, mit Pflichten, die mit der Risikoklasse steigen. Für Bauende ist Artikel 12 der praktische Kern: Hochrisiko-Systeme müssen Protokolle führen, die ihren Betrieb nachvollziehbar machen. Provenienz ist damit nicht mehr optional.",
    related: ["provenance", "sovereign-ai", "cognitive-debt"],
    reads: [READS.compliance],
  },
  {
    slug: "adoption-rings",
    term: "Adoption Rings",
    category: "sovereignty",
    en: "The Adopt, Trial, Assess, Hold classification popularised by the technology radar. A way to say not just what exists but what you should do about it. Useful only if the placement is earned by evidence rather than assigned by opinion.",
    de: "Die Einordnung in Adopt, Trial, Assess, Hold, bekannt aus dem Technologie-Radar. Eine Art zu sagen, nicht nur was existiert, sondern was man damit tun sollte. Nur nützlich, wenn die Platzierung durch Belege verdient und nicht durch Meinung vergeben wird.",
    related: ["eval", "model-router"],
    reads: [READS.aiRadar],
  },
  {
    slug: "prompt-injection",
    term: "Prompt Injection",
    category: "sovereignty",
    en: "An attack where hostile text in a model's input hijacks its instructions: hidden commands in a web page, a document, a tool result. The agentic version is worse, because an agent can act on the injected instruction. Guardrails and least-privilege tools are the defence.",
    de: "Ein Angriff, bei dem feindlicher Text in der Eingabe eines Modells dessen Anweisungen kapert: versteckte Befehle in einer Webseite, einem Dokument, einem Tool-Ergebnis. Die agentische Variante ist schlimmer, weil ein Agent auf die eingeschleuste Anweisung handeln kann. Guardrails und Least-Privilege-Tools sind die Abwehr.",
    related: ["guardrails", "tool-use", "agentic-ai"],
  },
];

export function termDisplay(t: GlossaryTerm, lang: "en" | "de"): string {
  return lang === "de" && t.term_de ? t.term_de : t.term;
}

// DefinedTermSet structured data for one language page.
export function glossaryJsonLd(lang: "en" | "de", pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: lang === "de" ? "Glossar: Agentic AI & Harness" : "Agentic AI & Harness Glossary",
    inLanguage: lang,
    url: pageUrl,
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: termDisplay(t, lang),
      description: t[lang],
      url: `${pageUrl}#${t.slug}`,
      inDefinedTermSet: pageUrl,
    })),
  };
}
