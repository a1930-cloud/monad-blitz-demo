# Blitz Vote — candidate four-hour MVP

Proposal pending event rules and participant feedback.

## Pitch

Turn a live audience question into a verifiable onchain vote. Create a poll, share its ID/link, vote from several wallets, watch results update, and inspect the transactions on Monad Testnet.

This fits an afternoon because it needs one small contract and a static frontend, without external APIs, token economics, custody or a backend. Fast chain feedback can make the live interaction pleasant; actual confirmation latency must be measured.

## Acceptance criteria

- Creator opens a poll with 2–4 options and a closing time.
- A connected wallet votes once per poll; unknown polls, invalid options, repeated and late votes revert.
- UI validates network, handles rejected signatures/reverted transactions, and shows pending/confirmed states.
- Results are read from chain and update after confirmations; every successful vote has an explorer link.
- Refresh preserves the selected poll through the URL.
- Demo uses at least two wallets and real testnet transactions.

One wallet is not one person. This is transparent audience interaction, not identity-verified or secret-ballot governance. Votes are public. No payments, prizes or token issuance.

## Four-hour allocation

1. 0:00–0:30: confirm rules, freeze scope, obtain testnet MON.
2. 0:30–1:30: contract plus meaningful tests for permissions, bounds, duplicate votes and deadline; compile and deploy.
3. 1:30–2:45: wallet connection, poll creation, vote flow, results and explorer links.
4. 2:45–3:30: two-wallet end-to-end check, failed-transaction UX, responsive layout.
5. 3:30–4:00: hosted frontend, README with deployment addresses, 90-second script and screen recording.

## Demo script

“An audience poll usually relies on a central server. Here each vote is independently verifiable.” Create a poll, cast two votes from separate wallets, show the result updating, then open a transaction in the explorer. Explain why Monad's quick feedback suits live audience interaction.

## Scope exclusions

No AI integration, NFT minting, ERC-20, custom accounts, gas sponsorship, multi-chain support, DAO execution or elaborate analytics in the first demo.

## Submission checklist (candidate, not verified event requirements)

Record contract address/network, deployment transaction, source verification, frontend URL, setup instructions, demo video and known limitations. Confirm official requirements before submitting.
