---
layout: post
title: "Autoencoders: Compression, Representations, and Variational Extensions"
date: 2025-03-05
description: From vanilla autoencoders to VAEs — learning latent representations without labels, and the reparameterization trick.
tags: [unsupervised, deep-learning, representation-learning]
categories: [coreml]
domain: coreml
content_type: technical
toc:
  sidebar: left
---

## What Is an Autoencoder?

An autoencoder learns to compress input to a **bottleneck representation** $$z$$, then reconstruct the original:

$$x \xrightarrow{\text{Encoder } f_\theta} z \xrightarrow{\text{Decoder } g_\phi} \hat{x}$$

Trained to minimize reconstruction loss:
$$\mathcal{L} = \|x - \hat{x}\|^2 \quad \text{(for continuous data)}$$

The bottleneck forces the network to learn the most important features.

---

## Implementation (PyTorch)

```python
import torch
import torch.nn as nn

class Autoencoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, latent_dim)
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.ReLU(),
            nn.Linear(256, input_dim)
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

# Training loop
model = Autoencoder(input_dim=784, latent_dim=32)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.MSELoss()

for epoch in range(50):
    for batch in dataloader:
        x = batch[0]
        x_hat = model(x)
        loss = criterion(x_hat, x)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
```

---

## Variational Autoencoders (VAE)

The regular autoencoder's latent space has no structure — you can't sample from it. VAEs fix this by learning a **distribution** over $$z$$:

$$q_\phi(z \mid x) = \mathcal{N}(\mu_\phi(x), \sigma^2_\phi(x))$$

**ELBO objective** (Evidence Lower BOund):

$$\mathcal{L}_\text{VAE} = \mathbb{E}_{q}[\log p_\theta(x|z)] - D_\text{KL}(q_\phi(z|x) \| p(z))$$

- First term: reconstruction quality
- KL term: forces $$q$$ to stay close to the prior $$p(z) = \mathcal{N}(0, I)$$

**Reparameterization trick** (enables gradients through sampling):
$$z = \mu + \sigma \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)$$

```python
class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(input_dim, 256), nn.ReLU())
        self.mu_head = nn.Linear(256, latent_dim)
        self.logvar_head = nn.Linear(256, latent_dim)
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 256), nn.ReLU(),
            nn.Linear(256, input_dim)
        )

    def encode(self, x):
        h = self.encoder(x)
        return self.mu_head(h), self.logvar_head(h)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        return mu + std * torch.randn_like(std)

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        x_hat = self.decoder(z)
        return x_hat, mu, logvar

def vae_loss(x_hat, x, mu, logvar, beta=1.0):
    recon = nn.functional.mse_loss(x_hat, x, reduction='sum')
    kl = -0.5 * torch.sum(1 + logvar - mu**2 - logvar.exp())
    return recon + beta * kl
```

---

## Use Cases

| Use case | Method |
|---|---|
| Anomaly detection | High reconstruction error = anomaly |
| Denoising | Train with noisy input, clean target |
| Feature learning | Use encoder output as embeddings |
| Generative modeling | VAE: sample $$z \sim \mathcal{N}(0, I)$$, decode |
| Dimensionality reduction | Non-linear alternative to PCA |

---

## Autoencoders vs. PCA

PCA finds the optimal **linear** compression. Autoencoders with non-linear activations can capture complex manifold structure that PCA misses. But PCA is:
- Deterministic and interpretable
- Has a closed-form solution
- Immune to local minima

Start with PCA; use autoencoders when linear compression isn't sufficient.
