# Research — 2026-11-21

## Event rules: supplied by participant on 2026-11-21

Source: participant pasted the rules from the event page. Exact schedule and judging weights remain unconfirmed.

- Maximum team size: 3.
- Original project conceived for Monad Blitz; no existing project or fork except standard libraries/boilerplate.
- Coding and assets must start within the official event period. Pre-event research, brainstorming and planning are encouraged.
- GitHub code submissions outside the event period may affect eligibility. Preserve actual timestamps.
- Substantial innovation or a distinctive Monad use case is required; a basic clone is discouraged.
- Submission materials, including GitHub repository, must be public.
- Project must run on Monad; frontend must be publicly hosted; both must remain available for review over time. The pasted rules do not specify testnet versus mainnet or an exact hosting duration.
- Confirm MOJO login immediately: https://mojo.devnads.com/ . Register/join a team before submission stage; only team leader can submit project details. Vote for other projects.
- Team handles prize allocation; agree on responsibilities and split.

### Immediate checks

Official development start and submission deadline; whether coding is currently allowed; MOJO login/team state; permitted network; required submission fields; current team size.

### Existing workspace provenance

Repository setup, planning notes and a small read-only RPC check script were created before the official schedule was known. The script is development code; do not assume it is exempt. If created before the allowed window, disclose it to organizers and ask whether it can be treated as setup or must be excluded. Do not rewrite dates or represent it as event-period work. No application or contract has been built.

Repository is currently private and must become public before submission. Routine chain voting alone is a weak fit for the stated innovation requirement; the proposal below is not yet selected.

## Verified developer facts

Sources accessed on 2026-11-21:
- https://docs.monad.xyz/ — EVM-compatible Layer 1; parallel execution; Ethereum RPC compatibility. Current documentation describes 300 ms blocks and 600 ms finality. These are network characteristics, not measured UI latency or an app guarantee.
- https://docs.monad.xyz/developer-essentials/testnet — Chain ID 10143, currency MON, RPC https://testnet-rpc.monad.xyz, explorer https://testnet.monadscan.com, faucet https://faucet.monad.xyz. Testnet reset on 2025-12-16, so older deployed addresses may be obsolete.
- https://docs.monad.xyz/developer-essentials/summary — Solidity/EVM tools apply; recommended viem >=2.40.0 and Foundry >=1.8 with Monad execution network enabled. Gas charging and opcode costs differ from Ethereum; use estimation and check receipts. Transaction receipt availability and finality are distinct.
- https://docs.monad.xyz/developer-essentials/differences — local Ethereum simulations do not reproduce every Monad behavior.

## Practical choices

Use testnet for development pending event requirements. React + Vite + TypeScript + viem for the proposed frontend, Solidity for a small voting contract. Read events with bounded polling initially; avoid building an indexer or backend in the MVP. Do not claim measured throughput or latency until measured against this deployment.

No private key is needed for research/RPC checks. Actual deployment requires a funded testnet wallet; wallet signatures stay with the participant.
