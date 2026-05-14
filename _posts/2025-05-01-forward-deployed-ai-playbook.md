---
layout: post
title: "Forward-Deployed AI: What Changes When the Customer Is in the Room"
date: 2025-05-01
description: Lessons from deploying AI systems directly with enterprise customers — integration challenges, rapid iteration, and making models useful in practice.
tags: [forward-deployed, enterprise, deployment, ai]
categories: [forward-deployed]
domain: forward-deployed
content_type: blog
toc:
  sidebar: left
---

## The Shift From Internal to External Deployment

Building ML systems for internal use is hard. Building them with and for customers is a different discipline entirely. The technical challenges are often secondary to:

- Understanding what the customer actually wants (vs. what they asked for)
- Working within existing infrastructure constraints you don't control
- Showing value fast enough to maintain trust
- Handing off a system the customer can own without you

This post documents the patterns that work.

---

## Lesson 1: Integration Is the Real Work

A customer's data is never in the format the model expects. Their systems don't have the APIs you need. Their org chart determines what you're actually allowed to do.

**Pattern:** Spend the first 48 hours on a data audit, not model selection. Map:
- What data exists, where, in what format
- What can be accessed via API vs. manual export
- What data quality issues exist (nulls, encoding issues, stale records)

The model you can train with the data you actually have beats the optimal model you can't access training data for.

---

## Lesson 2: Show Something Working, Fast

Customers don't believe a roadmap. They believe a working system — even a rough one.

**Pattern:** Ship a thin vertical slice in the first sprint:
1. One real input → model → one real output
2. End-to-end, even if 80% of the pipeline is hardcoded
3. In their environment (not a demo)

This does two things: proves integration is feasible, and anchors conversations around something concrete.

---

## Lesson 3: Define Success Before You Build

"Make it more accurate" is not a success criterion. Neither is "reduce false positives."

Tie the model to a business outcome:
- "Reduce manual review time by 30%"
- "Increase conversion rate by 2pp on this segment"
- "Flag 80% of fraud cases before payment clears"

Then instrument for that outcome from day one. Without measurement, you can't argue for continued investment.

---

## Lesson 4: Design for Handoff

You won't be there to maintain it. The customer's team needs to:
- Understand what the model does and doesn't do
- Know when to trust it and when to override it
- Monitor it without your help
- Retrain it when it drifts

**Minimum viable handoff package:**
- Model card (what it predicts, how it was trained, known failure modes)
- Monitoring runbook (what to watch, what thresholds to alert on, who to call)
- Retraining guide (how often, on what data, how to evaluate)
- Rollback procedure (how to revert to previous version)

---

## Lesson 5: Human-in-the-Loop Is Often the Right Answer

Full automation isn't always the goal. For high-stakes decisions (loan approval, medical triage, legal review), a model that surfaces the top cases for human review — with explanation — is often more valuable than one that decides autonomously.

The model raises the ceiling on what a human expert can review per hour. That's often enough.

---

## What to Read Next

- [Distributed ML Inference Design](/posts/2025-03-10-distributed-ml-inference) — for when you do need to automate at scale
- [MLOps Tabular Pipeline](/posts/2025-04-10-mlops-tabular-pipeline) — the operational system underneath
