# FarmingStar — developer repair handoff

**Current assessment: Playable with Major Issues.** Audit of 0.4.0 at commit `d3af7526950637f243727b90c3c0f6b784ac02f5`, 5 November 2026. **Nine confirmed open bugs: two P1, seven P2; no P0 identified.** No application fixes were made. The original `index.html`, supplied tests, manifests and lockfile remain unchanged.

Start with [QA_BUG_REPORT.md](QA_BUG_REPORT.md) for exact reproduction/state/error evidence. [QA_TEST_COVERAGE.md](QA_TEST_COVERAGE.md) lists executed checks and omissions. A comprehensive test request does not imply complete platform coverage: this audit used Chromium, emulated devices and controlled states; physical Android/iPad and alternate engines remain outstanding.

## What the existing passing tests miss

The seven supplied scripts pass with locked Playwright 1.58.2. New expected-behaviour checks fail in nine distinct areas. Do not weaken or remove those checks to restore a green summary. Several supplemental probes assert that a bug is reproducible; their successful probe status is **not** a product pass. Read the final JSON row titles and the case ledger.

| ID | Severity | Broken behaviour | Primary regression case |
|---|---|---|---|
| QA-001 | P1 | Refresh during cooking loses reserved input and pending result | audit `SAVE-04`, final `REAL-RELOAD` |
| QA-002 | P1 | Market prices one quality stack but removes another | audit `ECO-02`, extended `REPRO-02` |
| QA-003 | P2 | New farmer inherits replaced farm's history/undo data | audit `SAVE-07`, final `REAL-REPLACE` |
| QA-004 | P2 | Null nested collection accepted; harvest partially grants then throws | audit `SAVE-05`, extended `SAVE-11` |
| QA-005 | P2 | Merge into equipped destination selects emptied source | audit `INV-05`, final `REAL-MERGE` |
| QA-006 | P2 | Visible Mira cannot use town↔forest connection | extended `NPC-03` |
| QA-007 | P2 | Exhausted chopping attempts increment hit progress | extended `FARM-07` |
| QA-008 | P2 | Staffed hall delivery succeeds at 22:00 | extended `COMM-05` |
| QA-009 | P2 | Placement permits solid furniture over farmer, blocking walking | extended `BUILD-02`, final `REAL-BUILD` |

## Batch 1 — cooking durability and safe save validation

**QA-001: durable cooking transaction.** `beginCook` at `index.html:335` consumes ingredients through `transact` and puts the reservation only in runtime `miniGame`. `save` at line 238 persists `g`; pagehide at line 681 flushes the debited state; `start` at line 319 discards runtime activity. Three actual refreshes each restored neither the potato nor chopped output.

Choose one explicit lifecycle: persist a pending reservation that can resume/refund exactly once, or reserve without committing ingredients until output can commit atomically. Cover partial timing progress and exceptional writes. Disabling autosave history alone cannot fix a pagehide/manual save. Do not introduce an alternate inventory representation: `bagSlots` is canonical and `inv` is a derived compatibility proxy.

**QA-004: validate deep shapes before live mutation.** `validateSave` lines 216–232 accepts `collections.crops = null`. Successful `transact` at harvest line 434 grants a carrot, then the null access throws before resetting the plot. Validate or safely normalize all nested collection/progression data into a detached candidate before replacing `g`. Preserve invalid raw bytes, including invalid history entries, rather than silently overwriting the original on `start`.

**Dependencies:** changing the save schema for pending activities should share validation/migration work with QA-004. Retain support for existing schema versions 1–4. Schema migration must not consume ingredients twice or infer rewards for historical events without evidence.

**Acceptance tests:**

1. Begin each station-family cook; refresh before timing, after action one/two, and after completion. Inventory plus pending reservation/output is conserved; no duplicate XP/coins/output.
2. Quota failure at reservation and completion; repeated resume/restore and background/foreground. Test real page reload, not only `start(load())`.
3. Null/string/array collection buckets and malformed pending transactions: reject or normalize deterministically, no uncaught error/partial reward and no destroyed raw save.
4. Re-run all supplied migrations, capacity tests and bedside save/day tests.

## Batch 2 — exact-stack economic operations and merge selection

**QA-002: one selected stack must determine both price and removal.** Market update at line 688 obtains the first matching stack's quality, then decrements `g.stock[id]`; proxy removal sorts by ascending grade in `removeFromSlots` line 81. Excellent→Standard stock pays 26c twice, while the correct combined payout at fair/autumn pricing is 44c. Operate on the canonical market array and atomically remove from the selected stack. Keep the current sale guard, market interval and demand rules.

**QA-005: distinguish merge from swap selection remapping.** `moveBag` line 328 redirects equipped destination index to source even when a merge depletes that source. Preserve the equipped destination's surviving stack. If the equipped source merges fully, move selection to destination; define partial-merge semantics and test them. Preserve item quantity and q metadata.

**Acceptance tests:** all three grades in both stack orders; grade-sensitive price/sale/withdraw/reload; Budget/Fair/Premium; current demand multipliers; exact total payouts. For merging, cover both equipped ends, unselected ends, partial/full merges and both UI click/drag paths. Existing 100-transfer quantity/quality checks must stay green.

## Batch 3 — save lineage and replacement consistency

**QA-003:** replacement handler at line 636 creates defaults, and begin at line 654 writes the primary. The old `.history` and `.before-restore` keys remain. Actual UI replacement Old farm QA → New farm QA still exposes and restores Old farm QA. The delete handler already illustrates all companion keys, but do not copy its early deletion sequence into replacement without handling storage failure.

Add durable farm identity/lineage to primary/history/undo and enforce it on read/restore. On confirmed successful replacement, reset old companion state. Decide atomicity/recovery for a primary-success/history-clear-failure scenario. Preserve the old farm if the replacement cannot be saved. Keep the three unrelated slots isolated.

**Acceptance tests:** replacement with empty/four-point history, undo present/absent, occupied and unreadable primary, each slot, storage failure at each affected key, new-farm restore and undo. Tests must use a genuinely different farmer name/identity so inherited state cannot hide behind identical defaults.

## Batch 4 — placement safety and action preconditions

**QA-009:** `placementValid` line 171 checks objects and home reachability but not the farmer collision footprint. `finishFurniture` line 161 commits without relocation. A table starting at `(10,9)` overlaps the farmer at `(252,228)` and all four real key directions fail. This is recoverable via Build Mode, so it is P2 rather than a proven permanent deadlock.

Reject newly blocking overlap with the player's collision shape, including moved objects and stations, or relocate atomically to a reachable safe position as part of commit. Recheck at confirmation, not only preview, because the farmer may move between them. Maintain door/home reachability and UID-based chest contents.

**QA-007:** original obstacle-hit code at line 432 increments `g.hits[key]` before rejecting `consumeEnergy(2)`. Ten zero-energy attempts plus one paid hit yield three wood from a Basic tree. Perform precondition checks before mutable hit progress. Specify how full-backpack failure interacts with hit progress and paid energy, then test that policy consistently; do not accidentally break quarry's separate `gather` transaction.

**Acceptance tests:** multi-tile/rotated objects, player on each covered tile and moving after preview, machine placement and stored chest replay; low/zero energy axe/pick at every tier; full bag and repeated ineffective input produce no phantom damage/reward.

## Batch 5 — shared transitions and service-hour enforcement

**QA-006:** `updateNPC` line 498 assumes a town departure always maps to a building. Mira's 06:00 forest destination has no building, so `continue` skips her route indefinitely while visible. Off-screen resolution jumps her correctly to `(22,17)`. Use a shared area/exit graph for buildings and outdoor map edges. `npcEntrance` line 494 needs corresponding gate entries. Fixing only plan coordinates or forcing visible teleports will hide rather than solve the mismatch.

**QA-008:** carrot delivery at line 649 ignores `shopOpen('hall')`. At 22:00 it removes one carrot and grants 25c plus 10c first journal reward, despite false hall-open state. Soup delivery at line 666 has the same missing guard by inspection; only carrot after-hours execution is confirmed. Project donations already have an hours guard. Centralise the intended domain policy and update UI feedback. Keep public hall access, calendar and exiting available.

**Acceptance tests:** Mira both directions observed/off-screen, six-minute work destination changes, weather/festival overrides, save/load during transition; all staffed services immediately before/at/after open/close while remaining inside the public hall. Explicitly decide whether request-board deliveries are self-service rather than inferring it inconsistently across handlers.

## Test execution and evidence navigation

Run from the repository with its existing Node/Python/Chromium setup:

```sh
bash 'Bug Reports/scripts/run-baseline.sh'
node 'Bug Reports/scripts/audit.cjs'
node 'Bug Reports/scripts/extended.cjs'
node 'Bug Reports/scripts/final-checks.cjs'
```

The three custom scripts write JSON/logs/screenshots inside `Bug Reports/evidence`. They are audit runners, not a conventional all-or-nothing test framework: inspect failed rows, and update expected-bug probes to expected-correctness assertions after implementing repairs. The baseline runner propagates underlying failures and logs seven sequential supplied processes against a disposable copy. Existing cloud command sandbox rules may require supported escalation for local sockets/browser launch.

Useful evidence: `audit-results.json` and `extended-results.json` hold exact fixtures/results; `final-checks.json` verifies actual refresh/pointer/keyboard reproductions; `real-input-trace.zip` shows the relevant UI sequence; `bug-*.png` show affected screens. No real player saves or credentials are included. Keep a copy of this original evidence when collecting post-fix runs.

## Release gates and work intentionally deferred

All ten crop lifecycles, twenty recipe completions, twelve crafting blueprints, backpack tiers, project completions, normal save round trips, and exercised keyboard/touch controls worked. Preserve those paths during repairs. Do not expand content while repairing integrity defects.

Short cloud samples measured roughly 56.35–59.34 FPS depending on area, with isolated 33–50ms frames. These are headless cloud measurements, **not an Android 60 FPS result**. Five post-GC batches/500 combined cycles kept one ambience canvas and bounded DOM, with modest heap growth insufficient to diagnose a leak. Do not prioritise a speculative performance rewrite above the confirmed integrity bugs.

Before stable release: rerun the nine failure cases and baseline after fixes; test real Android landscape and OS/tab background/kill behaviour; install/validate Firefox and WebKit where supported; run long natural gameplay across seasons; listen to audio and verify actual mute output; check all accessory/blink/mobile visual combinations. Direct file launch remains a separate unmanaged-browser test. Planned animals, native packaging and export/import were not treated as regressions.

**Recommended order:** cooking/save consistency → exact-stack market accounting → farm lineage and deep schema validation → blocking placement/energy preconditions → merge selection → NPC edge routing/service hours → real-device and long-session release validation. Save-schema work may be batched together to avoid repeated migrations.
