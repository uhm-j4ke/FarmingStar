# Stability repair ledger

Baseline: `d3af752`. Original reports above are unchanged. The combined TXT repeats the three Markdown reports verbatim; referenced independent scripts, traces and images were not included in the attachment. New regressions reconstruct the documented fixtures and direct-input reproduction steps. No unrelated features were implemented. All nine supplied defects reproduced before repairs; each original reproduction now passes. The running table was updated after each relevant group passed.

| Issue | Priority | Status | Verification |
|---|---|---|---|
| QA-001 cooking reload loss | P1 | Fixed | Original real reload + 108 station/grade/interruption combinations, quota rollback and repeat completion |
| QA-002 market stack accounting | P1 | Fixed | Original 44c pair + all grade orders, price presets, seasonal demand and reloads |
| QA-003 replacement history lineage | P2 | Fixed | Named UI replacement; 54 slot/history/failure cases; own and legacy history/undo, unrelated slots, raw-byte checks |
| QA-004 malformed nested saves | P2 | Fixed | Null collection and nested shape matrix; detached/live state and invalid history/undo preservation, including backup quota failure |
| QA-005 equipped merge selection | P2 | Fixed | Original UI clicks + full/partial merges, all grades/equipped ends and actual drag |
| QA-006 visible forest NPC routing | P2 | Fixed | Original 1200-tick case; observed gates/doors both ways, collision/speed checks, work/weather/festival changes, mid-route reload and actual player crossings |
| QA-007 exhausted obstacle damage | P2 | Fixed | Original exhausted swings; axe/pick at all tiers; insufficient energy, full bag, paid thresholds, quarry and optional-energy checks |
| QA-008 closed hall delivery | P2 | Fixed | Original 22:00 hand-in; carrot/soup/request/project at 07:59, 08:00, 21:59, 22:00; public entry, exit and board controls |
| QA-009 player-overlapping placement | P2 | Fixed | Original Confirm path; rotated footprints, collision edges, movement after preview, chest UID/content preservation and bought station |

## Newly discovered issues

**QA-010 · P2 · Fixed:** legacy achievement replay. A schema-1 save with 321 coins and historical harvest evidence loaded as 326 coins in the original build. `ensureProgress` awarded a newly introduced milestone for that past event. Legacy migration now recognises evidenced milestones without granting historical coins. Schema 1–3 and repeated reload checks pass; genuine schema-4 milestones still pay exactly once. See `verification/baseline-migration.json` and `verification/migration-fix.json`.

Other observations: A suspected HUD/activity issue was checked with real pointer input: the modal already intercepts it, so it is not promoted to a gameplay defect. A defensive dispatch guard is included in the cooking transaction work; synthetic stale-click testing verifies it.

## Outstanding validation

Physical Android/iPad storage and lifecycle, Firefox/WebKit, direct file launch outside managed Chromium, sustained natural play and subjective audio remain unverified. No hardware performance or stable-release certification is claimed.

## Unresolved defects and recovery limits

No confirmed report defect remains unresolved in the exercised reproductions. Previously lost cooking inputs cannot be reconstructed from old saves that never recorded a reservation. Past market overpayments are not deducted without an authoritative sale log. Invalid saves are preserved, not guessed into a new inventory.

The final combined result and exact HTML SHA-256 are in `verification/final.json`. Intermediate group JSON files document checks at each repair stage; their source commit names identify the baseline, and final-file hashes identify the tested uncommitted artifact. Original independent 83-case scripts were not attached and are not claimed as rerun.

## Final verification

`npm test -- --record=final` completed successfully: all eight suite processes passed; the new stability suite recorded 29 named PASS rows and zero FAIL rows. Original supplied tests were not changed. The checked-in HTML SHA-256 matches `verification/final.json`: `3bc34d2eb41e24fd71e4ce81d26a1330cbcca3713d35191f08bc2f9b1ef4cd7b`.

`verification/fixture-correction.json` documents a test-construction failure in an earlier run, explained in `verification/fixture-correction.txt`; it is not an unresolved game defect. The final run uses the corrected fixture and passes. Baseline FAIL rows remain as before-fix evidence, not product-success claims.
