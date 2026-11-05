# FarmingStar — Moss & Ember

An original, offline, top-down farming and kitchen game. This is a playable first release, not the complete master specification.

## Play

Download/open `index.html` in a modern browser. The entire game, procedural pixel artwork, styles and generated music are in that file; no network, build, account, asset download, or package installation is needed. Keep the same browser and file/location for your saved farm. Browser storage restrictions or clearing site data can remove saves. Android file opening varies by browser/file manager; a local web server is another option.

For development, from this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in your browser. File and HTTP origins have separate saves. This project's managed Chromium policy blocks file URLs, so automated browser checks use a local HTTP server. Direct file launch on an unrestricted browser remains a manual check.

## First harvest

1. Create a farmer. Walk south of the farmhouse to the brown field.
2. Select the hoe. Click an adjacent tile (or face it and press Space / Use tool).
3. Select carrot seeds and plant on that tile. Select the watering can and water it.
4. Enter the house through the front door with E / Talk–Enter. Stand beside the bed and interact to sleep.
5. Water and sleep again. Harvest the mature carrot by using any equipped item on it.
6. Walk east along the lane to town. Enter Juniper Grocery, approach the counter, and interact to buy or sell.
7. Visit Anvil & Oak for kitchen equipment. Purchases take you home: click a nearby free floor tile to place the station. Coins are charged only on placement; Escape cancels.
8. Stand beside a station and interact. Ingredients are consumed when cooking begins. Time three actions in the green zone. Gentle mode in Settings guarantees standard output.

The starter cutting board and stove are in your house. Potatoes become chopped potatoes, then golden potatoes with oil and salt. Buy the staples in town. Buy a mill, mixer and oven for wheat → flour → dough → bread.

Refill the can at the southeast pond. Collect free daily wild carrots with the scythe in the southwest corner: a fallback income source. Wood and stone come from marked trees/rocks using axe/pickaxe. Winter has no seed crops; fishing, cooking and forage remain available.

## Controls

- WASD / arrows: walk; click adjacent tile or Space: equipped item.
- E: interact with a door, counter, villager, bed, chest or station.
- 1–9: hotbar; I: inventory; M: map; Escape: pause / close.
- Mobile: joystick, contextual interaction, Use tool, touch hotbar and menus.
- Settings switches control modes and adjusts music, effects and master volume.

Menus pause time. An outdoor day lasts about eight minutes. Seasons last 14 days. Watered crops grow on sleeping; rain waters all plots. Unsupported-season crops wither at season boundaries. Save failures produce an explicit warning.

## Implemented

- Connected farm and town, four town interiors, farmhouse and pantry, solid buildings, doors and equipment; camera and depth-sorted original pixel characters.
- Custom name, skin/hair/eye/clothing colours, hairstyles, two outfits and accessories; appearance can be edited later.
- Ten seasonal crop definitions, single and repeat harvests, watering capacity/refill, rain, four tool tiers, wood/stone gathering.
- Inventory, equipment hotbar, chest transfers, seasonal seed shop, ingredient shop, direct sales and validated transactions.
- Nine physical placeable station types and twelve recipes; interactive three-action timing activities, gentle mode, performance coin bonuses.
- Three adult villagers, daily talk/gift friendship, optional companion designation, repeatable soup delivery.
- Basic fishing for perch, market stocking/removal/collection, probabilistic daytime sales and sleep-time reports.
- Full-area map, discovery, farm/town travel, simple directional waypoint and minimap.
- Day/night tint, rain visuals, procedural looping melody/effects, autosave and versioned localStorage; malformed saves preserve their original contents.

## Scope and next milestones

The initial release intentionally simplifies later phases. All twelve recipes are visible from the start; no recipe unlock tree yet. Cooking stations share a timing mechanic rather than bespoke dragging, stirring, pizza preparation or oven temperature controls. Coffee uses a shortened roasting/grinding/brewing chain. Food has a performance coin bonus rather than persistent quality stacks.

NPC movement is simple ambient movement, not a full pathfinding schedule or building routine. Fishing has one species and no delayed bite, bait or improved rods. Market pricing is fixed with a modest premium; there are no price sliders, preference weights or stall upgrades. Maps have two area destinations and textual building directions; no per-building fast travel or routed path highlighting. No farm expansion, station upgrades, fertiliser, full dialogue trees, festivals, livestock, or APK.

Next: broaden regression coverage and test on physical Android devices, refine touch ergonomics and saving across Android file handlers, then add bespoke cooking minigames, pizza/cake chains, recipe discovery, persistent quality, richer NPC routines and fishing. Later add responsive audio ambience, wildlife and equipment/farm expansion. Target 60 FPS has not been benchmarked on Android hardware.

**Future roadmap:** animal farming remains planned, including livestock care and animal products; none is implemented now. **APK reminder:** a fully offline Android WebView APK is a future milestone after browser stability, including persistent saves, back-button handling and an original icon.

## Browser regression tests

The game has no runtime dependencies. Development checks require Node.js, Playwright and Chromium:

```sh
npm ci
npm test
```

`CHROMIUM_PATH` can select a system Chromium binary (defaults to `/usr/bin/chromium`). Browser execution must be permitted by the host sandbox. Tests launch an ephemeral local server and check character creation, keyboard movement, farming over two days, shop purchases/sales, failed transactions, storage, cooking, equipment placement/collision, save restoration, operation with network disabled, mobile layouts and corrupt-save recovery. Screenshots are generated under `tests/` and ignored. Tests use controlled state hooks for repeatable scenarios; manual end-to-end play and physical Android tests are still needed.
