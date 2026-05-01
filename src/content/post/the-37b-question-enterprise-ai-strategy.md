---
title: "The $37B Question Nobody's Answering"
description: "On why most enterprise AI investment misses EBIT, and what the organizations closing that gap are actually doing differently."
dateFormatted: Apr 26th, 2026
---

I sat in a strategy review last quarter where someone proudly presented an AI-powered dashboard that saved the team "hundreds of hours." When I asked what they did with those hours, the room went quiet.

That silence is the $37 billion problem.

---

## The Investment Reality

Menlo Ventures puts enterprise GenAI spending at $37 billion in 2025. Three times more than the year before. The Wharton/GBK AI Adoption Report surveyed enterprises across industries and found something that should unsettle any board: 80%+ report no measurable impact on EBIT.

Not marginal impact. Not impact that's hard to attribute. Zero.

The average enterprise gets $3.70 back per dollar invested in AI. Top performers, the quartile actually closing the gap, get $10.30. That spread isn't about which model they chose. It's about what they built around it.

The $10.30 organizations rebuilt processes around AI capabilities instead of welding AI onto existing workflows. They stopped measuring model accuracy and started measuring revenue impact. And they invested in the work nobody wants to present at the all-hands: data quality, governance, change management. Boring work that makes everything else possible.

Most GenAI spending right now is sophisticated prototyping dressed up as transformation.

---

## The Architecture Gap Nobody Talks About

Here's the number I keep quoting: 40% of enterprise agent projects will be dead by 2027. Deloitte published that. When I first read it, it felt aggressive. After several months embedded in multi-agent architecture work, it feels conservative.

Eighty percent of enterprises are mature in basic automation. Only 28% have the maturity to combine that with actual AI agents. That 52-point gap isn't a skills gap. It's an architecture gap.

Three failure modes I see repeatedly:

Agent sprawl kills coordination first. Someone builds an agent for email triage, someone else for ticket routing, a third team for data extraction. Six months later there are 15 agents with no coordination layer, conflicting outputs, and an inference bill that makes the CFO physically uncomfortable.

Then there's what O'Reilly called the prompting fallacy: "You can't prompt your way out of a system-level failure." When a multi-agent system underperforms, the instinct is to tweak the prompt. The fix is almost always structural: supervisor patterns, shared memory, proper handoff protocols. Architecture, not wordsmithing.

And the hardest one to argue against in a sprint review: removing humans from decisions that actually need them. Google's multi-agent design patterns paper baked human-in-the-loop in for good reason. Autonomous agents triggering irreversible financial decisions without a checkpoint isn't innovation. It's negligence with good marketing.

The teams that will still have working agent systems in 2027 aren't deploying the most agents. They're the ones who spent boring months designing coordination structures before writing a single prompt.

---

## What Kubernetes Wasn't Designed For

I've spent close to a decade building distributed systems and cloud-native platforms. Containerized monoliths, service meshes, Helm charts at 2 AM. I genuinely love this work.

Gartner's 2026 AI IaaS data: inference spending crossed $20.6 billion, up from $9.2 billion the year before. For the first time, inference overtook training as the dominant AI infrastructure cost driver.

Your Kubernetes clusters weren't designed for this.

Cloud-native was built for CPU-bound, stateless, request-response workloads. Horizontal scaling. Twelve-factor apps. Elegantly boring. AI-native is a different animal: memory-aware GPU pipelines, per-invocation token costs, state that doesn't fit the stateless paradigm; model weights, context windows, embedding caches.

The consequence nobody budgets for: inference is COGS now. A complex agent workflow can cost $2-5 per invocation. Multiply by your user base. Your CFO needs that number before the next board presentation, not during it.

The CTOs treating this as an infrastructure upgrade will be explaining cost overruns within 18 months.

---

## What I Got Wrong About Governance

I used to think governance slowed things down. Then I watched a team spend four months building an AI-powered recommendation system, ship it, and pull it offline in two weeks because nobody had tested for demographic bias in the training data.

Four months of engineering. Gone.

McKinsey's 2026 AI Trust report: only a third of organizations have reached maturity level 3 on their trust framework. PwC puts average governance maturity at 2.3 out of 5. In the age of agentic AI, where systems chain decisions and trigger actions autonomously, immature trust isn't just a compliance risk. It's an operational one.

What changed in my approach: I stopped treating governance as an audit gate at the end. Fairness checks, hallucination rate monitoring, decision traceability: all automated, all running before anything touches production. Not because a regulator required it. Because shipping faster demands it.

If I can set an SLO for response time, I can set one for hallucination rates. The tooling exists. Most teams just haven't connected the dots yet.

The McKinsey correlation: organizations at trust maturity level 3+ deploy AI features 40% faster than those at levels 1-2. Not despite the governance overhead, but because of it. Fewer rollbacks. Faster stakeholder sign-off. Less rework.

Governance doesn't slow you down. Rework does.

---

## The Decision That Actually Matters

The most important AI decision your company will make this year has nothing to do with model selection.

I keep having the same conversation with CTOs. They want to talk about GPT vs. Claude vs. open-weight. I want to talk about their data pipeline, their serving infrastructure, and whether they've thought about swapping that model in 18 months.

Because they will.

Three architectural decisions that outlast any model choice:

RAG vs. fine-tuning is not a solved debate despite what the internet suggests. The LaRA benchmark from ICML is precise: RAG is better for knowledge-intensive tasks with changing data; fine-tuning is better for tone, structure, and domain behavior. Most enterprises need both. The way you combine them shapes your data pipeline and cost structure for years.

On build vs. integrate: DeepSeek V3 was trained for roughly $5 million. Not $50M. Five. That cost collapse changes the build-vs-buy equation for what a focused engineering team can realistically tackle in a quarter.

These aren't implementation details to delegate. They're strategic bets that compound, or don't, for years.

Your architecture is your AI strategy. Same thing. If the architecture is wrong, it doesn't matter which model you picked.

---

## Sources

[1] Menlo Ventures: The State of Generative AI in the Enterprise (2025)

[2] Wharton/GBK: 2025 AI Adoption Report ($3.70 vs. $10.30 ROI; 80%+ no EBIT impact)

[3] Deloitte Insights, Agentic AI Strategy: Tech Trends 2026

[4] Deloitte TMT Predictions: AI Agent Orchestration (40%+ projects cancelled by 2027; 28% enterprise maturity)

[5] O'Reilly Radar: Designing Effective Multi-Agent Architectures

[6] Google/InfoQ: Eight Essential Multi-Agent Design Patterns (human-in-the-loop as standard)

[7] Gartner: AI-Optimized IaaS Growth ($9.2B to $20.6B inference; inference overtakes training)

[8] McKinsey: State of AI Trust in 2026 (1/3 at maturity level 3+; 40% faster deployment)

[9] PwC: 2025 Responsible AI Survey (governance maturity 2.3/5)

[10] Sebastian Raschka: The State of LLMs 2025 (DeepSeek V3 at ~$5M training cost)

---

*This piece draws from a five-part LinkedIn series on generative AI strategy for leadership, published April 2026.*
