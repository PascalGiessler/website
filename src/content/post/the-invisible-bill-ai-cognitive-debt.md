---
title: "The Invisible Bill: What Your AI Tools Are Really Building"
description: "On the 83-point productivity gap, 211 million lines of decaying code, and why the engineers ahead of this curve aren't faster coders."
dateFormatted: Apr 26th, 2026
---

I run Claude Code daily. Have been for about eight months.

The blank-page problem is mostly gone. When I need to rough out a service, scaffold a test suite, or translate a spec into a first implementation, the friction has dropped to almost nothing. It genuinely feels like I'm moving faster. The output feels more consistent. The dead time between knowing what to build and having something to review has compressed dramatically.

That's the part that kept nagging at me. *Feels like.*

About three months ago I started asking a harder question: what is my measured output actually doing? Not my velocity; my output. Can I explain this module to a colleague without checking the source? Could I debug it at 2 AM without the tool present? Do I understand the behavioral contracts well enough to extend it safely in six months?

The answers were uncomfortable. Not because the code was bad. Because I wasn't entirely sure. And in eight months of daily use, I had never once asked myself whether being unsure was a problem I was creating.

---

## The 83-Point Gap

METR ran the only study I've seen that I'd actually trust on this question [1]. 246 real software tasks, 16 experienced developers, controlled conditions. The result: developers were 19% slower when using AI tools. They reported believing they were 20% faster. A 39-point perception-reality gap, in the wrong direction.

The methodology matters here. METR didn't survey developers about their feelings. They measured actual task completion times on real open-source repositories against a control group. This is the kind of study that's hard to fund and easy to dismiss, which is probably why most teams haven't read it.

The perception gap is not a measurement artifact. It's a known feature of how humans assess their own cognitive performance when the *feeling* of effort decreases. AI tools dramatically reduce the friction of the hardest-feeling moments: the blank page, the lookup, the boilerplate. That reduction in felt difficulty registers as speed. The actual output rate doesn't necessarily track.

Faros AI tracks engineering metrics across thousands of production teams [2]. As of early 2026: 93% of engineering organizations report AI tool adoption. Org-level productivity gain: approximately 10%.

The per-developer feeling of acceleration is real. The system-level output gain is about one-tenth of what the adoption curve would suggest. The 83 points between those two numbers aren't a measurement error. They're what's actually happening.

This isn't an argument against AI tools. It's an argument for understanding the gap, because the teams that understand it are the ones that close it. The teams that don't are accumulating something they haven't named yet.

---

## What's Inside the Code

GitClear doesn't run surveys [3]. They instrument repositories and measure structural commit patterns across real codebases. Their 2025 analysis covered 211 million lines of code. The 2026 update held and extended the finding.

Since 2021: refactoring dropped from roughly 25% of all code changes to under 10%. Code duplication grew by 4x.

Neither of these is a prediction. They already happened to the codebases most of us work in.

The mechanism isn't laziness. LeadDev put it plainly: AI tools optimize for the phase of coding that feels hardest: the blank page, the lookup, the boilerplate [4]. They don't optimize for the phase that actually compounds: refactoring, deduplication, architectural coherence. Developers are rewarded for shipping features. AI tools make shipping faster. The incentive structure is working exactly as designed. The side effect is that structural maintenance is being systematically deferred.

What does 4x duplication actually look like in a production codebase? It's not copy-paste in the obvious sense. It's five services that handle authentication slightly differently because each was generated independently from the same prompt. It's four data transformation functions that do functionally the same thing in functionally different ways. None of them are wrong. None of them trigger lint errors. All of them become a problem the first time you need to change the behavior they share.

Debt on debt. Every refactor you skip makes the next one harder. The compounding isn't dramatic in any single sprint. It just runs quietly in the background until it doesn't.

---

## The Math That Wasn't in the Business Case

The AI productivity conversation almost always stops at year one. Faster delivery, lower cost per story point, better time-to-merge. The numbers look good. Leadership approves the rollout.

What doesn't appear in year one: the maintenance curve.

WishTree's analysis across multiple case studies puts the year-two maintenance multiplier for AI-generated code at 4x [6]. Think about what that actually means operationally. Every feature shipped in year one that touches AI-generated logic is going to cost four times more to maintain in year two than a traditionally-written equivalent. This doesn't show up in the quarterly review that approved the rollout. It shows up eighteen months later as an engineering team that seems slower than expected despite having adopted all the right tools.

IBM's Institute for Business Value makes the connection explicit [5]. Organizations that price in technical debt upfront, before the AI rollout rather than after, project 29% higher ROI than those that don't. That 29% isn't a bonus for doing something extra. It's the cost of planning correctly. The organizations underperforming on AI ROI aren't failing because the tools don't work. They're failing because they modeled the year-one numbers and ignored the year-two maintenance reality.

There's a security dimension that belongs in the same conversation. MIT Tech Review and Veracode put the share of AI-generated code containing OWASP Top 10 vulnerabilities at 45-48% [7]. This is not a code quality concern for most teams; it's a structural condition of how LLMs generate code. The models don't hallucinate security vulnerabilities deliberately. They pattern-match against training data that contains insecure code because most code in the world is insecure. The output reflects the distribution.

For teams operating under GDPR or EU AI Act Phase 2, which covers most of the DACH market [11], this is not a quality issue. It is a DPIA risk. A data protection impact assessment conducted on a system whose developers can't fully audit the logic of the code is not a valid DPIA. I've had this conversation with compliance teams in three organizations in the last six months. Every one of them initially treated AI-generated code security as an engineering concern. None of them had mapped it to their DPO's requirements until I asked.

---

## Thoughtworks Named It

Thoughtworks published Technology Radar Vol 34 in April 2026 [8]. Their term for what I've been describing: cognitive debt.

The distinction from technical debt is precise and worth holding onto. Technical debt is code that works but is hard to maintain: measurable, schedulable, a resourcing problem. You can put it in the backlog. You can budget the sprint. Cognitive debt is different. It's code that works and that your team no longer fully understands. You can't schedule that refactor because you don't know what you'd be fixing. You can't estimate it because you don't know what you don't know. It's a knowledge problem, not a code problem.

RDEL's taxonomy sharpens the distinction further [10]. There are actually three simultaneous debt types accumulating in AI-assisted codebases. Technical debt is the visible stuff: duplication, missing refactors, security holes. Cognitive debt is the knowledge gap: developers shipping code they no longer have a mental model for. Behavioral debt is the subtlest: the drift between what a system was designed to do and what it actually does in production. Behavioral debt is invisible without deliberate audit practice. It often doesn't surface until something fails in a context nobody anticipated.

Sonar framed the dynamic as well as I've seen it framed [9]: AI externalizes cognitive load but internalizes debt. You feel lighter. The system gets heavier.

Named risks are manageable. Unnamed risks accumulate silently. The naming matters more than it might seem. Once a team has a shared term for this, conversations that previously stalled, like "we're moving fast but something feels off," suddenly have traction. The problem isn't new. The vocabulary is.

---

## What I Changed

About three months ago I stopped measuring my own output by PR velocity and started measuring it by a different set of questions.

Can I explain this code to a colleague without checking the source? Can I predict how it behaves at the edges? Could I debug it at 2 AM if the tool wasn't there?

That second set of questions is harder. The answers are sometimes uncomfortable. But they're the right questions.

The IBM framing is what I keep coming back to [5]: audit discipline isn't a drag on AI adoption. It's what makes AI adoption sustainable. The organizations that price in audit cost from day one project 29% higher ROI. The audit is not overhead. The audit is the value.

In practice, this means three things changed in my workflow. I added a behavioral review step before committing any AI-generated function; not a full audit, just the three questions above. I started building golden dataset tests for any AI-generated logic that handles decisions: 20 representative inputs, known-correct outputs, run on every model update or prompt change. And I started tracking cognitive debt explicitly: code I shipped with less than full understanding gets a `// TODO: audit` annotation and a reminder in the next sprint.

The third type, behavioral debt, is the one most teams haven't addressed yet. It's subtle because the code passes all the tests. The function does what the test suite asks of it. But the behavior at the edges of the distribution, inputs nobody wrote a test for, drifts from the specification. The only way to catch behavioral debt is to test against behavior, not structure. Which is precisely what evals are designed to do.

The developers who compound in this environment aren't the ones who code fastest. They're the ones building judgment alongside velocity. That combination is harder to develop than either alone. It's also considerably harder to replace.

The invisible bill arrives eventually. The question is whether you know it's coming.

---

## Sources

[1] METR: Measuring the Impact of AI on Experienced Software Developers (Jul 2025); Feb 2026 update

[2] Faros AI: Engineering Productivity Report, 2026

[3] GitClear: AI and Code Quality: Annual Analysis (2025); 2026 update

[4] LeadDev: How AI Coding Tools Are Affecting Software Quality

[5] IBM Institute for Business Value: AI Technical Debt and ROI

[6] WishTree Tech: AI-Generated Code: Year-Two Maintenance Cost Analysis

[7] MIT Technology Review / Veracode: Security vulnerabilities in AI-generated code (OWASP Top 10)

[8] Thoughtworks Technology Radar Vol 34: Cognitive Debt (April 2026)

[9] Sonar: AI Is Redefining Technical Debt

[10] RDEL #137: A Taxonomy of AI-Induced Debt Types

[11] EU AI Act Phase 2 implementation guidance / GDPR DPIA requirements

---

*This piece draws from a five-part LinkedIn series on AI cognitive debt published in April 2026. Each post goes deeper on one dimension: the productivity data, the code quality evidence, the economics, the institutional naming, and the resolution.*
