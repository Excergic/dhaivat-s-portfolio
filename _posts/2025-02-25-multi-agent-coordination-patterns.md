---
layout: post
title: "Multi-Agent Coordination: Patterns That Actually Work"
date: 2025-02-25
description: Orchestrator-worker, peer-to-peer, and blackboard patterns for multi-agent systems — with trade-offs and when to use each.
tags: [agentic, multi-agent, coordination]
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

## Why Multi-Agent?

Single-agent systems hit a wall:
- Context window fills with a long task history
- A generalist model does everything mediocrely
- No parallelism

Multi-agent systems solve this by splitting work. But coordination is hard. Here are the three patterns worth knowing.

---

## Pattern 1: Orchestrator-Worker

One orchestrator decomposes the task and delegates to specialist workers.

```
Orchestrator
├── Worker A: web research
├── Worker B: code generation
└── Worker C: data analysis
```

**Pros:** Simple, easy to debug, clear ownership
**Cons:** Orchestrator is a bottleneck; workers can't collaborate

**Use when:** Tasks decompose into independent subtasks.

```python
class Orchestrator:
    async def execute(self, task: str) -> str:
        plan = await self.planner.plan(task)
        results = {}
        for step in plan.steps:
            worker = self.router.route(step)
            results[step.id] = await worker.execute(step, context=results)
        return self.synthesizer.synthesize(task, results)
```

---

## Pattern 2: Peer-to-Peer (Debate / Critique)

Agents interact directly — one generates, one critiques, repeat.

```
Generator Agent ←→ Critic Agent
       ↕
   Synthesizer
```

**Pros:** Higher quality output, catches errors
**Cons:** 2-3x cost and latency; needs convergence criterion

**Use when:** Quality matters more than speed (complex reasoning, code review).

```python
async def debate_loop(task: str, max_rounds: int = 3) -> str:
    response = await generator.generate(task)
    for _ in range(max_rounds):
        critique = await critic.critique(task, response)
        if critique.approved:
            break
        response = await generator.revise(task, response, critique.feedback)
    return response
```

---

## Pattern 3: Blackboard

Agents share a central state (the "blackboard") and each contributes when they can add value.

```
         Blackboard (shared state)
        /     |      |      \
Agent A   Agent B  Agent C  Agent D
```

**Pros:** Highly flexible, no fixed execution order, agents can collaborate naturally
**Cons:** Complex to implement, race conditions, hard to debug

**Use when:** Problems where the solution emerges from multiple perspectives.

---

## Avoiding the Coordination Anti-Patterns

1. **Chatty agents:** Don't pass large payloads between agents — share references, not data
2. **Circular dependencies:** Agents waiting on each other → deadlock. Use DAGs
3. **No convergence:** Define explicit success criteria or max iteration counts
4. **Noisy context:** Each agent gets only what it needs, not the full history

---

## The Practical Default

For 90% of use cases: start with **Orchestrator-Worker**. It's the simplest pattern that works. Add peer critique when output quality is critical. Avoid blackboard unless you have a compelling reason.
