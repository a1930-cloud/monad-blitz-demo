# SpecBounty — Monad Blitz Guangzhou

An acceptance-specification bounty prototype: discover an incorrect agent delivery that still passes the tests, reward a customer-approved counterexample, repair and freeze the specification, then accept the correct delivery.

Application source and setup: [specbounty/README.md](specbounty/README.md).

Research and mentor responses: [docs/](docs/).

Status: public frontend live at https://specbounty-monad.vercel.app . Escrow deployed to Monad Testnet with verified source. Seven real settlement transactions completed using a disclosed, same-controller test recipient contract. The current probe is deterministic, not an LLM. See specbounty/public/evidence.json for transaction evidence.

No secrets belong in this repository. `.mojo/` contains local credentials and is excluded from Git.
