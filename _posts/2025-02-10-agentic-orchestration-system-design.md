---
layout: post
title: "Agentic Orchestration System Design"
date: 2025-02-10
description: Architecture document for a production multi-agent orchestration layer — routing, memory, tool dispatch, and failure handling.
tags: [agentic, system-design, orchestration]
categories: [agentic]
domain: agentic
content_type: design-doc
toc:
  sidebar: left
---

## Overview

This document describes the design of a production-grade agentic orchestration layer capable of routing tasks to specialized sub-agents, managing shared memory, dispatching tools, and recovering from failures.

**Goals:**
- Support heterogeneous sub-agents (different models, APIs, capabilities)
- Provide reliable tool execution with retries and timeouts
- Maintain conversation and task state across multi-step workflows
- Expose a clean API for downstream applications

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Client                     │
└──────────────────┬──────────────────────────┘
                   │ Task request
                   ▼
┌─────────────────────────────────────────────┐
│            Orchestrator                      │
│  ┌──────────┐  ┌────────────┐  ┌─────────┐  │
│  │  Router  │  │  Planner   │  │ Memory  │  │
│  └──────────┘  └────────────┘  └─────────┘  │
└────────┬────────────────────────────────────┘
         │
    ┌────┴────┐
    │ Tool    │
    │ Registry│
    └────┬────┘
    ┌────┴──────────────────┐
    │    Sub-Agents          │
    │  [CoreML] [Search]     │
    │  [Code]   [Memory]     │
    └───────────────────────┘
```

---

## Components

### Orchestrator

The central coordinator. Receives a task, calls the Planner to decompose it into steps, routes each step to the appropriate sub-agent, aggregates results.

**Key responsibilities:**
- Maintain execution graph (DAG of steps)
- Track step dependencies
- Handle failures: retry, fallback, escalate

### Router

Selects which sub-agent handles each step. Uses a combination of:
1. **Explicit routing rules** (keyword matching, task type tags)
2. **LLM-based routing** for ambiguous tasks
3. **Capability registry** (each agent registers its capabilities)

```python
class Router:
    def __init__(self, agents: dict[str, Agent], llm: LLM):
        self.agents = agents
        self.llm = llm

    def route(self, step: Step) -> str:
        # Try rule-based first (fast path)
        for name, agent in self.agents.items():
            if any(kw in step.description for kw in agent.keywords):
                return name
        # Fall back to LLM routing
        prompt = self._build_routing_prompt(step, list(self.agents.keys()))
        return self.llm.complete(prompt).strip()
```

### Memory Layer

Two-tier:
- **Working memory:** In-process dict, task-scoped, fast
- **Persistent memory:** Vector store (e.g., Chroma, Pinecone) + key-value store for structured state

Memory is namespaced by `session_id` + `task_id` to prevent cross-task contamination.

### Tool Registry

Central registry of available tools. Each tool declares:
- Input/output schema (JSON Schema)
- Timeout
- Retry policy
- Rate limits

```python
@tool(timeout=30, max_retries=3)
async def web_search(query: str) -> list[dict]:
    ...
```

---

## Failure Handling

| Failure type | Strategy |
|---|---|
| Tool timeout | Retry with backoff (max 3x), then fallback |
| Agent error | Retry with different agent if available |
| Planner loop | Max step count (default: 25), then surface to user |
| Context overflow | Summarize working memory, compress history |
| Hallucinated tool call | Validate against registry schema, reject + re-prompt |

---

## API Design

```
POST /v1/tasks
{
  "task": "Research competitors and summarize pricing",
  "session_id": "abc123",
  "config": {
    "max_steps": 20,
    "timeout_s": 120
  }
}

→ 200 OK
{
  "task_id": "task_xyz",
  "status": "running",
  "stream_url": "/v1/tasks/task_xyz/stream"
}
```

Streaming via SSE — clients receive step-by-step updates as the agent works.

---

## Open Questions / Trade-offs

- **LLM routing vs. rule-based:** LLM routing is flexible but adds latency and cost. Recommend hybrid: rules for 80% of cases, LLM for the rest.
- **Synchronous vs. async sub-agents:** Async is required for parallelizable sub-tasks. Adds complexity to the execution graph.
- **Memory retrieval:** When to query persistent memory vs. trust working memory? Current: query persistent memory at task start and at each new sub-task invocation.
