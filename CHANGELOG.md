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
