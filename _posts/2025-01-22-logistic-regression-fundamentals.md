---
layout: post
title: "Logistic Regression: From Odds to Decision Boundaries"
date: 2025-01-22
description: Binary classification via maximum likelihood — deriving the gradient, understanding the sigmoid, and implementing with numpy.
tags: [supervised, classification, numpy]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## The Core Idea

We want $$P(y=1 \mid x)$$ to be a number between 0 and 1. Linear regression gives us an unbounded value — so we squash it through the **sigmoid**:

$$\sigma(z) = \frac{1}{1 + e^{-z}}, \quad z = x^\top \beta$$

---

## Log-Odds Interpretation

The sigmoid comes naturally from modeling log-odds linearly:

$$\log \frac{P(y=1)}{P(y=0)} = x^\top \beta$$

Solving for $$P(y=1)$$ gives $$\sigma(x^\top \beta)$$.

---

## Maximum Likelihood

The likelihood for $$n$$ binary observations:

$$\mathcal{L}(\beta) = \prod_{i=1}^n \sigma(x_i^\top \beta)^{y_i} (1 - \sigma(x_i^\top \beta))^{1-y_i}$$

Taking log and negating → **binary cross-entropy loss**:

$$\mathcal{J}(\beta) = -\frac{1}{n}\sum_{i=1}^n \left[ y_i \log \hat{p}_i + (1-y_i)\log(1-\hat{p}_i) \right]$$

Gradient (clean form):

$$\nabla_\beta \mathcal{J} = \frac{1}{n} X^\top (\hat{p} - y)$$

---

## Implementation

```python
import numpy as np

class LogisticRegression:
    def __init__(self, lr=0.1, epochs=500):
        self.lr = lr
        self.epochs = epochs

    @staticmethod
    def sigmoid(z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def fit(self, X, y):
        n, d = X.shape
        self.beta = np.zeros(d)
        for _ in range(self.epochs):
            p = self.sigmoid(X @ self.beta)
            grad = X.T @ (p - y) / n
            self.beta -= self.lr * grad
        return self

    def predict_proba(self, X):
        return self.sigmoid(X @ self.beta)

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)
```

---

## Decision Boundary

The boundary is where $$\hat{p} = 0.5$$, i.e., $$x^\top \beta = 0$$ — a hyperplane in $$\mathbb{R}^d$$.

Logistic regression is a **linear classifier**. For non-linear boundaries: add polynomial features or use kernel methods.

---

## Regularization

| Type | Penalty | Effect |
|---|---|---|
| L2 (Ridge) | $$\lambda\|\beta\|_2^2$$ | Shrinks all weights |
| L1 (Lasso) | $$\lambda\|\beta\|_1$$ | Sparse weights |

Add penalty gradient to update:
```python
grad += (self.lambda_ / n) * self.beta  # L2
```

---

## Evaluation Beyond Accuracy

For imbalanced classes, accuracy is misleading. Use:
- **ROC-AUC**: discrimination ability across thresholds
- **Precision-Recall AUC**: better for rare positive class
- **Calibration**: does $$\hat{p}=0.7$$ mean 70% of the time it's positive?
