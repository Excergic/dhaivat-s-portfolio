---
layout: page
title: case studies
permalink: /case-studies/
nav: true
nav_order: 2
description: Deep-dives into real-world AI/ML problems — from problem framing to production.
---

<div class="case-studies">

  <div class="card mt-3 p-3 z-depth-1">
    <div class="row no-gutters align-items-start">
      <div class="col">
        <h5 class="card-title font-weight-bold mb-1">Tool Use Agent</h5>
        <p class="card-text text-muted small mb-1">Agentic Pattern · Technical Depth</p>
        <p class="card-text mt-2">
          For the first two years after ChatGPT, the entire world experienced LLMs the same way: as a brilliant, articulate friend trapped behind glass. You could ask it anything. It would answer almost anything. But it could not <em>do</em> anything. A founder would ask "which of my Pro-tier customers had declining usage last month?" — and the LLM would make up an answer, or say it had no access to the data. Neither was useful. The founder had real customers, real usage logs, real Stripe events. The LLM had words. There was a wall between them.
        </p>
        <a href="https://github.com/Excergic/Agent-design-patterns/blob/main/Agent_Patterns_Depth/Tool_Use/tool_use.md" target="_blank" class="btn btn-sm z-depth-0 mt-1" style="background-color: var(--global-theme-color); color: white; padding: 0.3rem 0.9rem; border-radius: 4px; text-decoration: none; font-weight: 500;">Read Full Article</a>
      </div>
    </div>
  </div>

  <div class="card mt-3 p-3 z-depth-1">
    <div class="row no-gutters align-items-start">
      <div class="col">
        <h5 class="card-title font-weight-bold mb-1">Agentic RAG</h5>
        <p class="card-text text-muted small mb-1">Agentic Pattern · Technical Depth</p>
        <p class="card-text mt-2">
          The breakthrough came in a 2020 paper by Patrick Lewis and colleagues at Facebook AI — the paper that gave RAG its name. The core idea was almost embarrassingly simple in retrospect: don't try to put knowledge inside the model. Put the knowledge <em>next to</em> the model at the moment of the question. Retrieve the relevant passages, paste them into the prompt, and let the language model read them while it generates the answer. Hallucination rates dropped. Knowledge updates became a database operation, not a training run. The retrieval system did what retrieval systems are good at; the generator did what generators are good at.
        </p>
        <a href="https://github.com/Excergic/Agent-design-patterns/blob/main/Agent_Patterns_Depth/RAG/rag_and_agentic_rag.md" target="_blank" class="btn btn-sm z-depth-0 mt-1" style="background-color: var(--global-theme-color); color: white; padding: 0.3rem 0.9rem; border-radius: 4px; text-decoration: none; font-weight: 500;">Read Full Article</a>
      </div>
    </div>
  </div>

  <div class="card mt-3 p-3 z-depth-1">
    <div class="row no-gutters align-items-start">
      <div class="col">
        <h5 class="card-title font-weight-bold mb-1">Seller Lead Generation AI System</h5>
        <p class="card-text text-muted small mb-1">Agent Implementation · Real Estate</p>
        <p class="card-text mt-2">
          This case study walks through a full five-layer architecture for an AI-powered seller lead generation system. From left to right: the Data Input Layer where raw signals enter, the Orchestration Layer where leads are triaged and researched, the Prediction Layer where motivation is scored, the Decision Layer where business rules and a human gate decide what happens, and the Action Layer where the lead is written to the CRM and contacted. A Memory loop runs underneath all of it, feeding outcomes back into the scorer.
        </p>
        <a href="https://github.com/Excergic/Agent-design-patterns/blob/main/real-estate-seller-agent-pattern.md" target="_blank" class="btn btn-sm z-depth-0 mt-1" style="background-color: var(--global-theme-color); color: white; padding: 0.3rem 0.9rem; border-radius: 4px; text-decoration: none; font-weight: 500;">Read Full Article</a>
      </div>
    </div>
  </div>

</div>
