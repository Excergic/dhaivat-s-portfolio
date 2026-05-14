---
layout: post
title: "Linear Regression: Geometry, Gradients, and Guarantees"
date: 2025-01-15
description: A from-scratch derivation of OLS, gradient descent, and the normal equation — with geometric intuition and numpy implementation.
tags: [supervised, regression, numpy]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## Why Linear Regression Still Matters

Linear regression is the baseline every other model is measured against. Understanding it deeply — not just calling `sklearn.LinearRegression()` — unlocks intuition for regularization, logistic regression, and beyond.

---

## The Setup

Given $$n$$ observations $$(x_i, y_i)$$ with $$x_i \in \mathbb{R}^d$$, we want:

$$\hat{y} = X\beta$$

We minimize the **residual sum of squares**:

$$\mathcal{L}(\beta) = \|y - X\beta\|^2 = (y - X\beta)^\top (y - X\beta)$$

---

## The Normal Equation

Taking the gradient and setting to zero:

$$\nabla_\beta \mathcal{L} = -2X^\top(y - X\beta) = 0$$

$$\Rightarrow \hat{\beta} = (X^\top X)^{-1} X^\top y$$

**Geometric view:** $$\hat{y} = X\hat{\beta}$$ is the orthogonal projection of $$y$$ onto the column space of $$X$$. The residual $$e = y - \hat{y}$$ is perpendicular to every column of $$X$$.

---

## Gradient Descent Implementation

```python
import numpy as np

class LinearRegressionGD:
    def __init__(self, lr=0.01, epochs=1000):
        self.lr = lr
        self.epochs = epochs

    def fit(self, X, y):
        n, d = X.shape
        self.beta = np.zeros(d)
        for _ in range(self.epochs):
            residuals = y - X @ self.beta
            grad = -2 * X.T @ residuals / n
            self.beta -= self.lr * grad
        return self

    def predict(self, X):
        return X @ self.beta
```

---

## Key Properties

| Property | OLS | Gradient Descent |
|---|---|---|
| Exact solution | Yes (if $$X^\top X$$ invertible) | Approximate |
| Cost | $$O(d^3)$$ — cubic in features | $$O(nd \cdot \text{epochs})$$ |
| Large $$d$$ | Breaks down | Works well |

---

## Assumptions (Gauss-Markov)

For OLS to be BLUE (Best Linear Unbiased Estimator):
1. Linearity: $$y = X\beta + \epsilon$$
2. Full rank: $$\text{rank}(X) = d$$
3. Zero mean errors: $$\mathbb{E}[\epsilon] = 0$$
4. Homoscedasticity: $$\text{Var}(\epsilon) = \sigma^2 I$$
5. No multicollinearity

When these break → regularization (Ridge, Lasso).

---

## What to Try Next

- Add L2 penalty → Ridge: $$\hat{\beta} = (X^\top X + \lambda I)^{-1} X^\top y$$
- Add L1 penalty → Lasso (requires coordinate descent)
- Weighted least squares when variance is non-constant
