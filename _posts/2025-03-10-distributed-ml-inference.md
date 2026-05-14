---
layout: post
title: "Distributed ML Inference: Design for 10K RPS"
date: 2025-03-10
description: System design for a low-latency ML inference service — batching, model replicas, circuit breakers, and the P99 latency problem.
tags: [system-design, inference, serving, distributed]
categories: [system-design]
domain: system-design
content_type: design-doc
toc:
  sidebar: left
---

## Requirements

**Functional:**
- Real-time predictions for tabular classification model
- REST API: `POST /predict` → `{score, label, confidence}`
- Batch endpoint: `POST /predict/batch` (up to 1000 rows)

**Non-functional:**
- 10K RPS peak
- P50 < 20ms, P99 < 100ms
- 99.9% availability
- Model updates without downtime

---

## Architecture Overview

```
              Load Balancer (L7)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   Inference Server A   Inference Server B
   (model replica)      (model replica)
         │                     │
         └──────────┬──────────┘
                    ▼
            Feature Store
            (Redis / Feast)
                    │
                    ▼
            Model Registry
            (MLflow / SageMaker)
```

---

## Inference Server Design

Each inference server:
1. Loads model into memory at startup (warm)
2. Exposes HTTP and gRPC endpoints
3. Does input validation + feature lookup + inference
4. Returns structured response

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np

app = FastAPI()

class PredictRequest(BaseModel):
    entity_id: str
    features: dict[str, float] | None = None  # pre-computed or fetch from store

class PredictResponse(BaseModel):
    score: float
    label: str
    confidence: float
    latency_ms: float

@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    start = time.perf_counter()

    features = req.features or await feature_store.get(req.entity_id)
    if features is None:
        raise HTTPException(404, f"No features for entity {req.entity_id}")

    X = feature_pipeline.transform(features)
    score = float(model.predict_proba(X)[0, 1])
    label = "positive" if score >= threshold else "negative"
    confidence = max(score, 1 - score)

    latency_ms = (time.perf_counter() - start) * 1000
    return PredictResponse(score=score, label=label, confidence=confidence, latency_ms=latency_ms)
```

---

## Batching Strategy

Two types of batching:

**Client-side batching:** Client sends multiple rows in one request. Process in vectorized numpy call (10-100x faster than loop).

**Server-side dynamic batching:** Accumulate requests for 5-10ms, process together. Reduces model overhead. Implementation via async queue:

```python
class BatchProcessor:
    def __init__(self, model, max_batch=64, max_wait_ms=10):
        self.queue = asyncio.Queue()
        self.model = model
        self.max_batch = max_batch
        self.max_wait_ms = max_wait_ms

    async def predict(self, features: np.ndarray) -> float:
        future = asyncio.Future()
        await self.queue.put((features, future))
        return await future

    async def _process_loop(self):
        while True:
            batch, futures = [], []
            deadline = time.time() + self.max_wait_ms / 1000
            while len(batch) < self.max_batch and time.time() < deadline:
                try:
                    features, future = await asyncio.wait_for(
                        self.queue.get(), timeout=max(0, deadline - time.time())
                    )
                    batch.append(features)
                    futures.append(future)
                except asyncio.TimeoutError:
                    break
            if batch:
                scores = self.model.predict_proba(np.stack(batch))[:, 1]
                for future, score in zip(futures, scores):
                    future.set_result(float(score))
```

---

## Model Updates (Zero-Downtime)

Blue-Green deployment:
1. New model loads into standby pool
2. Health check passes → send 1% of traffic
3. Monitor error rate + latency for 5 min
4. Ramp to 100% if healthy
5. Old replicas decommission

Rollback: traffic switch takes < 30 seconds.

---

## Scaling Decisions

| Component | Scaling approach |
|---|---|
| Inference servers | Horizontal (autoscale on CPU/RPS) |
| Feature store (Redis) | Read replicas per region |
| Load balancer | Least-connections routing (not round-robin) |
| Model weights | Shared volume (ReadOnlyMany) or S3 with local cache |

---

## P99 Latency Budget

```
Network (client→LB→server)   ~5ms
Feature store lookup          ~8ms
Feature transformation        ~2ms
Model inference               ~3ms
Serialization + response      ~2ms
─────────────────────────────
Total P50                    ~20ms
Tail (GC, retry, slow store) +30ms
P99 target                   ~50ms (well under 100ms)
```
