---
layout: post
title: "MLOps Monitoring System Design"
date: 2025-04-15
description: Design document for a production ML monitoring system — data drift, prediction drift, business KPIs, and alerting architecture.
tags: [mlops, monitoring, drift, system-design]
categories: [mlops]
domain: mlops
content_type: design-doc
toc:
  sidebar: left
---

## Overview

This document describes the monitoring system for ML models in production. The goal: detect model degradation before it affects business outcomes.

**Three layers of monitoring:**
1. **Data layer** — are inputs what we expect?
2. **Model layer** — are predictions drifting?
3. **Business layer** — are outcomes changing?

Monitoring should surface issues at the **earliest possible layer**. Data drift precedes prediction drift; prediction drift precedes business impact.

---

## Architecture

```
Inference Service
       │
       │ (log features + predictions)
       ▼
Event Stream (Kafka)
       │
  ┌────┴─────────────────────┐
  ▼                          ▼
Feature Logger           Prediction Logger
  │                          │
  ▼                          ▼
Feature Store            Prediction Store
(time-windowed)          (time-windowed)
  │                          │
  └────────────┬─────────────┘
               ▼
        Drift Detector
        (scheduled: 1h)
               │
        ┌──────┴──────┐
        ▼             ▼
   Alert Manager   Dashboard
   (PagerDuty)     (Grafana)
```

---

## Drift Detection Methods

### Data Drift (Input Features)

| Feature type | Method | Threshold |
|---|---|---|
| Continuous | KS test | p-value < 0.05 |
| Continuous | Population Stability Index | PSI > 0.2 |
| Categorical | Chi-squared test | p-value < 0.05 |
| Categorical | Jensen-Shannon divergence | JS > 0.1 |

**PSI formula:**

$$\text{PSI} = \sum_{i=1}^{B} (A_i - E_i) \ln\frac{A_i}{E_i}$$

where $$A_i$$ = actual (current) % in bucket $$i$$, $$E_i$$ = expected (reference) %.

Interpretation: PSI < 0.1 (no drift), 0.1–0.2 (moderate), > 0.2 (significant).

```python
def compute_psi(reference: np.array, current: np.array, bins: int = 10) -> float:
    ref_counts, bin_edges = np.histogram(reference, bins=bins)
    cur_counts, _ = np.histogram(current, bins=bin_edges)

    # Add small epsilon to avoid log(0)
    ref_pct = (ref_counts + 1e-6) / len(reference)
    cur_pct = (cur_counts + 1e-6) / len(current)

    psi = np.sum((cur_pct - ref_pct) * np.log(cur_pct / ref_pct))
    return float(psi)
```

### Prediction Drift

Monitor the **score distribution** and the **decision rate** (fraction predicted positive).

Decision rate is particularly sensitive — a 5% shift in decision rate is often the first signal of a problem.

### Concept Drift (Requires Labels)

When labels arrive (delayed, e.g., T+7d):
- Compute rolling AUC on recent labeled data
- Compare to reference window
- Alert if drop > 2%

---

## Alerting Tiers

| Tier | Condition | Response |
|---|---|---|
| Warning | PSI 0.1–0.2 on any feature | Log, increase monitoring frequency |
| Alert | PSI > 0.2 on primary feature | Page on-call, investigate |
| Critical | Decision rate shift > 5% | Automatic shadow comparison with retrained model |
| Emergency | AUC drop > 5% on labeled data | Rollback to previous model version |

---

## Reference Window Management

The reference distribution must be:
- From a **clean, stable period** (not during a data incident)
- **Large enough** (at least 30 days of production data)
- **Updated periodically** (after successful retraining, use training set as new reference)

Avoid using the entire historical dataset — old data may not represent current patterns.

---

## Dashboard Specification

**Per-model dashboard:**
- Score distribution: current vs. reference (overlaid histogram)
- Decision rate: 7-day rolling average
- Top 10 features: PSI time series
- P50/P99 inference latency
- Error rate (tool failures, timeouts)

**Business dashboard:**
- Conversion rate by model version
- Revenue attribution
- A/B test results (if running experiments)
