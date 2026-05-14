---
layout: post
title: "SVMs: Maximum Margin, Kernels, and the Dual Problem"
date: 2025-01-29
description: Hard-margin to soft-margin SVMs, the kernel trick, and why the dual formulation is the key to everything.
tags: [supervised, classification, optimization]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## The Big Idea

Among all hyperplanes that separate two classes, SVMs find the one with **maximum margin** — the widest street between the classes. More margin → better generalization.

---

## Hard-Margin SVM

For linearly separable data, the primal problem:

$$\min_{w, b} \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_i(w^\top x_i + b) \geq 1 \; \forall i$$

The margin is $$\frac{2}{\|w\|}$$. Maximizing margin = minimizing $$\|w\|^2$$.

**Support vectors** are the points with $$y_i(w^\top x_i + b) = 1$$ — the ones touching the margin. Everything else is irrelevant.

---

## The Dual Problem

Via Lagrangian duality, the primal becomes:

$$\max_{\alpha} \sum_i \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j x_i^\top x_j$$

$$\text{s.t.} \quad \alpha_i \geq 0, \quad \sum_i \alpha_i y_i = 0$$

Key insight: the objective depends only on **dot products** $$x_i^\top x_j$$.

---

## The Kernel Trick

Replace $$x_i^\top x_j$$ with a kernel $$K(x_i, x_j) = \phi(x_i)^\top \phi(x_j)$$:

| Kernel | Formula | Use case |
|---|---|---|
| Linear | $$x_i^\top x_j$$ | Linearly separable |
| RBF | $$e^{-\gamma\|x_i-x_j\|^2}$$ | Smooth boundaries |
| Polynomial | $$(x_i^\top x_j + c)^d$$ | Feature interactions |

We never need to compute $$\phi(x)$$ explicitly — only $$K(x_i, x_j)$$.

---

## Soft-Margin SVM

Real data isn't linearly separable. Add slack variables $$\xi_i \geq 0$$:

$$\min_{w, b, \xi} \frac{1}{2}\|w\|^2 + C\sum_i \xi_i$$

$$\text{s.t.} \quad y_i(w^\top x_i + b) \geq 1 - \xi_i$$

- Large $$C$$: hard margin, more overfitting
- Small $$C$$: wide margin, more regularization

---

## Sklearn Usage

```python
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# SVMs need scaled features
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(kernel='rbf', C=1.0, gamma='scale', probability=True))
])
pipe.fit(X_train, y_train)
```

---

## When to Use SVMs

**Good fit for:**
- High-dimensional sparse data (text classification)
- Small to medium datasets where kernel trick is affordable
- Cases where you need a strong margin guarantee

**Less suitable for:**
- Very large $$n$$ (quadratic in support vectors during training)
- Probabilistic outputs needed without calibration overhead
- Noisy features (use L1 regularization or feature selection first)
