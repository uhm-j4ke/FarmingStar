# FarmingStar — Complete Independent QA Report

**Test date:** 11 November 2026 (UTC)<br>
**Target:** user-supplied `index (2).html`<br>
**Assessment:** **Playable with Minor Issues**<br>
**Confirmed defects:** **4** — P0: 0 · P1: 0 · P2: 4 · P3: 0

This is one complete report containing the findings, coverage, evidence, reproduction code, and developer handoff. No companion download is required. The supplied game and repository application code were left unchanged.

> **Build identity matters:** this audit tests the uploaded HTML, not the older `index.html` on repository `main`. Apply and verify fixes against the uploaded build identified below. Earlier reports in this folder concern other builds; their bug counts must not be added to this report's count.

## 1. Executive assessment

The tested core game works: crop production, cooking, crafting, fishing, inventory transactions, purchases, saves, recovery, and migration completed their checks. No startup failure, crash, confirmed inventory duplication, save corruption, or permanent progression deadlock was observed in the executed scenarios.

Four reproducible defects remain:

| ID | Severity | Defect | Practical impact | Reproduction |
| --- | --- | --- | --- | --- |
| HTML-001 | P2 / Medium | Midnight resource renewal regenerates solid nodes underneath the farmer | Movement stops in forest quarry and mine until the node is mined again | 3/3 per area, plus normal-frame-loop touch reproduction in mine |
| HTML-002 | P2 / Medium | Hens cannot route around a valid fence despite an open detour | A hen remains in its entering-coop state instead of reaching shelter | 3/3; removing fence restores movement |
| HTML-003 | P2 / Medium | Accepted south-edge coop placement gives hens an unreachable sleeping entrance | A legally placed coop cannot be entered at night | 3/3; moving coop north restores entry |
| HTML-004 | P2 / Medium | Native Back callback refuses to exit all three arcade games | Back is consumed and shows a cooking-style activity warning; on-screen Exit still works | 1/1 per game, 3/3 game types |

HTML-001 deserves the first repair because it interrupts direct player movement. HTML-002 and HTML-003 affect the new animal system through different causes and need separate regression checks. HTML-004 has a small, local dispatch fix. Their observed workarounds and limited scope support P2; none was demonstrated to cause irreversible progress loss. Severity is separate from the deterministic reproduction frequency.

The overall assessment is **Playable with Minor Issues**, not a release certification. Real Android hardware/WebView integration, other browser engines, audible sound quality, and extended real-time play still need validation. These coverage limits are not game bugs.

## 2. Build identity, environment, and method

| Item | Recorded value |
| --- | --- |
| Uploaded filename | `index (2).html` |
| Size | 523,834 bytes; 1,615 source lines |
| SHA-256 | `cf8ad944e857ea60ed85a967be4e717d9dda92280fdc7d2229e2cec925b28f9e` |
| Internal portable app version | `1.0.0` |
| Save schema | `5` |
| Page/game identity | FarmingStar · Moss & Ember |
| Repository used for publication and historical regression scripts | `uhm-j4ke/FarmingStar` |
| Repository baseline inspected | `d164f84ba1eeb6c3e2e123e6a97e9864c13ed48f` |
| Browser | Headless Chromium `155.0.8059.79` |
| Automation | Playwright `1.58.2`; Node.js `v24.22.1` |
| Host | Linux cloud environment; kernel `6.18.57` |
| Serving | Local HTTP server, serving a byte-identical copy of the uploaded HTML |
| Default desktop test viewport | 1366×768 CSS pixels; selected historical/UI checks at 1280×800 |
| Additional viewports | 1920×1080, 915×412, 740×360, 1024×768, 1366×1024, 390×844 |
| Touch emulation | `hasTouch`/mobile contexts; DPR 2.625, 2, or 3 depending on viewport |
| Storage isolation | Disposable browser contexts and disposable localStorage saves |

### Diagnostic changes and their limits

No HTML, CSS, JavaScript, application dependency, or repository test file was changed. Scratch scripts and test output were kept outside the publication checkout. Upload bytes and tested-copy bytes were compared and their hashes matched.

The build already supports `window.__FARMINGSTAR_TEST__ = true` before initialisation. Playwright `addInitScript` enabled that existing hook so tests could inspect `FarmingStar`, prepare inventory/time/position fixtures, run transactions, and inspect resulting state. This exposes diagnostics at runtime; it does not patch source bytes.

Most deterministic system probes queued `requestAnimationFrame` and stepped the existing update functions explicitly. This prevents an uncontrolled frame from changing a carefully prepared fixture midway through an assertion. Such probes prove the exercised state transitions; they are not hours of natural uninterrupted play. Separate checks used the ordinary animation loop, actual keyboard events, browser-generated CDP touch input, actual modal buttons, screenshots, and reloads. HTML-001 was reproduced again with the normal animation loop and an actual touch joystick attempt.

Synthetic gamepad tests replaced the disposable page's `navigator.getGamepads` result. Storage-failure tests temporarily replaced `Storage.prototype.setItem` and restored it afterwards. These controlled faults test rollback paths; no genuine player save was used. Hen probes advanced `playtime` and `updateChickens(0.05)` while holding the night clock at 21:00 to isolate routing. Positions and starting inventory were fixtures, not claims that a person naturally played to those states.

Initial title/gameplay screens, responsive views, inventories, editor layouts, directional sprite phases, and selected failure states were captured during the audit. Decisive state/log evidence and a rerunnable reproducer are embedded below so this report can be shared by itself.

### Execution results and counting rules

There are **120 named audit checks: 116 PASS and 4 FAIL**. The four failing assertions map to **three underlying defects**: two resource-renewal assertions share HTML-001; the other two are HTML-002 and HTML-003. A separate focused callback probe established HTML-004. Do not count forest and mine renewal as separate bugs.

| Audit group | Named checks | PASS | FAIL |
| --- | ---: | ---: | ---: |
| Core systems | 43 | 43 | 0 |
| Extended systems, regressions, viewports, and movement | 33 | 33 | 0 |
| New animals, editor, mine, arcade, developer mode, controller | 29 | 27 | 2 |
| Boundary, migration, storage, controller, and touch-editor cases | 13 | 11 | 2 |
| Current appearance and atlas UI confirmation | 2 | 2 | 0 |
| **Total** | **120** | **116** | **4** |

Five additional focused verification groups all reproduced their expected failure/recovery observations: shared renewal, hen detour, hen entrance, arcade Back, and normal-loop touch renewal. These are **successful reproductions of bugs**, not five additional clean-gameplay passes. The portable inline reproduction script was also executed successfully against the unchanged HTML.

Four historical repository suites completed: `immersion`, `stability`, `compatibility`, and `bedtime`. Their overlapping assertions are not added to the 120-check total. Other older suites stopped at outdated assumptions, detailed in Section 7. A PASS means the recorded case completed; some extended cases deliberately record diagnostic state rather than prove an entire feature exhaustively. The ledger preserves those distinctions.

No unexpected page errors were recorded by the four main custom suites. The core harness observed no external HTTP(S) asset requests beyond the local test origin. That supports the self-contained loading claim in this browser run; it is not a physical-device offline-install test.

## 3. Confirmed defects

### HTML-001 — Resource renewal can regenerate a solid node under the farmer and stop movement

**Severity:** P2 / Medium<br>
**Systems:** world collision, midnight rollover, forest quarry, Copperbell Mine<br>
**Environment:** Chromium desktop and emulated touch; both deterministic update and ordinary animation loop<br>
**Frequency:** forest 3/3; mine 3/3; separate normal-loop touch reproduction 1/1<br>
**Error:** no JavaScript exception; the player remains on a collision-invalid tile.

**Starting conditions**

Use a disposable day-30 save. Day 30→31 changes the three-day gathering epoch. Clear a solid resource node, keep room in the backpack and enough energy if energy consumption is enabled, then stand on the cleared tile. Tested examples are forest quarry tile `(32,25)` and the basic mine deposit at `(3,3)`. Tile centers are `(780,612)` and `(84,84)` world pixels respectively; the tile size is 24 pixels.

**Reproduction**

1. Enter the forest quarry or mine, equip the pickaxe, and mine the example node.
2. Walk onto the now-cleared node tile.
3. Remain there across midnight from absolute day 30 to 31. The deterministic probe set `time = 1439.99` and called `update(0.05)`; the ordinary-frame probe let the running game cross the boundary.
4. Attempt to move in each cardinal direction. In the touch run, hold the joystick to the right.
5. Inspect the node and current player collision validity.

**Expected:** resource renewal preserves a valid player position. A node beneath the farmer should be deferred, or the farmer should be moved safely, or movement should provide a safe way off the occupied cell.

**Actual:** the solid node returns under the farmer. `walkable(g.x,g.y)` becomes false. All four movement attempts leave the position unchanged; real touch movement also leaves it unchanged.

**Embedded evidence**

| Location | Day after rollover | Position before attempted movement | Position after | Walkable |
| --- | ---: | --- | --- | --- |
| Forest `(32,25)`, each of 3 repetitions | 31 | `[780,612]` | `[780,612]` | false |
| Mine `(3,3)`, each of 3 repetitions | 31 | `[84,84]` | `[84,84]` | false |
| Mine, normal-loop touch repeat | 31 | `[84,84]` | `[84,84]` | false |

In the normal-loop touch repeat, tapping the contextual Interact action mined the node underneath the farmer and restored `walkable` to true. This is an observed recovery path, so the evidence does **not** establish a permanent softlock. Recovery with a full backpack or insufficient energy was not established.

**Root cause — confirmed code path**

Uploaded-source line 1045, `gatherKey`, keys collected resources by `Math.floor((g.day-1)/3)`. Lines 1046–1047 use that key to expose and collect resources. Line 1059, `blocked`, treats uncollected quarry cells as solid; mine collision similarly consults its deposits. Line 1107, `nextDay(false)`, advances the epoch at midnight while retaining the current location. There is no occupied-node deferral or safe-position reconciliation on that rollover. Nearby movement checks then reject small steps that still overlap the new solid node.

The forest and mine manifestations share the same epoch/collision transition and are one defect. The earlier resource-renewal trap remains relevant to this upload; the new mine exhibits it as well.

**Workaround:** with the pickaxe equipped and sufficient capacity/resources, use the contextual gather interaction to clear the node beneath the farmer. Avoid waiting on mined solid-node tiles near renewal midnight.

**Recommended correction:** reconcile dynamic solids with actor occupancy whenever the resource epoch changes. Either defer occupied solid nodes until the farmer moves away, or relocate the farmer to a nearby confirmed walkable point without granting/removing resources. Keep resource renewal and one-time reward accounting intact. Loading a save on an invalid renewed node must also recover safely.

**Acceptance/retest cases**

- Repeat the exact forest and mine scenarios with keyboard and real touch input.
- Test days 3→4, 30→31, and a nonrenewal midnight.
- Test ordinary waiting, menu close near midnight, save/reload, and energy/full-bag boundaries.
- Verify no duplicate resources, free mining rewards, teleport into another obstacle, or loss of gather history.

### HTML-002 — A valid fence stops a hen from reaching its coop despite a clear detour

**Severity:** P2 / Medium<br>
**Systems:** animal movement, obstacle avoidance, night routine<br>
**Environment:** unchanged HTML, controlled night-time update loop<br>
**Frequency:** 3/3; removing the fence recovered entry in all three repetitions<br>
**Error:** no JavaScript exception; the hen remains `behavior: "entering"`.

**Starting conditions**

A basic Oak chicken coop occupies farm tiles beginning at `(9,47)`, with dimensions 3×2. A hen is assigned to it. A fence at `(15,50)` is accepted and committed through the furnishing editor. The farmer is positioned clear of the placement. For deterministic repetition, start the hen at continuous tile coordinates `(20,52)` and set the game clock to 21:00 (`1260` minutes).

**Reproduction**

1. Place the coop and adopt a hen in a disposable farm.
2. Place a fence at `(15,50)` using the editor; leave the space below the fence clear.
3. At night, have the assigned hen approach the coop from the southeast. The fixture sets `(20,52)` to make the approach repeatable.
4. Advance `updateChickens(0.05)` 12,000 times while advancing `playtime` and holding the night clock fixed. This is 600 simulated movement seconds, not 600 real seconds or a natural full-day playthrough.
5. Observe that the hen does not go around the obstruction. Remove only the fence and advance another 1,200 × 0.05-second movement steps.

**Expected:** the hen follows the open detour and reaches the sleeping entrance near `(10,49.8)`.

**Actual:** it walks toward the goal until collision blocks it, then remains outside rather than selecting a detour.

**Embedded evidence, identical outcome across 3 repetitions**

```text
With fence:
  x = 16.22282752501815
  y = 49.80000000000067
  inCoop = false
  behavior = "entering"

After removing only the fence:
  x = 10.177827525018042
  y = 49.80000000000002
  inCoop = true
```

The candidate detour waypoints `(17,52)`, `(17,53)`, `(15,53)`, `(13,53)`, `(12,51)`, and `(11,50)` all returned true from `chickenWalkable`. This is not a test of a completely sealed coop. An unobstructed night-entry control also passed independently.

**Root cause — confirmed code path**

Uploaded-source line 1431, `updateChickens`, calculates a direct vector toward the target, then tries X and Y motion separately if `chickenWalkable` permits them. It does not calculate a route or replan after obstruction. At the observed stopped point, greedy direct motion cannot move around the obstacle even though a route exists. Line 1423 supplies collision checks but no navigation.

**Observed impact:** the hen's movement and sleeping routine are broken in a valid player layout. This audit did not establish lost eggs, animal death, or save corruption as a consequence; do not attach those effects to this bug without evidence.

**Workaround:** remove or reposition the obstructing fence, or relocate the coop to make the direct approach clear.

**Recommended correction:** provide hen-specific waypoint/path navigation using the same clearance rules as `chickenWalkable`, with replanning when furnishings or goals change. Use a stuck timer/fallback for unreachable goals. A generic outdoor route must account for the pen boundary, furniture dimensions, and the hen collision margin rather than assume farmer navigation is interchangeable.

**Acceptance/retest cases**

- The exact fence arrangement, repeated from several valid starts, reaches the coop without moving furnishings.
- L-shaped obstacles, multiple fences, feeders, bowls, and moved coops do not cause permanent greedy-motion stalls.
- A genuinely sealed route is handled without wall clipping or an infinite expensive search.
- Verify multiple hens, save/reload, night/dawn transitions, and out-of-area updates.

### HTML-003 — The editor accepts a coop whose night entrance is outside the hen walking bounds

**Severity:** P2 / Medium<br>
**Systems:** furnishing placement validation, animal housing, night entry<br>
**Environment:** unchanged HTML; actual editor commit followed by controlled animal updates<br>
**Frequency:** 3/3; moving the same coop north recovered entry in all three repetitions<br>
**Error:** no JavaScript exception; the accepted goal is geometrically unreachable.

**Starting conditions**

Use the farm's south animal pen with enough coins and one owned basic coop. Keep the farmer clear. The pen is `{x:7, y:44, w:24, h:15, gateX:16}`. Its permitted hen-center range ends at `y = 57`.

**Reproduction**

1. Open the furnishing editor and select the owned basic coop.
2. Place its top-left corner at `(9,56)`, rotation 0. The editor accepts and commits it.
3. Visit the open animal shop and adopt a hen; adoption succeeds and assigns it to that coop.
4. Return to the farm at 21:00.
5. Advance 12,000 × 0.05-second hen updates, advancing `playtime` and holding the night clock fixed.
6. Move the same coop north to `y = 52`, then run another 1,200 × 0.05-second hen updates as a recovery control.

**Expected:** accepted housing includes a reachable entrance, or the editor/adoption process rejects the invalid housing arrangement with a clear reason.

**Actual:** the footprint is accepted, but the calculated entrance is `(10,58.8)`, outside the allowed walking range. The hen stays at the southern walking limit and cannot enter.

**Embedded evidence, identical outcome across 3 repetitions**

```text
Accepted coop:       x=9, y=56, width=3, height=2
Computed night goal: x=10, y=58.8
Maximum walking Y:   57
Stopped hen:         x=8.796167661251356, y=57
                     inCoop=false, behavior="entering"

Same coop moved north to y=52:
  hen x=9.91943656335148, y=54.94722943961693
  inCoop=true
```

The recovery control changed the coop coordinate directly in the disposable fixture to isolate the geometric cause. Valid occupied-coop movement through the furnishing system was covered separately.

**Root cause — confirmed code path**

Uploaded-source line 685, `placementValid`, checks the furnishing footprint and pen restrictions, but not the derived animal entrance. Line 1423, `chickenWalkable`, rejects a center beyond `animalPen.y + animalPen.h - 2`, which is 57. Line 1431, `updateChickens`, chooses `coop.y + furnitureSize(coop).h + 0.8` for the entrance: 58.8 for this accepted placement. No pathfinder can reach a destination outside the valid space; fixing HTML-002 alone cannot resolve this bug.

**Observed impact:** legally placed and successfully assigned housing fails its night-entry behaviour. Egg loss or health damage specifically caused by this placement was not established.

**Workaround:** place the coop farther north; `y = 52` recovered the tested case.

**Recommended correction:** define a shared coop-entrance helper and validate a reachable, clear approach in placement, moving, rotation, upgrades, and adoption. Consider existing saves containing invalid housing, with a safe migration or runtime recovery policy that preserves ownership, assigned hens, and nest eggs.

**Acceptance/retest cases**

- Reject `(9,56)` or compute a valid entrance that the hen can actually reach.
- Check basic and large coops, all supported rotations, each pen boundary, adjacent furnishings, and an occupied moved coop.
- Verify animal assignment and chest/furniture transaction rollback remain correct if placement is rejected.
- Test older valid saves and currently accepted invalid arrangements without deleting animals.

### HTML-004 — Native Back is consumed without exiting arcade games

**Severity:** P2 / Medium<br>
**Systems:** native lifecycle integration, arcade cancellation, input consistency<br>
**Environment:** HTML's exposed lifecycle callback invoked in Chromium; no physical Android Back key tested<br>
**Frequency:** 1/1 for maze, 1/1 for memory, 1/1 for rhythm<br>
**Error/toast:** `Finish the activity before leaving. Your saved preparation is preserved.`

**Starting conditions**

Enter Firefly Arcade, stand near a cabinet, and start its game. Each of the three games is otherwise playable and its explicit Exit operation works.

**Reproduction**

1. Start Lantern Lanes, Harvest Pairs, or Firefly Rhythm.
2. Invoke the native integration entry point `FarmingStarLifecycle.back()` while the arcade activity is active.
3. Observe the callback return value, current activity, and toast.
4. Use the game's Exit operation as a control.
5. Repeat for the remaining cabinets.

**Expected:** Back exits the arcade safely, consistent with the game's instructions. The journal says “Escape or the back button always exits safely”; the arcade panel says “Escape / Back exits safely” when a controller is inactive.

**Actual:** the callback returns `true` (consumed), leaves the arcade active, and shows a saved-preparation warning that applies to protected cooking/rest activities. Calling `exitArcade()` clears the activity in every case.

**Embedded evidence**

| Arcade kind | Back return | Still in arcade | Explicit exit clears activity |
| --- | --- | --- | --- |
| maze | true | true | true |
| memory | true | true | true |
| rhythm | true | true | true |

**Root cause — confirmed code path**

Uploaded-source line 1411, `nativeBack`, begins with an unconditional `if(miniGame || resting)` guard. An arcade session is also stored in `miniGame`, so the guard returns before any arcade-specific cancellation. Arcade-specific keyboard/controller dispatch already has separate cancellation handling. User-facing promises are at lines 901 and 1443.

**Scope:** this establishes a defect in the HTML callback an Android wrapper can call. It does not prove how any particular APK maps its hardware/system Back button; the uploaded target here is HTML, and no wrapper or device was used.

**Workaround:** use the visible Exit game button. The independent arcade completion/exit cases passed; this defect is specific to the native Back callback.

**Recommended correction:** dispatch arcade cancellation through `exitArcade()` before the durable cooking/resting guard, then retain the existing protection for prepared ingredients and sleep. Avoid removing the entire activity guard.

**Acceptance/retest cases**

- For all three cabinets, native Back exits before and after completion; repeated Back cannot award scores or rewards twice.
- Verify Escape, controller Cancel, and touch Exit remain equivalent.
- Confirm active cooking/reserved ingredients and resting retain their intended protection.
- After the HTML callback is fixed, verify actual Android system Back through the intended wrapper on a physical device.

## 4. Implemented systems and coverage

The following inventory is based on source inspection and executed behaviour. “Implemented” does not mean every possible combination passed; linked findings and limits remain applicable.

| System | Implementation observed | Executed coverage / result |
| --- | --- | --- |
| Entry, game loop, rendering | Single HTML; canvas world; DOM menus; animation/update loop; cached maps and original sprite drawing | Title/new farm/load exercised; frame sampling; sprite phases and representative area screenshots; no core-suite page error |
| Input and movement | Keyboard, pointer, virtual joystick, synthetic standard gamepad, remapping | Four directions and normalised diagonal verified; real touch movement at five sizes; gamepad disconnect/menu release and mapping uniqueness passed; HTML-001 affects dynamic collision |
| Inventory/equipment | Explicit quality-bearing bag slots, hotbar, split/merge/sort, backpack expansions | 100 transfer cycles plus 100 cross-container swaps; quantities/quality conserved; equipped merge and full-bag rejection passed |
| Containers/shipping | Chest UID storage, shipping settlement, cross-container transactions | Stored/moved/retrieved chest preserved UID and contents; shipping paid once; write-failure rollback passed |
| Farming/tools | 10 crop types, seasonal planting, growth, water, fertiliser, regrowth, upgraded tools | All 10 purchase→plant→water→grow→harvest→sell flows; four regrowth types; full-bag harvest; pond banks; gold hoe/can; exhaustion; 50 valid actions passed |
| Cooking | 20 recipes, stations and upgrades, timed activities, reserved ingredients | All recipes exact debit/output; missing ingredients/full-bag protection; reload at pending stages; historical stability suite checked station families and ingredient grades |
| Crafting/progression | 12 blueprints, skills/levels, unlocks/specialisations | Every blueprint consumed materials once; thresholds/level cap and recipe locks passed; not every specialisation combination exhausted |
| Shops/economy | Grocery, smith, estate, fishing hut, hall, animal shop, arcade, seasonal shop; quality sales and market | Dynamic business definitions checked; seed purchase, failed purchase, direct sale, market grade payout, housing/animal payments, and upgrade transactions passed in covered cases |
| Fish | Three rod tiers, location/season/hour eligibility, timed and assisted catch control | 20 assisted catches; an unassisted tracked catch; cancel/miss/land cast rejection; eligibility boundaries passed |
| Clock/weather/seasons | Day rollover, four seasons, forecast cache, weighted weather, rain watering | Clock/menu pause and 20 transitions; 224-day forecast sampling; tomorrow consistency; dry growth/winter wither passed; renewal midnight defect HTML-001 |
| World/navigation | Farm/town/forest, interiors, bridges, landmarks, waypoints, atlas/minimap | 50 transitions and 20 destination walkability checks; current atlas select/set/clear and waypoint null persistence passed; map visual samples inspected |
| Gathering/mine | Forage/quarry renewal, fixed mine deposits, tier gates | One reward per epoch, all mine tool-tier gates passed; occupied renewal fails, HTML-001 |
| Town/NPCs/relationships | Schedules for workers and residents, scene paths, dialogue, gifts, friendship | Schedule samples across three weather types (collision assertions for the original four workers); visible route and scene-edge checks; daily greeting and liked/disliked gifts passed; not every new resident route exhaustively walked |
| Community/festivals | Projects, requests, four seasonal festivals, rewards | Project/request payout once; four festival completions; material prerequisite; staffed hall closing boundary passed |
| Land/home/furnishing | Four purchasable parcels, three home upgrades, owned/placed/shop editor, layouts A/B/C | Ownership and furniture preserved; placement overlap reject, cancellation, write rollback, occupied coop store reject; actual touch placement in A/B/C passed; entrance validation fails HTML-003 |
| Animals | Coop housing/capacity, hen adoption, feed/water, illness/medicine, eggs, movement | Capacity, exact charging, 20 day/save cycles, care, recovery, egg capacity/rollback passed; open-route control passed; detour/edge entrance fail HTML-002/003 |
| Arcade | Generated maze, memory pairs, rhythm beats, high scores, exit | All three completed via their activity controls; completion once and clock pause/resume passed; native Back fails HTML-004 |
| Appearance | Six tabbed sections, preview/randomise/compare/reset, farmhouse mirror, confirmation/cancel | All tabs reachable; randomised creation profile persisted through actual reload; mirror confirmed name persisted; cancel left name unchanged; all style combinations not exhausted |
| Saves/recovery | Three localStorage slots, schema validation/migration, primary/history/undo, four restore points | 20 core round trips; history ring/restore; replacement lineage; malformed data; quota rollback; older schema cases and animal validation passed |
| Developer mode | Separate temporary test farm and developer commands | Invalid code refused; developer changes did not alter normal slot bytes; no production code changes made |
| Audio/settings | Inlined assets/synthesis and settings present in source | Runtime did not throw in sampled sessions; audible correctness, long-term audio resource use, and every audio setting combination not verified |

### Specific throughput and persistence evidence

- **Crops:** carrot, wheat, potato, tomato, lettuce, onion, strawberry, corn, pumpkin, coffee. Tomato, strawberry, corn, and coffee regrowth checked.
- **Cooking:** flour, dough, bread, chopped potato, fries, sauce, soup, jam, roasted ingredients, ground coffee, cup, meal, pizza dough, raw pizza, pizza, cake batter, cake, berry tea, mushroom stew, vegetable tart. Exact input/output transitions were checked through the existing recipe APIs/timing controls, with prepared recipe/station fixtures; this was not a natural full-progression playthrough.
- **Crafting:** fence, gate, path, chest, flower, bench, sign, lamp, shelf, mill machine, plank, fertiliser.
- **Stress:** 100 menu cycles, 100 stack-transfer cycles, an additional 100 cross-container swaps, 50 map transitions, 50 valid tool actions, 20 controlled day transitions, 20 core save/load cycles, 20 assisted fishing catches, and 20 animal day/save cycles. These are loop iterations within named cases, not extra independent case counts.
- **Shop boundary evidence:** 48 opening/closing boundary assertions (8 businesses × 6 times) were executed for grocery, smith, estate, hut, hall, animal shop, arcade, and seasonal shop. Some inherited case titles still say “five” and the result object retains a stale hard-coded `checks:30`; the actual loop enumerated all eight current definitions and asserted six boundaries for each. Do not infer that every menu button in every new catalogue was exercised.
- **NPC evidence:** schedule output included nine NPC entries across Sunny/Rain/Snow samples. The inherited “all four schedules” title refers to the original workers; visible movement and all scene connections were not exhaustively repeated for each added resident.
- **Save safety:** malformed primary/history/reservation fields, storage quota failures, replacement lineage, and rollback were tested in disposable localStorage. Artificial failures are simulated write exceptions, not a physical power-loss test.

## 5. Performance observations

These are approximately three-second ordinary-frame-loop samples in a shared cloud Chromium process. They describe this execution environment; they are not Android performance promises or a device benchmark. No performance bug is filed from these short samples.

| Scene | Weather | Average FPS | p95 frame interval | Longest interval |
| --- | --- | ---: | ---: | ---: |
| Farm | Sunny | 60.00 | 16.7 ms | 16.8 ms |
| Town | Sunny | 58.68 | 16.8 ms | 50.0 ms |
| Grocery | Sunny | 60.00 | 16.7 ms | 16.8 ms |
| Forest | Sunny | 58.67 | 16.8 ms | 50.0 ms |
| Town | Heavy rain | 59.67 | 16.8 ms | 33.4 ms |
| Town, festival day 36 | Sunny | 58.35 | 16.8 ms | 83.3 ms |

The JavaScript heap, sampled after forced garbage collection, changed from **2,917,408** to **4,152,428 bytes** (+1,235,020) across the six measured scenes and an additional 100 journal/travel/save cycles. A single before/after pair includes warm-up/caching and does not establish a leak. There was no repeated long-duration heap slope or allocation attribution, so reporting a memory leak would be unsupported.

## 6. Prior regressions and false-positive controls

The previous cooking-loss, market quality-price mismatch, save-history lineage, malformed save collection, equipped-merge, visible NPC transition, energy-free chopping, closed hall delivery, and furniture-over-player issues were exercised in custom checks and/or the completed historical `stability` suite. Their tested cases passed. The resource-renewal issue is separately confirmed above; it should not be inferred fixed from a passing one-reward-per-epoch check.

Several initial failures were investigated and excluded from the defect count:

- An arcade economy assertion initially included the intended one-time 5-coin arcade journal reward. After preclaiming that reward in the fixture, the arcade's inventory/coin conservation check passed. There is no confirmed duplicate-reward bug from that observation.
- An animal-save fixture initially moved the clock backwards from 21:00 to 08:00 without advancing the date. Replacing that impossible chronology with `nextDay()` produced a valid saved state.
- A mirror fixture initially tried to edit `#name` while the Eyes tab was selected. Selecting Body exposed the field; cancellation and confirmed persistence checks passed.
- Existing appearance tests expected a transparent portrait background and un-tabbed controls. The current preview deliberately paints an opaque checkerboard and hides inactive tabs. A current screenshot showed the farmer inside the preview, and actual tab/edit/confirm/reload checks passed. This audit does not file a portrait clipping bug from the old alpha-only assertion.
- The old map legend assertion expected `[data-legend="estate"]`. The current legend provides navigation instructions, while named locations are in the atlas. The actual atlas Estate selection and waypoint operations were checked with current controls.
- The old schedule test expected every NPC to be working at 10:00. Added resident NPCs can be socialising. That assertion does not by itself establish an incorrect schedule.
- New secondary browser contexts initially lacked the opt-in diagnostic flag. The scratch test adapter was updated to install it for every context; `compatibility` and `bedtime` then completed. This was a harness setup issue, not a game startup defect.

## 7. Blocked, inconclusive, and untested work

| Status | Scope | Meaning |
| --- | --- | --- |
| BLOCKED | Firefox and WebKit runtime comparison | Required browser executables were absent in the environment. Their launch attempts did not test the game. |
| INCONCLUSIVE as complete legacy suites | Historical `smoke`, `update`, `expansion`, `systems` | Each stopped at a changed UI/schedule assumption. Relevant current behaviour was checked separately, but these suites did not complete end to end against this upload. |
| NOT TESTED | Physical Android device, actual WebView/wrapper, real system Back integration | Touch emulation and direct lifecycle callback probes do not substitute for this. |
| NOT TESTED exhaustively | Every character style, every new resident route, seasonal-decoration catalogue, every skill/specialisation combination, all rotated housing layouts | Definitions and selected related operations were inspected; no complete combinatorial claim is made. |
| NOT TESTED | Audible music/effect quality, sound balance, real mute/background audio behaviour | Headless execution and absence of exceptions do not prove audible correctness. |
| NOT TESTED | Long real-time overnight/multihour soak, sustained memory profiling, thermal/battery impact, low-memory mobile process death | Controlled loop cycles and short frame samples cover different risks. |
| NOT TESTED | Every physical notch/safe-area/keyboard/orientation combination; touch accessibility across devices | Seven viewport snapshots and five joystick runs are representative samples only. |
| NOT TESTED | Every import/export file picker/download path; all OS interruption and storage eviction modes | Save serialisation, migration, history and simulated write errors were covered. |

The missing engines and hardware are test limitations, not reported defects. No planned-but-absent feature was counted as a regression. “No confirmed P0/P1” means none emerged from the executed checks, not that untested scenarios are guaranteed safe.

## 8. Developer handoff and repair order

All source locations below refer to the exact uploaded HTML hash, with 1-based line numbers. They must not be linked to the older repository `index.html` as though that were the audited file. The inline architecture uses very long source lines; locate functions by name as well as line number.

| Order | Finding | Main source locations | Corrective approach | Verification gate |
| --- | --- | --- | --- | --- |
| 1 | HTML-001 | `gatherKey` 1045; `resourceNodes` 1046; `gather` 1047; `blocked` 1059; `nextDay` 1107; movement update | Reconcile newly solid resources with occupied actor space at epoch changes; preserve gather accounting | Forest and mine midnight movement works; no duplicate rewards or unsafe load positions |
| 2 | HTML-003 | `placementValid` 685; `animalPen` 653; `chickenWalkable` 1423; `updateChickens` 1431 | Shared entrance geometry and reachable-approach validation for housing actions; handle existing saves | Accepted placements have enterable housing; rejected edits preserve ownership, hens and eggs |
| 3 | HTML-002 | `chickenWalkable` 1423; `updateChickens` 1431 | Clearance-aware paths, invalidation on layout changes, stuck recovery | Valid fence detour reaches coop; sealed routes remain safe and bounded |
| 4 | HTML-004 | `nativeBack` 1411; arcade setup/exit dispatch; help at 901/1443 | Exit arcade before protected-activity guard | Three games exit through Back; cooking/rest protection still passes |

HTML-002 and HTML-003 can share animal geometry helpers, but the route fix cannot cure an out-of-bounds goal. Validate housing geometry before routing. HTML-001 and HTML-004 are otherwise independent. None requires an economic rebalance or replacing the save format merely to fix the observed behaviour.

After local targeted tests, rerun the completed save/cooking/transaction stability coverage. In particular, keep quota rollback, chest UID/quality preservation, hen assignment, one-time eggs/rewards, and durable cooking reservations intact. Update repository tests for the new tabbed appearance UI, opaque preview background, instructional legend, resident schedules, and opt-in test hook in every browser context before treating the complete old suite as a release gate.

The inline script in Section 10 deliberately expects the current defects to reproduce. After repairs, its `reproduced` expectations should be inverted or replaced with the acceptance assertions above; a reproduction script failing on a fixed build is not itself evidence of a new regression.

## 9. Full executed-case ledger

IDs are scoped to their audit group. Titles below are the original recorded test titles, including inherited wording. “PASS / observation” denotes a diagnostic case that completed and recorded state rather than asserting every implication in its title. In particular, a title containing “loss” or “failure” is not an extra confirmed bug. Interpret observations alongside the actual findings and false-positive analysis above.

### Core systems

| Case | Recorded result | Executed check / interpretation |
| --- | --- | --- |
| INV-01 | PASS | Starter inventory and hotbar agree |
| INV-02 | PASS | 100 stack transfers conserve quantity and quality |
| INV-03 | PASS | Full bag rejects withdrawal atomically |
| INV-04 | PASS | All four backpack purchases and persistence |
| INV-05 | PASS | Merging into equipped target preserves selection |
| INV-06 | PASS | Splitting and sorting preserve quantities |
| ECO-01 | PASS | Negative currency and invalid transaction rejection |
| SHOP-01 | PASS | Five business opening and closing boundaries |
| SHOP-02 | PASS | Counters reachable from all five interior entrances |
| SHOP-03 | PASS | Seed purchase, direct sale and failed purchase via UI |
| FARM-01 | PASS | Every crop: purchase, plant, water, grow, harvest, sell |
| FARM-02 | PASS | Regrowing crops produce exactly one repeat harvest |
| FARM-03 | PASS | Full bag leaves mature crop intact |
| FARM-04 | PASS | Watering limits, invalid planting, fertiliser idempotence |
| FARM-05 | PASS | All four pond banks refill and deep water collides |
| FARM-06 | PASS | Directional targeting and 50 valid tool actions |
| CLOCK-01 | PASS | Rate, menu pause, midnight and 20 day transitions |
| WEATHER-01 | PASS | 224 forecasts seasonal snow and next-day consistency |
| SAVE-01 | PASS | 20 full round trips preserve core data |
| SAVE-02 | PASS | Autosave four-point rollover and isolated restore |
| SAVE-03 | PASS | Truncated, unsupported, invalid stacks rejected without deletion |
| SAVE-04 | PASS | Reload during cooking preserves inputs or pending output |
| SAVE-05 | PASS | Malformed nested collection cannot enter playable state |
| SAVE-06 | PASS | Quota failure retains primary bytes and exposes warning |
| COOK-01 | PASS | All implemented recipes complete with exact ingredients and output |
| COOK-02 | PASS | Missing ingredients and full output bag preserve inputs |
| CRAFT-01 | PASS | Every crafting blueprint consumes materials exactly once |
| FISH-01 | PASS | Three rod tiers, unlock gating and duplicate rejection |
| FISH-02 | PASS | 20 assisted catches yield one reward per activity |
| FISH-03 | PASS | Unassisted minigame catches through tracked control |
| FISH-04 | PASS | Cancel and deliberate miss never grant fish |
| WORLD-01 | PASS | 50 map transitions and each destination remains walkable |
| WORLD-02 | PASS | Forage and quarry reward once per renewal epoch |
| WORLD-03 | PASS | All four parcels and all three home upgrades preserve furniture |
| COMM-01 | PASS | Every project completes once and persists |
| COMM-02 | PASS | Seasonal request deliveries are paid once |
| COMM-03 | PASS | Winter festival enforces its material prerequisite |
| NPC-01 | PASS | All four schedules sampled across three weather types |
| NPC-02 | PASS | Visible NPC route follows collision model for 600 ticks |
| NAV-01 | PASS | Waypoint clears on cancellation and arrival, persists null |
| STRESS-01 | PASS | 100 menu cycles leave no duplicated UI canvas |
| ECO-02 | PASS | Market payout matches the grade actually removed |
| SAVE-07 | PASS | Replacing a farm clears unrelated prior restore points |

### Extended systems

| Case | Recorded result | Executed check / interpretation |
| --- | --- | --- |
| REPRO-01 | PASS / observation | Cooking loss after serialized load/start, repeated 3 times |
| REPRO-02 | PASS / observation | Market grade accounting repeated 3 times |
| REPRO-03 | PASS / observation | Merge selection loss repeated 3 times |
| NPC-03 | PASS | Mira can follow town-to-forest schedule while visible |
| FARM-07 | PASS | Energy-free failed chopping must not advance hits |
| FARM-08 | PASS | Gold hoe and can affect four tiles and use exactly four water |
| FARM-09 | PASS | Unwatered crops stop, seasonal crops wither, winter has no seeds |
| FISH-05 | PASS | Land casting rejected by actual tool path |
| FISH-06 | PASS | Fish hours and seasonal catalogue eligibility boundaries |
| COMM-04 | PASS | Spring, summer, autumn and winter festivals complete once |
| COMM-05 | PASS | Staffed hall refuses delivery after closing |
| REL-01 | PASS | Greeting once daily, preferred/disliked gifts and controls resume |
| SAVE-08 | PASS / observation | Save replacement observation after lineage fix |
| SAVE-09 | PASS | Normal crop watering and maturity survive actual serialize/validate |
| SAVE-10 | PASS / observation | Zero, missing and string time cannot bypass day boundaries |
| SAVE-11 | PASS / observation | Nested save validation failure is reproducible without modifying source |
| BUILD-01 | PASS | Furniture placement, move cancellation and chest preservation |
| BUILD-02 | PASS | Blocking furniture must not be placeable over the farmer |
| SHIP-01 | PASS | Shipping pays once and clears deposited quality stacks |
| PROG-01 | PASS | Skill thresholds, recipe locks and level cap |
| VIEW-1920x1080 | PASS | Responsive viewport and bag observation |
| VIEW-1366x768 | PASS | Responsive viewport and bag observation |
| TOUCH-915 | PASS | Real touchscreen joystick changes player position |
| VIEW-915x412 | PASS | Responsive viewport and bag observation |
| TOUCH-740 | PASS | Real touchscreen joystick changes player position |
| VIEW-740x360 | PASS | Responsive viewport and bag observation |
| TOUCH-1024 | PASS | Real touchscreen joystick changes player position |
| VIEW-1024x768 | PASS | Responsive viewport and bag observation |
| TOUCH-1366 | PASS | Real touchscreen joystick changes player position |
| VIEW-1366x1024 | PASS | Responsive viewport and bag observation |
| TOUCH-390 | PASS | Real touchscreen joystick changes player position |
| VIEW-390x844 | PASS | Responsive viewport and bag observation |
| MOVE-01 | PASS | Four directional keys and diagonal normalisation |

### New features

| Case | Recorded result | Executed check / interpretation |
| --- | --- | --- |
| DISC-01 | PASS | Actual new content definitions |
| AN-01 | PASS | Adopt three hens, debit once, reject fourth and preserve save |
| AN-02 | PASS | No housing and offsite adoption reject without charging |
| AN-03 | PASS | Refill feed and water exactly once with correct supply deductions |
| AN-04 | PASS | Fed watered hens produce one egg per hen per day |
| AN-05 | PASS | Egg collection adds exact inventory and cannot repeat |
| AN-06 | PASS | Full bag leaves nest eggs and XP unchanged |
| AN-07 | PASS | Neglect makes hens unwell without removing them |
| AN-08 | PASS | Medicine plus care restores health without repeated medicine spending |
| AN-09 | PASS | Long-run animal state remains valid across 20 day/save cycles |
| AN-10 | PASS | Chicken night movement eventually reaches its coop |
| AN-11 | PASS | Occupied coop cannot be stored in furnishing editor |
| AN-12 | PASS | Animal transaction failure rolls back eggs and bag |
| ED-01 | PASS | Owned furniture placement debit and persistence |
| ED-02 | PASS | Move/store/retrieve chest preserves UID and quality contents |
| ED-03 | PASS | Player-overlapping placement rejects without item loss |
| ED-04 | PASS | Failed furniture save restores ownership and placed objects |
| ED-05 | PASS | Occupied coop moved within pen preserves chicken assignment and save validity |
| ARC-01 | PASS | Maze solvable through actual movement API and preserves clock/items |
| ARC-02 | PASS | Memory matching all eight pairs finishes once |
| ARC-03 | PASS | Rhythm 16 beats score once per beat and end after 14.4 seconds |
| ARC-04 | PASS | Arcade exit cancels transient state and resumes world time |
| MINE-01 | PASS | All mine tiers reject insufficient tools and give resources once |
| MINE-02 | FAIL | Midnight resource reset preserves a valid miner position → HTML-001 |
| WORLD-01 | FAIL | Previous forest regeneration trap remains fixed → HTML-001 |
| DEV-01 | PASS | Developer test farm changes never alter normal slot |
| DEV-02 | PASS | Invalid developer code does not enter test session |
| PAD-01 | PASS | Synthetic gamepad movement and disconnect release |
| PAD-02 | PASS | Controller cannot move player while a menu is open |

### Boundary cases

| Case | Recorded result | Executed check / interpretation |
| --- | --- | --- |
| HEN-01 | FAIL | Hen reaches coop around a single valid fence with an open detour → HTML-002 |
| HEN-02 | FAIL | Coop placed at accepted southern pen boundary has a reachable sleep entrance → HTML-003 |
| HEN-03 | PASS | Animal save retains valid state after dawn and moving coop |
| BAG-01 | PASS | 100 cross-container swaps conserve all grade counts |
| BAG-02 | PASS | Cross-container write failure rolls back both arrays |
| PAD-03 | PASS | Opening menu releases a held movement direction |
| PAD-04 | PASS | Controller remapping swaps bindings without duplicate actions |
| MIG-01 | PASS | Schema 4 save migrates to 5 with items and no invented animals |
| MIG-02 | PASS | Malformed animal reference and health fields rejected without overwriting |
| TOUCH-EDITOR-A | PASS | Actual touch select and place chest in layout A |
| TOUCH-EDITOR-B | PASS | Actual touch select and place chest in layout B |
| TOUCH-EDITOR-C | PASS | Actual touch select and place chest in layout C |
| APPEAR-01 | PASS | Actual mirror cancellation leaves name unchanged |

### Current UI confirmation

| Case | Recorded result | Executed check / interpretation |
| --- | --- | --- |
| APPEAR-02 | PASS | All appearance tabs usable; randomised creation and mirror confirmation persist through actual reload |
| NAV-02 | PASS | Current legend opens and atlas selects estate, sets and clears waypoint |

### Additional focused verification ledger

| Group | Outcome | Interpretation |
| --- | --- | --- |
| REGEN | Reproduced | Forest and mine, three repetitions each; unchanged position after movement and invalid collision |
| HEN-DETOUR | Reproduced | Three repeated stalls; removing only the fence restores entry |
| HEN-ENTRANCE | Reproduced | Three repeated unreachable entrances; moving coop north restores entry |
| ARCADE-BACK | Reproduced | Each of three arcade kinds consumes Back without exiting; explicit exit clears activity |
| REGEN-REAL-TOUCH | Reproduced | Ordinary animation loop; real CDP touch joystick cannot move; contextual mining restores walkability |

### Historical suite completion

| Suite | Result against upload | Notes |
| --- | --- | --- |
| immersion | PASS | Completed against byte-identical supplied build with diagnostics enabled |
| stability | PASS | Durable cooking, save validation/lineage, market grade accounting, actual bag drag/merge, actor scene edges, energy/tool checks, hall boundaries, and placement checks completed |
| compatibility | PASS after harness adaptation | Diagnostic opt-in installed in every context; migration/overflow, slot validation, desktop drag, touch swaps, midnight timing, responsive layout and mobile fishing completed |
| bedtime | PASS after harness adaptation | Bedside interaction, night/after-midnight rest, one-shot advancement, reduced-motion menus and mobile bedtime completed |
| smoke | INCONCLUSIVE / incomplete | Stopped selecting hidden `#accessory` in the new tabbed editor |
| update | INCONCLUSIVE / incomplete | Old transparent-top-row portrait assertion fails because current preview has an opaque background |
| expansion | INCONCLUSIVE / incomplete | Old per-destination legend selector is absent in redesigned instructional legend |
| systems | INCONCLUSIVE / incomplete | Old all-NPCs-working-at-10:00 assertion conflicts with added resident socialising schedules |

These incomplete suites are disclosed rather than silently treated as passes. Their first-stop assertions were investigated; they are not four more confirmed product defects.

## 10. Self-contained reproduction harness

This code was executed against the unchanged uploaded HTML and reproduced all five verification groups listed above. It is included here rather than published as a separate file. It intentionally **expects the bugs to exist**. Keep the original uploaded build when reproducing; the current repository entry point may be different.

To rerun in a disposable local test environment:

1. Have Node.js, the `playwright` npm package, and Chromium available. The tested dependency was Playwright 1.58.2. This script uses `/usr/bin/chromium`; adjust that path if your installation differs.
2. Copy the single code block below into a scratch `reproduce.cjs`, outside the application source.
3. Run `node reproduce.cjs "/absolute/path/to/index (2).html"`. If Playwright lives elsewhere, set `NODE_PATH` to that installation's `node_modules` directory. It serves the exact input bytes locally; it does not edit the HTML.
4. Read each `reproduced` flag. All were true in this audit. Resource groups share one underlying defect. Script fixtures reset only their new disposable browser context's localStorage.

The hen cases use controlled continuous tile coordinates and a held night clock. The final touch case runs the production frame loop. A nonzero exit indicates a fixture/runtime error or a reported bug not reproducing; inspect output before deciding whether a repair succeeded.

```javascript
const {chromium}=require('playwright'),fs=require('fs'),http=require('http');
(async()=>{const input=process.argv[2];if(!input)throw Error('Pass the HTML file path as the first argument');const results=[];const s=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync(input))});await new Promise(r=>s.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try {const c=await b.newContext({viewport:{width:915,height:412},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await c.newPage();await p.addInitScript(()=>{globalThis.__FARMINGSTAR_TEST__=true;requestAnimationFrame=cb=>{window.__frame=cb;return 1}});await p.goto('http://127.0.0.1:'+s.address().port);await p.evaluate(()=>{window.Q={reset(o={}){localStorage.clear();FarmingStar.start(Object.assign(FarmingStar.defaults(),o));return FarmingStar.state},flock(y=47){const f=FarmingStar,g=this.reset({area:'animalShop',time:600});g.coins=10000;g.furniture.push({uid:'qa-coop',id:'coop',area:'farm',x:9,y,r:0});f.ensureAnimals();if(!f.buyChicken())throw Error('adopt');f.close();return g},draw(){for(let i=0;i<30;i++){window.__tick=(window.__tick||performance.now())+50;__frame(__tick)}}}});
const record=async(id,fn)=>{const r=await p.evaluate(fn);results.push({id,...r});console.log(id,JSON.stringify(r));/* Observations are checked after browser cleanup. */};
await record('REGEN',()=>{const f=FarmingStar,rows=[];for(const area of ['forest','mine'])for(let i=0;i<3;i++){const g=Q.reset({area,day:30,time:600});g.selected='pick';const n=area==='forest'?f.resourceNodes().find(n=>n.x===32&&n.y===25):f.mineDeposits().find(n=>n.tier===0);if(!f.gather(n))throw Error('mine fixture');g.x=n.x*24+12;g.y=n.y*24+12;g.time=1439.99;f.update(.05);const before=[g.x,g.y];for(const key of ['w','a','s','d']){document.body.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));f.update(.1);document.body.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}))}rows.push({area,node:{x:n.x,y:n.y},day:g.day,walkable:f.walkable(g.x,g.y),before,after:[g.x,g.y]})}return{reproduced:rows.every(r=>!r.walkable&&JSON.stringify(r.before)===JSON.stringify(r.after)),rows}});
await record('HEN-DETOUR',()=>{const f=FarmingStar,rows=[];for(let repeat=0;repeat<3;repeat++){const g=Q.flock();g.area='farm';g.time=1260;g.x=396;g.y=1044;g.ownedFurniture.fence=1;f.openFurnishingEditor();f.selectEditorItem('owned','fence');f.furnishing.cursor={x:15,y:50};if(!f.commitEditorPlacement())throw Error('valid fence');f.close();const h=g.chickens[0];h.x=20;h.y=52;h.inCoop=false;for(let i=0;i<12000;i++){g.playtime+=.05;f.updateChickens(.05)}const stuck={x:h.x,y:h.y,inCoop:!!h.inCoop,behavior:h.behavior};const fence=g.furniture.find(v=>v.id==='fence'&&v.x===15&&v.y===50);g.furniture=g.furniture.filter(v=>v!==fence);for(let i=0;i<1200;i++)f.updateChickens(.05);rows.push({stuck,afterRemovingFence:{x:h.x,y:h.y,inCoop:!!h.inCoop}})}return{reproduced:rows.every(r=>!r.stuck.inCoop&&r.afterRemovingFence.inCoop),rows}});
await record('HEN-ENTRANCE',()=>{const f=FarmingStar,rows=[];for(let repeat=0;repeat<3;repeat++){const g=Q.reset({area:'farm',x:396,y:1044,time:600});g.coins=10000;g.ownedFurniture.coop=1;f.openFurnishingEditor();f.selectEditorItem('owned','coop');f.furnishing.cursor={x:9,y:56};if(!f.commitEditorPlacement())throw Error('placement not accepted');f.close();g.area='animalShop';if(!f.buyChicken())throw Error('adoption');f.close();g.area='farm';g.time=1260;const h=g.chickens[0];for(let i=0;i<12000;i++){g.playtime+=.05;f.updateChickens(.05)}const stuck={x:h.x,y:h.y,inCoop:!!h.inCoop,goal:{x:10,y:58.8}};const coop=g.furniture.find(v=>v.id==='coop');coop.y=52;for(let i=0;i<1200;i++)f.updateChickens(.05);rows.push({stuck,afterMovingCoopNorth:{x:h.x,y:h.y,inCoop:!!h.inCoop}})}return{reproduced:rows.every(r=>!r.stuck.inCoop&&r.afterMovingCoopNorth.inCoop),rows}});
await record('ARCADE-BACK',()=>{const f=FarmingStar,rows=[];for(const kind of ['maze','memory','rhythm']){const g=Q.reset({area:'arcade',time:600}),cab=f.interiors.arcade.props.find(v=>v.id==='cabinet-'+kind);g.x=cab.x*24+12;g.y=(cab.y+1)*24+12;f.startArcade(kind);const returned=FarmingStarLifecycle.back(),stillActive=f.activity?.type==='arcade',toast=document.querySelector('#toast').textContent;f.exitArcade();rows.push({kind,returned,stillActive,toast,exitButtonEquivalentWorks:f.activity===null})}return{reproduced:rows.every(r=>r.returned&&r.stillActive&&r.exitButtonEquivalentWorks),rows}});
// Production frame-loop reproduction and actual touch recovery for the shared resource trap.
const actual=await c.newPage();await actual.addInitScript(()=>globalThis.__FARMINGSTAR_TEST__=true);await actual.goto('http://127.0.0.1:'+s.address().port);await actual.evaluate(()=>{const f=FarmingStar;f.start({...f.defaults(),day:30,area:'mine',time:600});const g=f.state;g.selected='pick';const n=f.mineDeposits().find(n=>n.tier===0);f.gather(n);g.x=n.x*24+12;g.y=n.y*24+12;g.time=1439.99});await actual.waitForTimeout(300);const before=await actual.evaluate(()=>({day:FarmingStar.state.day,x:FarmingStar.state.x,y:FarmingStar.state.y,walkable:FarmingStar.walkable(FarmingStar.state.x,FarmingStar.state.y)}));const joy=await actual.locator('#joy').boundingBox();const cdp=await c.newCDPSession(actual);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:joy.x+joy.width*.85,y:joy.y+joy.height*.5}]});await actual.waitForTimeout(350);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const after=await actual.evaluate(()=>({x:FarmingStar.state.x,y:FarmingStar.state.y}));await actual.locator('#interact').tap();const recovered=await actual.evaluate(()=>FarmingStar.walkable(FarmingStar.state.x,FarmingStar.state.y));results.push({id:'REGEN-REAL-TOUCH',reproduced:!before.walkable&&before.x===after.x&&before.y===after.y&&recovered,before,after,recovered});
console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.reproduced))throw Error('At least one reported defect did not reproduce')}finally{await b.close();await new Promise(r=>s.close(r))}})().catch(e=>{console.error(e);process.exitCode=1});
```

## 11. Final assessment

**Playable with Minor Issues.** The extensive executed checks support the core gameplay and save/transaction paths in the tested Chromium environment. Four noncritical defects are confirmed, with concrete workarounds and independently observed recovery controls. Repair renewal collision first, then housing entrance validation and hen detours, then native arcade Back dispatch. Revalidate on the uploaded build and complete physical Android/WebView and other-engine checks before treating it as a stable release candidate.

Only this report is intended for repository publication. Existing reports are preserved; the game, tests, dependencies, and environment configuration remain unchanged.
