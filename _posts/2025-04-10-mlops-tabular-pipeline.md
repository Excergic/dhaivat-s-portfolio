---
layout: post
title: "Production MLOps for Tabular Data: End-to-End Pipeline"
date: 2025-04-10
description: A complete production ML pipeline for tabular data — data validation, feature engineering, training, evaluation, deployment, and monitoring.
tags: [mlops, tabular, pipeline, production]
categories: [mlops]
domain: mlops
content_type: technical
toc:
  sidebar: left
---

## The Problem with "Good Enough" Notebooks

A notebook that works once is not an ML system. A system needs to:
- Retrain automatically when data drifts
- Catch data quality issues before they reach the model
- Deploy new model versions without downtime
- Alert when predictions degrade in production

This write-up documents the end-to-end pipeline built during the MLOps tabular project.

---

## Pipeline Overview

```
Raw Data
   │
   ▼
[Data Validation]  ← Great Expectations schemas
   │
   ▼
[Feature Engineering]  ← sklearn Pipeline (serializable)
   │
   ▼
[Model Training]  ← LightGBM + hyperparameter search
   │
   ▼
[Evaluation Gate]  ← Business metrics + slice analysis
   │ (pass)
   ▼
[Model Registry]  ← MLflow, semantic versioning
   │
   ▼
[Deployment]  ← FastAPI + Docker + k8s
   │
   ▼
[Monitoring]  ← Data drift + prediction drift + business KPIs
   │ (alert)
   ▼
[Retraining Trigger]
```

---

## Stage 1: Data Validation

Never train on dirty data silently.

```python
import great_expectations as ge

def validate_training_data(df: pd.DataFrame) -> ValidationResult:
    suite = ge.dataset.PandasDataset(df)

    suite.expect_column_values_to_not_be_null("target")
    suite.expect_column_values_to_be_between("age", 18, 120)
    suite.expect_column_values_to_be_in_set("category", VALID_CATEGORIES)
    suite.expect_column_pair_values_A_to_be_greater_than_B("end_date", "start_date")

    result = suite.validate()
    if not result.success:
        failed = [r for r in result.results if not r.success]
        raise DataValidationError(f"{len(failed)} expectations failed: {failed[:3]}")
    return result
```

---

## Stage 2: Feature Engineering Pipeline

The key: build a sklearn `Pipeline` that can be serialized and used identically at training and serving time.

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.impute import SimpleImputer
import joblib

numeric_features = ['age', 'income', 'tenure_days']
categorical_features = ['category', 'channel', 'region']

preprocessor = ColumnTransformer([
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
    ]), numeric_features),
    ('cat', Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)),
    ]), categorical_features),
])

# Full pipeline including model
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', LGBMClassifier(**best_params))
])

full_pipeline.fit(X_train, y_train)
joblib.dump(full_pipeline, 'model.pkl')  # one artifact, transforms + model
```

---

## Stage 3: Training and Evaluation Gate

Don't deploy a model that isn't better than the baseline.

```python
from sklearn.metrics import roc_auc_score, average_precision_score
import mlflow

def evaluate_with_gate(model, X_test, y_test, baseline_auc: float) -> bool:
    y_pred = model.predict_proba(X_test)[:, 1]

    auc = roc_auc_score(y_test, y_pred)
    ap = average_precision_score(y_test, y_pred)

    # Slice analysis — don't let aggregate metrics hide group degradation
    for group in X_test['region'].unique():
        mask = X_test['region'] == group
        group_auc = roc_auc_score(y_test[mask], y_pred[mask])
        mlflow.log_metric(f"auc_{group}", group_auc)
        if group_auc < 0.55:  # minimum acceptable per-group
            raise EvaluationGateError(f"AUC too low for group {group}: {group_auc:.3f}")

    mlflow.log_metrics({"auc": auc, "average_precision": ap})

    if auc <= baseline_auc:
        raise EvaluationGateError(f"New AUC {auc:.4f} ≤ baseline {baseline_auc:.4f}")

    return True
```

---

## Stage 4: Monitoring

Track three signal types:

**Data drift:** input distribution shift
```python
from scipy.stats import ks_2samp

def check_drift(reference: pd.Series, current: pd.Series, threshold=0.05) -> bool:
    stat, p_value = ks_2samp(reference, current)
    return p_value < threshold  # True = drift detected
```

**Prediction drift:** output distribution shift (leading indicator of model decay)
```python
def check_prediction_drift(ref_scores: np.array, cur_scores: np.array) -> dict:
    psi = compute_psi(ref_scores, cur_scores, bins=10)
    return {"psi": psi, "drift_detected": psi > 0.2}
```

**Business KPI monitoring:** conversion rate, revenue — what actually matters

---

## Stage 5: Retraining Strategy

| Trigger | Condition | Action |
|---|---|---|
| Scheduled | Weekly | Retrain if data has grown by > 10% |
| Drift alert | PSI > 0.2 on key features | Retrain immediately |
| Performance drop | AUC drops > 2% on holdout | Emergency retrain + rollback option |
| Label delay | New labels available (T+7d) | Queue retrain |

Never retrain blindly — always run the evaluation gate before promoting.
