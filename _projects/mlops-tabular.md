---
layout: page
title: MLOps Tabular Pipeline
description: End-to-end production ML system for tabular classification — data validation, feature store, model training, deployment, and drift monitoring.
img:
importance: 1
category: mlops
---

## What It Does

A complete production ML pipeline that takes a tabular classification problem from raw data to a monitored, auto-retraining system in production.

**Covers the full lifecycle:**
1. **Data ingestion + validation** via Great Expectations
2. **Feature engineering** with serializable sklearn pipelines (same code training + serving)
3. **Model training** with LightGBM + MLflow experiment tracking
4. **Evaluation gate** — slice-level analysis, must beat baseline before promoting
5. **Deployment** — FastAPI inference server, Docker, K8s, blue-green rollout
6. **Monitoring** — PSI drift detection, decision rate tracking, automated retraining triggers

## Why It Matters

The hardest problem in MLOps isn't the model — it's making sure the model keeps working after you deploy it. This project builds the full observability and retraining loop, not just a one-shot deployment.

Key solved problems:
- Training-serving skew prevention via feature store
- Automated retraining that runs the evaluation gate before promoting
- Per-group slice analysis catches silent degradation on subpopulations

## Tech Stack

- **LightGBM** — model
- **sklearn Pipeline** — feature engineering (serializable)
- **Great Expectations** — data validation
- **MLflow** — experiment tracking + model registry
- **Feast** — feature store (offline + online)
- **FastAPI + Docker + K8s** — serving
- **Kafka + custom drift detector** — monitoring

## Links

- [Pipeline Technical Write-up](/posts/2025-04-10-mlops-tabular-pipeline)
- [Monitoring System Design](/posts/2025-04-15-mlops-monitoring-design)
- [Feature Store Architecture](/posts/2025-03-17-feature-store-architecture)
