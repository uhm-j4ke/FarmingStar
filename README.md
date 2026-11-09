# FarmingStar — Moss & Ember

An original, offline, top-down farming and kitchen game. This release branch packages **Alpha 0.4.0** with native Android and desktop wrappers, portable saves and the original forest portrait icon. The prior 0.4.1 stability repairs are retained; the public package version follows the requested Alpha 0.4.0 release metadata. Compact furnished shops, NPC routines, slot backpacks, fishing and Bramblewood exploration remain available. This is a playable release, not the complete master specification. See [CHANGELOG.md](CHANGELOG.md), the [repair handoff](bug%20reports/REPAIR_CHANGELOG.md) and the [issue ledger](bug%20reports/FIX_STATUS.md) for fixes, exact reproduction checks and remaining validation.

## Play

Download/open `index.html` in a modern browser. The entire game, procedural pixel artwork, styles and generated music are in that file; no network, build, account, asset download, or package installation is needed. Keep the same browser and file/location for your three save slots. Existing single saves migrate automatically; the original legacy data remains as a backup. Browser storage restrictions or clearing site data can remove saves. Android file opening varies by browser/file manager; a local web server is another option.

For development, from this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in your browser. File and HTTP origins have separate saves. This project's managed Chromium policy blocks file URLs, so automated browser checks use a local HTTP server. Direct file launch on an unrestricted browser remains a manual check.

## First harvest

1. Create a farmer (new farms begin in autumn). Open Bag → Journal / Log Book for starter quests. Walk south of the farmhouse to the brown field.
2. Select the hoe. Face an adjacent tile, then click anywhere in the world or press Space / Use tool. The cursor never chooses a tool target.
3. Select carrot seeds and plant on that tile. Select the watering can and water it.
4. Enter the house through the front door with E / Talk–Enter. Stand beside the bed and interact to sleep.
5. Water and sleep again. Harvest the mature carrot by using any equipped item on it.
6. Walk east along the lane to town. Enter Juniper Grocery, approach the counter, and interact to buy or sell.
7. Visit Anvil & Oak for kitchen equipment. Purchases take you home: click a nearby free floor tile to place the station. Coins are charged only on placement; Escape cancels.
8. Stand beside a station and interact. Ingredients are consumed when cooking begins. Time three actions in the green zone. Gentle mode in Settings guarantees standard output.

The starter cutting board and stove are in your house. Potatoes become chopped potatoes, then golden potatoes with oil and salt. Buy the staples in town. Buy a mill, mixer and oven for wheat → flour → dough → bread.

Refill the can at the southeast pond. Collect free daily wild carrots with the scythe in the southwest corner: a fallback income source. A basic fishing rod costs 45 coins at the hut. Wood and stone come from marked trees/rocks using axe/pickaxe. Winter has no seed crops; fishing, cooking and forage remain available.

## Controls

- WASD / arrows: walk; face a tile, then click anywhere or press Space: equipped item (timed impact).
- E: interact with a door, counter, villager, bed, chest or station.
- 1–9: hotbar; I: inventory; M: map; Escape: pause / close.
- Mobile: joystick, contextual interaction, Use tool, touch hotbar and menus.
- Settings switches control modes, camera zoom, reduced motion, gentle activities, music, effects and master volume. Phone hotbar: swipe horizontally for more tools and seeds; tap to equip. The item name appears briefly after selection.

Menus pause time. One real second equals thirty game seconds: a complete natural day lasts 48 real minutes. Stand beside your farmhouse bed and press E / tap Talk–Enter to sleep until 08:00. Turning in early is available. After midnight, sleeping wakes you on the current date because the daily crop/shipping update has already happened. Seasons last 14 days. Watered crops grow when the date advances; rain waters all plots. Unsupported-season crops wither at season boundaries. Save failures produce an explicit warning.

The latest art refresh adds carved menu frames, seasonal background leaves, detailed original furniture, shop fittings, buildings, tools, food icons and character accents. The bold pixel font remains embedded. Reduced Motion disables falling leaves. All artwork stays offline in `index.html`; no asset fetches or save migration are needed.

## Implemented

- Connected farm and town, five compact town interiors, farmhouse and pantry, solid buildings, doors and equipment; camera and depth-sorted original pixel characters.
- Custom name, skin/hair/eye/clothing colours, hairstyles, two outfits and accessories; appearance can be edited later.
- Ten seasonal crop definitions, single and repeat harvests, watering capacity/refill, rain, four tool tiers, wood/stone gathering.
- Inventory, equipment hotbar, chest transfers, seasonal seed shop, ingredient shop, direct sales and validated transactions.
- Nine physical placeable station types and twenty recipes; three-action timing activities, gentle mode, quality and craft bonuses. Interrupted cooking resumes its saved ingredient reservation.
- Four adult villagers with indoor/outdoor routines, daily talk/gift friendship, optional companion designation and community deliveries.
- Three fishing rod tiers and five fish, market stocking/removal/collection, quality-aware daytime sales and end-of-day reports.
- Pannable/zoomable atlas, minimap, discovered-area travel, building landmarks, player/facing marker and walkable waypoint routes. Town has winding water, two bridges and eastbank gardens.
- Day/night tint, seasonal foliage, rain, wind, leaves, original pixel font/art/icons and generated music/effects. Three versioned localStorage save slots; migration preserves legacy data and corrupt slots remain isolated.

## Scope and next milestones

Cooking stations use timing activities rather than bespoke dragging, stirring, topping placement or temperature controls. Coffee uses a shortened roasting/grinding/brewing chain. NPC schedules and off-screen resolution remain lightweight. The market uses price presets and modest seasonal demand rather than a detailed preference simulation. Portable save export/import and native package candidates are now implemented. Livestock remains future work; native build and runtime results are tracked in [RELEASE_TEST_REPORT.md](RELEASE_TEST_REPORT.md).

The next milestone is completing the native macOS and Windows verification gates. The user reports that the Android beta functions perfectly on their phone; no device model or OS version was supplied. Browser emulation and synthetic checks do not establish hardware performance. No unrelated gameplay content is planned during this packaging phase.

**Future roadmap:** animal farming and controller support remain planned. **APK status:** the offline Android test build, with persistent saves, back handling and the original icon, is available in [betas/](betas/). Android work is paused following the user’s successful phone test; release signing remains a separate milestone.

## Browser regression tests

The game has no runtime dependencies. `npm test` runs the original seven browser suites plus the independent-report regression suite; `npm run test:stability -- --record=recheck` writes a named result file under `bug reports/verification/`. Development checks require Node.js, Playwright and Chromium:

```sh
npm ci
npm test
```

`CHROMIUM_PATH` can select a system Chromium binary (defaults to `/usr/bin/chromium`). Browser execution must be permitted by the host sandbox. Tests launch an ephemeral local server and check character creation, keyboard movement, farming over two days, shop purchases/sales, failed transactions, storage, cooking, equipment placement/collision, save restoration, operation with network disabled, mobile layouts and corrupt-save recovery. Update checks also cover the pixel UI, editable inputs, native touch hotbar/joystick/map gestures, camera zoom targeting, journal rewards, map routes, multi-slot saving, migration and invalid-position relocation. Screenshots are generated under `tests/` and ignored. Tests use controlled state hooks for repeatable scenarios; manual end-to-end play and physical Android tests are still needed.

The embedded font is generated from original grid patterns by `tools/pixel_font.py` (development-only Python dependency: fonttools). Regeneration is optional; the playable HTML already contains the font.

## Hearth & Acre and home building

Visit the estate agency north of the town lane (08:00–18:00) to preview parcels, select their initial use, redevelop land or extend the farmhouse eastward. Purchased land remains yours after saving. Existing fields, machines, furniture and storage survive upgrades.

At home or on your farm, use **Build** for Furniture Shop, Owned Furniture and Build Mode. Buy into furniture storage, choose Place/Move, tap a target floor tile or face it and choose Preview, rotate if useful, then Confirm. Escape/Cancel preserves the original item. Removed chests keep their contents. Outdoor furnishings/machines require an owned parcel. TV interaction shows the saved daily weather and tomorrow’s consistent forecast.

## Saves and history

Load Game → a slot’s **...** menu opens Rename, Delete and Autosave History. Four rolling restore points are made at roughly 60 seconds of active play; menus/inactive tabs pause the interval. Current progress saves separately at important actions. Confirm before restoring; one pre-restore safety copy permits Undo last restore. Restore points are isolated by farm. Browser storage is not a permanent backup; use Save files & transfer to export a validated portable backup. See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md#portable-saves) for import confirmation, full replacement and backup recovery details.

The minimap and atlas share actual world terrain and original illustrated woodland/roof assets. Tap the map for the atlas; use the **?** button for the compact icon legend. The reference image inspired density and overhead styling, not copied geography.

**Permanent roadmap:** animal farming and controller support in future updates; iPad IPA with minimum iOS 15 support only on explicit request, subject to suitable build/signing tools. The Android test APK is already available; no iOS package is produced.

## Backpack and village life (0.4.0)

New farms carry 10 real inventory slots; the first row is the hotbar. Buy additional rows in Juniper Grocery’s equipment category. Tap an item then another slot to swap, drag on a computer, split/sort stacks, or select a chest for bulk transfer. Quality remains on stored items. Existing farms migrate without losing quantity, even if their previous contents require more capacity or recoverable overflow.

Grocery: 08:00–23:00. Blacksmith and estate: 09:00–21:00. Fishing hut: 07:00–21:00. Staffed hall: 08:00–22:00; the hall itself remains public. Workers follow shared interior/outdoor/off-screen routines. Approach shelves, counters or objects and use the matching contextual prompt. Floating furniture labels are removed. Use Clear Waypoint on the map or active navigation panel; arriving clears it automatically.

From town, follow the northeast lane north into Bramblewood. Seasonal forage renews every three days; quarry rocks provide stone, ore and clay. Skills unlock crafting and recipes; crafted objects go to Owned Furniture. Community donations repair a forest crossing, build a well, expand the stall or add lights. The shipping crate beside the farm chest pays once when the date advances. Check the hall calendar for optional season-day-eight activities.

Buy a basic rod (45c), equip it, face suitable water and cast. Hold Space/the reel button to raise your catching zone; release to lower it. Keep the moving fish in the zone. Improved/advanced rods unlock through Fishing skill. Gentle mode can finish the activity at standard quality. Fish can be sold at the hut or used in appropriate cooking recipes.

Android landscape is preferred: joystick left, hotbar centre, interaction/tool controls right. Portrait remains available with a rotation suggestion; orientation locking is attempted where the browser supports it.

The next phase is stability. See [QA-HANDOVER.md](docs/QA-HANDOVER.md) for canonical state, transaction rules, clock/NPC logic, test hooks, limitations and priorities.

## Stability candidate (0.4.1)

Cooking writes its ingredient reservation before the minigame starts and resumes it after reload. If storage cannot accept the reservation, ingredients stay in the bag. If completion cannot save, no output/reward is granted and **Finish & save** retries the reserved recipe. Saves created by old interrupted cooks contain no recovery record, so already-lost ingredients cannot be reconstructed.

Farm replacement starts play only after the new primary save succeeds. Restore points and undo are checked against farm identity; failed cleanup cannot bring the old farmer into the new lineage. Invalid nested saves are rejected without replacing live progress. Invalid history/undo bytes are copied to companion `.unreadable` recovery keys before overwrite; backup failures retain the original bytes.

Staffed hall deliveries and project donations operate 08:00–22:00. The public board/calendar and accepting/cancelling requests remain available after hours. Solid placement cannot overlap the farmer, including at confirmation after moving. Failed energy/capacity tool actions consume neither energy nor obstacle damage. Market payouts use the exact sold stack’s grade, and inventory merges retain surviving equipment selection.

The imported independent reports are unchanged in `bug reports/`; their external scripts and traces were not attached. See the [repair changelog](bug%20reports/REPAIR_CHANGELOG.md) for coverage and recovery limits. Existing schema 1–4 saves remain supported; no unrelated gameplay systems were added.


## Native alpha packaging

See [build instructions](BUILD_INSTRUCTIONS.md), [test results](RELEASE_TEST_REPORT.md), [release issue log](RELEASE_BUG_LOG.md) and [artifact manifest](RELEASE_MANIFEST.md). Current native packages are candidates until their platform gates pass. The GitHub workflow builds macOS Universal 2 on a Mac, tests the same DMG on Intel and Apple Silicon, and builds/tests Windows x64 alongside Mac rechecks after shared tests. It does not publish a release. Controller support and animal farming remain in [the future roadmap](ROADMAP.md).
