---
layout: post
title: "Feature Store Architecture: Solving Training-Serving Skew"
date: 2025-03-17
description: Why feature stores exist, how to design one that prevents training-serving skew, and the offline/online duality.
tags: [system-design, feature-store, mlops]
categories: [system-design]
domain: system-design
content_type: design-doc
toc:
  sidebar: left
---

## The Problem Feature Stores Solve

**Training-serving skew:** The model was trained on features computed one way. At serving time, features are computed differently (different code, different timing, different data source). Model accuracy silently degrades.

Root causes:
- Training: Python pandas on historical data. Serving: Java microservice with different logic.
- Training uses features at time $$T$$. Serving uses stale features from $$T - 24h$$.
- Training includes future data via leakage. Serving can't.

The feature store provides **one definition, two stores** (offline + online), computed from the same transformations.

---

## Architecture

```
                     ┌─────────────────┐
  Raw Events ───────▶│  Feature        │
  (Kafka/S3)         │  Computation    │
                     │  (Spark/Flink)  │
                     └────────┬────────┘
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
    ┌──────────────────┐            ┌───────────────────┐
    │  Offline Store   │            │  Online Store     │
    │  (S3 + Parquet)  │            │  (Redis / DynamoDB│
    │  Training data   │            │  Low-latency      │
    └──────────────────┘            │  serving)         │
                                    └───────────────────┘
              │                                │
              ▼                                ▼
        Training Jobs                   Inference Server
```

---

## Feature Definition (Point-in-Time Correct)

The critical piece: offline features must be looked up at the **time the label was observed**, not the time you run training.

```python
from feast import FeatureStore, Entity, FeatureView, Field
from feast.types import Float64, Int64
from feast.infra.offline_stores.file_source import FileSource

# Define the feature source
transaction_source = FileSource(
    path="s3://my-bucket/features/transactions/",
    timestamp_field="event_timestamp",
)

# Define the feature view
transaction_fv = FeatureView(
    name="transaction_features",
    entities=["user_id"],
    schema=[
        Field(name="txn_count_7d", dtype=Int64),
        Field(name="avg_txn_amount_30d", dtype=Float64),
        Field(name="days_since_last_txn", dtype=Float64),
    ],
    source=transaction_source,
    ttl=timedelta(days=90),
)
```

**Point-in-time join for training:**

```python
store = FeatureStore(repo_path=".")

# entity_df has: user_id, event_timestamp (when label was observed)
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["transaction_features:txn_count_7d",
              "transaction_features:avg_txn_amount_30d"],
).to_df()
```

Feast handles the temporal join — each row gets feature values as they were at `event_timestamp`, not now.

---

## Online Serving

```python
# Materialize features to Redis
store.materialize_incremental(end_date=datetime.utcnow())

# Online lookup (< 10ms P99)
feature_vector = store.get_online_features(
    features=["transaction_features:txn_count_7d"],
    entity_rows=[{"user_id": "user_123"}]
).to_dict()
```

---

## Feature Freshness

| Feature type | Update frequency | Storage |
|---|---|---|
| Historical aggregates (7d, 30d) | Daily batch | S3 + Redis |
| Recent aggregates (1h, 24h) | Streaming (Flink) | Redis with TTL |
| Real-time context | Request-time | Passed in request |

Real-time features (e.g. "time since last click") are computed at request time and never stored — they can't be materialized.

---

## Preventing Skew in Practice

1. **Same transformation code for offline + online.** Use feature pipelines (sklearn `Pipeline`) that serialize and deserialize identically. Never rewrite logic.

2. **Log features at serving time.** Store the actual feature vector used for each prediction. This lets you debug discrepancies and do shadow deployment comparisons.

3. **Feature monitoring.** Track distribution drift between training features and online features. Alert when they diverge.

```python
# Log prediction features
prediction_log = {
    "prediction_id": str(uuid4()),
    "entity_id": entity_id,
    "timestamp": datetime.utcnow().isoformat(),
    "features": feature_vector,  # actual values used
    "score": score,
}
await feature_log_store.append(prediction_log)
```

---

## Build vs. Buy

| Option | Pros | Cons |
|---|---|---|
| Feast (OSS) | Free, flexible, integrates well | Operational overhead |
| Tecton | Managed, streaming support | Expensive |
| Vertex AI Feature Store | Tight GCP integration | GCP lock-in |
| Hopsworks | Feature monitoring built-in | Complex setup |

For teams under 10 ML engineers: managed feature store. For larger teams with specific requirements: Feast on your infra.
