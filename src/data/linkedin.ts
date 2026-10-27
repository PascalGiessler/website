/** Published posts only. Dates and URLs checked against Buffer and LinkedIn. */
export const linkedinPosts = [
  {
    published: "2026-10-27",
    url: "https://www.linkedin.com/posts/pgiessler_agentengineering-softwarearchitektur-share-7520718550966145024-MbYn/",
    language: "de",
    de: {
      title: "Die Integration mehrerer Coding-Agenten prüfen",
      summary: "Filter und Navigation bestehen ihre Einzeltests, zusammen verliert die Suche ihren Zustand. Eine Prüfung nach dem Merge muss den gemeinsamen Ablauf abdecken.",
    },
    en: {
      title: "Testing changes from multiple coding agents",
      summary: "Filter and navigation changes pass their separate tests, but together they break the search state. The merged version needs a test of the complete user flow.",
    },
  },
  {
    published: "2026-10-22",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7518891546155393024",
    language: "de",
    de: {
      title: "Wann muss der Agent nachfragen?",
      summary: "Die Breite eines Filters lässt sich aus vorhandenen Komponenten ableiten. Ob er archivierte Kundendaten einschließen darf, braucht eine fachliche Entscheidung.",
    },
    en: {
      title: "When should an agent ask for clarification?",
      summary: "An agent can infer a filter’s width from nearby components. Including archived customer data requires a decision about scope and access.",
    },
  },
  {
    published: "2026-10-15",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7516354803489374208",
    language: "de",
    de: {
      title: "Was liefert das Tool zurück?",
      summary: "Ein Import kann erfolgreich enden und trotzdem Datensätze zurückweisen. Der Agent muss diesen Teilerfolg erkennen und die nächste Aktion danach wählen können.",
    },
    en: {
      title: "What does the tool return?",
      summary: "An import can finish successfully while rejecting records. The agent needs to recognise partial success before choosing its next action.",
    },
  },
  {
    published: "2026-10-13",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7515630090127339520",
    language: "de",
    de: {
      title: "Was passiert beim zweiten Versuch?",
      summary: "Die Bestellung wurde angenommen, die Antwort ging verloren. Wie der Agent den Status ermittelt und eine doppelte Bestellung verhindert, gehört in den Test.",
    },
    en: {
      title: "What happens on the second attempt?",
      summary: "The order was accepted, but its response was lost. Test how the agent checks its status and avoids placing the order twice.",
    },
  },
] as const;
