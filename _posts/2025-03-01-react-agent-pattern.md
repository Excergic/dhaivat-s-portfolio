---
layout: post
title: "The ReAct Pattern: Reasoning and Acting in Interleaved Loops"
date: 2025-03-01
description: How ReAct works, why the think-act-observe loop is so powerful, and implementation details for robust agents.
tags: [agentic, react, patterns]
categories: [agentic]
domain: agentic
content_type: technical
toc:
  sidebar: left
---

## What Is ReAct?

ReAct (Reasoning + Acting) is the core loop behind most LLM agents:

```
Thought: I need to find the current price of X.
Action: web_search("X current price 2025")
Observation: [search results]
Thought: The price is $Y. Now I need to compare to competitor Z.
Action: web_search("Z pricing 2025")
Observation: [search results]
Thought: I have enough information to answer.
Action: finish("X is $Y, Z is $W — X is cheaper by 20%.")
```

The key insight: **interleaving reasoning and action** lets the LLM adapt its plan based on what it actually observes, rather than committing to a fixed plan upfront.

---

## Why It Works

Traditional chain-of-thought: think → answer (no feedback loop)
ReAct: think → act → observe → think → act → observe → ... → answer

The observation step grounds the agent's reasoning in real data. The agent can change direction, retry, or ask for clarification based on what it finds.

---

## Implementation

```python
from typing import Optional

class ReActAgent:
    def __init__(self, llm, tools: dict, max_steps: int = 25):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps

    def run(self, task: str) -> str:
        history = [{"role": "user", "content": task}]
        system = self._build_system_prompt()

        for step in range(self.max_steps):
            response = self.llm.complete(system=system, messages=history)
            thought, action, action_input = self._parse(response)

            history.append({"role": "assistant", "content": response})

            if action == "finish":
                return action_input

            observation = self._execute_tool(action, action_input)
            history.append({
                "role": "user",
                "content": f"Observation: {observation}"
            })

        return "Max steps reached without conclusion."

    def _execute_tool(self, tool_name: str, tool_input: str) -> str:
        if tool_name not in self.tools:
            return f"Error: tool '{tool_name}' not found. Available: {list(self.tools.keys())}"
        try:
            return str(self.tools[tool_name](tool_input))
        except Exception as e:
            return f"Tool error: {e}"

    def _build_system_prompt(self) -> str:
        tool_descriptions = "\n".join(
            f"- {name}: {fn.__doc__}" for name, fn in self.tools.items()
        )
        return f"""You solve tasks using the following tools:

{tool_descriptions}
- finish(answer): Return final answer

Format:
Thought: <your reasoning>
Action: <tool_name>
Action Input: <input>

After each Observation, continue with Thought.
Use finish() when done."""
```

---

## Parsing Agent Output

The parser needs to be robust to LLM formatting quirks:

```python
import re

def _parse(self, text: str) -> tuple[str, str, str]:
    thought_match = re.search(r"Thought:\s*(.*?)(?=Action:|$)", text, re.DOTALL)
    action_match = re.search(r"Action:\s*(\w+)", text)
    input_match = re.search(r"Action Input:\s*(.*?)(?=\n|$)", text, re.DOTALL)

    thought = thought_match.group(1).strip() if thought_match else ""
    action = action_match.group(1).strip() if action_match else "finish"
    action_input = input_match.group(1).strip() if input_match else text

    return thought, action, action_input
```

---

## Common Failure Modes

| Failure | Cause | Fix |
|---|---|---|
| Infinite loop | No convergence criterion | Max steps + detect repeated actions |
| Hallucinated tools | LLM invents tool names | Validate against registry before calling |
| Bad action parsing | LLM deviates from format | Few-shot examples in system prompt |
| Stale observations | LLM ignores tool output | Summarize long observations in context |
| Over-planning | Agent thinks instead of acts | Prompt: "Take action, don't over-plan" |

---

## ReAct vs. Function Calling

Modern LLMs (GPT-4, Claude) support structured function calling natively — the model returns JSON tool calls instead of text to parse.

| Aspect | ReAct (text) | Function Calling (structured) |
|---|---|---|
| Model support | Any LLM | Requires capable model |
| Parsing robustness | Fragile | Reliable |
| Flexibility | High (free-form thought) | Lower |
| Latency | Same | Same |

Prefer function calling for production; use text-based ReAct for models that don't support it.
