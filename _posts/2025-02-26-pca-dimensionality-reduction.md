---
layout: post
title: "PCA: Variance, Eigenvectors, and the SVD Connection"
date: 2025-02-26
description: Principal Component Analysis from the ground up — covariance matrix, eigendecomposition, SVD, and when to use it vs. alternatives.
tags: [unsupervised, dimensionality-reduction, linear-algebra]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## The Objective

Find a low-dimensional linear projection of data that **maximizes preserved variance**.

Given $$X \in \mathbb{R}^{n \times d}$$ (centered, so $$\bar{x} = 0$$), find the unit vector $$u \in \mathbb{R}^d$$ maximizing:

$$\text{Var}(Xu) = u^\top \Sigma u \quad \text{s.t.} \quad \|u\|=1$$

where $$\Sigma = \frac{1}{n} X^\top X$$ is the sample covariance matrix.

By Lagrange multipliers, the solution is the **top eigenvector of $$\Sigma$$**.

---

## The SVD Route (Numerically Preferred)

Compute the SVD of the centered data matrix:

$$X = U \Sigma V^\top$$

- Columns of $$V$$: principal directions (eigenvectors of $$X^\top X$$)
- Singular values $$\sigma_i$$: $$\lambda_i = \sigma_i^2 / n$$ (eigenvalues of covariance)
- Projection: $$Z = X V_k$$ (take first $$k$$ columns)

```python
import numpy as np

class PCA:
    def __init__(self, n_components):
        self.n_components = n_components

    def fit(self, X):
        self.mean_ = X.mean(axis=0)
        X_c = X - self.mean_
        # SVD is numerically more stable than eig(X^T X)
        U, S, Vt = np.linalg.svd(X_c, full_matrices=False)
        self.components_ = Vt[:self.n_components]
        self.explained_variance_ = (S**2)[:self.n_components] / len(X)
        total_var = (S**2).sum() / len(X)
        self.explained_variance_ratio_ = self.explained_variance_ / total_var
        return self

    def transform(self, X):
        return (X - self.mean_) @ self.components_.T

    def fit_transform(self, X):
        return self.fit(X).transform(X)
```

---

## Choosing the Number of Components

**Explained variance ratio plot (scree plot):**

```python
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

pca = PCA().fit(X)
cumvar = np.cumsum(pca.explained_variance_ratio_)
n_components_90 = np.argmax(cumvar >= 0.90) + 1

plt.plot(cumvar)
plt.axhline(0.90, ls='--', color='red')
plt.xlabel('Number of components')
plt.ylabel('Cumulative explained variance')
```

---

## Limitations

| Issue | Description |
|---|---|
| Linear only | Can't capture non-linear structure |
| Sensitive to scale | Always standardize features first |
| Interpretability | Components are linear combos of all features |
| Outliers | Pulls principal directions |

---

## Alternatives for Different Goals

| Method | Use when |
|---|---|
| PCA | Linear compression, preprocessing |
| Kernel PCA | Non-linear structure, known kernel |
| UMAP | Visualization (2D/3D), preserves topology |
| t-SNE | Visualization only — not for downstream ML |
| ICA | Separating independent sources |
| Autoencoders | High-dimensional, complex non-linear data |

---

## PCA Before Clustering

PCA + K-Means is a common and effective combo. But note: PCA maximizes variance, not cluster separability. For that, use **Linear Discriminant Analysis (LDA)** if you have labels.
