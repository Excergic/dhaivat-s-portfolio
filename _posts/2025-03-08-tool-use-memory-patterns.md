---
layout: post
title: "Tool-Use and Memory Patterns for Production Agents"
date: 2025-03-08
description: Practical patterns for tool design, memory management, and state persistence in agents that run in production.
tags: [agentic, tools, memory, patterns]
categories: [agentic]
domain: agentic
content_type: technical
toc:
  sidebar: left
---

## Tool Design Principles

A well-designed tool is:
1. **Single-purpose** — one tool, one job
2. **Idempotent** — safe to call twice
3. **Descriptive** — the docstring IS the system prompt for that tool
4. **Bounded** — explicit timeout, output size limit

```python
from typing import Annotated
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: Annotated[str, Field(description="Search query string", max_length=200)]
    num_results: Annotated[int, Field(default=5, ge=1, le=20)]

async def web_search(input: SearchInput) -> list[dict]:
    """
    Search the web for current information. Use this when you need facts,
    prices, recent events, or any information that may have changed recently.
    Returns a list of {title, url, snippet} dicts.
    """
    ...
```

---

## Tool Output Formatting

Return structured, concise output. The LLM needs to fit tool results into its context. Long tool outputs → context overflow.

**Rule:** Cap tool output at 1000 tokens. Summarize or paginate beyond that.

```python
def format_search_results(results: list[dict]) -> str:
    lines = []
    for i, r in enumerate(results[:5], 1):
        lines.append(f"{i}. [{r['title']}]({r['url']})\n   {r['snippet'][:200]}")
    return "\n\n".join(lines)
```

---

## Memory Architecture

### Four Types of Memory

| Type | Storage | Scope | When to use |
|---|---|---|---|
| **In-context** | LLM context window | Current session | Active working data |
| **External** | Vector DB / KV store | Cross-session | User preferences, past tasks |
| **Episodic** | Timestamped log | Historical | What happened and when |
| **Semantic** | Knowledge base | Global | Domain facts, company info |

### Working Memory Pattern

```python
class WorkingMemory:
    """Short-term, task-scoped memory. Cleared after task completion."""
    def __init__(self, max_entries: int = 50):
        self._store: dict[str, Any] = {}
        self._order: list[str] = []
        self.max_entries = max_entries

    def set(self, key: str, value: Any) -> None:
        if key not in self._store and len(self._order) >= self.max_entries:
            oldest = self._order.pop(0)
            del self._store[oldest]
        self._store[key] = value
        if key not in self._order:
            self._order.append(key)

    def get(self, key: str, default=None) -> Any:
        return self._store.get(key, default)

    def to_context_string(self) -> str:
        """Serialize for inclusion in LLM context."""
        return "\n".join(f"- {k}: {v}" for k, v in self._store.items())
```

### Semantic Memory (Vector Store)

```python
from sentence_transformers import SentenceTransformer
import chromadb

class SemanticMemory:
    def __init__(self, collection_name: str):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(collection_name)

    def store(self, text: str, metadata: dict) -> None:
        embedding = self.model.encode(text).tolist()
        self.collection.add(
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata],
            ids=[metadata.get('id', str(hash(text)))]
        )

    def retrieve(self, query: str, n_results: int = 5) -> list[dict]:
        embedding = self.model.encode(query).tolist()
        results = self.collection.query(query_embeddings=[embedding], n_results=n_results)
        return [
            {"text": doc, "metadata": meta}
            for doc, meta in zip(results['documents'][0], results['metadatas'][0])
        ]
```

---

## Memory Write Strategy

Don't write everything. Write memories that are:
- **Novel:** not already in memory
- **Useful:** will help future tasks
- **Accurate:** verified, not hallucinated

Trigger memory writes:
- Explicit user preference ("always use metric units")
- Successful task completion with reusable output
- Correction of a prior mistake

```python
async def maybe_store_memory(result: TaskResult, memory: SemanticMemory) -> None:
    if result.worth_remembering:  # LLM judges this
        await memory.store(
            text=result.summary,
            metadata={"task_type": result.task_type, "date": result.date}
        )
```

---

## Context Management

When context approaches limits:
1. Summarize old observations (keep last 3 full, summarize older)
2. Keep system prompt + recent tool calls + final answer attempt
3. Use working memory reference: "see memory['competitor_analysis']" instead of re-embedding the full content

```python
def compress_history(history: list[dict], max_tokens: int = 6000) -> list[dict]:
    if count_tokens(history) <= max_tokens:
        return history
    # Keep system + last 5 messages, summarize the middle
    summary = summarize_messages(history[1:-5])
    return [history[0], {"role": "assistant", "content": f"[Summary: {summary}]"}, *history[-5:]]
```
