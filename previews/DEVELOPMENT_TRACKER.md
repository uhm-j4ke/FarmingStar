# FarmingStar 1.0 — development tracker

**Current state: development in progress. This update is not complete or released.**

Game changes are confined to `index.html`. This tracker is documentation requested during development. Android, Windows and macOS installers, package metadata, existing beta downloads and releases remain unchanged until the user authorises platform rollout.

## Current work

- Tab/button treatment and tool poses are approved. The requested final refinements are implemented: the journal button panel starts below the top-right button; side profiles are slimmer, with a smaller nose and forward-facing mirrored feet. Targeted checks pass.
- The yellow-paper, centre-crease, leather-outline and stepped-corner design is now shared across the menus; retain the satchel handle and obtain feedback on the latest pictures.
- Build the dedicated overhead furnishing editor and its mouse/touch/controller interactions.
- Continue integration testing and repair confirmed failures before completion.

## Feature status

| Feature | Implementation | Verification / remaining work |
|---|---|---|
| Camera bounds and settling | Implemented | Old out-of-bounds transition reproduced; 20 area/frame-rate cases and orientation changes passed |
| Controller support | Implemented in shared HTML | Synthetic title/start, name entry, colour palette, movement/deadzone, hotbar, bag/map/journal shortcuts, sliders/selects, remap/swap/persistence, reserved D-pad, atlas panning, placement, fishing, cooking, arcade, focus and disconnect tests pass. Physical controllers/native compatibility remain unverified |
| Phone layouts A and C | Implemented, A default | 14 variants across seven phone/tablet sizes passed overlap checks; minimap opening and preference persistence passed |
| Compact phone title / shortcut menu | Implemented | Phone checks pass; final visual review remains |
| Expanded farm and town | Implemented | Old/new outdoor landmark reachability passed; full integration rerun underway |
| New villagers and interiors | Implemented | Schedules/dialogue integrated; full interior and path regressions underway |
| Chicken purchasing and housing | Implemented | Unique identities, cost, capacity, valid spawning and failed-save rollback passed |
| Feed, water, health and medicine | Implemented | Three hens consume full supplies over two days; sustained neglect and recovery tests passed; feed/water/medicine single-commit and failed-save rollback checks now pass; final animation review remains |
| Eggs | Implemented | Collection conservation, repeated-collection rejection, storage/persistence passed; final cooking/delivery integration checks remain |
| Coop / fixture artwork and chicken behaviours | Implemented | Visual and extended behaviour review underway |
| Slot-based chest interface | Implemented | Two grids, drag transfers both directions, splitting and item conservation passed; further failure/quality checks remain |
| Recipe book and journal | Functional, visual revision underway | Page/index navigation, page turns, swipe support and menu tests pass; latest whole-page navigation request is being applied |
| Dedicated overhead furnishing editor | Not implemented yet | Existing world placement/storage safeguards are retained and tested. The new editor is the main outstanding gameplay feature |
| Arcade | Three playable games implemented | Maze completion, memory pairs, rhythm scoring, duplicate-tap rejection, high scores, paused farm state and safe exits passed |
| Enterable mine | Implemented | Entry, tool tiers, real resource yields, repeated-reward rejection and regeneration passed |
| Seasonal merchandise / retained ownership | Implemented | Seasonal stock and furnishings added; final calendar/ownership regression matrix remains |
| Foliage, bridges, lighting and environmental art | Integrated | Cached seasonal foliage, bridge lamps/arches, dawn/dusk/night, grass and decorations added; visual/performance checks underway |
| Held tools / working poses | Implemented; visual review pending | Fixed-length hand-attached tools; overhead windup/contact/recovery and tipped-can watering pass targeted checks; original directional impact/tier/energy regressions pass |
| Music, tool sounds and ambience | Implemented; audible review pending | Soft/plucked/chip music, paper sounds, distinct soil/wood/stone/water/harvest effects, birds and proximity river ambience. Generated effects, mute and explicit node cleanup pass browser checks |
| Save migration / portable saves | Schema 5 integrated | Old schemas 1–4 remain accepted; new chicken state and actual stored schema 5 tested. Main legacy/negative-data regression and portable-save suites pass; final expansion-specific validation remains |
| Native apps / GitHub release | On hold by user instruction | No updated APK, EXE, DMG or release is being produced in this browser-only pass |

## Verification ledger

- All eight main browser suites passed on the controller/visual expansion checkpoint (`integration-regressions-r10.log`). This includes original-house nighttime persistence and the independent QA regressions.
- Current targeted suites pass for chicken care/ownership/eggs/save rollback, arcade/mining, book/chest interactions, and all 14 A/C phone layouts.
- New-home service/navigation anchors are now covered by passing interior/route suites. Clear riverbank access was restored after procedural trees displaced the old fishing approach.
- Portable import/export, malformed files, interrupted imports, multi-key rollback and native save-bridge contract checks pass.
- The latest journal navigation eligibility/viewport refinement passes: recipe ingredients remain visible, chapter navigation starts at the top of the spare page, and page controls fit desktop plus portrait/landscape phone viewports.
- Six new reusable suites live in `tests/`: controller, tool/audio, animals, activities, book/storage, and phone layouts. All six reusable suites passed in a clean post-restart run.
- The entire expansion is not marked complete: the dedicated editor, final seasonal/placement matrix, design feedback and performance review remain.
- No physical-controller, audible-output, real-phone frame-rate or newly packaged-app certification is claimed.

## Confirmed integration issues

| Issue | Cause / fix | Status |
|---|---|---|
| Out-of-bounds camera after travel | Transition path assigned an unclamped camera; unified clamped follow/settle function | Targeted reproduction and regressions pass |
| Pen waypoint inaccessible with closed gate | Destination was inside enclosure; moved approach point outside the gate and connected lane | Original route test passes |
| Occupied coop could be stored | Generic furniture removal allowed active housing removal; occupied coop guard added | Guard implemented; extended UI retest pending |
| New shopkeeper Browse Shop crashed | Old handler only mapped the original shops; service routing extended | Implemented; extended dialogue retest pending |
| Save writer forced old schema number | Existing save() assigned version 4; changed writer to 5 and asserted actual stored bytes | Targeted persistence test passes |
| Nested care transaction could save midway | Existing transact() saves internally; outer transaction now defers those writes until full commit | Purchase plus feed, water, eggs and medicine commit-once / full rollback tests pass |
| Recipe labels overlapped buttons | Flex shrink compressed wrapped labels; fixed non-shrinking labelled controls | Menu tests and screenshots pass |
| Portrait HUD overlapped minimap | Inherited 124px action-width cap wrapped controls; removed cap for the compact phone row | All 14 A/C layout cases pass |
| New home navigation anchor absent | Added explicit reachable living/interaction anchors | Full interior/path regression passes |
| Original homes rejected by expanded save validator | Dynamic room-only list omitted Lina/Rowan/Mira homes; canonical scene list now includes declared building destinations | Real nighttime save/reload in all three homes, mid-route reload and full stability suite pass |
| Riverbank fishing approach blocked by scenery | Procedural trees could occupy a bank approach; adjacent bank foliage is now non-blocking | Original purchased-rod/catch/sell reproduction passes |
| Tool sprites stretched / hoe orientation unclear | Target-relative shaft length replaced with fixed geometry and explicit overhead/contact/recovery poses | Pose, real watering, original impacts and tier/energy tests pass; visual review pending |
| Button layers used conflicting corner shapes | Backing, frame and face now share stepped outlines; layer bounds stay inside the hit box | Slot overflow and phone/tablet layout checks pass |
| Whole-page index pushed book controls outside viewport | Spread height now accounts for header/footer; ordinary page buttons use a grey panel, attached tabs remain at the edge | Desktop/phone viewport and recipe visibility regressions pass |

## Design review

Preview images are shared on `review/1.0-menu-previews`, separately from unreleased game code. Current direction: cream/yellow paper, full-window book layout, central crease, leather backing and stepped corners. The latest requested refinement is whole-page, top-aligned navigation with ordinary grey-panel buttons where space allows.

User-selected phone behaviour: **A by default, optional C in Settings**.

For each set of visual options, wait for the user's response before continuing that specific design task. Continue independent gameplay, bug fixes and tests meanwhile. Silence is not approval.

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
node tests/activities.cjs
node tests/book-storage.cjs
node tests/phone-layouts.cjs
node tests/profile.cjs
```

Browser tests need installed Playwright and Chromium (`CHROMIUM_PATH` can override the browser path). Each test uses a fresh disposable origin. Generated images are under the ignored `tests/artifacts/1.0/` directory. No player save files are used.

Existing test expectations were updated only for intentional changes: non-working residents retain daily routines; the closed pen gate deliberately blocks one path tile and must open/close correctly; the accepted landscape hotbar can be 350px wide; destination map icons are removed. Fixtures that deliberately rewind the calendar now reset their empty-flock test clock. Transaction, conservation, collision, restore and corrupt-data assertions remain in place.
