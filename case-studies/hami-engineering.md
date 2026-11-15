# Hami — Engineering Case Study

**Role:** Founder / systems architect  
**Repository:** [kn33r0s3/ForgeOS](https://github.com/kn33r0s3/ForgeOS)  
**Product identity:** Hami  
**Evidence reviewed:** repository source and documentation available on 15 November 2026

## Overview

Hami is an evolving full-stack system for turning observations into traceable understanding and governed decisions. Its technical lineage is the ForgeOS repository; Hami is developed in place rather than as a parallel replacement.

The central engineering idea is to keep one connected evidence and action substrate. Observations, evidence, beliefs, opportunities, decisions, experiments, actions, and outcomes should remain traceable to one another. The system distinguishes real-world facts from estimates, tests, mocks, and hypotheses.

## Selected engineering work

### 1. Closing authorization gaps in existing API routes

A security pass protected previously unauthenticated write and sensitive routes across five existing FastAPI routers:

- Orchestrator routes, including a flow response that can contain contact-related personal information.
- Substrate write routes.
- Product write routes.
- Observer write route.
- Evidence-triage route.

Rather than introducing a second authentication system, the implementation reused the repository's existing owner-key security seam. Public read paths were left unchanged where the existing middleware already handled their access policy.

The PR records 14 new router-auth tests, including missing/wrong-key behavior and preservation of intended public reads. Its recorded full-backend result at that point was 953 passed, 2 skipped.

**Evidence:** [PR #17 — owner-key authentication across five routers](https://github.com/kn33r0s3/ForgeOS/pull/17)

### 2. Reconnecting scheduled research to the existing collection pipeline

The scheduled intelligence endpoint was connected to the existing `collector_runner.run_pending_tasks()` path. It processes explicitly planned research tasks rather than launching a new scheduler or parallel worker.

The documented safeguards include:

- A bounded collection limit of five tasks per scheduled run.
- Atomic task claiming so concurrent workers do not claim the same task.
- An idempotency constraint for duplicate task creation.
- Source-clearance checks before network access.
- Provenance on collected signals, including source, canonical URL, and retrieval time.
- Per-task failure isolation so one failed task does not terminate the entire collection stage.

The PR records focused tests for authorization, invocation, and failure isolation, along with 16 scheduled-test passes and a historical full-backend result of 933 passed, 2 skipped.

**Important limit:** the PR explicitly said that production execution with real queued ResearchTasks had not yet been observed. Passing tests did not establish a live scheduled research service.

**Evidence:** [PR #18 — scheduled observation through the existing collector](https://github.com/kn33r0s3/ForgeOS/pull/18)

### 3. Recovering discovery methods into the existing discovery engine

Five database-backed discovery methods were recovered into the existing `discovery_engine.py` seam:

- `map_gap` — areas with no candidate coverage.
- `superseded_belief` — potentially contradicted or superseded beliefs.
- `outcome_anomaly` — failed or disputed outcomes.
- `pending_capability` — proposed or building capabilities that may reveal a gap.
- `horizon_escape` — domains outside the current watch horizon.

These methods query existing records rather than making network calls. Empty results are represented honestly as no material discovery, and model-proposed findings remain unconfirmed until supported.

The PR records ten added tests, 21/21 discovery-engine tests passing, and a historical full-backend result of 1,046 passed, 2 skipped.

**Evidence:** [PR #20 — recover discovery sources into the existing engine](https://github.com/kn33r0s3/ForgeOS/pull/20)

## Engineering principles demonstrated

- **Reuse before adding:** extend existing routes, services, records, and security seams instead of creating parallel subsystems.
- **Authorization before action:** authentication, approval, permission, execution, and successful outcome are distinct states.
- **Fail closed:** uncleared sources and unconfigured runtime dependencies should not silently proceed.
- **Traceability:** preserve source, provenance, status transitions, and evidence links.
- **Honest empty states:** absence of evidence should not be replaced with generated or assumed facts.
- **Test the boundaries:** verify denied requests, concurrency claims, duplicate prevention, and task-level failure isolation—not only the happy path.

## Current limitations — do not read this as a production success story

The implementation evidence above is real repository work, but it does not establish that Hami is a reliable live service or that it has created economic value.

The repository's 15 November 2026 operating notes report that production readiness was still unverified: a READY deployment did not establish a live public service, the project was marked non-live and SSO-protected, environment variables and durable database configuration were absent, and health/read-after-write evidence was unavailable through that check.

The same day's queue records an unresolved generated-map/importer test-count mismatch and says exact main-push GitHub Actions results were unverified. The exact current CI state must be checked against the relevant commit before claiming a green build.

The commercial evidence log contains no verified customer, transaction, or revenue entries. Accordingly, this case study makes no claims about customers, revenue, production uptime, real scheduled collection, or measured business impact.

## What would make the next case study stronger

1. Resolve the importer/test mismatch through the authorized synchronization path and obtain a green exact-commit CI result.
2. Establish durable, authenticated runtime configuration and verify health plus a read-after-write round trip.
3. Observe a permitted scheduled research task complete in the live environment, with provenance and an auditable result.
4. Record a real, consented user outcome and independently verifiable economic result before claiming impact.

## Source material

- [Hami repository](https://github.com/kn33r0s3/ForgeOS)
- [Current system map](https://github.com/kn33r0s3/ForgeOS/blob/main/docs/HAMI_SYSTEM_MAP.md)
- [Operating queue and verification boundaries](https://github.com/kn33r0s3/ForgeOS/blob/main/QUEUE.md)
- [Commercial evidence log](https://github.com/kn33r0s3/ForgeOS/blob/main/docs/REVENUE_LOG.md)
