// Content for the /cognitive-debt pillar page (EN + DE).
//
// This is the definitive resource for the term and for the Cognitive Debt
// Maturity Model (CDMM), Pascal's proprietary framework. Essays argue it; this
// page *defines* it. Definitions here must match src/data/entity.ts (canonical
// FAQ) and the glossary, word for word where they overlap.

export interface CdmmLevel {
  level: string;
  name: string;
  state: string;
  symptom: string;
  interest: string;
  next: string;
}

export interface PillarContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  standfirst: string;
  definitionHeading: string;
  definition: string;
  vsTechDebtHeading: string;
  vsTechDebt: string;
  modelHeading: string;
  modelIntro: string;
  levels: CdmmLevel[];
  useHeading: string;
  useIntro: string;
  steps: Array<{ name: string; text: string }>;
  faqHeading: string;
  readHeading: string;
  labels: { symptom: string; interest: string; next: string };
}

export const pillar: Record<"en" | "de", PillarContent> = {
  en: {
    eyebrow: "The framework",
    titleLead: "Cognitive",
    titleAccent: "Debt",
    standfirst:
      "The interest on AI you cannot explain. What the term means, why it is not technical debt, and how to measure how much of it your organisation is carrying.",
    definitionHeading: "The definition",
    definition:
      "Cognitive Debt is the slow erosion of an organisation's judgment when AI systems produce decisions no one can any longer explain or check. Like technical debt it stays invisible, until the interest comes due as liability, compliance gaps, and lost competence.",
    vsTechDebtHeading: "Why it is not technical debt",
    vsTechDebt:
      "Technical debt sits in the code; Cognitive Debt sits in the judgment. Code debt you repay with refactoring. Cognitive Debt you repay by watching your organisation forget how to assess its own AI output, a more expensive and less reversible loan. And unlike code debt, it never appears in a backlog. That is precisely why it needs an instrument before the interest falls due.",
    modelHeading: "The Cognitive Debt Maturity Model",
    modelIntro:
      "The CDMM makes the otherwise invisible loan measurable: five levels, from black-box dependent to sovereign. An organisation does not climb by adding models. It climbs by one architecture decision per level, from we trust the output to we can explain, audit and exit every output.",
    levels: [
      {
        level: "Level 0",
        name: "Black-box dependent",
        state: "The organisation uses AI output without being able to explain it. “The model says X” is the end of the argument, not the beginning.",
        symptom: "No single decision can be reconstructed. Trust has replaced verification.",
        interest:
          "Full liability with no traceability. In an audit or an incident the organisation stands there without a justification. For high-risk systems that stops being a comfort problem in August 2026: the EU AI Act requires automatic logging over the system's lifetime.",
        next: "Name the debt. Make the gap visible, inventory the AI decision paths.",
      },
      {
        level: "Level 1",
        name: "Aware",
        state: "The debt is named but not measured. There is a list of AI-assisted decisions, but no instrumentation.",
        symptom: "“We know we have a problem”, but the risk is anecdotal, not quantified.",
        interest: "Reactive instead of anticipatory; you learn about gaps through incidents.",
        next: "Build traceability into the architecture. Every decision gets an explainable, auditable path.",
      },
      {
        level: "Level 2",
        name: "Traceable",
        state: "Every AI decision is explainable and auditable. You can show why the system reached a result.",
        symptom: "Explainability exists, but the system still belongs to the vendor. Model, data, or logic sit in someone else's hands.",
        interest: "Lock-in. Explainable but not negotiable; switching vendor would destroy the traceability.",
        next: "Establish exit capability. Encapsulate model, data, and decision logic so they belong to you and stay portable.",
      },
      {
        level: "Level 3",
        name: "Exit-capable",
        state: "No lock-in. The organisation owns model, data, and logic, and can change vendor without losing control.",
        symptom: "Sovereignty is structurally possible, but not continuously verified. It is a state, not a process.",
        interest: "Drift. Without ongoing verification, traceability erodes with every update.",
        next: "Make verification continuous and EU-compatible, so judgment grows with the system rather than against it.",
      },
      {
        level: "Level 4",
        name: "Sovereign",
        state: "AI architecture the organisation owns: auditable, exit-capable, EU-compatible, continuously verified. Sovereignty here is a running process, not a one-time state.",
        symptom: "The system makes the organisation more capable of judgment, not more dependent. Every decision is explainable, checkable, escapable.",
        interest: "Minimal and visible. The debt is managed, not accumulated.",
        next: "Hold the line. Sovereign AI is not on-premise for its own sake, it is control over model, data, logic, and liability.",
      },
    ],
    useHeading: "How to use the model",
    useIntro: "The CDMM is diagnostic, not decorative. Three steps:",
    steps: [
      {
        name: "Locate",
        text: "Determine the maturity level for each of your most important AI-assisted decision paths. An organisation is rarely at the same level everywhere.",
      },
      {
        name: "Pay the most expensive interest first",
        text: "Do not climb everywhere at once. Take the path with the highest liability, compliance, or lock-in and outage risk up one level first.",
      },
      {
        name: "Make an architecture move, not a tool purchase",
        text: "Every step up is a decision about traceability, ownership, or verification. It is never a new model.",
      },
    ],
    faqHeading: "Frequently asked",
    readHeading: "Read further",
    labels: { symptom: "Symptom", interest: "Interest", next: "Way up" },
  },
  de: {
    eyebrow: "Das Framework",
    titleLead: "Cognitive",
    titleAccent: "Debt",
    standfirst:
      "Die Zinsen auf KI, die niemand erklären kann. Was der Begriff bedeutet, warum er nicht technische Schuld ist, und wie sich messen lässt, wie viel davon Ihre Organisation trägt.",
    definitionHeading: "Die Definition",
    definition:
      "Cognitive Debt ist die schleichende Erosion der Urteilsfähigkeit einer Organisation, wenn KI-Systeme Entscheidungen produzieren, die niemand mehr nachvollziehen oder prüfen kann. Wie technische Schuld bleibt sie unsichtbar, bis die Zinsen als Haftung, Compliance-Lücke und Kompetenzverlust fällig werden.",
    vsTechDebtHeading: "Warum das keine technische Schuld ist",
    vsTechDebt:
      "Technische Schuld sitzt im Code, Cognitive Debt sitzt im Urteilsvermögen. Code-Schuld bezahlt man mit Refactoring. Cognitive Debt bezahlt man damit, dass die Organisation verlernt, ihre eigenen KI-Ergebnisse zu beurteilen: ein teurerer, schwerer reversibler Kredit. Und anders als Code-Schuld taucht sie in keinem Backlog auf. Genau deshalb braucht es ein Messinstrument, bevor die Zinsen fällig werden.",
    modelHeading: "Das Cognitive Debt Maturity Model",
    modelIntro:
      "Das CDMM macht den sonst unsichtbaren Kredit messbar: fünf Reifegrade, von Black-Box-abhängig bis souverän. Eine Organisation steigt nicht durch mehr Modelle. Sie steigt durch eine Architektur-Entscheidung pro Stufe, von „wir vertrauen der Ausgabe“ zu „wir können jede Ausgabe erklären, prüfen und verlassen“.",
    levels: [
      {
        level: "Level 0",
        name: "Black-Box-abhängig",
        state: "Die Organisation nutzt KI-Ausgaben, ohne sie erklären zu können. „Das Modell sagt X“ ist das Ende der Argumentation, nicht der Anfang.",
        symptom: "Niemand kann eine einzelne Entscheidung rekonstruieren. Vertrauen ersetzt Prüfung.",
        interest:
          "Volle Haftung bei fehlender Nachvollziehbarkeit. Bei einem Audit oder Schadensfall steht die Organisation ohne Begründung da. Für Hochrisiko-Systeme ist das ab August 2026 kein Komfort-, sondern ein Rechtsproblem: Die EU-KI-Verordnung verlangt eine automatische Protokollierung über die Lebensdauer des Systems.",
        next: "Cognitive Debt benennen. Die Lücke sichtbar machen, eine erste Inventur der KI-Entscheidungspfade.",
      },
      {
        level: "Level 1",
        name: "Bewusst",
        state: "Die Schuld ist benannt, aber nicht gemessen. Es gibt eine Liste der KI-gestützten Entscheidungen, aber keine Instrumentierung.",
        symptom: "„Wir wissen, dass wir ein Problem haben“, aber das Risiko ist anekdotisch, nicht quantifiziert.",
        interest: "Reaktiv statt vorausschauend; man erfährt von Lücken durch Vorfälle.",
        next: "Nachvollziehbarkeit in die Architektur bauen. Jede Entscheidung bekommt einen erklärbaren, auditierbaren Pfad.",
      },
      {
        level: "Level 2",
        name: "Nachvollziehbar",
        state: "Jede KI-Entscheidung ist erklärbar und auditierbar. Man kann zeigen, warum das System zu einem Ergebnis kam.",
        symptom: "Erklärbarkeit existiert, aber das System gehört noch dem Anbieter. Modell, Daten oder Logik sitzen in fremder Hand.",
        interest: "Lock-in. Erklärbar, aber nicht verhandelbar; ein Anbieterwechsel würde die Nachvollziehbarkeit zerstören.",
        next: "Exit-Fähigkeit herstellen. Modell, Daten und Entscheidungslogik so kapseln, dass sie der Organisation gehören und portierbar sind.",
      },
      {
        level: "Level 3",
        name: "Exit-fähig",
        state: "Kein Lock-in. Die Organisation besitzt Modell, Daten und Logik und kann den Anbieter wechseln, ohne die Kontrolle zu verlieren.",
        symptom: "Souveränität ist strukturell möglich, aber noch nicht kontinuierlich geprüft. Sie ist ein Zustand, kein Prozess.",
        interest: "Drift. Ohne laufende Prüfung erodiert die Nachvollziehbarkeit mit jedem Update wieder.",
        next: "Prüfung kontinuierlich und EU-anschlussfähig machen, damit die Urteilsfähigkeit mit dem System wächst statt gegen es.",
      },
      {
        level: "Level 4",
        name: "Souverän",
        state: "KI-Architektur, die der Organisation gehört: nachvollziehbar, exit-fähig, EU-anschlussfähig, kontinuierlich geprüft. Souveränität ist hier ein laufender Prozess, kein einmaliger Zustand.",
        symptom: "Das System macht die Organisation urteilsfähiger, nicht abhängiger. Jede Entscheidung ist erklärbar, prüfbar, verlassbar.",
        interest: "Minimal und sichtbar. Schuld wird gemanagt, nicht angehäuft.",
        next: "Die Linie halten. Souveräne KI ist nicht On-Premise als Selbstzweck, sondern Kontrolle über Modell, Daten, Logik und Haftung.",
      },
    ],
    useHeading: "Wie man das Modell benutzt",
    useIntro: "Das CDMM ist diagnostisch, nicht dekorativ. Drei Schritte:",
    steps: [
      {
        name: "Verorten",
        text: "Für die wichtigsten KI-gestützten Entscheidungspfade je den Reifegrad bestimmen. Eine Organisation ist selten überall auf derselben Stufe.",
      },
      {
        name: "Den teuersten Zins zuerst",
        text: "Nicht überall gleichzeitig steigen. Den Pfad mit dem höchsten Haftungs-, Compliance- oder Lock-in- und Ausfallrisiko zuerst eine Stufe hochziehen.",
      },
      {
        name: "Architektur-Move, kein Tool-Kauf",
        text: "Jeder Aufstieg ist eine Entscheidung über Nachvollziehbarkeit, Eigentum oder Prüfung. Es ist nie ein neues Modell.",
      },
    ],
    faqHeading: "Häufige Fragen",
    readHeading: "Weiterlesen",
    labels: { symptom: "Symptom", interest: "Zins", next: "Weg nach oben" },
  },
};
