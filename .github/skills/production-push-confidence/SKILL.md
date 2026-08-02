---
name: production-push-confidence
description: Run a pre-push confidence gate to reduce production break risk. Use before pushing, deploying, or marking a change release-ready.
license: MIT
compatibility: Works with Node/Next.js workflows in this repository.
metadata:
  author: chanchal-fashion
  version: "1.0"
---

Run a production confidence gate before any push/deploy decision.

## Purpose

Estimate confidence that a new push will not break production by validating the most failure-prone layers: tests, build, key runtime paths, and release assumptions.

## Confidence Output Contract

Always return:
- Confidence level: `High` / `Medium` / `Low`
- Evidence summary (what passed, what was not checked)
- Residual risks
- Push recommendation: `Go` / `Go with caution` / `Do not push`

## Required Checks (Minimum)

1. Automated quality gate
- Run `npm run test`
- Run `npm run build`

2. Critical-path behavior gate
- Verify core public routes and critical API routes relevant to the change
- For this repo, minimum default set:
  - `/`
  - `/cart`
  - `/api/products`
  - admin entry route (`/admin`) when admin/auth was touched

3. Scope-aware regression gate
- If change touches product/order/image/auth/config flows, run targeted checks for those paths.
- Prefer existing tests first; add manual smoke checks only where tests do not cover.

4. Deployment-context gate (when preparing deploy)
- Confirm env assumptions required by touched code (for example secrets/config keys)
- Verify no known blocking warnings/errors in recent build/deploy output

5. Runtime JSON ownership gate
- If the change touches `data/*.json`, `lib/db.ts`, `fly.toml`, or product/order/config/admin runtime flows, explicitly verify that local or repo JSON changes will not become unintended production runtime data.
- Confirm the production runtime source of truth is still the mounted `DATA_DIR` volume, not bundled repo files.
- Confirm `orders.json` is treated as runtime-owned data and is not seeded from repo content into production-like storage.
- If repo-tracked JSON changed, classify each changed file as one of: `seed/bootstrap only`, `local-only/private`, or `runtime-owned`. Do not proceed without that classification.
- If local-only/private JSON is present, verify it is excluded from git or stored outside tracked repo runtime paths.

## JSON Safety Stop Conditions

Return `Do not push` if any of the following are true:
- You cannot explain whether changed JSON files are seed data or runtime data.
- Production could bootstrap mutable runtime state from unintended repo JSON.
- `DATA_DIR` / mounted volume assumptions are unverified after a data-layer or deploy-config change.
- `orders.json` or other runtime-owned business data could be replaced by bundled repo content.

## Confidence Rubric

Set confidence to `High` only if all are true:
- Tests pass
- Build passes
- Critical routes behave correctly
- No unresolved high-severity warnings affecting runtime reachability
- No unverified risky changes in touched critical paths
- Runtime JSON ownership is verified and repo/local JSON changes cannot unintentionally replace production runtime data

Set to `Medium` if:
- Tests/build pass, but one or more critical checks are partial/manual-only
- Non-blocking warnings exist with plausible runtime risk

Set to `Low` if:
- Tests or build fail
- Critical path checks fail or are missing
- Runtime reachability/auth/data integrity concerns are unresolved
- JSON ownership or mounted runtime data safety is unresolved

## Suggested Command Pattern

1. `npm run test`
2. `npm run build`
3. Route checks (local or production depending on stage), for example:
   - `curl` status/time checks for `/`, `/cart`, `/api/products`, `/admin`
4. Runtime JSON ownership review:
  - inspect `data/*.json`, `lib/db.ts`, `fly.toml`, and relevant docs/env assumptions when touched
  - confirm local-only data is untracked or outside the bundled runtime seed path
  - confirm production mount/bootstrap behavior is still safe
5. Optional deploy/health checks when explicitly preparing production push

## Report Template

```md
## Production Push Confidence

Confidence: <High|Medium|Low>
Recommendation: <Go|Go with caution|Do not push>

Checks passed:
- ...

Checks not fully verified:
- ...

Residual risks:
- ...

JSON runtime ownership:
- <seed/bootstrap classification>
- <local-only/private classification>
- <runtime-owned classification>

Reasoning:
- ...
```

## Guardrails

- Do not claim `High` confidence without both test and build passing.
- If a check could not be executed, explicitly list it as unverified.
- Prefer honest `Medium` confidence over optimistic `High` when evidence is incomplete.
- If deployment warnings indicate potential reachability issues, do not mark confidence as `High` until verified.
- If JSON ownership is ambiguous, do not treat the push as release-ready.
