# Monad Blitz Demo

Monad Blitz hackathon workspace. Initial candidate: **Blitz Vote**, live onchain audience voting on Monad.

Status: repository initialized; event rules pending verification; no application or deployed contract yet.

## Quick start

Requires Node.js 22+.

```sh
npm run check:rpc
```

This read-only check confirms the configured RPC chain ID and retrieves the latest block. It needs no wallet or private key.

- [Monad research and event rule status](docs/research.md)
- [Four-hour MVP proposal](docs/mvp.md)

Never commit seed phrases, private keys, or `.env` files. Use a dedicated testnet wallet for development.
