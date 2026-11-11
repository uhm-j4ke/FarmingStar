# Repairs for the 11 November 2026 independent HTML audit

The four P2 findings in [the original report](QA_REPORT_2026-11-11_HTML_cf8ad944.md) are repaired in the current browser `index.html`. The audited HTML hash is `cf8ad944…`; its exact bytes were recovered from commit `3d3b933` and verified before reproduction. Repairs were applied to `92fbc2c`, retaining the subsequent requested larger hotbar icons. The older game on `main` was not used as the repair target.

## HTML-001 — Resource renewal and actor collision

**Before:** at a three-day resource epoch boundary, a quarry/mine node became solid beneath the farmer. Tiny movement steps remained collision-invalid and the farmer could not walk away.

**Fix:** natural day rollover reconciles the farmer's full movement footprint against the updated collision world before saving. If occupied space has become solid, a bounded nearest-tile search finds an actually walkable point. The same safe-position search handles interiors and saved invalid positions; it no longer assumes a fixed interior fallback is clear. Resource history, regenerated nodes, inventory, energy and XP are not used to pay for or grant this recovery.

**Verified:** exact forest `(32,25)` and mine `(3,3)` scenarios; days 3→4 and 30→31 plus nonrenewal 31→32; normal, full-bag and zero-energy states; overlap at the edge of the collision footprint; load/reload; menu pause/close near midnight; fresh-epoch reward once; ordinary game loop and real CDP touch movement in both areas. No resource is removed or granted by relocation.

## HTML-003 — Coop entrances and placement

**Before:** a basic coop at `(9,56)` passed the editor's footprint check but its night target was south of the permitted walking region.

**Fix:** shared entrance/approach geometry and hen-clearance paths now participate in placement, movement, rotation, upgrade and adoption checks. New housing must have a clear front approach connected to the pen's entry; candidate furnishings cannot cut off accessible occupied housing. Failed editor changes and upgrades retain their normal transaction behavior. Existing invalid housing remains readable: a clear side/rear service approach permits runtime recovery without moving the coop or discarding its hens/nest eggs. Adoption requires reachable housing and a valid connected spawn.

**Verified:** the original editor placement rejects three times without spending ownership; 72 basic/large × rotation/boundary combinations; accepted housing permits adoption and night entry; eight rotated legacy boundary saves and the original south-edge layout recover while preserving IDs and eggs. Invalid occupied moves/upgrades and sealed adoption preserve coins, supplies and assignments. Existing furnishing/care write-failure and identity regressions pass.

## HTML-002 — Hen detours and stuck recovery

**Before:** separate X/Y attempts toward a direct goal stalled against a fence despite an open path around it.

**Fix:** hens follow clearance-aware waypoints on a bounded half-tile pen grid, joined to continuous start/goal positions only by collision-checked segments. The grid has at most 1,075 vertices. Transient routes are cached outside saves, invalidated by layout/goal changes and retried after a short stuck/wait interval. Movement checks each traversed segment; unreachable routes wait instead of clipping through walls. Food/water movement uses clear fixture approaches as well. Egg production, care and authoritative clock rules are unchanged.

**Verified:** the exact committed fence `(15,50)`, L-shaped fences and feeder/bowl obstacles, each repeated three times with three hens from different starting points. Every step retains clearance. Tests also cover a completely sealed legacy route, opening its gap, occupied coop movement, returning from another area, night save/reload and dawn exit. Identity, nest eggs and coins remain conserved. Normal care, illness/recovery, egg collection and egg-to-cake/request/shipping regressions pass.

## HTML-004 — Arcade native Back

**Before:** `FarmingStarLifecycle.back()` hit the generic protected-activity guard and left every arcade game active.

**Fix:** arcade Back dispatches to the existing `exitArcade()` before cooking/rest protection. Other activity guards remain intact.

**Verified:** maze, memory and rhythm before/after actual game completion through native callback, Escape, controller Cancel and touch Exit: 24 combinations. Repeated Back cannot duplicate scores/rewards or change inventory. A real reserved cooking preparation, its saved bytes and the sleep transition remain protected and can complete normally. This validates the HTML integration callback; physical Android system Back and an updated APK are not claimed.

## Reproduce the repaired checks

With the existing pinned development dependencies and Chromium:

```sh
node tests/qa-resource-renewal.cjs
node tests/qa-housing.cjs
node tests/qa-hen-routing.cjs
node tests/qa-arcade-back.cjs
npm test
node tests/animals.cjs
node tests/furnishing.cjs
node tests/chicken-loop.cjs
node tests/activities.cjs
node tests/controller.cjs
node tests/portable.cjs
node tests/developer-tools.cjs
node tests/production-html.cjs
```

Tests use disposable browser origins; no real player saves are edited. The original report's harness intentionally expects bugs and is not a fixed-build acceptance test. Its unmodified original outcomes are in [baseline evidence](verification/2026-11-11/baseline-reproductions.json). Passing repair and group-regression logs are in [the verification folder](verification/2026-11-11); the [machine-readable record](verification/2026-11-11/verification.json) names the exact delivered HTML hash.

All eight established browser suites passed, including prior independent save-corruption, cooking-reservation, market-quality, lineage, actor-route, energy and placement reproductions. Old tabbed-editor/portrait/legend/resident/test-hook fixture adaptations were already present on this branch; no assertion was removed to conceal a reported defect.

**Save compatibility:** schema remains 5; supported older schemas still migrate. No persisted path format, economy rebalance, deleted animals/furniture/eggs or new dependency is introduced.

**Fixed / unresolved:** all four reported defects are fixed with passing original-reproduction acceptance checks. No newly confirmed unrelated issue remains. Finite Chromium coverage does not certify all future farms, other engines, physical controllers/phones, audible output or long natural play.

**Platform status:** browser source only. Existing APK, EXE/DMG, beta downloads, package versions, `main` game and releases are unchanged. Native packaging/publication remains on hold until the user requests it.
