# SpecBounty — Monad Blitz Guangzhou

An acceptance-specification bounty prototype: discover an incorrect agent delivery that still passes the tests, reward a customer-approved counterexample, repair and freeze the specification, then accept the correct delivery.

Application source and setup: [specbounty/README.md](specbounty/README.md).

Research and mentor responses: [docs/](docs/).

Status: frontend lab implemented and locally verified; Solidity escrow compiled and tested on a local EVM. Monad Testnet deployment and real settlement are pending wallet authorization. The current agent probe is deterministic, not an LLM.

No secrets belong in this repository. `.mojo/` contains local credentials and is excluded from Git.
