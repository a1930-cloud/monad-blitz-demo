# Research — 2026-11-21

## Event rules: not yet verified

User-provided sources:
- https://monad-foundation.notion.site/Monad-Blitz-6786367594f2834fbd6e818968e1bde9
- https://monad-foundation.notion.site/7546367594f2835ba564814eae664af9

The in-app browser identified the first page as “Monad Blitz 广州”, but reading its content timed out. Search could not retrieve either page; the Notion content endpoint returned HTTP 403. This is not evidence of any event requirement.

Before finalizing scope, verify: event/date and submission deadline; permitted starting code and AI usage; team size; tracks and judging criteria; required network; required repository visibility/license; deployment, video and presentation requirements; sponsor requirements.

## Verified developer facts

Sources accessed on 2026-11-21:
- https://docs.monad.xyz/ — EVM-compatible Layer 1; parallel execution; Ethereum RPC compatibility. Current documentation describes 300 ms blocks and 600 ms finality. These are network characteristics, not measured UI latency or an app guarantee.
- https://docs.monad.xyz/developer-essentials/testnet — Chain ID 10143, currency MON, RPC https://testnet-rpc.monad.xyz, explorer https://testnet.monadscan.com, faucet https://faucet.monad.xyz. Testnet reset on 2025-12-16, so older deployed addresses may be obsolete.
- https://docs.monad.xyz/developer-essentials/summary — Solidity/EVM tools apply; recommended viem >=2.40.0 and Foundry >=1.8 with Monad execution network enabled. Gas charging and opcode costs differ from Ethereum; use estimation and check receipts. Transaction receipt availability and finality are distinct.
- https://docs.monad.xyz/developer-essentials/differences — local Ethereum simulations do not reproduce every Monad behavior.

## Practical choices

Use testnet for development pending event requirements. React + Vite + TypeScript + viem for the proposed frontend, Solidity for a small voting contract. Read events with bounded polling initially; avoid building an indexer or backend in the MVP. Do not claim measured throughput or latency until measured against this deployment.

No private key is needed for research/RPC checks. Actual deployment requires a funded testnet wallet; wallet signatures stay with the participant.
