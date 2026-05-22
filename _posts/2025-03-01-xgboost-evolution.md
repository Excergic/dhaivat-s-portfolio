---
layout: post
title: "The Evolution of Machine Learning: Why XGBoost Rules the World"
date: 2025-03-01
description: From linear regression's straight-line assumptions to decision trees' fragility to random forests' inefficiency — and how Tianqi Chen's sequential correction chain changed everything.
tags: [machine-learning, xgboost, boosting, ensemble]
redirect: https://www.linkedin.com/pulse/evolution-machine-learning-why-xgboost-rules-world-dhaivat-jambudia-jhvaf/?trackingId=oaDsDPFTRCqgGLqjT23%2Fiw%3D%3D
external_source: LinkedIn
---

From linear regression's straight-line assumptions to decision trees' fragility to random forests' inefficiency — and how Tianqi Chen's sequential correction chain changed everything.

**Linear Regression** is highly predictable and stable, but it treats the world like a smooth, straight line. It completely misses the "jagged cliffs" of human behavior — like a credit score that stays perfectly fine until it drops off a cliff after a single missed payment.

**Decision Trees** are great at finding those cliffs, but incredibly fragile. Change a tiny bit of your training data, and the whole tree structurally reshapes itself, leading to wild inconsistency.

To fix this, the industry built **Random Forests** — 100 different trees voting on an answer. It worked, but it was inefficient. Like hiring 100 junior analysts who work in separate rooms, never talk to each other, and simply average their guesses at the end. They all kept making the same easy mistakes because they weren't learning from one another.

Then came **Tianqi Chen in 2014** with XGBoost (Extreme Gradient Boosting). He asked a radical question: What if, instead of a crowd, we built a high-performance relay team?

Each analyst only focuses on the mistakes of the previous one. The most valuable information isn't in what the model gets right — it's in the errors (residuals) it leaves behind.
