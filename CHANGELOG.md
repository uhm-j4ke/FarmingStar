# 0.4.0 — Bramblewood & village life

## Completed and modified

- One contextual resolver drives both bottom-right/mobile prompts and the actual action. Floating machine labels are removed. Doors, shelves, counters, villagers, pond, well and furnishings share targeting; Tab cycles candidates.
- Compact grocery, smith, estate office, tackle hut and hall layouts use authoritative furnishing collision. Original exterior footprints remain. Shelves display varied goods; forge, tools, files, blueprints, nets, rods, crates and community furnishings distinguish businesses.
- Canonical 10-slot starter backpack; first row is the hotbar. Four upgrades add ten slots each, to fifty. Drag/touch swaps, stack merging/splitting, sorting, item details, quality badges, bulk chest transfers and full-bag checks are integrated. Legacy inventories expand safely or preserve overflow. Furnishings stay in their own storage.
- Unified NPC work/home/social/weather/festival plans simulate off screen and move through valid doors/routes on screen. Grove and quarry are reachable. Clock progression is one real second per thirty game seconds, including natural midnight rollover. Grocery closes 23:00; smith/estate/hut 21:00; staffed hall 22:00. Occupants can leave after closing.
- Three purchasable rod tiers, five fish definitions, a casting wait and a hold/release catching-zone activity. Fish availability follows area, time, season and rain preference. Catching awards skill/collection progress; catches sell or substitute into fish recipes. Gentle mode remains available.
- Five ten-level skills and specialisations, crafting recipes, renewable foraging/quarry resources, seasonal forest nodes and a supply-cache discovery. Crafted furnishings use the existing build system. Clay and ore are renewable quarry outputs.
- Fertiliser and three product grades affect harvest value and cooking. Quality persists in storage and shipping. Eight additional recipes add pizza, cakes, tea, stew and tarts, with skill/discovery/cookbook/project/festival unlocks. Original recipes stay available. Cooking minigames remain; equipment upgrades improve consistency.
- Shipping crate, once-per-day payout/report, modest seasonal market demand and price presets, four material-donation projects with actual crossing/well/stall/lighting benefits, daily accepted requests, gift preferences and four optional seasonal activities. Collections and once-only milestone rewards extend the existing journal.
- Stable varied grass/path textures, less regular garden flowers, a shaped refill pond, scattered woodland, decorative wildlife/forest audio and landscape-first touch placement. Portrait fallback, tablet layout, safe areas, reduced motion, dialogue speed, interface size, highlights and optional energy are preserved or added.
- Version 4 migrations preserve existing progression and the four-point autosave history. No build or external runtime asset is needed.

## Fixes found during integration

- A superseded NPC update function was overriding the new scheduler; duplicate-function audit and schedule tests caught it.
- A forest-size edit hit an optional-chaining expression in the door helper. The forest now has explicit 44×36 bounds, a proper entry, reachable destinations and dedicated traversal tests.
- Waiting-phase time could be applied immediately to a new fishing activity after a large update delta; phases now hand over without double-applying elapsed time.
- Full output-quality stacks could leave cooking/fishing unable to complete; all possible output grades are capacity-checked before starting.
- Clearing a waypoint inside the atlas could leave stale enabled travel buttons. Selection, markers, routes and action availability now clear together; selecting another destination re-enables them.
- Quality would have been lost through quantity-only storage. Containers now use the same stack shape as the backpack, with computed legacy quantity views.
- Legacy overflow retrieval now recovers one stack at a time, so inventories above maximum carrying capacity remain recoverable.
- Tests now use the intentional slot UI and compact service coordinates while retaining previous gameplay assertions.

## Validation and handover

All six browser suites pass. They check new systems plus retained farming, shop sales, cooking, storage, estate upgrades, character/input rendering, touch controls, saves and offline operation. Physical Android/iPad testing and extended economy/season balance playthroughs remain outstanding. No physical-device frame-rate guarantee is made.

The full technical handover, state invariants, transaction functions, schedules, test interfaces, save format and known simplifications are in [docs/QA-HANDOVER.md](docs/QA-HANDOVER.md). The new specification is retained in [docs/IMMERSION-PROGRESSION-SPEC.md](docs/IMMERSION-PROGRESSION-SPEC.md). This release ends the major-feature pass; next work should focus on stability and systematic regression/performance testing.

**Future only:** animal farming; offline Android APK on explicit request; iPad IPA for iOS 15+ on explicit request with appropriate build/signing facilities. Neither application package is produced.

---

# 0.3.0 — Hearth & Acre

The world-expansion specification is retained in [docs/WORLD-EXPANSION-SPEC.md](docs/WORLD-EXPANSION-SPEC.md). The subsequent map reference guided the illustrated overhead design, not its geography or assets.

## Completed

- **Character and tools:** Stable integer head/eye coordinates independent of body breathing and walk frames. Distinct front/back/profile poses, distance-driven walking and retained facing. Tools use the facing tile regardless of pointer position, with a timed impact, cooldown, movement lock, directional swing/can tilt/rod line and particles. Upgraded hoe and watering strips extend forward and stop at obstacles. Switching tools during a swing cannot change the pending action. Fishing adds a short bite wait and cancel option before the retained timing game.
- **World:** Farm grows to 56×40 tiles, town to 60×48. Estate agency, three connected villager homes with interiors/gardens, denser mixed woodland and bushes, explorable connecting lanes, existing shops/river/bridges preserved. Night routes lead villagers toward their home entrances. Decorative woodland trees can be chopped for wood; clearings persist.
- **Estate:** Hearth & Acre opens 08:00–18:00, with estate agent Edda. Four fenced parcels cost 240/420/650/900 coins. Preview the exact footprint, confirm purchase and choose agriculture/storage/building/garden. Redevelopment costs 75c and preserves crops, furnishings and stored items. Layouts supply prepared rows, a chest or garden furnishings; every owned parcel remains usable for later farming or furnishing.
- **Home:** Four levels, costing 350/750/1400c after the starter cottage. Expansions add floor width to the east without moving doors, furniture, stored items or stations. Roof/details change with level. New homes include bed, television, counter, table, chair, chest, plant and the existing cooking board/stove. TV forecasts match saved daily weather.
- **Build & Furnish:** Buy into separate furniture storage, preview valid/invalid placement, rotate, confirm, cancel, move, or store. Bed/door access and reachable interaction space are checked. Removed chests retain their identity and contents; equipment can be stored/replaced. Owned parcels support outdoor furnishings and cooking stations. Legacy equipment is preserved; starter furniture that would overlap it goes into owned storage.
- **Illustrated maps:** Shared high-resolution terrain cache for minimap and atlas, miniature leafy crowns rather than square tree markers, woodland clusters, grassy/flower textures, shaded banks and rippled water, planked bridges, tiled top-down roofs, gardens, hedges and parcel boundaries. Map clearings, crops, home roof level and furniture reflect saved world data. Shared pixel destination icons, expandable legend, heading arrow, waypoints, drag/zoom/recenter and discovered-area travel remain. Artwork is original and no external assets are used.
- **Weather:** Daily deterministic seasonal probabilities for sunny, partly cloudy, overcast, rain, heavy rain and winter-only snow. Today/tomorrow forecasts persist. Both rain types water outdoor plots, with precipitation/darkening and smooth generated rain/river ambience. Snow has particles and roof/ground treatment.
- **Conversations:** Bottom panel, matching original portraits, typewriter text, generated bleeps and appropriate short greeting responses. Game controls hide, pause stays accessible, and the HUD restores on close. Seasonal decorative popup leaves have finite lifetimes and respect reduced motion.
- **Platforms:** Phone camera requests about 12% wider views, quantised to whole physical pixels at the device's pixel density; exact change depends on density and selected zoom. Safe-area positioning, tablet minimap/control layouts and the compact phone hotbar are preserved.
- **Saving:** Version 3 migration accepts existing v1/v2 farms without resetting progression. Current state and up to four autosave restore points are separate per slot. Autosaves use 60 seconds of active gameplay, defer history writes until activities are safely complete, and pause with menus/inactive tabs. Important changes also save. Nearby writes coalesce. Slot `...` menu provides history, rename and delete. Restoring requires confirmation and retains one undo copy in addition to the four-point history. Failed writes give a warning; localStorage writes are atomic per key. Browser/OS deletion of storage remains outside the game's control.

## Bug fixes and evidence

- Faces previously shared breathing offsets and front-shaped side poses; the new integer head anchor and profile renderer are checked for stable eye pixel positions in all directions and walk frames.
- Upgraded tools previously applied strips across the facing axis. Tests now verify forward strips, wall blocking, delayed impacts, duplicate-trigger rejection and captured tool identity.
- Existing positions that conflict with denser geometry are relocated to a walkable tile on load; owned items and crop state remain intact.
- Furnishing collision and validation share footprints. Placement cannot block the door, overlap objects or isolate required interaction access. Cancellation leaves the original object intact.
- Outdoor equipment originally failed home-only save bounds during integration; validation now uses its actual area.
- An opaque loading fade could freeze behind a popup. Visual transitions now finish independently while gameplay time pauses.
- Current-state writes, history rollover, restore confirmation, failure recovery and per-slot isolation are tested independently.

## Validation and remaining limits

`npm test` runs the existing gameplay/touch suites plus `tests/expansion.cjs`. Checks include farming over days, shops, cooking, storage, fishing, save migration, isolated slots, front-target actions, stable eye pixels, land transactions, house upgrades, furniture/chest preservation, invalid placement, forecast consistency, rain watering, NPC dialogue controls, every landmark's reachability, four-point history, restore confirmation, write failure/recovery, map density/cache invalidation and high-DPI phone/tablet layouts. Screenshots are produced under `tests/` and ignored by Git.

Browser tests use controlled hooks for repeatable scenarios plus real pointer/touch input for UI. They do not replace extended manual playtesting or physical Android/iPad performance measurements. No claim of measured 60 FPS on physical devices is made. Managed Chromium blocks file URLs; the single file has no external requests and is tested through local HTTP with offline gameplay checks.

NPCs have lightweight outdoor routines and home-front-door night destinations, not a full simulation of entering/leaving homes. New home interiors share a common furnishing vocabulary. Chair/bench use supplies a short rest message rather than a seated character pose. Tool particles use a compact shared rendering system, not elaborate per-tool sprite sheets. Furniture rotation uses footprint/layout changes, with symmetric pieces naturally unchanged. Snow coverage is visual rather than a persistent depth simulation. The map illustrates this game's actual two areas rather than adding the reference image's mountains, coast, railway or island.

**Next:** Physical Android/iPad playtesting, longer progression/balance tests, richer household/NPC schedules and additional animation/art variation.

**Future roadmap:** animal farming remains a future update. Build a fully offline Android APK only when explicitly requested. Build an iPad IPA targeting iOS 15+ only when explicitly requested and with suitable iOS build/signing tools. Neither package is produced here. Save export/import remains a future reliability enhancement.

---

# 0.2.0 — The autumn pages

## Visuals and usability

- Original embedded Ember Grid font, pixel-framed menus, pixel icons and textured terrain; no fonts or artwork are downloaded.
- Closer integer camera scales (3x/4x/5x desktop; one step lower on narrow screens). Pointer targeting uses the current canvas dimensions and camera position.
- Detailed outlined farmers and villagers with directional poses, idle breath/blink, walking and tool feedback. Walking animation follows actual movement; stopped villagers stop stepping.
- Autumn starts new farms on calendar day 29. Existing dates remain unchanged. Original autumn tree palettes, falling leaves, warm tint, grass/flowers, shrubs, chimney smoke, warm lamps, and gently moving canopies/crops. Reduced-motion option and system preference support.
- Animated title illustration, three save slots, per-slot portraits and metadata, confirmation before replacement/deletion. Valid legacy saves migrate into a free slot without modifying the original backup. Corrupt slots do not block others.
- Compact mobile hotbar: approximately 254 × 50 CSS pixels, capped for narrow screens; native horizontal swipe, 40px item targets, separate quantity badges, automatic reveal of equipped items, no keyboard numbers, briefly shown selection name. Desktop retains keyboard numbers and a persistent name label.
- Native character inputs now explicitly specify foreground, background, caret, placeholder and focus colours. Editing shortcuts remain native.

## World and guidance

- Town expanded from 36 × 28 to 52 × 40 tiles, with paths connected to actual entrances, benches, eastbank gardens, additional trees/shrubs and hedged boundaries. The original four town interiors remain accessible.
- Winding river, two walkable bridges, visible banks, and water continuing beyond the map. Rendering, collision, maps and routing share geometry.
- Expanded minimap atlas: mouse/touch drag, bounded zoom, recenter, selectable landmarks, discovered-area travel, player position/facing and routes computed over walkable tiles.
- Inventory now has a Journal / Log Book tab: thirteen event-driven starter chapters, instructions, progress, completion history and one-time rewards. Includes a one-time carrot request at the hall; original soup deliveries remain available.
- The journal explains free daily forage and the free fishing rod as recovery income. No timed quest expiry. Seasonal objectives can be resumed when their crops return.

## Bug record and verification

| Problem | Cause and fix | Verification |
| --- | --- | --- |
| Reported white text in character inputs | Form colours depended on browser defaults/inheritance. Explicit dark text, text-fill, light background and caret; game shortcuts exempt text controls. | Browser-computed contrast colours, native cursor movement, insertion/deletion and keyboard shortcuts tested. |
| Seed labels overlap hotbar slots | Full names, counts and shortcuts competed in fixed small cells. Replaced text labels with original pixel icons, independent badges and a separate item-name label. | Portrait/landscape bounds and overflow checks; browser-generated touch swipes and seed selection. |
| Character preview clipped its head | Original 3x preview placed a taller updated sprite above the canvas. Reframed full sprite at 2x within the preview. | Pixel check for clear top margin and screenshot inspection. |
| Title settings discarded on New Game | Preferences existed only in transient game state. Persisted non-secret preferences separately and merged them into new farms. | Title settings flow, new game and continued saves tested. |
| Waypoint text incorrectly called non-town landmarks “Farm” | Old hint assumed only two destinations. Resolve names and directions from actual route/destination data. | Atlas waypoint/travel tests and route validation. |
| Paths and river could disagree with collision | Independent terrain conditions described straight roads/water. Shared footprints, paths, winding river, bridges and blocked-tile functions now drive maps and routes. | All town landmarks reachable from entry; paths avoid solid objects; routes contain walkable tiles only. |
| Old saves could place a player in new scenery/water | Changed geometry invalidated coordinates. Preserve valid positions; search nearest walkable tile for invalid positions on load. | Migration and invalid-position restoration tests. |
| Malformed transaction with overlapping input/output keys | Merging dictionaries could hide a negative input quantity. Validate every input and output entry separately before mutation. | Negative overlapping recipe inputs rejected; baseline transaction tests retained. |
| Mobile messages covered action buttons | Toast and touch controls used competing bottom offsets. Moved notifications and minimap around the compact bar/controls. | Screenshots and control-overlap checks at 390×844 and 844×390. |

## Validation and limits

`npm test` runs both the preserved gameplay regression suite and new update checks in Chromium, using an ephemeral loopback server. It checks existing farming/selling/buying/cooking/storage/placement, offline operation, save restoration, malformed save recovery, input contrast/editing, title animation, camera targeting, journal reward idempotence, map panning/travel, landmark reachability, save-slot isolation, legacy preservation and player relocation. A touch-enabled browser context dispatches native touch events for the hotbar, joystick and atlas.

Screenshots are generated in `tests/`: title, creation, farm, town, journal, atlas and both mobile orientations. They are local review artifacts and ignored by Git.

Managed Chromium blocks file URLs, so direct file launch remains a manual check on an unrestricted browser. Physical Android devices and real-device frame rates have not been tested. Cooking still uses shared timing activities; fishing has one species; NPC routes are lightweight outdoor routines rather than full building schedules. No birds/butterflies, dedicated UI scale slider, new building interiors, bespoke cooking games, or additional music/ambience systems in this milestone.

**Next:** physical Android playtesting and balance, then bespoke cooking activities and richer town schedules.

**Future roadmap:** animal farming remains planned and is not implemented. **APK reminder:** a fully offline Android APK is a future milestone after browser stability.
