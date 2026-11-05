# FarmingStar — test coverage and limitations

Build 0.4.0, commit `d3af7526950637f243727b90c3c0f6b784ac02f5`; 5 November 2026 (Europe/London). Read [QA_BUG_REPORT.md](QA_BUG_REPORT.md) for defect details and [QA_DEVELOPER_HANDOFF.md](QA_DEVELOPER_HANDOFF.md) for repair batches.

## Scope, environment and result accounting

This was an independent browser audit of the supplied build. It includes source inspection, supplied regressions, new state/boundary tests, genuine pointer/keyboard/touch input, visual inspection, deterministic stress and measured cloud frame timings. It is **not** a full natural-time playthrough of every possible state or a physical-device certification.

| Run | Executed units | Result |
|---|---:|---|
| Supplied regression scripts, copied into QA evidence | 7 script processes | All seven completed successfully with Playwright 1.58.2; see `evidence/baseline-console.log` |
| `scripts/audit.cjs` | 43 named checks | 38 PASS, 5 FAIL |
| `scripts/extended.cjs` | 33 named checks | 29 PASS, 4 FAIL |
| `scripts/final-checks.cjs` | 7 named checks | 7 successful observations/reproductions |
| **Independent total** | **83 named checks** | **74 PASS rows, 9 FAIL rows; nine unique confirmed defects** |
| Alternate engine prerequisites | 2 launch attempts | Firefox and WebKit BLOCKED: required executables absent |

**A passing bug-reproduction probe means the bug was reproduced, not fixed.** The `REPRO-*`, `REAL-RELOAD`, `REAL-MERGE`, `REAL-REPLACE`, `REAL-BUILD`, `SAVE-08` and `SAVE-11` checks explicitly record demonstrated faults. Do not describe the 74 PASS rows as 74 clean gameplay features. The nine FAIL rows are the nine expected-behaviour assertions documented in the bug report. Loop iterations and repeated reproductions are not counted as additional named cases. Supplied script processes are separate from the 83-case total; their internal assertions are not assigned an invented case count.

The custom audit processes exit zero when evidence collection completes even when individual cases fail; consume the JSON `status` fields. A process exit alone is not a readiness signal. All three final independent runs completed, with no uncaught `pageerror` events. `SAVE-05` deliberately produces a caught exception through `page.evaluate`; the error stack is retained.

Environment: Linux 6.18.57, Chromium 155.0.8059.79, Node 24.22.1, Playwright 1.58.2, Python 3.12.14. Main test viewport 1366×768/DPR1. The first exploratory baseline copy resolved the image-wide Playwright 1.62.1; the final saved baseline log is a completed repeat with `NODE_PATH` explicitly selecting locked 1.58.2. The initial exploratory audit also exposed QA selector/reward/weather fixture mistakes; these were corrected before the final results reported here. They are not product bugs.

## Architecture and actual feature inventory

| System | Build status | Architecture / verified scope |
|---|---|---|
| Entry/runtime | Implemented | `index.html` contains CSS, embedded font, canvas art, WebAudio and one JavaScript IIFE; no build or external runtime assets |
| Main loop/rendering | Implemented | `frame` → capped-delta `update` → world/menu/sleep rendering; logical tile coordinates, doubled canvas backing, depth-sorted sprites |
| Input | Implemented | Delegated clicks/drag-drop, keyboard, joystick pointer/touch, context resolver; inputs excluded from keyboard gameplay |
| Movement/camera/collision | Implemented | Four directions/normalised diagonal movement, shared blocked geometry, map-edge travel; furniture player-overlap defect confirmed |
| Character/appearance | Implemented | Profile colours, hair/outfits/accessories; fixed face anchors; sampled eight phases/four directions without an observed shifting-eye defect |
| Farming | Implemented | Ten crops; four regrow; seasonal planting/wither; watering/upgrades/fertiliser/quality/optional energy |
| Terrain/world | Implemented | Farm/town/forest, deterministic scenery/terrain, rivers/bridges, forest cache/quarry/resource epochs |
| Inventory | Implemented | Canonical `{id,n,q}` bag slots; 10–50 capacity; tools single-stack; proxy totals; split/sort/merge; merge-selection defect |
| Containers/economy | Implemented | Canonical storage arrays for chests/market/shipping; direct sales; quality pricing; market mismatch defect |
| Shops/interiors | Implemented | Grocery, smith, estate, fishing hut, public hall; compact colliding props, service points and hours |
| NPC routines | Partially implemented by design | Four adult villagers; visible routes/off-screen destination resolution, weather/festival overrides; simplified routines; forest edge bug |
| Dialogue/relationships | Implemented | Typewriter portrait dialogue, once-daily greeting/gift, preferred/disliked gifts, friendship/companion threshold |
| Fishing | Implemented | Three rods, five fish with area/season/time eligibility, waiting/reel activity, standard/quality catch; cancellation/failure |
| Cooking | Implemented with persistence defect | Nine station types, twenty recipes, timing/assist/quality/station upgrades; no bespoke pizza-drag or parallel queues |
| Crafting | Implemented | Twelve material-based blueprints including furnishings, mill, planks and fertiliser |
| Land/farmhouse/building | Implemented | Four parcels, three home expansions, furniture storage/placement/move/cancel, persistent chest contents |
| Skills/progression | Implemented | Five XP totals, square-root thresholds, ten-level cap, specialisations/unlocks, collections/achievements/journal |
| Requests/projects/festivals | Implemented, simplified | Three feasible daily offers/no expiry; four projects; four seasonal day-eight festival interactions; hall enforcement inconsistency |
| Clock/weather/day-night | Implemented | 0.5 game minutes/real second; menus pause; once/day processing; deterministic saved forecast and winter-only snow |
| Navigation/minimap | Implemented | Shared geometry/cached terrain, destination routes, clear and arrival behaviour, atlas gestures; not every map pixel independently compared |
| Audio | Implemented, partially verified | Generated melody, effects, noise ambience/river/rain; one context and persisted master mute verified; subjective sound quality not listened to |
| Save system | Implemented with defects | Three localStorage farms, v1–v4 validator/migration, coalesced writes, four history points, undo restore; cooking/history/schema gaps |
| Native packages/animals | NOT IMPLEMENTED | APK, IPA and animal farming are explicit future work; not regressions |
| Export/import/durable native saves | NOT IMPLEMENTED | Browser-origin localStorage is the actual persistence mechanism; no export feature tested or assumed |

## Reproduction safety and instrumentation

- No tracked game code, supplied tests, dependency manifests or lockfile were changed. `git diff --exit-code` passed at completion. Only the new `Bug Reports` tree was added to the checkout.
- Initial/final source SHA-256 matches the byte-identical evidence baseline copy: `194f34c1e24c0e42d40366b0f8f5bdea6004c67ac7d201995a605003d118e907`.
- Every browser context is nonpersistent and disposable. Clearing/mutating localStorage affects only QA profiles. Genuine player data and browser profiles were not used.
- No disposable source instrumentation was needed. The shipped `window.FarmingStar` hooks expose defaults/state, transactions, activity, routing, saving and definitions. Fixture calls do not prove real-time accessibility; direct-input checks and supplied regressions complement them.
- `audit.cjs` and the logic portion of `extended.cjs` intercept `requestAnimationFrame` **at runtime** and explicitly step `update`/`stepAction`. This avoids uncontrolled time/RNG during assertions. Temporary `Q` helpers exist in the browser only. Rich fixtures grant capacity/coins and preclaim starter/achievement coin bonuses to isolate exact transaction deltas.
- State fixtures intentionally set season/time, resources, skills, coordinates and NPC location. Market RNG is temporarily fixed only for deterministic customer arrival; it is restored immediately. Quota simulation temporarily overrides `Storage.prototype.setItem`, then restores it.
- `final-checks.cjs` retains the ordinary RAF loop and performs actual reloads, clicks and key input. Audio instrumentation subclasses `AudioContext` only to count created contexts; it does not change the sound graph. A temporary sprite-sheet canvas captures existing render calls; the game HTML stays untouched.
- Scene screenshots were refreshed under the actual frame loop after allowing entry fades to finish. Early transition-tinted captures are not interpreted as permanent visual faults.

## Gameplay coverage by programme area

| Area | Status / execution | Evidence and remaining gaps |
|---|---|---|
| Startup/new/load/title | PASS for exercised paths; FAIL farm lineage | Initial screenshots, supplied suites, actual replacement/restore; all three slot UI variants not exhaustively replayed |
| Keyboard movement | PASS | Four keys, exact 6.8-unit displacement per controlled 0.1s, diagonal equality; 50 hook transitions; natural walking across every exit not independently replayed |
| Touch movement | PASS | Real CDP touchStart/touchEnd joystick drags in five emulated touch viewports, all changed X positively |
| Character eyes/animation | PASS for sampled appearance | Four directions × eight walking phases, source anchors and supplied pixel checks; every accessory/blink combination NOT TESTED |
| Tool target/animation | PASS selected cases; FAIL exhaustion side effect | Hoe four directions/50 valid uses, gold four-tile hoe/can, four pond banks; supplied cursor-independence/collision tests; axe/pick/can/scythe/rod every direction at every tier NOT TESTED |
| Crops | PASS | Every crop purchased as seed, planted, watered for defined days, harvested and sold; four regrow cycles; dry growth/season/winter checks |
| Crop negatives | PASS selected boundaries | Occupied planting, empty can, repeated water, full-bag harvest, fertiliser once-only, mature/fertilised save; exhaustive rainfall moment permutations NOT TESTED |
| Inventory/storage | PASS conservation, split/sort/full rollback; FAIL equipped merge | 100 store/withdraw cycles, quantity and q conservation, direct UI merge; supplied native drag/touch swap checks |
| Backpack | PASS | All four 10-slot upgrades and maximum rejection, save/load capacity; supplied mobile layout checks; full 50-slot UI in all seven viewports NOT TESTED |
| Economy | PASS direct buy/sell/insufficient funds/shipping; FAIL market quality | Exact deltas isolate journal bonuses; 52c vs expected 44c market pair; no probabilistic market balance study |
| Shops | PASS 30 clock boundaries and five reachable service routes; FAIL hall transaction enforcement | Actual seed purchases/sales, all rod/backpack upgrades, parcel/home operations; after-hours soup handler statically flagged, not separately executed |
| NPCs | PASS sampled workplace/off-screen routes; FAIL visible forest transfer | Four NPCs across 30 time/weather combinations (120 actor observations), 600 visible grocery path ticks, 1,200 town→forest ticks; no full natural-time day for all NPCs |
| Dialogue/gifts | PASS sampled | Daily greeting/duplicate guard, liked jam/disliked stone, friendship deltas, clean close; supplied portrait/mobile dialogue isolation; every villager/gift/companion outcome NOT TESTED |
| Fishing | PASS exercised loops | All three rods, unlock gating, five fish eligibility windows, 20 assisted catches, one unassisted feedback-controlled catch, cancel/miss and land rejection; physical touch sustained reeling NOT TESTED |
| Cooking | PASS all twenty successful recipes; FAIL interruption | Exact consumed/output items, capacity/missing ingredients, all nine station families; supplied timing actions and chains; 3 real interrupted reloads lose input |
| Crafting | PASS all twelve recipes | Exact materials/output, all unlocked through fixture XP; furniture/chest persistence and cancellation checked |
| Exploration/forage/quarry | PASS sampled | Forest seasonal forage plus stone/ore/clay rewards, once/epoch guard; supplied renewal/cache checks; every randomly generated spawn's player route NOT TESTED |
| Land/home/furniture | PASS purchase/preservation, FAIL player overlap | Four parcels, all three expansions, table/chest state preservation, actual blocked-player reproduction; every redevelop purpose/layout permutation NOT TESTED |
| Skills/unlocks/journal | PASS selected rules | All five XP threshold sequences to level 10, cooking level lock/unlock, journal one-time rewards in supplied suites; all specialisation choices and achievement combinations NOT TESTED |
| Requests/projects | PASS daily seasonal deliveries, all four projects and repeat rejection | Reward quantities and persistence; later request dates/deadlines absent by design; every project contribution order NOT TESTED |
| Festivals | PASS four season interactions and reward guards | Spring/winter timing assist; summer cooked dish/autumn crop submission; 21:00 end guard; natural festival setup/teardown through a whole day NOT TESTED |
| Clock/day/sleep | PASS controlled steps | 2s → 1 game minute, menu pause, midnight once, 20 controlled days; supplied before/after-midnight bedside keyboard/touch tests; not a 48-minute natural-day timing certification |
| Weather | PASS deterministic sample | 224 day forecasts with no nonwinter snow, 20 next-day consistency checks, dry/season and supplied rain checks; real measured climate probabilities NOT TESTED |
| Day/night/lighting | PARTIAL visual inspection | Day scenes and supplied bedtime scene inspected; all light/weather/interior combinations NOT TESTED |
| Audio | PARTIAL PASS | Actual WebAudio context running, no duplicated context, master-zero settings saved/restored; audible correctness, river spatial balance and measured silence INCONCLUSIVE |
| Waypoint/atlas/minimap | PASS clear/arrival/persistence and supplied routes/gestures | No permanently stuck indicator reproduced; shared geometry inspected, scene minimaps captured; exhaustive minimap icon/terrain alignment NOT TESTED |
| Menus/mobile UI | PASS sampled interaction/layout | Seven viewport/bag captures, five actual touch movement checks, supplied touch hotbar/map/dialogue cases; overflow measurements noted without promoting an unproved defect |
| Normal saving/history | PASS tested values and rollover | 20 full save/load round trips, six autosaves → four retained points, restore and unrelated-slot isolation; actual old-lineage restore FAIL |
| Corruption/quota/migration | PASS selected invalid stack/version/truncation/quota; FAIL null collection | Supplied legacy migration/overflow checks; primary bytes preserved on quota; low-level multi-key interruption matrix and every legacy field combination NOT TESTED |
| Offline | PASS network independence under local bootstrap | No external HTTP requests in audit; local-server origin still allowed on reload; true file-URL launch BLOCKED by managed browser policy, airplane-mode device packaging NOT TESTED |
| Stress/performance/memory | PASS completion, limited conclusions | Counts/measurements below; no multi-hour burn-in or physical device measurements |

## Stress runs actually completed

| Operation | Completed | Verification |
|---|---:|---|
| Bag → chest → bag | 100 round trips | 99 Excellent carrots retained, quality unchanged |
| Journal open/close | 100 cycles in audit | One ambience canvas, modal closed |
| Map changes | 50 hook transitions in audit | Resulting player tile walkable |
| Tool actions | 50 valid hoe actions | Correct plot creation, four facing directions included |
| Calendar advancement | 20 controlled transitions plus midnight in clock case | Exact day count; separate 20-day forecast test |
| Save/load | 20 round trips | Inventory, crops, relationships, skills, projects, waypoint, coins, furniture, stations, parcels and containers compared |
| Fishing | 20 assisted attempts + one unassisted catch | Exactly one gain/catch; repeat finish calls grant none |
| Visible NPC routing | 600 grocery ticks + 1,200 forest-transition ticks | Grocery collision check passes; forest departure fails |
| Post-GC memory batches | 5 × 100 menu/travel/save cycles | 500 combined cycles, recorded after each 100; bounded DOM after first batch |
| Additional performance-stage churn | 100 menu/travel/save cycles | Independent before/after heap sample, not merged into memory slope claims |

All controlled transitions are simulations, not elapsed natural days. No claim of a multi-hour soak or 20 naturally played fishing activities is made.

## Measured performance

Real RAF timestamps from ordinary running headless Chromium; roughly 3.02 seconds per area, 1366×768. Shared cloud resources and software rendering can affect these numbers. The heavy-rain and festival states were fixture-selected. These are observations, not a stable-release FPS guarantee.

| Scene | Average FPS | Mean frame ms | p95 frame ms | Maximum frame ms |
|---|---:|---:|---:|---:|
| Farm, sunny | 58.68 | 17.04 | 16.80 | 50.10 |
| Town, sunny | 57.35 | 17.44 | 16.80 | 50.00 |
| Grocery | 59.34 | 16.85 | 16.80 | 33.30 |
| Forest | 58.68 | 17.04 | 16.80 | 50.00 |
| Town, heavy rain | 56.35 | 17.74 | 16.80 | 50.00 |
| Town, autumn festival day | 59.01 | 16.95 | 16.80 | 33.30 |

Raw samples: `evidence/performance.json`. A p95 below the mean is possible here because a few longer frames influence the mean beyond the 95th percentile. No percentile or FPS value was inferred from screenshots.

Post-GC heap in the five-batch check rose from **3,858,536 bytes to 4,098,072 bytes** across 500 combined cycles. DOM nodes rose from 96 to 152 in the first batch and stayed at 152; ambience canvases stayed at one. Primary save JSON stayed around 2.8KB. This short run identifies modest retention/caching but does not distinguish a leak from normal engine/resource behaviour. No leak is filed as a confirmed defect. See `final-checks.json` → `MEMORY-01` for every sample.

## Browser/device/layout matrix

| CSS viewport | DPR | Touch/mobile emulation | Executed |
|---|---:|---|---|
| 1920×1080 | 1 | No | Startup, gameplay and bag screenshots |
| 1366×768 | 1 | No | Main logic/direct input suites and screenshots |
| 915×412 | 2.625 | Yes | Startup, joystick touch movement, bag, screenshots |
| 740×360 | 2 | Yes | Startup, joystick touch movement, bag, screenshots |
| 1024×768 | 2 | Yes | Same |
| 1366×1024 | 2 | Yes | Same |
| 390×844 | 3 | Yes | Same, portrait and horizontal bag scroll observation |

Fresh Chromium contexts were used for each row. Emulation does not reproduce hardware GPU, Android file handlers, OS lifecycle, cut-outs or native safe-area behaviour. Firefox and WebKit were attempted via their Playwright launch APIs; binaries `firefox-1509/firefox/firefox` and `webkit-2248/pw_run.sh` are absent. No engine-compatibility pass is claimed. Additional browsers were not installed or network policy broadened as part of this read-only audit.

## Evidence and rerunning

From `/workspace/FarmingStar`, with installed locked dependencies and a host that permits Chromium/local sockets:

```sh
node 'Bug Reports/scripts/audit.cjs'
node 'Bug Reports/scripts/extended.cjs'
node 'Bug Reports/scripts/final-checks.cjs'
bash 'Bug Reports/scripts/run-baseline.sh'
```

The independent scripts read the original HTML and write only within `Bug Reports/evidence`; rerunning replaces their own generated evidence. Baseline scripts run against `evidence/baseline`, a byte-identical copy, to avoid overwriting screenshots under the original `tests/`. Do not point the destructive localStorage fixtures at an existing user profile. Socket/browser commands may need the supported command-sandbox escalation in this cloud environment.

Main evidence:

- `audit-results.json`, `extended-results.json`, `final-checks.json`: per-case results, reproducibility state and errors.
- `audit-console.log`, `extended-console.log`, `final-checks-console.log`, `baseline-console.log`: runner output.
- `audit-trace.zip`, `real-input-trace.zip`: inspect with Playwright Trace Viewer (`npx playwright show-trace <path>` on a suitable host).
- `initial-title.png`, `initial-farm.png`; `viewport-*.png`, `bag-*.png`; `area-*.png`; `directional-sprite-phases.png`; `bug-*.png`.
- `baseline/tests/*.png`: supplied suite's own screenshots, preserved separately from the original checkout's outputs.
- `performance.json`: raw area frame samples and an independent heap observation.

### Required follow-up before a stable-release claim

Fix and retest all nine confirmed defects; run Firefox/WebKit and real Android landscape; test mobile backgrounding/tab kill during production activities and save writes; perform sustained natural gameplay across seasons; listen to audio/mute behaviour on devices; benchmark frame times/heap on target hardware; systematically walk generated resource routes and transitions rather than relying solely on state hooks. These are explicitly outstanding, not silently passed.

## Named-case ledger

The following table is generated from the final saved JSON results. The nine expected-behaviour failures map directly to the bug report; observation probes identify their intent in the title. See source and JSON for fixtures, exact values and loop counts.

| Runner | ID | Check | Recorded status |
|---|---|---|---|
| audit | `INV-01` | Starter inventory and hotbar agree | PASS |
| audit | `INV-02` | 100 stack transfers conserve quantity and quality | PASS |
| audit | `INV-03` | Full bag rejects withdrawal atomically | PASS |
| audit | `INV-04` | All four backpack purchases and persistence | PASS |
| audit | `INV-05` | Merging into equipped target preserves selection | FAIL |
| audit | `INV-06` | Splitting and sorting preserve quantities | PASS |
| audit | `ECO-01` | Negative currency and invalid transaction rejection | PASS |
| audit | `SHOP-01` | Five business opening and closing boundaries | PASS |
| audit | `SHOP-02` | Counters reachable from all five interior entrances | PASS |
| audit | `SHOP-03` | Seed purchase, direct sale and failed purchase via UI | PASS |
| audit | `FARM-01` | Every crop: purchase, plant, water, grow, harvest, sell | PASS |
| audit | `FARM-02` | Regrowing crops produce exactly one repeat harvest | PASS |
| audit | `FARM-03` | Full bag leaves mature crop intact | PASS |
| audit | `FARM-04` | Watering limits, invalid planting, fertiliser idempotence | PASS |
| audit | `FARM-05` | All four pond banks refill and deep water collides | PASS |
| audit | `FARM-06` | Directional targeting and 50 valid tool actions | PASS |
| audit | `CLOCK-01` | Rate, menu pause, midnight and 20 day transitions | PASS |
| audit | `WEATHER-01` | 224 forecasts seasonal snow and next-day consistency | PASS |
| audit | `SAVE-01` | 20 full round trips preserve core data | PASS |
| audit | `SAVE-02` | Autosave four-point rollover and isolated restore | PASS |
| audit | `SAVE-03` | Truncated, unsupported, invalid stacks rejected without deletion | PASS |
| audit | `SAVE-04` | Reload during cooking preserves inputs or pending output | FAIL |
| audit | `SAVE-05` | Malformed nested collection cannot enter playable state | FAIL |
| audit | `SAVE-06` | Quota failure retains primary bytes and exposes warning | PASS |
| audit | `COOK-01` | All implemented recipes complete with exact ingredients and output | PASS |
| audit | `COOK-02` | Missing ingredients and full output bag preserve inputs | PASS |
| audit | `CRAFT-01` | Every crafting blueprint consumes materials exactly once | PASS |
| audit | `FISH-01` | Three rod tiers, unlock gating and duplicate rejection | PASS |
| audit | `FISH-02` | 20 assisted catches yield one reward per activity | PASS |
| audit | `FISH-03` | Unassisted minigame catches through tracked control | PASS |
| audit | `FISH-04` | Cancel and deliberate miss never grant fish | PASS |
| audit | `WORLD-01` | 50 map transitions and each destination remains walkable | PASS |
| audit | `WORLD-02` | Forage and quarry reward once per renewal epoch | PASS |
| audit | `WORLD-03` | All four parcels and all three home upgrades preserve furniture | PASS |
| audit | `COMM-01` | Every project completes once and persists | PASS |
| audit | `COMM-02` | Seasonal request deliveries are paid once | PASS |
| audit | `COMM-03` | Winter festival enforces its material prerequisite | PASS |
| audit | `NPC-01` | All four schedules sampled across three weather types | PASS |
| audit | `NPC-02` | Visible NPC route follows collision model for 600 ticks | PASS |
| audit | `NAV-01` | Waypoint clears on cancellation and arrival, persists null | PASS |
| audit | `STRESS-01` | 100 menu cycles leave no duplicated UI canvas | PASS |
| audit | `ECO-02` | Market payout matches the grade actually removed | FAIL |
| audit | `SAVE-07` | Replacing a farm clears unrelated prior restore points | FAIL |
| extended | `REPRO-01` | Cooking loss after serialized load/start, repeated 3 times | PASS |
| extended | `REPRO-02` | Market grade accounting repeated 3 times | PASS |
| extended | `REPRO-03` | Merge selection loss repeated 3 times | PASS |
| extended | `NPC-03` | Mira can follow town-to-forest schedule while visible | FAIL |
| extended | `FARM-07` | Energy-free failed chopping must not advance hits | FAIL |
| extended | `FARM-08` | Gold hoe and can affect four tiles and use exactly four water | PASS |
| extended | `FARM-09` | Unwatered crops stop, seasonal crops wither, winter has no seeds | PASS |
| extended | `FISH-05` | Land casting rejected by actual tool path | PASS |
| extended | `FISH-06` | Fish hours and seasonal catalogue eligibility boundaries | PASS |
| extended | `COMM-04` | Spring, summer, autumn and winter festivals complete once | PASS |
| extended | `COMM-05` | Staffed hall refuses delivery after closing | FAIL |
| extended | `REL-01` | Greeting once daily, preferred/disliked gifts and controls resume | PASS |
| extended | `SAVE-08` | Save replacement preserves old history and undo data (repeat evidence) | PASS |
| extended | `SAVE-09` | Normal crop watering and maturity survive actual serialize/validate | PASS |
| extended | `SAVE-10` | Zero, missing and string time cannot bypass day boundaries | PASS |
| extended | `SAVE-11` | Nested save validation failure is reproducible without modifying source | PASS |
| extended | `BUILD-01` | Furniture placement, move cancellation and chest preservation | PASS |
| extended | `BUILD-02` | Blocking furniture must not be placeable over the farmer | FAIL |
| extended | `SHIP-01` | Shipping pays once and clears deposited quality stacks | PASS |
| extended | `PROG-01` | Skill thresholds, recipe locks and level cap | PASS |
| extended | `VIEW-1920x1080` | Responsive viewport and bag observation | PASS |
| extended | `VIEW-1366x768` | Responsive viewport and bag observation | PASS |
| extended | `TOUCH-915` | Real touchscreen joystick changes player position | PASS |
| extended | `VIEW-915x412` | Responsive viewport and bag observation | PASS |
| extended | `TOUCH-740` | Real touchscreen joystick changes player position | PASS |
| extended | `VIEW-740x360` | Responsive viewport and bag observation | PASS |
| extended | `TOUCH-1024` | Real touchscreen joystick changes player position | PASS |
| extended | `VIEW-1024x768` | Responsive viewport and bag observation | PASS |
| extended | `TOUCH-1366` | Real touchscreen joystick changes player position | PASS |
| extended | `VIEW-1366x1024` | Responsive viewport and bag observation | PASS |
| extended | `TOUCH-390` | Real touchscreen joystick changes player position | PASS |
| extended | `VIEW-390x844` | Responsive viewport and bag observation | PASS |
| extended | `MOVE-01` | Four directional keys and diagonal normalisation | PASS |
| final-checks | `REAL-RELOAD` | Actual page reload during cooking loses reserved input (3 reproductions) | PASS |
| final-checks | `REAL-MERGE` | Actual inventory clicks reproduce equipped target merge loss | PASS |
| final-checks | `REAL-REPLACE` | Actual replacement UI restores previous farm into new lineage | PASS |
| final-checks | `REAL-BUILD` | Actual placement confirms furniture over player and blocks keyboard movement | PASS |
| final-checks | `AUDIO-01` | WebAudio initialises once and settings round-trip | PASS |
| final-checks | `OFFLINE-01` | Existing page reloads and plays with external network requests denied | PASS |
| final-checks | `MEMORY-01` | Five 100-cycle stress batches: bounded DOM and post-GC heap samples | PASS |
