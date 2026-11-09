# FarmingStar 1.0 — development tracker

**Current state: development in progress. This update is not complete or released.**

Game changes are confined to `index.html`. This tracker is documentation requested during development. Android, Windows and macOS installers, package metadata, existing beta downloads and releases remain unchanged until the user authorises platform rollout.

## Current work

- Revise navigation pages to start at the top and use a whole page when space allows. Use ordinary buttons inside a lightly greyed panel there; use projecting sticker tabs only when both pages are fuller.
- Extend the approved yellow-paper, centre-crease, leather-outline and stepped-corner design language across the other menus. Preserve useful physical details such as the satchel handle.
- Build the dedicated overhead furnishing editor and its mouse/touch/controller interactions.
- Continue integration testing and repair confirmed failures before completion.

## Feature status

| Feature | Implementation | Verification / remaining work |
|---|---|---|
| Camera bounds and settling | Implemented | Old out-of-bounds transition reproduced; 20 area/frame-rate cases and orientation changes passed |
| Controller foundation | Implemented in shared HTML | Synthetic movement, hotbar, pause/back and disconnect passed; remapping, prompts and background-input checks remain; physical/native compatibility is not certified |
| Phone layouts A and C | Implemented, A default | 14 variants across seven phone/tablet sizes passed overlap checks; minimap opening and preference persistence passed |
| Compact phone title / shortcut menu | Implemented | Phone checks pass; final visual review remains |
| Expanded farm and town | Implemented | Old/new outdoor landmark reachability passed; full integration rerun underway |
| New villagers and interiors | Implemented | Schedules/dialogue integrated; full interior and path regressions underway |
| Chicken purchasing and housing | Implemented | Unique identities, cost, capacity, valid spawning and failed-save rollback passed |
| Feed, water, health and medicine | Implemented | Three hens consume full supplies over two days; sustained neglect and recovery tests passed; further fault and animation checks remain |
| Eggs | Implemented | Collection conservation, repeated-collection rejection, storage/persistence passed; final cooking/delivery integration checks remain |
| Coop / fixture artwork and chicken behaviours | Implemented | Visual and extended behaviour review underway |
| Slot-based chest interface | Implemented | Two grids, drag transfers both directions, splitting and item conservation passed; further failure/quality checks remain |
| Recipe book and journal | Functional, visual revision underway | Page/index navigation, page turns, swipe support and menu tests pass; latest whole-page navigation request is being applied |
| Overhead furnishing editor | In progress | Existing placement/storage safeguards retained; new editor not complete |
| Arcade | Three playable games implemented | Maze completion, memory pairs, rhythm scoring, duplicate-tap rejection, high scores, paused farm state and safe exits passed |
| Enterable mine | Implemented | Entry, tool tiers, real resource yields, repeated-reward rejection and regeneration passed |
| Seasonal merchandise / retained ownership | Implemented | Seasonal stock and furnishings added; final calendar/ownership regression matrix remains |
| Foliage, bridges, lighting and environmental art | Integrated | Cached seasonal foliage, bridge lamps/arches, dawn/dusk/night, grass and decorations added; visual/performance checks underway |
| Held tools / working poses | Integrated | Hand-attached raster tools and articulated arms added; visual and gameplay regression checks remain |
| More generated music and paper sounds | Integrated | Soft, plucked, chip and varied settings added; synthesis/lifecycle/mute checks remain |
| Save migration / portable saves | Schema 5 integrated | Old schemas 1–4 remain accepted; new chicken state and actual stored schema 5 tested. Full legacy/negative-data/fault matrix still underway |
| Native apps / GitHub release | On hold by user instruction | No updated APK, EXE, DMG or release is being produced in this browser-only pass |

## Verification ledger

- All eight original browser suites passed after the initial camera/controller foundation changes.
- Current targeted suites pass for chicken care/ownership/eggs/save rollback, arcade/mining, book/chest interactions, and all 14 A/C phone layouts.
- The first complete expansion rerun stopped at a missing navigation/service anchor in newly added homes. Those rooms now have explicit reachable anchors; retest is pending. This is not marked resolved yet.
- Broader legacy regression results must be read separately from targeted passes. No full expansion pass is claimed yet.
- No physical-controller, audible-output, real-phone frame-rate or newly packaged-app certification is claimed.

## Confirmed integration issues

| Issue | Cause / fix | Status |
|---|---|---|
| Out-of-bounds camera after travel | Transition path assigned an unclamped camera; unified clamped follow/settle function | Targeted reproduction and regressions pass |
| Pen waypoint inaccessible with closed gate | Destination was inside enclosure; moved approach point outside the gate and connected lane | Original route test passes |
| Occupied coop could be stored | Generic furniture removal allowed active housing removal; occupied coop guard added | Guard implemented; extended UI retest pending |
| New shopkeeper Browse Shop crashed | Old handler only mapped the original shops; service routing extended | Implemented; extended dialogue retest pending |
| Save writer forced old schema number | Existing save() assigned version 4; changed writer to 5 and asserted actual stored bytes | Targeted persistence test passes |
| Nested care transaction could save midway | Existing transact() saves internally; outer transaction now defers those writes until full commit | Purchase rollback passes; care-specific write-fault matrix pending |
| Recipe labels overlapped buttons | Flex shrink compressed wrapped labels; fixed non-shrinking labelled controls | Menu tests and screenshots pass |
| Portrait HUD overlapped minimap | Inherited 124px action-width cap wrapped controls; removed cap for the compact phone row | All 14 A/C layout cases pass |
| New home navigation anchor absent | Added explicit reachable living/interaction anchors | Full-suite retest pending |

## Design review

Preview images are shared on `review/1.0-menu-previews`, separately from unreleased game code. Current direction: cream/yellow paper, full-window book layout, central crease, leather backing and stepped corners. The latest requested refinement is whole-page, top-aligned navigation with ordinary grey-panel buttons where space allows.

User-selected phone behaviour: **A by default, optional C in Settings**.

For each set of visual options, wait for the user's response before continuing that specific design task. Continue independent gameplay, bug fixes and tests meanwhile. Silence is not approval.
