---
layout: post
title: "Decision Trees and Ensembles: From CART to Gradient Boosting"
date: 2025-02-05
description: How trees split, why they overfit, and how bagging and boosting turn weak learners into strong ones.
tags: [supervised, ensemble, trees]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## Decision Trees (CART)

A decision tree recursively partitions the feature space by choosing splits that minimize impurity.

**Splitting criteria:**

For classification — **Gini impurity**:
$$G = 1 - \sum_k p_k^2$$

For regression — **MSE**:
$$\text{MSE} = \frac{1}{n}\sum_i (y_i - \bar{y})^2$$

At each node, we pick the feature $$j$$ and threshold $$t$$ that minimize a weighted sum of child impurities.

---

## Why Trees Overfit

A fully grown tree memorizes training data. The remedy: **pruning** or controlling depth/leaf size. But a single pruned tree still has high variance — a different training set gives a very different tree.

---

## Bagging: Random Forests

**Idea:** Train $$T$$ trees on bootstrapped samples, average predictions.

Random forests add **feature subsampling** at each split ($$\sqrt{d}$$ features for classification). This decorrelates the trees.

```python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=200,
    max_features='sqrt',
    max_depth=None,        # let trees grow deep
    min_samples_leaf=1,
    n_jobs=-1,
    random_state=42
)
```

**Out-of-bag (OOB) score:** ~37% of samples are never used for each tree → free validation set.

---

## Boosting: Gradient Boosting

**Idea:** Fit trees sequentially, each correcting the residuals of the previous ensemble.

For regression with MSE loss, the pseudo-residuals are:
$$r_i^{(t)} = y_i - \hat{y}_i^{(t-1)}$$

Each new tree fits these residuals. Update:
$$\hat{y}^{(t)} = \hat{y}^{(t-1)} + \eta \cdot h_t(x)$$

where $$\eta$$ is the learning rate and $$h_t$$ is a shallow tree.

---

## XGBoost vs LightGBM vs CatBoost

| Feature | XGBoost | LightGBM | CatBoost |
|---|---|---|---|
| Growth strategy | Level-wise | Leaf-wise | Symmetric |
| Categoricals | Manual encoding | Native | Native |
| Speed | Fast | Fastest | Medium |
| Overfitting control | Good | Needs tuning | Strong defaults |

```python
import lightgbm as lgb

model = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.05,
    num_leaves=31,
    reg_alpha=0.1,
    reg_lambda=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
)
```

---

## Feature Importance

Trees provide built-in importance (impurity-based), but it's biased toward high-cardinality features. Use **permutation importance** or **SHAP** for reliable attribution.

```python
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
shap.summary_plot(shap_values, X_test)
```

---

## Practical Guidance

- Start with Random Forest, establish a strong baseline
- Move to LightGBM when you need more performance
- Watch for leakage when computing importance on training data
- Always tune `n_estimators` + `learning_rate` together (lower LR = more trees needed)
