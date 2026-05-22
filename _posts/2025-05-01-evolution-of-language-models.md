---
layout: post
title: "The Evolution of Language Models: From N-Grams to Transformers"
date: 2025-05-01
description: The full story — from n-gram probability tables and RNNs' vanishing gradients to LSTMs' memory gates and finally the attention mechanism that changed everything.
tags: [machine-learning, nlp, transformers, deep-learning]
redirect: https://x.com/dhaivat00/status/2057822902825975956
external_source: X (Twitter)
---

The full arc of how machines learned language — from counting word pairs in a lookup table to the attention mechanism that powers every modern LLM.

**N-grams** were the starting point: predict the next word based on the previous N words. Simple, fast, but the context window was tiny and the tables grew exponentially with vocabulary size.

**RNNs** introduced the idea of hidden state — a vector that carries information through the sequence step by step. But training them meant gradients had to flow back through every time step, and they vanished or exploded long before reaching the beginning of the sequence.

**LSTMs** solved the vanishing gradient problem with gating mechanisms — forget gate, input gate, output gate — giving the network explicit control over what to remember and what to discard. They worked remarkably well for years.

Then came the **Transformer**. Instead of processing tokens sequentially, attention lets every token look directly at every other token simultaneously. Distance in the sequence no longer determines how well two tokens can influence each other. That single insight — query, key, value — is the architecture behind every frontier model today.
