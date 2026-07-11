---
title: "Compliance by Design: Wenn die Architektur das Audit schon mitliefert"
description: "Warum DORA, NIS2 und der AI Act dieselbe Architektur-Schicht treffen, und wie drei Entkopplungen sie gemeinsam beantworten."
dateFormatted: Jun 17th, 2026
lang: de
---

*Zuerst erschienen auf Substack ([Stack und Kalkül](https://pascalgiessler.substack.com/)).*

## Hook

In einem Architektur-Review vor einigen Monaten fiel der Satz, an dem sich für mich alles aufhängt: „Die Compliance machen wir, wenn das System steht." Gesagt von einem fähigen Lead, in einem Haus, das es ernst meint. Und trotzdem war es der Moment, in dem die teuerste Architekturentscheidung des Projekts fiel, leise, ohne dass sie als Entscheidung markiert wurde.

Denn Compliance, die nach dem System kommt, ist nicht Governance. Sie ist Nachrüstung. Erst wird gebaut, dann kommt der Auditor, dann wird hektisch ergänzt, was von Anfang an nachweisbar hätte sein müssen: Logging, das nie durchgängig war. Access-Control, die an den falschen Stellen sitzt. Ein Nachweis über Modell-Herkunft, den niemand mehr sauber rekonstruieren kann. Jede dieser Nachrüstungen kostet mehr als das ursprüngliche Feature, und hält schlechter.

Und unter all dem liegt die teuerste Schicht, die in keiner Checkliste steht. Wenn niemand im Haus mehr belegen kann, wie das System zu seiner Antwort kam, ist das nicht fehlende Compliance, das ist Cognitive Debt: Schulden nicht im Code, sondern im Urteilsvermögen der Organisation. Sie werden vor dem Prüfer fällig, nicht im Sprint.

In den letzten Jahren habe ich genug produktive KI-Systeme begleitet, um ein Muster zu sehen: Die Teams, die bei Regulierungs-Schlagzeilen entspannt bleiben, behandeln Compliance nicht als separates Projekt. Sie bauen so, dass der Nachweis aus der Architektur fällt. Das geht nur, wenn man vorher drei Schnitte macht.

## These

Compliance by Design heißt nicht, dass man ein Audit-Modul anbaut. Es heißt, dass die Schichten, die man für Souveränität ohnehin braucht, Modellzugriff, Agenten-Orchestrierung, Modell-Herkunft, zugleich die Audit-Schichten sind. DORA, NIS2 und der AI Act lesen sich in vielen Häusern wie drei getrennte Pflichten mit drei Teams und drei Aktenordnern. Aus Architektur-Perspektive verdichten sie sich zu einer Frage: Wo berührt dein Stack einen Anbieter, und kannst du diesen Punkt kontrollieren, testen und nachweisen? Wer die drei Entkopplungen baut, beantwortet drei Regulierungsfragen mit einem Design statt mit drei Projekten.

*Dieselben drei Souveränitäts-Schichten, zweimal gelesen: einmal als Exit-Funktion, einmal als Audit-Funktion. Gateway = durchgängiges Tracing (DORA). MCP-Server = Access-Control am Datenfluss (NIS2). Open-Weight unter europäischer Jurisdiktion = Herkunfts-Nachweis (AI Act).*

## Argument

### Beat 1 — Drei Regulierungen, ein Berührungspunkt

Es lohnt sich, die drei Regelwerke nicht zuerst über ihre Paragraphen zu lesen, sondern über die Frage, die sie an die Architektur stellen.

**DORA** (Digital Operational Resilience Act, seit Januar 2025 scharf für den Finanzsektor) fragt nach Drittparteien-Risiko und nach Exit-Plänen für kritische IKT-Dienstleister.[^1] Übersetzt: Was passiert, wenn dein Modell-Anbieter ausfällt oder kündigt, und wie schnell bist du woanders? Wir haben gesehen, wie schnell eine Regierung ihren Einfluss auf Modellanbieter ausüben kann.

**NIS2** (seit Oktober 2024 in nationaler Umsetzung, in Deutschland über das Umsetzungsgesetz) fragt nach Lieferketten-Sicherheit und Risikomanagement entlang der digitalen Supply Chain.[^2] Übersetzt: Wer sitzt eigentlich alles in deinem kritischen Pfad, und hast du darüber Kontrolle?

**Der AI Act** (gestaffelt in Kraft, GPAI-Pflichten und Code of Practice greifen 2025/2026) fragt nach Modell-Herkunft, Trainingsdaten-Transparenz und Verarbeitungsort.[^3] Übersetzt: Woher kommt das Modell, wo laufen die Daten, und kannst du es belegen?

Drei verschiedene Behörden, drei verschiedene Vokabulare, aber alle drei Fragen treffen denselben Punkt: die Schicht, an der deine Anwendung einen externen Modell-Anbieter berührt. Wer diesen Berührungspunkt nicht kontrolliert, verteilt das Risiko über den ganzen Stack. Wer ihn kontrolliert, macht aus drei Compliance-Problemen eine Architektur-Eigenschaft.

### Beat 2 — Das Gateway ist deine Audit-Schicht

Das AI-Gateway verkaufe ich normalerweise über Austauschbarkeit: Die Anwendung spricht gegen eine einheitliche API, der Anbieter wird zur Konfiguration. Aber dieselbe Schicht hat eine zweite Lesart, die in regulierten Branchen wichtiger ist.

Ein Gateway ist der einzige Ort im Stack, durch den jeder Modell-Aufruf läuft, über alle Anbieter hinweg. Das macht es zur natürlichen Audit-Schicht. Durchgängiges Tracing über Provider-Grenzen, Cost- und Rate-Anomalie-Erkennung, Prompt-Injection-Detection und ein lückenloses Log darüber, welche Anfrage mit welchen Daten an welches Modell ging. Genau das, wonach ein Auditor fragt, und genau das, was nachträglich kaum sauber herzustellen ist.

Der Punkt für DORA: Ein Exit-Plan ist nicht glaubwürdig, wenn der Wechsel ein Sechs-Monats-Projekt ist. Mit einem Gateway ist er eine Routing-Regel, und damit dokumentier- und testbar. Resilience-by-Design statt Resilience-im-Foliensatz.

Das wird konkret, sobald ein Prüfer den Exit nicht beschrieben, sondern vorgeführt haben will. Ohne Gateway heißt „zeigt mir, dass ihr den Anbieter wechseln könnt": eine PowerPoint mit einem Migrationsplan, der nie ausgeführt wurde. Mit Gateway heißt es: Routing-Regel auf den Sekundär-Anbieter umschalten, eine repräsentative Last durchlaufen lassen, die Trace-Logs als Nachweis exportieren, in einer Übung, die man quartalsweise wiederholen kann, ohne die Produktion anzufassen. Der Unterschied zwischen einem behaupteten und einem getesteten Exit ist in einem DORA-Kontext nicht kosmetisch. Er ist die ganze Anforderung.

Das Anti-Pattern, das hier regelmäßig auftaucht: der dünne Wrapper, der nur das Provider-SDK kapselt. Der erzeugt kein durchgängiges Log, weil anbieter-spezifische Felder durchschlagen. Sobald der zweite Provider dazukommt, reißt die Abstraktion, und mit ihr die Audit-Linie.

### Beat 3 — Der MCP-Server ist deine Access-Control

Die zweite Frage, wer darf welche Daten an welches Modell geben, wird in vielen Stacks gar nicht an einer kontrollierbaren Stelle beantwortet. Sie verteilt sich über Agenten-Code, Framework-Konfiguration und Tool-Definitionen, die an drei Orten gepflegt werden.

Das Model Context Protocol zieht diese Grenze an die richtige Stelle. Tools werden zu Servern, die nicht wissen müssen, welcher Agent sie aufruft; Agenten werden zu Clients. Damit wird der MCP-Server zum natürlichen Ort für Access-Control und Datenfluss-Kontrolle: Tool-Aufrufe werden dort sichtbar und policy-fähig, bevor sie ans Modell gehen. Welche Datenquelle, in welcher Reihenfolge, mit welcher Filterung, die Logik sitzt im Server, an einer Stelle, prüfbar.

Der Punkt für NIS2: Lieferketten-Sicherheit heißt, den kritischen Pfad zu kennen und zu kontrollieren. Eine MCP-konforme Architektur macht diesen Pfad explizit, statt ihn in proprietären Orchestrierungs-Primitiven zu vergraben, deren Semantik mit dem nächsten Framework-Update mitwandert.

### Beat 4 — Open-Weight unter europäischer Jurisdiktion ist dein Herkunfts-Nachweis

Die dritte Frage, woher kommt das Modell, wo laufen die Daten, ist die, an der „EU-Region" als Antwort oft zu kurz greift. Datenresidenz löst, wo die Daten liegen. Sie löst nicht die Jurisdiktion: CLOUD Act und FISA 702 greifen unabhängig vom physischen Standort, sobald der Anbieter eine US-Muttergesellschaft hat.[^4] Das Rechenzentrum in Frankfurt ändert daran nichts.

Ein Open-Weight-Modell (Mistral, Llama-Linie, Qwen, Apertus aus der Schweiz) unter europäischer Jurisdiktion ist die robustere Architektur-Antwort auf die Herkunfts-Frage des AI Act, nicht nur ein Häkchen in der Cloud-Konsole. Open-Weight heißt nicht zwangsläufig Open-Source; die Trainingsdaten sind meist nicht offen. Aber die Gewichte sind verfügbar, der Verarbeitungsort ist kontrolliert, und das Modell-Verhalten ist für einen Auditor reproduzierbar.

Man muss darüber nicht die gesamte Last fahren. Der Wert liegt in der Existenz des Pfades: ein inferenzfertiges Setup, das in unter zwei Wochen produktionsreif zugeschaltet werden kann. Der Schalter muss existieren, bevor er gebraucht wird.

### Beat 5 — Warum die Nachrüstung strukturell teurer ist

Bleibt die Frage, warum „erst das System, dann die Compliance" so verlässlich teuer wird. Es ist kein Disziplin-Problem und keine Frage des Budgets. Es ist strukturell.

Eine Audit-Eigenschaft, die man nachträglich einzieht, muss durch Code laufen, der nicht dafür gebaut wurde. Das durchgängige Tracing-Log existiert nicht, weil jeder Service den Anbieter anders aufruft, also wird es an zwanzig Stellen halb nachgezogen, mit Lücken genau dort, wo die direkten Provider-Calls sitzen. Die Access-Control sitzt im Agenten-Code statt am Datenfluss, also muss sie für jedes Tool einzeln nachgepflegt werden, divergiert und veraltet. Und der Herkunfts-Nachweis lässt sich für ein Modell, das über eine proprietäre Plattform lief, oft gar nicht mehr sauber rekonstruieren, weil die nötigen Informationen nie protokolliert wurden.

Das Muster dahinter: Nachgerüstete Compliance ist immer eine Funktion der Anzahl der Stellen, an denen das System einen Anbieter berührt. Je verteilter diese Berührung, desto teurer der Nachweis, und ohne Entkopplung ist sie maximal verteilt. Compliance by Design dreht das um: Es bündelt die Berührung an drei kontrollierten Schichten. Dann ist der Nachweis eine Eigenschaft von drei Komponenten, nicht von zwanzig.

Das gefährlichste Anti-Pattern ist deshalb nicht die fehlende Compliance, sondern das Compliance-Theater: die EU-Region als Häkchen, der Wrapper als „Abstraktion", der Migrationsplan, der nie lief. Es sieht im Audit eine Weile gut aus, bis zu dem Tag, an dem ein Vendor-Strategiewechsel oder eine Schlagzeile die Frage aus dem Foliensatz in die Produktion zieht. Dann ist man genau dort, wo man nie sein wollte: mit einer Abhängigkeit, die schneller eskaliert, als ein Replatforming dauert.

## Implikation für CTO/CISO

Für die CTO-Seite ist die Reihenfolge entscheidend, weil sie über Aufwand und Reversibilität bestimmt: erst das Gateway (billigster, reversibelster Schritt, liefert sofort die Audit-Linie), dann MCP-Normalisierung der Tools (parallelisierbar mit Feature-Sprints, liefert die Access-Control-Schicht), zuletzt der Open-Weight-Pfad (kapital-intensiver, aber zeitlich entzerrbar, liefert den Herkunfts-Nachweis). Nach Schritt eins ist der DORA-Exit dokumentierbar, nach Schritt zwei ist der NIS2-Pfad explizit, nach Schritt drei ist die AI-Act-Herkunftsfrage belastbarer beantwortet, ohne dass die Roadmap pausiert.

Für die CISO-Seite ist die Pointe, dass keine dieser drei Schichten eine Compliance-Sonderausgabe ist. Es sind dieselben Schichten, die das Engineering für technologische Flexibilität ohnehin baut. Das ist der eigentliche Hebel von Compliance by Design: Du zahlst nicht zweimal, einmal für Souveränität, einmal für Audit. Du baust einmal und liest das Ergebnis zweimal.

Souveränität ist die Vorbedingung, nicht das Ergebnis. Und Compliance ist, richtig geschnitten, nur ihre zweite Lesart.

## Call-to-Reflect

Wenn morgen die nächste Regulierungs-Schlagzeile kommt, ist das in eurem Haus ein Krisen-Call oder ein Nicht-Ereignis? Und an welcher der drei Schichten, Gateway, Orchestrierung, Modell-Herkunft, würde der Nachweis heute zuerst brechen?

## Weiterführend

- Begriffe aus diesem Text im [Glossar](/de/glossary/): [AI Gateway](/de/glossary/#ai-gateway), [Model Context Protocol (MCP)](/de/glossary/#mcp), [Souveräne AI](/de/glossary/#sovereign-ai), [Vendor Lock-in](/de/glossary/#vendor-lock-in), [EU AI Act](/de/glossary/#eu-ai-act), [Cognitive Debt](/de/glossary/#cognitive-debt).
- Verwandter Essay: [Das Cognitive Debt Maturity Model](/post/das-cognitive-debt-maturity-model/), das misst, wie souverän eine AI-Architektur bereits ist.

## Quellen

[^1]: *Digital Operational Resilience Act (DORA)*, Verordnung (EU) 2022/2554, Anforderungen an IKT-Drittparteien-Risikomanagement und Exit-Strategien für kritische Dienstleister im Finanzsektor, anwendbar seit 17. Januar 2025. <https://eur-lex.europa.eu>

[^2]: *NIS2-Richtlinie*, Richtlinie (EU) 2022/2555, erweiterte Cybersicherheits- und Lieferketten-Anforderungen, nationale Umsetzung seit Oktober 2024 (Deutschland: NIS2-Umsetzungsgesetz). <https://eur-lex.europa.eu>

[^3]: *EU AI Act*, Verordnung (EU) 2024/1689, sowie der *General-Purpose AI Code of Practice*, Transparenz- und Dokumentationspflichten zu Modell-Herkunft, Trainingsdaten und Verarbeitungsort, gestaffelt in Kraft. <https://digital-strategy.ec.europa.eu>

[^4]: U.S. *CLOUD Act* (2018) und *FISA Section 702*, ermöglichen US-Behörden den Zugriff auf Daten US-amerikanischer Anbieter unabhängig vom physischen Speicherort. Konsequenz: Die EU-Region eines US-Hyperscalers löst die Datenresidenz, nicht die Jurisdiktions-Frage.
