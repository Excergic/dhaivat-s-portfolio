---
layout: post
title: "K-Means: Lloyd's Algorithm, Initialization, and When It Fails"
date: 2025-02-12
description: The EM view of K-Means, k-means++ initialization, and the cases where K-Means fundamentally breaks down.
tags: [unsupervised, clustering, numpy]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## The Algorithm (Lloyd's Method)

K-Means alternates between two steps until convergence:

1. **Assignment:** assign each point to its nearest centroid
   $$z_i = \arg\min_k \|x_i - \mu_k\|^2$$

2. **Update:** recompute centroids as cluster means
   $$\mu_k = \frac{1}{|C_k|}\sum_{i \in C_k} x_i$$

The objective being minimized is the **within-cluster sum of squares (WCSS)**:

$$\mathcal{J} = \sum_{k=1}^K \sum_{i \in C_k} \|x_i - \mu_k\|^2$$

---

## The EM Perspective

K-Means is a special case of Expectation-Maximization for Gaussian Mixture Models with:
- Equal, isotropic covariances: $$\Sigma_k = \sigma^2 I$$
- Hard assignments (E-step becomes argmin instead of softmax)

This reveals why K-Means assumes **spherical, equally-sized clusters**.

---

## K-Means++ Initialization

Random initialization is brittle. K-Means++ gives a $$O(\log k)$$-approximation guarantee:

1. Pick first centroid uniformly at random
2. For each subsequent centroid, sample point $$x$$ with probability proportional to $$\min_k \|x - \mu_k\|^2$$

```python
import numpy as np

class KMeans:
    def __init__(self, k, max_iter=300, n_init=10):
        self.k = k
        self.max_iter = max_iter
        self.n_init = n_init

    def _init_centroids(self, X):
        idx = np.random.randint(len(X))
        centroids = [X[idx]]
        for _ in range(self.k - 1):
            dists = np.min([np.linalg.norm(X - c, axis=1)**2 for c in centroids], axis=0)
            probs = dists / dists.sum()
            centroids.append(X[np.random.choice(len(X), p=probs)])
        return np.array(centroids)

    def fit(self, X):
        best_inertia = np.inf
        for _ in range(self.n_init):
            centroids = self._init_centroids(X)
            for _ in range(self.max_iter):
                dists = np.linalg.norm(X[:, None] - centroids[None], axis=2)
                labels = dists.argmin(axis=1)
                new_centroids = np.array([X[labels == k].mean(axis=0) for k in range(self.k)])
                if np.allclose(centroids, new_centroids):
                    break
                centroids = new_centroids
            inertia = sum(np.linalg.norm(X[labels==k] - centroids[k])**2 for k in range(self.k))
            if inertia < best_inertia:
                best_inertia = inertia
                self.centroids_, self.labels_ = centroids, labels
        return self
```

---

## Choosing K

- **Elbow method:** plot WCSS vs K, look for the elbow (often ambiguous)
- **Silhouette score:** $$s_i = \frac{b_i - a_i}{\max(a_i, b_i)} \in [-1, 1]$$ — higher is better
- **Gap statistic:** compare WCSS to random baseline

---

## When K-Means Fails

| Problem | Why K-Means struggles | Alternative |
|---|---|---|
| Non-spherical clusters | Assumes Euclidean, isotropic | DBSCAN, spectral clustering |
| Unequal cluster sizes | Hard centroid update | GMM with learned covariance |
| Different densities | No density model | DBSCAN |
| Unknown K | Must prespecify | DBSCAN, hierarchical |
| Outliers | Outliers pull centroids | DBSCAN (marks outliers as noise) |

---

## Preprocessing Matters

K-Means uses Euclidean distance → **always scale features**. PCA before K-Means also helps in high dimensions (curse of dimensionality makes Euclidean distance less meaningful).
