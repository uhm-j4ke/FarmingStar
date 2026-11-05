# FarmingStar — independent QA bug report

**Assessment: Playable with Major Issues.** The game launches and its core loops work, but cooking can lose ingredients across reloads and the market misaccounts item quality. Do not treat the passing supplied regression suites as a release sign-off.

**Build:** 0.4.0, commit `d3af7526950637f243727b90c3c0f6b784ac02f5`. **Test date:** 5 November 2026, Europe/London (GMT). **Scope:** browser game only; no fixes made.

## Executive summary

**9 confirmed defects: 0 P0, 2 P1, 7 P2, 0 P3.** All are still open. Severity expresses impact, not likelihood. The highest priorities are interrupted cooking transactions and market quality accounting. Save replacement/history isolation and malformed-save validation follow. None of the confirmed issues establishes that every player save is corrupt or that the game is unplayable.

The seven supplied regression scripts passed with locked Playwright 1.58.2. The independent scripts executed **83 named checks**, including **9 failing expected-behaviour checks** mapping to the nine defects below. Some additional checks deliberately reproduce a bug and therefore return `PASS` when that reproduction succeeds; their labels must not be interpreted as the game behaving correctly. Detailed counts and gaps are in [QA_TEST_COVERAGE.md](QA_TEST_COVERAGE.md).

Reliable within the exercised scenarios: all ten crop lifecycles; four regrowing crops; all twenty cooking recipes on completion; all twelve crafting blueprints; backpack progression; conservative storage transfers; fishing rewards and cancellation; normal save/load round trips; shipping once-only payouts; project completion; forecast consistency; waypoint cancellation/arrival; keyboard and touch movement. No unexplained page errors occurred in the final three independent runs. An intentionally malformed save produces a caught TypeError, documented separately.

Major remaining uncertainties: real Android/iPad behaviour, other browser engines, long sessions and device storage lifecycle. Firefox/WebKit launch attempts were blocked by absent browser binaries. Short cloud performance measurements are not Android benchmarks. See the coverage report before expanding claims.

## Reproduction environment and evidence

- Linux kernel 6.18.57; system Chromium **155.0.8059.79**; Node **24.22.1**; Playwright **1.58.2** for the independent scripts and final baseline.
- Logic/reproduction viewport: 1366×768 CSS pixels, DPR 1. Additional desktop, mobile and tablet configurations are recorded in `evidence/extended-results.json`.
- Fresh, nonpersistent Playwright contexts; disposable localStorage. No real player profile was opened. Storage keys are `farmingstar.moss-ember.slot.1`–`.3`, their `.history` and `.before-restore` keys, plus preferences/legacy keys.
- `scripts/audit.cjs` and the logic portion of `scripts/extended.cjs` queue RAF callbacks to permit controlled stepping. Existing `window.FarmingStar` hooks construct fixtures. `scripts/final-checks.cjs` uses the normal frame loop and actual Playwright clicks, keyboard input and page reloads for key reproductions.
- `evidence/audit-trace.zip` and `evidence/real-input-trace.zip` preserve interaction traces. JSON files preserve exact values, exceptions and test IDs. Screenshot links below supplement state evidence; no pixel image alone is used to prove a transaction defect.
- Source hash, unchanged before/after: `194f34c1e24c0e42d40366b0f8f5bdea6004c67ac7d201995a605003d118e907` for `index.html`. The baseline uses a byte-identical disposable copy. Original tracked source, tests, lockfile and manifests remain unchanged.

## P1 — high severity

### QA-001 — Reloading during cooking permanently loses reserved ingredients

**System:** cooking, persistence. **Frequency:** 3/3 actual page reloads; also repeated in controlled round trips. **Environment:** Chromium desktop above. **Impact:** paid/harvested ingredients disappear without a result after refresh, tab termination or another event that saves an unfinished cook. Only refresh was physically executed; OS termination is a consequence of the demonstrated persistence design, not an executed test.

**Starting conditions:** disposable farm, home area, beside cutting board at `(5,4)`; player `(5,5)` in tiles; one potato in the bag. No chopped potatoes.

**Steps:**

1. Start preparing Chopped potatoes using the cutting board (`beginCook('chopped')` is the equivalent hook).
2. Confirm the cooking activity is open and the potato has been debited.
3. Reload the page before completing its three timing actions.
4. Click Continue your farm; inspect bag totals and activity state.

**Expected:** resume the pending cook, refund the reserved potato, or restore the last consistent state. One ingredient must not disappear without a completed output.

**Actual:** `potato: 0`, `chopped: 0`, `activity: null` on all three reloads. The lost reservation is absent from the save. No exception or recovery warning appears.

**Confirmed cause:** [index.html:335](../index.html#L335) consumes via `transact(needs)` before creating runtime-only `miniGame`. [index.html:238](../index.html#L238) serializes `g`, not `miniGame`. The pagehide handler at line 681 force-saves that debited state, and `start` at line 319 clears `miniGame`. The prevention of autosave-history writes during activities does not protect ordinary saves or pagehide.

**Evidence:** `audit-results.json` → `SAVE-04`; `extended-results.json` → `REPRO-01`; `final-checks.json` → `REAL-RELOAD`; [pending activity screenshot](evidence/bug-cooking-pending.png); `real-input-trace.zip`.

**Recommended correction:** make cooking reservations durable, with an explicit transaction identifier/status and exactly-once completion or rollback. Alternatively commit ingredients and output atomically only at successful completion, while preventing reuse of reserved inputs. Handle existing interrupted state and storage-write failure deliberately. Simply disabling history/autosave does not address refresh.

**Regression acceptance:** refresh before action 1, after actions 1 and 2, and immediately after action 3; background/foreground; quota failure; each quality grade; full bag; save/load repeatedly. Total ingredient/result quantities must remain consistent and rewards must occur once.

### QA-002 — Market pays for the first stack's quality but removes a different stack

**System:** economy, quality inventory. **Frequency:** 3/3 controlled two-sale sequences; expected-behaviour check also fails. **Environment:** Chromium desktop; deterministic customer RNG only, with normal market update/stock code. **Impact:** incorrect currency and exploitable overpayment whenever higher-grade stock precedes lower-grade stock of the same item.

**Starting conditions:** open stall, fair pricing, autumn day 29 at 10:00. Market contains one Excellent carrot followed by one Standard carrot. These are valid stacks attainable by stocking the higher-grade carrot first.

**Steps:**

1. Stock an Excellent carrot, then a Standard carrot.
2. Trigger a customer sale during 09:00–18:00. The repro fixes `Math.random` to zero to ensure the customer arrives and chooses carrots.
3. Inspect earnings and remaining stack quality.
4. Advance to the next 12-minute market interval and trigger the second sale.

**Expected:** Excellent carrot pays `ceil(23×1.1)=26c` and is removed; Standard carrot subsequently pays `ceil(16×1.1)=18c`. Total **44c**.

**Actual:** first payout **26c**, but Standard carrot is removed and Excellent remains. Second payout **26c**, total **52c**. Eight coins are created above the two items' expected combined market value. No error appears.

**Confirmed cause:** [index.html:688](../index.html#L688) chooses `.find(v => v?.id === id)` to calculate price, then decrements `g.stock[id]`. That quantity proxy uses [removeFromSlots at line 81](../index.html#L81), which removes the **lowest quality first**. Price selection and removal do not reference the same stack.

**Evidence:** `audit-results.json` → `ECO-02`; `extended-results.json` → `REPRO-02`, including both sale values and intermediate stacks. Normal container transfer checks preserve quality; this failure is specifically the market sale path.

**Recommended correction:** select one concrete canonical market stack and atomically price/decrement that exact stack. Reuse this explicit-stack operation for any other grade-sensitive sale. Do not use an aggregate quantity setter for grade-specific accounting.

**Regression acceptance:** Standard→Excellent and Excellent→Standard orders; multiple stacks and grades; budget/fair/premium prices; demand bonuses; save/reload between sales. Sum payouts against the actual consumed stacks.

## P2 — medium severity

### QA-003 — Replacing a farm retains the previous farm's autosave history and undo copy

**System:** save slots, farm identity. **Frequency:** 3/3 controlled replacements plus actual named-farm UI reproduction. **Environment:** Chromium desktop. **Impact:** a freshly created farm exposes restore points belonging to the farm the user explicitly replaced; selecting one replaces new progress with the old farmer. This requires an explicit restore action and is not spontaneous corruption.

**Starting conditions:** slot 1 has Old farm QA and at least one history point. An existing `.before-restore` copy additionally demonstrates the undo variant.

**Steps:** Load Game → new/replacement selection for slot 1 → confirm replacement → name the farmer New farm QA → Make this place home. Open that slot's Autosave History. Restore the remaining point and confirm.

**Expected:** replacement begins a new farm lineage with no prior farm history or undo copy. Other slots stay untouched.

**Actual:** `historyNames: ['Old farm QA']` remains; restoring changes the new farmer back to Old farm QA. The controlled undo-copy fixture also remains Old farmer. There is no error because the old data is otherwise structurally valid.

**Confirmed cause:** [index.html:636](../index.html#L636) replaces in-memory defaults, and line 654 starts the new farm, but neither resets the slot's companion keys. The delete path at line 635 explicitly removes those keys; replacement does not. History is keyed by slot number rather than a checked farm identity.

**Evidence:** `audit-results.json` → `SAVE-07`; `extended-results.json` → `SAVE-08`; `final-checks.json` → `REAL-REPLACE`; [history screenshot](evidence/bug-replacement-history.png); real-input trace.

**Recommended correction:** after replacement is confirmed and durably committed, clear or namespace all old history/undo data. Add a persistent farm ID to primary saves and restore points and refuse cross-lineage restores. Preserve old data if the replacement write fails; do not blindly delete it before successful commit.

**Regression acceptance:** replace each occupied slot with/without history and undo data; simulate storage failure; preserve unrelated slots; restoring a new farm's own history must continue to work.

### QA-004 — Save validator accepts null nested collections, then harvesting throws after crediting the crop

**System:** corruption recovery, persistence validation. **Frequency:** 3/3 crafted malformed saves plus independent failing case. **Environment:** Chromium desktop. **Prerequisite:** damaged or externally modified save; no evidence that ordinary game saves generate this value.

**Steps:** serialize a valid schema-4 disposable save; set `collections.crops` to `null`; run `validateSave` and load the accepted result; set up or grow a mature carrot; use a tool to harvest.

**Expected:** reject the malformed save without changing its stored bytes, or normalize its nested collection to an empty dictionary before gameplay.

**Actual:** validation accepts the save. Harvest throws `TypeError: Cannot read properties of null (reading 'carrot')`. The carrot has already been added to the bag, but the plot remains mature because the exception interrupts clearing/regrowth. This proves a partial transaction. Repeated in-frame exploits were not counted as a separate bug.

**Confirmed cause:** [index.html:222](../index.html#L222) shallow-merges `collections` with defaults without validating each nested dictionary. [index.html:434](../index.html#L434) transacts the crop gain before indexing `g.collections.crops`. Validation of `containerSlots` does not cover this field.

**Evidence:** `audit-results.json` → `SAVE-05` includes stack; `extended-results.json` → `SAVE-11` records accepted state, error, credited carrot and unchanged crop.

**Recommended correction:** deep shape validation/normalization for every nested state consumed at runtime, including collection buckets. Validate into a detached candidate before mutating the live state. Reject unsupported structural values and preserve damaged primary bytes for recovery. Consider transaction ordering so metadata failure cannot grant a duplicate harvest.

**Regression acceptance:** null/string/array values for each collection bucket and adjacent progression dictionaries; malformed history as well as primary saves; no crash, silent overwrite or partial reward.

### QA-005 — Merging onto an equipped stack changes equipment to an empty slot

**System:** backpack/hotbar. **Frequency:** 3/3 controlled repeats plus actual bag clicks. **Environment:** Chromium desktop; applicable to touch swap UI through the same `moveBag` path.

**Steps:** put 3 carrot seeds in slot 1 and 4 same-grade carrot seeds in slot 2. Equip slot 2. Open Bag; click slot 1 then slot 2 to merge. Close Bag.

**Expected:** slot 2 holds 7 seeds and remains equipped.

**Actual:** quantities correctly merge into slot 2, but `equippedSlot` becomes `0`, which is empty; `selected` becomes `'hand'`. No items are duplicated or lost. The user must re-equip the seeds.

**Confirmed cause:** [index.html:328](../index.html#L328) applies swap-style equipped-index remapping to both swaps and merges. When the equipped destination stack survives the merge it should remain selected, not move to the depleted source index.

**Evidence:** `audit-results.json` → `INV-05`; `extended-results.json` → `REPRO-03`; `final-checks.json` → `REAL-MERGE`; [post-merge screenshot](evidence/bug-merge-selection.png).

**Recommended correction:** distinguish merge and swap outcomes and update the equipped reference to the surviving canonical stack. Test both source and target being equipped, full and partial merges, and source depletion.

### QA-006 — Mira's visible schedule cannot transition from town into forest

**System:** NPC schedule/navigation. **Frequency:** one deterministic 1,200-tick visible simulation (120 simulated seconds) with off-screen comparison. **Environment:** Chromium desktop, sunny 06:00; controlled NPC position near the actual forest route.

**Steps:** at 06:00 remain in town, with Mira in town near `(54,2)`. Step `updateNPC(0.1)` 1,200 times while holding time at 06:00 to isolate routing. Inspect plan and runtime. Change the player area to farm and update once.

**Expected:** Mira follows the town's northern exit into forest and reaches her fishing destination `(22,17)`, with consistent visible/off-screen behaviour.

**Actual:** plan is forest/fishing, but visible runtime stays town `(54,2)`, stationary with an empty path and goal. As soon as the player area becomes farm, off-screen simulation resolves Mira directly to forest `(22,17)`. No exception appears.

**Confirmed cause:** [index.html:498](../index.html#L498) resolves every town departure by finding a building whose `to` equals the target area. Forest is a map-edge connection, not a town building; missing `b` takes `continue`. `npcEntrance` at line 494 likewise lacks a town/forest edge-specific mapping. The off-screen branch bypasses this path.

**Evidence:** `extended-results.json` → `NPC-03` contains the plan, visible state and off-screen state. This is not a claim that all work routes fail; grocery visible-route and other schedule samples passed.

**Recommended correction:** use a shared area-transition graph for player/NPC edges and building doors. Resolve town↔forest gates explicitly, with collision-valid entrances and no visible teleport. Reevaluate routes on map/goal changes.

**Regression acceptance:** both directions with actor observed on either side; day/weather transitions; save/load mid-route; no duplicate instances or skipped area transitions.

### QA-007 — Attempts made with zero energy still advance obstacle damage

**System:** gathering/tools, optional energy. **Frequency:** one controlled 10-attempt exhaustion sequence; deterministic code path. **Environment:** Chromium desktop, Basic axe, optional energy enabled.

**Steps:** set energy to zero; face the farm tree `(20,14)` from `(19,14)`. Use the axe ten times. Give the farmer only 2 energy, then use the axe once more.

**Expected:** failed zero-energy actions leave hit progress unchanged; a Basic tree requires three paid hits.

**Actual:** `hits['20,14']` is 10 after the failed attempts. One subsequently paid hit clears the tree and grants 3 wood while consuming only 2 energy. No exception appears; low-energy feedback is shown even while hidden hit progress advances.

**Confirmed cause:** [index.html:432](../index.html#L432) increments `g.hits[key]` **before** `consumeEnergy(2)` rejects the operation. The problem applies to the shared original tree/rock hit path; forest quarry `gather` uses a different path.

**Evidence:** `extended-results.json` → `FARM-07` records failed hits, resulting wood and energy.

**Recommended correction:** validate energy before mutating damage, and coordinate reward/capacity/energy checks so rejected actions have a defined, consistent effect. Add exhausted axe and pickaxe regressions at all tool tiers.

### QA-008 — Hall delivery services operate after their published closing hour

**System:** shop hours/community transactions. **Frequency:** one controlled UI-handler reproduction at exactly 22:00. **Environment:** Chromium desktop. The hall is intentionally publicly accessible, so public entry itself is not a defect.

**Steps:** be inside the public hall at 22:00 with one carrot and welcome basket unfinished. Open the community board and select Deliver one carrot. The repro opens the normal board through the dialogue UI action; the board's delivery handler is the same as its interior interaction.

**Expected:** staffed delivery refuses or clearly differentiates an intentionally available after-hours self-service mechanic. The stated hall staffed hours are 08:00–22:00, and project donations already enforce them.

**Actual:** `shopOpen('hall')` is false, but the carrot is removed, welcome basket completes, and currency rises by **35c**: 25c basket reward plus the once-only 10c journal reward. No closed-service feedback appears.

**Confirmed cause:** [index.html:649](../index.html#L649) checks only completion/item count. The soup delivery handler at line 666 also lacks an hours guard (statically identified related path, **not separately executed after hours**). `donateProject` at line 129 does check the clock. UI and domain operations have inconsistent service policies.

**Evidence:** `extended-results.json` → `COMM-05` records false hall-open state, zero remaining carrot and 35c delta. The 30 business boundary checks pass; this bug is in enforcement by the transaction, not `shopOpen` itself.

**Recommended correction:** decide/document which public-hall interactions are self-service, then enforce staffed requirements in the shared delivery domain entry points. Keep public access and safe exiting available.

**Regression acceptance:** carrot, soup, requests and projects at 07:59/08:00/21:59/22:00; public building access stays available; only intended staffed operations stop.

### QA-009 — Valid furniture placement can embed the player in a solid table

**System:** building placement, player collision. **Frequency:** one hook placement and one separate actual Confirm-button reproduction with keyboard verification. **Environment:** Chromium desktop, farmhouse.

**Steps:** own a dining table; stand at home tile `(10,9)` (`x=252,y=228`). Begin table placement and choose `(10,9)` as the upper-left preview. Press Confirm. Attempt W/A/S/D movement.

**Expected:** reject the overlapping footprint or safely relocate the farmer before committing. Reachable furnishings and room exit are necessary but do not alone establish valid player placement.

**Actual:** placement reports success, `walkable(g.x,g.y)` is false, and all four attempted movement directions leave position `[252,228]` unchanged. The farmer's body clips into the table. This is recoverable through Build Mode → store/move table; no permanent progression deadlock was established.

**Confirmed cause:** [index.html:171](../index.html#L171) checks fixtures, reserved floor and global home reachability, but not overlap with the current player's collision footprint. [index.html:161](../index.html#L161) commits without calling a safe-position resolution. Tiny movement steps then remain within blocked geometry.

**Evidence:** `extended-results.json` → `BUILD-02`; `final-checks.json` → `REAL-BUILD` records unchanged position after keyboard input; [clipping screenshot](evidence/bug-player-in-table.png); real-input trace.

**Recommended correction:** reject any newly blocking footprint intersecting the player's collision shape, or atomically relocate to a nearby reachable tile before commitment. Apply equivalent protection to moving furniture and station placement. Do not rely on reload to repair the location.

**Regression acceptance:** player under every portion of multi-tile/rotated furnishings; preview then walk into footprint; moved furniture; machine placement; door access and chest contents survive rejection/relocation.

## Observations not promoted to confirmed defects

- Save validation accepts finite out-of-range time values such as -1 and 100000 (`SAVE-10`). This is a hardening concern; normal gameplay production of these values was not demonstrated.
- Some viewport measurements show `scrollWidth > innerWidth`, while the modal remains within the viewport and gameplay touch controls function. World backing-canvas rounding and overflow-hidden behaviour need a targeted accessibility/scrolling investigation before claiming a clipping defect.
- Short post-GC heap samples grow modestly; bounded DOM and one recycled ambience canvas were observed. This is not enough to prove a leak.
- No shifting-eye defect was observed in the captured four-direction/eight-phase sprite sheet. This does not clear every hairstyle, accessory, blink time or physical-device rendering configuration.
- Planned animal farming, APK/IPA packaging and save export/import are not implemented in this build and are not counted as regressions.

## Release disposition

**Playable with Major Issues.** Repair QA-001 and QA-002 before a stability release, then save isolation/validation, player overlap and other P2 issues. Rerun the supplied suites **and the independent failing cases**. Require real Android landscape play, storage/background interruption testing and cross-engine checks before upgrading this assessment. No release or source change was made during this audit.
