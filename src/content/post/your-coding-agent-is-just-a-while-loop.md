---
title: "Your Coding Agent Is Just a While-Loop"
description: "Strip away the frameworks and every coding agent is the same twenty lines: an LLM calling tools in a loop. Here is why that matters more than the abstractions on top of it."
dateFormatted: Jun 11th, 2026
lang: en
---

*Principal Stack, Issue 01 of Agentic Engineering Patterns. Originally published on [Substack](https://pascalgiessler.substack.com/).*

![An abstract spiral of light, the loop at the centre of every coding agent](/assets/images/posts/agent-while-loop-header.webp)

## The whiteboard test

The fastest way I've found to cut through an architecture debate about agents is to ask the team to draw the agent on a whiteboard without using the name of a single framework. No LangGraph, no CrewAI, no "orchestrator layer." Just the control flow.

Almost every time, the room goes quiet for a moment. Then someone draws a loop: the model decides what it wants to do, something executes the action, the result goes back to the model, and the cycle repeats until the task is done.

That loop is the part that matters. Everything else on the original diagram was scaffolding.

I've shipped enough agent systems to trust this as a useful test, and it isn't my invention. Simon Willison's preferred definition is that an LLM agent "runs tools in a loop to achieve a goal" [^1]. Anthropic's engineering team builds its pattern taxonomy on the same kernel [^2]. Thoughtworks shows the same thing from the implementation side: start with a model, instructions, a few tools, and only then add protocol and framework conveniences where they help [^3]. The people closest to the metal keep arriving at the same place: the agent is small. The complexity you're fighting lives somewhere else, and you can't see where until you can see the loop clearly.

## Sharp thesis

A coding agent is not a framework, a platform, or a product category. It is a control-flow pattern: **an LLM in a loop, calling tools, until a goal is met.** Once you internalize that the kernel is small, two things change.

First, you stop attributing agent behavior to framework magic and start attributing it to the three things that actually determine outcomes: the tools you expose, the context you assemble, and the termination condition you set.

Second, build-versus-buy for agent frameworks becomes a sober decision about *those three things*, not a leap of faith. Frameworks are real and sometimes worth it. But you should be able to draw what they are doing for you. If you cannot, you are not buying leverage. You are buying fog.

![The agent loop: an LLM proposes a tool call, an executor runs it against the environment, the result returns to the model, repeating until a termination check passes](/assets/images/posts/agent-while-loop-diagram.webp)

*The kernel every coding agent shares: a cyclic loop between the model, a tool executor, and the environment, gated by a termination check. Frameworks add scaffolding around this loop. They do not replace it.*

## Beat 1 — The loop, stated as code

Here is the entire kernel, in pseudocode you could run today:

```python
messages = [system_prompt, user_goal]
while True:
    response = llm(messages, tools=available_tools)
    if response.is_final_answer:
        return response.text
    for call in response.tool_calls:
        result = execute(call)            # read file, run bash, edit, search…
        messages.append(call)
        messages.append(result)
```

That is it. The model receives a goal and a list of tools it may call. It either answers or asks to call a tool. You execute the call, append both the call and its result to the conversation, and loop. Anthropic describes the foundational building block as an "augmented LLM": a model with tools, retrieval, and memory [^2]. Willison's framing is the same primitive seen from the practitioner's chair [^1].

The reason this matters is not minimalism for its own sake. It is that every meaningful design decision in an agent is a decision about one of the four moving parts in those ten lines: the system prompt, the tool set, the execution sandbox, and the loop's exit condition. Most agent failures I see trace back to one of those four, not to the framework wrapped around them.

## Beat 2 — Why "just a loop" is a senior insight, not a reductive one

There's a reflex to hear "it's just a while-loop" as dismissive. It's the opposite. Saying a database is "just a B-tree and a write-ahead log" doesn't make databases trivial, it tells you *where the hard problems live*. Same here. Once the loop is visible, the genuinely hard parts come into focus, and none of them are the loop:

- **Tools** are your real API surface to the world. Their design, granularity, error messages, idempotency, determines what the agent can reliably do. A vague tool with a cryptic error is a bug the model cannot reason its way out of.
- **Context** is what you put in `messages` before each call. Phil Schmid argues, correctly, that "the new skill in AI is not prompting, it's context engineering", and most agent failures are context failures, not model failures [^4]. The loop is trivial; deciding what the model sees on each turn is not.
- **Termination** is the quietly dangerous one. `while True` with no robust exit is how you get runaway loops, repeated tool calls, and token bills that scale with the model's confusion. The exit condition is a correctness property, not a detail.

This is the altitude shift that matters for a principal engineer: the loop is a solved, copyable substrate. Your engineering effort, and your review attention, belongs on tools, context, and termination. Frameworks that genuinely help are the ones that improve *those three*. Frameworks that only hide the loop are selling familiarity at the price of clarity.

## Beat 3 — The proof: the framework is not the center

If the kernel were not this small, the first working version of a coding agent would require a heavyweight architecture. It does not. Thoughtworks' Ben O'Mahony walks through a CLI coding assistant that begins with a model, instructions, and a few local tools before adding MCP servers for richer capabilities; the striking takeaway is how little code is needed before the system becomes useful [^3]. Willison makes the complementary point from daily practice: the most productive loop is often a model that can use the shell, git, tests, and project-specific instructions well [^1].

There's an instructive tension worth flagging here, because it previews where this series goes. The Thoughtworks build leans into MCP as the extension layer [^3]. Willison and Armin Ronacher are more skeptical for day-to-day coding, preferring direct CLI tools and code execution unless a protocol server clearly earns its place [^1][^5]. Both camps agree the *loop* is simple. They disagree about how the loop should reach the world: through a protocol layer, through the shell, or through both.

That disagreement only becomes visible, and decidable, once you have stripped the agent down to its kernel and can see that "how tools connect" is a separate, swappable decision. Most teams never get there because the framework answered the question for them before they knew it was a question.

## Beat 4 — What this means for build-versus-buy

The practical payoff of seeing the loop is a calmer build-versus-buy conversation. The question stops being "should we adopt Framework X" and becomes three answerable ones:

1. Does X give us better tools, or make ours easier to write safely?
2. Does X give us better context control?
3. Does X give us a more robust termination and error model?

If yes, adopt it with open eyes. If X's main contribution is that it hides the loop behind nice abstractions, you are taking on a dependency, its lock-in, upgrade treadmill, and opinions, in exchange for not writing a small kernel you should understand anyway.

This is not an argument against frameworks. It is an argument for *reversibility*. Build the kernel yourself first, even as a throwaway, so you know what the framework is doing for you. Then a framework is a tool you chose, not a fog you are trapped in. The teams I've seen move fastest with agents are not the ones who picked the best framework. They are the ones who understood the loop well enough that the framework choice stopped being load-bearing.

## Implication for staff engineers and CTOs

For the **architecture review**: require that anyone proposing an agent can draw its loop without framework names. If they cannot, the design is not ready. Not because frameworks are bad, but because the team cannot yet see where the real risks live. The whiteboard test is cheap and diagnostic.

For the **roadmap**: treat the agent loop as a copyable substrate and concentrate engineering investment on the three hard parts. Your durable advantage is in tool design, context engineering, and eval/termination discipline, none of which any framework gives you for free. Frameworks can accelerate. They cannot substitute for understanding.

For **build-versus-buy**: adopt frameworks for what they measurably improve in tools, context, and termination, and keep them reversible. Build the twenty-line kernel once so the dependency is a choice, not a leap of faith. "We understand our agent down to the loop" is a stronger position than "we standardized on the popular framework."

## Call to reflect

Pull up the most important agent in your stack and try the whiteboard test on it: can your team draw its loop, the model, the tools, the execution, the exit condition, without naming a single framework?

If yes, you know where to spend your next sprint: harden the tools, sharpen the context, tighten the exit condition.

If no, that is not a knowledge gap to be embarrassed about. It is the highest-leverage thing you could close this quarter.

## Further reading

- The vocabulary in this piece, defined: [Harness](/glossary/#harness), [Agent](/glossary/#agent), [Agentic AI](/glossary/#agentic-ai), [Tool Use](/glossary/#tool-use), [Context Engineering](/glossary/#context-engineering), [Eval](/glossary/#eval), [MCP](/glossary/#mcp) in the [glossary](/glossary/).
- Built on this thesis: [AI Radar](/tools/ai-radar/), a technology radar that computes its own map instead of curating it.

## Sources

[^1]: Simon Willison, *Designing agentic loops* (September 2025). Preferred definition: an LLM agent "runs tools in a loop to achieve a goal"; emphasizes choosing the right tools for the loop, often shell commands over MCP. <https://simonwillison.net/2025/Sep/30/designing-agentic-loops/>

[^2]: Erik Schluntz & Barry Zhang (Anthropic), *Building effective agents* (December 2024). The "augmented LLM" (model + tools + retrieval + memory) as the composable building block; workflow-versus-agent distinction; "find the simplest solution possible." <https://www.anthropic.com/engineering/building-effective-agents>

[^3]: Ben O'Mahony (Thoughtworks), *Building your own CLI Coding Agent with Pydantic-AI* (August 2025). A working CLI coding agent built from a model, instructions, local tools, and MCP servers; notable for how little code the initial version requires. <https://martinfowler.com/articles/build-own-coding-agent.html>

[^4]: Philipp Schmid, *The new skill in AI is not prompting, it's context engineering*. Most agent failures are context failures; context as a dynamically assembled system output. <https://www.philschmid.de/context-engineering>

[^5]: Armin Ronacher, *Agentic Coding Recommendations* (June 2025). Optimize code and tooling for agents; favor explicit, fast-feedback CLI tools over bespoke integrations; MCP skepticism. <https://lucumr.pocoo.org/2025/6/12/agentic-coding/>
