---
layout: post
title: "DBSCAN: Density, Noise, and Arbitrary Shapes"
date: 2025-02-19
description: How DBSCAN defines clusters via density reachability, handles outliers natively, and the right way to set epsilon and min_samples.
tags: [unsupervised, clustering, density]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## Core Concepts

DBSCAN needs two parameters: **ε** (neighborhood radius) and **MinPts** (minimum neighbors).

For each point $$x$$, define its **ε-neighborhood**:
$$N_\varepsilon(x) = \{y : d(x, y) \leq \varepsilon\}$$

Three types of points:
- **Core point:** $$|N_\varepsilon(x)| \geq \text{MinPts}$$
- **Border point:** in the neighborhood of a core point, but not core itself
- **Noise point:** neither core nor border → labeled **-1**

---

## The Algorithm

```
For each unvisited point p:
    Mark p as visited
    If |N_ε(p)| < MinPts:
        Label p as noise
    Else:
        Start new cluster C
        Expand cluster: add all density-reachable points to C
```

**Density-reachable:** $$q$$ is reachable from $$p$$ if there's a chain of core points connecting them.

```python
from sklearn.cluster import DBSCAN
import numpy as np

dbscan = DBSCAN(eps=0.5, min_samples=5, metric='euclidean', n_jobs=-1)
labels = dbscan.fit_predict(X)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = (labels == -1).sum()
print(f"Clusters: {n_clusters}, Noise points: {n_noise}")
```

---

## Setting Parameters

**ε (epsilon):**
Plot the sorted k-NN distances (k = MinPts - 1). Look for the "knee" — the ε at which distances start increasing steeply.

```python
from sklearn.neighbors import NearestNeighbors

k = 4  # MinPts - 1
nbrs = NearestNeighbors(n_neighbors=k).fit(X)
distances, _ = nbrs.kneighbors(X)
k_distances = np.sort(distances[:, -1])[::-1]
# Plot k_distances — knee point → epsilon
```

**MinPts:**
Rule of thumb: $$\text{MinPts} \geq d + 1$$ where $$d$$ is the feature dimension. For noisy data, use larger values (5–20).

---

## What DBSCAN Does That K-Means Can't

```
Concentric rings → DBSCAN finds 2 clusters; K-Means fails
Elongated blobs → DBSCAN follows shape; K-Means cuts arbitrarily
Dataset with outliers → DBSCAN labels them noise; K-Means absorbs them
```

---

## HDBSCAN: The Better Default

HDBSCAN runs DBSCAN across all ε values and extracts the stable clusters — making it robust to the ε parameter choice.

```python
import hdbscan

clusterer = hdbscan.HDBSCAN(min_cluster_size=10, min_samples=5)
labels = clusterer.fit_predict(X)
```

Use HDBSCAN when you don't know ε. Use DBSCAN when you have domain knowledge of the scale.

---

## Complexity and Scaling

| Aspect | DBSCAN | K-Means |
|---|---|---|
| Time complexity | $$O(n \log n)$$ with KD-tree | $$O(nkd \cdot \text{iter})$$ |
| Space | $$O(n)$$ | $$O(n + k)$$ |
| Scales to millions? | With ball tree / approximate NN | Yes |

For large $$n$$: use approximate nearest neighbor search (FAISS, Annoy) before DBSCAN.
