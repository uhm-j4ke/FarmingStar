# FarmingStar 1.0 — development tracker

**Current state: development in progress. This update is not complete or released.**

Game changes are confined to `index.html`. This tracker is documentation requested during development. Android, Windows and macOS installers, package metadata, existing beta downloads and releases remain unchanged until the user authorises platform rollout.

## Current work

- Tab/button treatment and tool poses are approved. The requested final refinements are implemented: the journal button panel starts below the top-right button; side profiles are slimmer, with a smaller nose and forward-facing mirrored feet. Targeted checks pass.
- The yellow-paper, centre-crease, leather-outline and stepped-corner design is now shared across the menus; retain the satchel handle and obtain feedback on the latest pictures.
- Furnishing layout A is selected. Menu action buttons now use the right side, including the editor palette and placement controls. Book/journal navigation remains as approved. New title, pause, settings, backpack and phone pictures await visual feedback. Controller, furnishing transactions/touch and responsive menu checks pass.
- Latest requested fixes: carried tools now use separate sprites at 5/8 size, preserving working poses. Phone menus hide routine instructions, use short headings and keep action controls reachable while content scrolls; longer instructions are in Settings → Help & controls. Latest pictures await feedback. Continue independent regression checks.

## Feature status

| Feature | Implementation | Verification / remaining work |
|---|---|---|
| Camera bounds and settling | Implemented | Old out-of-bounds transition reproduced; 20 area/frame-rate cases and orientation changes passed |
| Controller support | Implemented in shared HTML | Synthetic title/start, name entry, colour palette, movement/deadzone, hotbar, bag/map/journal shortcuts, sliders/selects, remap/swap/persistence, reserved D-pad, atlas panning, placement, fishing, cooking, arcade, focus and disconnect tests pass. Physical controllers/native compatibility remain unverified |
| Phone layouts A and C | Implemented, A default | 14 variants across seven phone/tablet sizes passed overlap checks; minimap opening and preference persistence passed |
| Compact phone title / shortcut menu | Implemented | Phone checks pass; final visual review remains |
| Expanded farm and town | Implemented | Old/new outdoor landmark reachability passed; full established browser suite passes |
| New villagers and interiors | Implemented | Schedules/dialogue integrated; all nine dialogues, service access, interiors and path regressions pass |
| Chicken purchasing and housing | Implemented | Unique identities, cost, capacity, valid spawning and failed-save rollback passed |
| Feed, water, health and medicine | Implemented | Three hens consume full supplies over two days; sustained neglect and recovery tests passed; feed/water/medicine single-commit and failed-save rollback checks now pass; final animation review remains |
| Eggs | Implemented | Collection conservation, repeated-collection rejection, storage/persistence passed; naturally produced eggs also pass batter → cake, community request, one-time journal reward, shipping payout/repeat rejection and saved reload integration |
| Coop / fixture artwork and chicken behaviours | Implemented | Housing/care/egg persistence tests pass; final visual review remains |
| Slot-based chest interface | Implemented | Two grids, drag transfers both directions, splitting and item conservation passed; exact quality/UID and failed-write rollback checks pass with the furnishing editor |
| Recipe book and journal | Implemented; approved | Page/index navigation, page turns, swipe support and menu tests pass; raised ordinary page controls and projecting edge tabs remain unchanged by the new menu arrangement |
| Dedicated overhead furnishing editor | Implemented; layout A selected | Real plan, owned/placed/shop palette, pan/zoom, previews, rotation, move/store, home expansion, farm plan with crops/pen/parcels. Mouse, touch drag, controller entry/placement, chest grades/UIDs, equipment upgrades, occupied coop guard, retained feed, failed-save rollback, orientation and purchase de-duplication tests pass |
| Arcade | Three playable games implemented | Maze completion, memory pairs, rhythm scoring, duplicate-tap rejection, high scores, paused farm state and safe exits passed |
| Enterable mine | Implemented | Entry, tool tiers, real resource yields, repeated-reward rejection and regeneration passed |
| Seasonal merchandise / retained ownership | Implemented | All four catalogue availability guards, rejected off-season purchases and retained ownership/placement/save state across seasons pass |
| Foliage, bridges, lighting and environmental art | Integrated | Cached seasonal foliage, bridge lamps/arches, dawn/dusk/night, grass and decorations added; visual/performance checks underway |
| Held tools / working poses | Implemented; poses approved | Fixed-length hand-attached tools; overhead windup/contact/recovery and tipped-can watering pass targeted checks; original directional impact/tier/energy regressions pass |
| Music, tool sounds and ambience | Implemented; audible review pending | Soft/plucked/chip music, paper sounds, distinct soil/wood/stone/water/harvest effects, birds and proximity river ambience. Generated effects, mute and explicit node cleanup pass browser checks |
| Save migration / portable saves | Schema 5 integrated | Old schemas 1–4 remain accepted; new chicken state and actual stored schema 5 tested. Main legacy/negative-data regression and portable-save suites pass; targeted chicken/editor/schema and full stability validations pass |
| Native apps / GitHub release | On hold by user instruction | No updated APK, EXE, DMG or release is being produced in this browser-only pass |

## Verification ledger

- All eight main browser suites passed on the controller/visual expansion checkpoint (`integration-regressions-r10.log`). This includes original-house nighttime persistence and the independent QA regressions.
- Current targeted suites pass for chicken care/ownership/eggs/save rollback, arcade/mining, book/chest interactions, and all 14 A/C phone layouts.
- New-home service/navigation anchors are now covered by passing interior/route suites. Clear riverbank access was restored after procedural trees displaced the old fishing approach.
- Portable import/export, malformed files, interrupted imports, multi-key rollback and native save-bridge contract checks pass.
- The latest journal navigation eligibility/viewport refinement passes: recipe ingredients remain visible, chapter navigation starts at the top of the spare page, and page controls fit desktop plus portrait/landscape phone viewports.
- The six initial expansion suites passed after restart. New furnishing, profile, seasonal and controller/phone HUD regressions are also available; their focused checks pass.
- The full eight-suite main regression pass was repeated successfully with the dedicated editor integrated (`integration-regressions-editor.log`). Later editor text-size and controller-HUD spacing changes pass their targeted checks.
- Eight additional controller/phone cases include active waypoints and transient item labels, using generic long button prompts.
- The entire expansion is not marked complete: feedback on right-side menu controls, final performance/compatibility review and final verification handoff remain.
- No physical-controller, audible-output, real-phone frame-rate or newly packaged-app certification is claimed.

## Confirmed integration issues

| Issue | Cause / fix | Status |
|---|---|---|
| Out-of-bounds camera after travel | Transition path assigned an unclamped camera; unified clamped follow/settle function | Targeted reproduction and regressions pass |
| Pen waypoint inaccessible with closed gate | Destination was inside enclosure; moved approach point outside the gate and connected lane | Original route test passes |
| Occupied coop could be stored | Generic furniture removal allowed active housing removal; occupied coop guard added | Actual editor move/store guard and extended UI reproduction pass |
| New shopkeeper Browse Shop crashed | Old handler only mapped the original shops; service routing extended | All nine dialogues and service routing tests pass |
| Save writer forced old schema number | Existing save() assigned version 4; changed writer to 5 and asserted actual stored bytes | Targeted persistence test passes |
| Nested care transaction could save midway | Existing transact() saves internally; outer transaction now defers those writes until full commit | Purchase plus feed, water, eggs and medicine commit-once / full rollback tests pass |
| Recipe labels overlapped buttons | Flex shrink compressed wrapped labels; fixed non-shrinking labelled controls | Menu tests and screenshots pass |
| Portrait HUD overlapped minimap | Inherited 124px action-width cap wrapped controls; removed cap for the compact phone row | All 14 A/C layout cases pass |
| New home navigation anchor absent | Added explicit reachable living/interaction anchors | Full interior/path regression passes |
| Original homes rejected by expanded save validator | Dynamic room-only list omitted Lina/Rowan/Mira homes; canonical scene list now includes declared building destinations | Real nighttime save/reload in all three homes, mid-route reload and full stability suite pass |
| Riverbank fishing approach blocked by scenery | Procedural trees could occupy a bank approach; adjacent bank foliage is now non-blocking | Original purchased-rod/catch/sell reproduction passes |
| Tool sprites stretched / hoe orientation unclear | Target-relative shaft length replaced with fixed geometry and explicit overhead/contact/recovery poses | Pose, real watering, original impacts and tier/energy tests pass; poses approved |
| Button layers used conflicting corner shapes | Backing, frame and face now share stepped outlines; layer bounds stay inside the hit box | Slot overflow and phone/tablet layout checks pass |
| Whole-page index pushed book controls outside viewport | Spread height now accounts for header/footer; ordinary page buttons use a grey panel, attached tabs remain at the edge | Desktop/phone viewport and recipe visibility regressions pass |

## Design review

Preview images are shared on `review/1.0-menu-previews`, separately from unreleased game code. Current direction: cream/yellow paper, full-window book layout, central crease, leather backing and stepped corners. Book and journal navigation are approved, including the raised grey panel of ordinary buttons on a spare page. Furnishing layout A is selected. The right-side controls on other menus are implemented and await feedback on the latest pictures.

User-selected phone behaviour: **A by default, optional C in Settings**.

For each set of visual options, wait for the user's response before continuing that specific design task. Continue independent gameplay, bug fixes and tests meanwhile. Silence is not approval.

## Editor integration fixes

| Issue | Proper fix | Verification |
|---|---|---|
| Touch Confirm did nothing after a canvas drag | Browser compatibility clicks could be suppressed after pointer capture. Editor touch controls now activate on a valid pointer release and suppress the following compatibility click | Real emulated touch drag/confirm, purchase-once and touch-close reproductions pass |
| Canvas border shifted touch tile coordinates | Plan render size uses the content box; hit testing subtracts the actual border | Real touch tile and drag targets pass |
| Off-season furniture available through retained Build menu | Availability is checked in both the catalogue and purchase handler, alongside the new editor | All four seasons and forged stale purchase buttons pass; owned decorations remain usable |
| Long controller hints covered phone navigation / labels | Hints receive full available width above the hotbar, with separate portrait label spacing; old placement toolbar takes priority | Eight generic-controller A/C phone/tablet cases pass |
| Editor generic button text overrode compact labels | Scoped editor typography respects the shared UI scaling preference | Actual previews and touch placement checks pass |

## Latest visual refinement

- Journal navigation panel lifted beneath the top-right Close button; the left page and page-turn controls keep their positions.
- Side body/face narrowed and nose reduced. Side-view legs now stride horizontally and shoes point in the facing direction; right/left feet mirror across six walk frames.
- Book/storage, tool/audio and new `tests/profile.cjs` checks pass after these changes. The earlier full eight-suite pass remains the broader checkpoint.

## Repeatable checks

Run `npm test` and `node tests/portable.cjs` for the established regression suite. Expansion checks are available as:

```sh
node tests/controller.cjs
node tests/tool-audio.cjs
node tests/animals.cjs
node tests/chicken-loop.cjs
node tests/activities.cjs
node tests/book-storage.cjs
node tests/phone-layouts.cjs
node tests/profile.cjs
node tests/furnishing.cjs
node tests/seasonal.cjs
node tests/phone-controller.cjs
node tests/menu-layout.cjs
node tests/town-services.cjs
node tests/performance.cjs
```

Browser tests need installed Playwright and Chromium (`CHROMIUM_PATH` can override the browser path). Each test uses a fresh disposable origin. Generated images are under the ignored `tests/artifacts/1.0/` directory. No player save files are used.

Existing test expectations were updated only for intentional changes: non-working residents retain daily routines; the closed pen gate deliberately blocks one path tile and must open/close correctly; the accepted landscape hotbar can be 350px wide; destination map icons are removed. Fixtures that deliberately rewind the calendar now reset their empty-flock test clock. Transaction, conservation, collision, restore and corrupt-data assertions remain in place.

## Latest menu and service checks

- User selected furnishing layout A. Editor area/zoom, palette and placement actions are now on the right; plan remains on the left. Book/journal controls retain their approved layout.
- Title, pause, settings, map/destination and other menu action groups now use the right column. Shop-card purchase controls retain their item context on the right; bag navigation moved to its right side. Inventory slots remain in their grids.
- `tests/menu-layout.cjs` passes real character creation, right-column geometry, settings persistence, A editor controls, backpack navigation, book/journal exemptions, portrait/landscape sizing and screenshot capture.
- Controller and furnishing suites pass after the move, including touch drag/confirm, single purchases, complete failed-write rollback, chest quality/identity, machine upgrade preservation and occupied coop restrictions.
- Newly discovered service UI issue: residents offered nonexistent shops, and outside animal/seasonal catalogues offered purchases the backend correctly refused. Removed resident shop offers; outside catalogues disable purchase/adoption and provide a working map button. Closed seasonal shop now shows its hours. `tests/town-services.cjs` verifies all nine dialogues, outside disabled controls, real inside purchases/debits and closed-shop feedback.
- Pictures are shared at preview commit `4590b35aebe787d2595f2aaa7ae5db367fa394d5`. Further layout refinement waits for user feedback. No unreleased game code was pushed.

## Final automated checkpoint for right-side menus

- All eight established `npm test` suites passed after the menu and service fixes, including cooking reservation/reload conservation, save corruption rejection, old-home saves, original tool tiers, purchases, market grades, collision and progression regressions. Log: `/workspace/previews/farmingstar-1.0/final-menu-regressions.log`.
- Controller, furnishing, menu layout, all nine town services, animal care, naturally produced egg/cake/request/shipping integration, three arcade games/mine, book/storage, all four seasons, portable saves, 14 A/C phone layouts, eight controller/phone layouts, profile and tool/audio suites pass. The final nested fishing/dialogue action placement was followed by controller/menu/service and mobile compatibility checks.
- Renderer measurements (`tests/performance.cjs`, 240 warmed update/draw submissions per scene, cloud Chromium 1280×800): farm median 3.3 ms / p95 15.7 ms; rainy town 4.8 / 17.6; evening forest 3.6 / 18.4; home 1.3 / 13.4. These are CPU submission timings on a shared cloud machine, not presented-frame measurements or Android FPS certification. Audio/compositor/device time is excluded.
- No failing automated reproduction remains from this pass. Outstanding review: feedback on right-side menu pictures, audible-output assessment, physical-controller compatibility and actual-device performance. Native packaging/publication remains on hold.

## Compact phone menus and carried tools

- Confirmed cause of oversized carried tools: the idle pose drew the full working tool geometry. A dedicated nearest-neighbour sprite cache now renders carried equipment at 62.5% of that size, anchored at the hand. Working tools retain the approved overhead/tipping poses, contact timing, particles and sounds. No inventory/icon sizes, interactions or save fields change.
- Phone menus use shorter headings and smaller secondary text. Routine descriptions, repeated branding and save guidance stop occupying menu space; shop hours, counts, prices and storage errors stay visible. Settings → Help & controls covers touch/keyboard input, farming, storage, furnishing, map/town, cooking/fishing and saves/sound.
- Settings content and Help scroll independently from its reachable Save action. Reading Help preserves unsaved form values. Existing text-size preferences still apply.
- Pause actions use a compact two-column group on the right. Furnishing plan and placement actions remain on screen; its right palette scrolls independently. Backpack keeps finger-sized slots, right navigation, a shorter empty-selection hint and its handle. No approved book/journal design was replaced.
- `tests/phone-compact.cjs` measures all six carried tools at two tiers/four facings (48 cases), verifies scaled pixel bounds, captures real menu pictures, and tests touch flows at 844×390, 568×320 and 390×844. It also checks Help access, unsaved settings, Save visibility, the larger text preference, menu bounds, placement controls and all ten starter inventory slots.
- Tool/audio, controller, furnishing, menu layout, book/storage, 14 A/C phone layouts and eight controller/phone layouts pass. All eight established browser suites also pass (`compact-full-regressions.log`), including saves, duplication, tool tiers, farming/cooking, travel, mobile fishing and bedtime. The final font-scaling refinement passes the focused phone checks.
- Preview commit: `25de7f3efb688dfecbfff71caea226d6c37f3571`. Further visual refinement waits for feedback. Native installers, beta packages, versions and releases remain unchanged.
