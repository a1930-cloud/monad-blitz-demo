# SpecBounty

**Find flaws in acceptance criteria before an agent gets paid for the wrong result.**

Monad Blitz Guangzhou prototype, 2026-11-21. The lab demonstrates a concrete failure: a duplicate order passes the initial acceptance tests, inflating the total from ¥247 to ¥376. A reproducible counterexample leads to a repaired, frozen specification and a correct delivery.

## Run

```sh
npm ci
npm test
npm run dev
npm run build
```

Node.js 22+. `npm run build` compiles the Solidity contract and builds the static site to `dist/`.

## What works

- Editable order inputs, deterministic duplicate-order probe, old/new acceptance test comparison and repaired execution.
- Separate local lab and Monad Testnet settlement interface.
- Customer-funded escrow, counterexample submission/approval/rejection, repaired spec freeze, delivery approval/rejection, pull payments and 24-hour UI task deadline.
- Wallet-driven contract deployment, transaction receipt links, shareable contract/task URL and direct chain reads.

## Verified Monad Testnet deployment

- Contract: `0xed383f4c459764b442899f57abd8a9ed6f21352c` (chain 10143).
- Deployment: https://testnet.monadscan.com/tx/0xd0688556d9d96804a0d667f41c16f66bcf4143bee5b58fa9ceee652ceedf0f80
- Source verified on Monadscan and MonadVision through the devnads verification API.
- `public/deployment.json` records deployment and verification results.
- `public/evidence.json` records seven real integration transactions: fund, submit counterexample, approve bounty, freeze spec, submit delivery, approve payment, withdraw. Recipient received 0.004 test MON; remaining credit is zero.
- Role separation is tested using `TestRecipient.sol`, a contract controlled by the same session EOA as the customer. It is not an independent autonomous Agent or a separate human user. The UI labels this when viewing the example.
- Public frontend: https://specbounty-monad.vercel.app . Select chain settlement, then “查看已验证的链上示例” to inspect actual transactions without a wallet.

Use three wallet accounts for customer, hunter and worker. The hunter/worker must differ from the customer. The hunter and worker may be the same address. Budget: 0.001 test MON bounty + 0.003 test MON delivery, with gas paid separately. Approvals credit balances; recipients then withdraw.

## Trust boundaries

The current probe and executor are deterministic JavaScript, explicitly labelled in the UI. There is no LLM integration or autonomous paid agent service yet. Local confirmation does not pay anyone. The chain does not execute JavaScript tests or decide natural-language correctness: the customer explicitly attests to validity and delivery quality.

The contract stores hashes, not the original files. Share input/evidence separately and verify the same canonical hashes before using another wallet. Only one outstanding claim and delivery per task; the customer may reject either. Expiry refunds only unallocated escrow, never reverses awarded credit. This prototype has no independent audit, identity verification, Sybil resistance, dispute court, automatic quality oracle, mainnet payments or persistent server-side artifact storage.

## Structure

- `src/engine.js`: fixed task and deterministic test/probe engine.
- `src/main.js`: UI and viem wallet/chain integration.
- `contracts/SpecBounty.sol`: escrow state machine.
- `test/`: engine tests and local EVM authorization/payment lifecycle test.
- `scripts/compile.mjs`: pinned solc 0.8.28; Paris bytecode for broad EVM support.

Local EVM tests check Solidity behavior, not Monad-specific gas pricing or finality. Testnet end-to-end settlement was verified using the explicitly disclosed test recipient harness. Independent-wallet browser acceptance remains to be done. Gas is estimated on the target network with a 10% buffer; Monad charges the gas limit.

## Demo (under 3 minutes)

Run the probe. Show the ¥376 wrong result and green v1 tests beside the ¥247 requirement. Confirm the counterexample, freeze v2, show the old result failing 3 checks, then execute the repaired delivery and show all 5 passing. When a contract is deployed, use separate wallets for escrow, evidence submission, customer approval and withdrawals; open actual transaction receipts.

## Public frontend

https://specbounty-monad.vercel.app — production frontend deployed and anonymous HTTP 200 verified on 2026-11-21. Sites source was synchronized, but its archive-upload service failed to connect, so this initial public release uses Vercel. Onchain deployment and harness settlement are now verified.
