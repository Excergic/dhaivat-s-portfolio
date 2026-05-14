---
layout: post
title: "Building AI Agents From Scratch: What the Tutorials Don't Tell You"
date: 2025-02-18
description: The hard lessons from building production agentic systems — tool reliability, prompt engineering for agents, and when NOT to use agents.
tags: [agentic, agents, production]
categories: [agentic]
domain: agentic
content_type: blog
external_source: dev.to
redirect: https://dev.to
toc:
  sidebar: left
---

*Originally published on [dev.to](https://dev.to). Full article there.*

---

## The Gap Between Demo and Production

Every agent tutorial shows the same happy path: the LLM calls a tool, gets results, and returns a clean answer. What they skip:

- The tool returns a 429 rate limit at 2 AM
- The LLM hallucinates a tool that doesn't exist
- The agent loops indefinitely refining a bad answer
- Context fills up and the agent "forgets" earlier steps

Here's what I learned building agents that actually ship.

---

## Lesson 1: Tools Are Your Failure Surface

The LLM part is usually fine. Your tools will break.

**Rule:** Every tool needs:
- A timeout (default: 10 seconds)
- A retry policy with exponential backoff
- A meaningful error message the LLM can reason about
- Schema validation before the call is made

```python
async def call_tool(name: str, args: dict) -> ToolResult:
    tool = registry.get(name)
    if not tool:
        return ToolResult(error=f"Tool '{name}' not found. Available: {registry.list()}")

    validated_args = tool.schema.validate(args)  # raises on bad input
    for attempt in range(3):
        try:
            result = await asyncio.wait_for(tool.fn(**validated_args), timeout=10)
            return ToolResult(output=result)
        except asyncio.TimeoutError:
            if attempt == 2:
                return ToolResult(error="Tool timed out after 3 attempts")
            await asyncio.sleep(2 ** attempt)
```

---

## Lesson 2: Agent Loops Need Hard Stops

Without explicit limits, agents loop. Set:
- Max steps (25 is a good default)
- Max tokens consumed
- Wall clock timeout

And log everything. When an agent loops, you need the full trace to understand why.

---

## Lesson 3: Prompt Engineering Is Systems Engineering

The system prompt for an agent isn't copy — it's a specification. Be explicit:
- What tools exist and when to use them
- How to handle errors
- When to ask the user vs. proceed
- Format of final output

Bad: "You are a helpful assistant."
Good: See [the agentic system design doc](/posts/2025-02-10-agentic-orchestration-system-design).

---

## Lesson 4: Know When NOT to Use Agents

Agents add latency, cost, and failure modes. Use a simple chain (or a single LLM call) when:
- The task has ≤ 3 clear, predefined steps
- You control all inputs and outputs
- Latency matters (< 2 seconds)

Use agents when:
- The path to the answer is unclear upfront
- External data is needed mid-task
- Different branches of logic require different capabilities

---

## What to Read Next

- [ReAct pattern write-up](/posts/2025-03-01-react-agent-pattern) — the loop that powers most agents
- [Tool-use and memory patterns](/posts/2025-03-08-tool-use-memory-patterns) — practical patterns that work
