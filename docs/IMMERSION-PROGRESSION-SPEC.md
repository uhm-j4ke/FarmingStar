# FARMING SIMULATOR — COMPLETE WORLD IMMERSION, GAMEPLAY EXPANSION & PROGRESSION UPDATE

## IMPORTANT: THIS IS AN UPDATE TO THE EXISTING GAME, NOT A NEW PROJECT

Continue development of the current 2D pixel-art farming and cooking simulator.

The base game already exists. Do not recreate its foundation, replace its systems unnecessarily, or change its established gameplay identity.

This specification combines the requested improvements to shop interiors, inventory, fishing, NPCs, navigation, environmental detail, and mobile controls with a substantial expansion of farming, exploration, progression, cooking, crafting, community activities, and village life.

**The objective is to transform the existing game into a richer, more cohesive, highly detailed farming simulator while preserving everything that already works.**

After this feature update, development will shift primarily toward stability, bug fixing, optimisation, and automated testing. Therefore, prioritise completing and correctly integrating the systems described here rather than leaving a large collection of unfinished features.

### Essential development rules

1. Inspect the current game code before modifying anything.
2. Reuse existing systems where possible.
3. Do not duplicate inventory, clock, weather, NPC, item, or navigation systems.
4. Do not remove existing content to make new features easier.
5. Preserve existing save files and player progress.
6. Do not replace functioning features with static interfaces or placeholders.
7. Maintain the existing original pixel-art visual style.
8. Preserve offline compatibility.
9. Maintain the existing single-file `index.html` browser deliverable.
10. Organise implementation into logical stages, with functioning integrations between each stage.
11. Do not claim features are completed unless they are functional and verified.
12. Prepare the completed project for a separate, intensive QA and stability phase.

---

# SECTION 1 — CONTEXTUAL INTERACTION SYSTEM

## 1.1 Remove permanent floating labels

The game currently displays excessively large text labels above furniture and certain interactable objects.

Remove these permanent labels.

They clutter the screen and make interiors look less natural.

Replace them with a contextual interaction prompt that only appears when the player approaches an eligible object.

## 1.2 Bottom-right interaction prompt

Display the interaction prompt in the bottom-right HUD, positioned beside the existing E interaction indicator.

Examples:

- E — Open Chest
- E — Watch TV
- E — Use Stove
- E — Talk
- E — Browse Shop
- E — Refill Watering Can
- E — Inspect Noticeboard

For touchscreen controls, replace the keyboard-specific instruction with the existing mobile interaction button and the action description.

### Behaviour

- Show prompts only within valid interaction range.
- Prioritise objects directly in front of the character.
- Hide the prompt immediately when the object becomes unavailable.
- Use a subtle fade animation.
- Display only one primary interaction prompt at a time.
- Ensure the prompt never obstructs the hotbar or mobile action buttons.
- Prevent overlapping labels and duplicate prompts.

If multiple objects are equally valid interaction targets, select the closest object in the facing direction, with a consistent tie-breaking rule.

Allow target cycling where necessary.

### Technical requirement

The prompt and the actual interaction must share the same target identifier.

For example, if the prompt displays "Open Chest", pressing E must open that chest rather than a nearby stove.

Use one contextual interaction resolver for furniture, shop counters, NPCs, doors, fishing spots, and similar objects.

---

# SECTION 2 — COMPACT, HIGHLY DETAILED SHOP INTERIORS

## 2.1 General interior overhaul

Redesign the interiors of all existing town businesses.

The current interiors are too large and contain too much unused floor space.

Make them smaller, denser, and more believable.

**Keep the existing exterior building dimensions unchanged.**

Interior scenes may have different dimensions from their associated exterior footprints, provided entry and exit transitions remain consistent.

### Shared interior design requirements

Every interior should contain:

- Suitable flooring.
- Distinct wall textures.
- Appropriate furniture.
- Decorative clutter.
- Shelves and storage.
- Business-specific equipment.
- A functional service counter.
- Correct object layering and shadows.
- Clear walking paths.
- Proper collision boundaries.
- Accessible doors and interaction points.

Use compact floor plans, with most of the available space intentionally furnished.

Do not fill every tile indiscriminately. Maintain enough free space for the player and NPCs to move comfortably.

## 2.2 Grocery store

Transform the grocery store into a detailed small village supermarket.

Include multiple narrow aisles containing varied merchandise.

### Required furnishings

- Rows of grocery shelves.
- Fruit and vegetable crates.
- Bread displays.
- Bottled drinks.
- Jars and tins.
- Packaged ingredients.
- Seed packets.
- Basic cooking supplies.
- Refrigerated cabinets.
- A cashier's counter.
- Small storage shelves.
- Decorative signs and posters.
- Shopping baskets.
- Price labels.
- Wall decorations.

Each shelf should visually display appropriate merchandise rather than using identical, generic coloured blocks.

The shelves should be detailed at the pixel level, with recognisable packaging and products.

### Shopping interactions

Group merchandise into appropriate product categories.

For example:

- Seeds and gardening.
- Food ingredients.
- Cooking supplies.
- General equipment.
- Backpack upgrades.

Interacting with an appropriate shelf or the shopkeeper should open the relevant existing shop interface.

Preserve all current purchasing and selling functionality.

## 2.3 Blacksmith

Create a compact, detailed workshop interior.

Include:

- An animated forge.
- A large anvil.
- Workbenches.
- Tool racks.
- Metal shelving.
- Agricultural equipment.
- Ore crates.
- Coal storage.
- Barrels.
- Hanging tools.
- A tool upgrade counter.

Add a warm orange glow around the forge and subtle animated sparks.

Tool upgrades should remain available through the existing blacksmith interface.

Do not place decorative equipment in positions that prevent interaction with the shopkeeper.

## 2.4 Estate agency

Furnish the estate agency as a proper land-management office.

Include:

- Reception desk.
- Office chairs.
- Filing cabinets.
- Bookshelves.
- Paperwork.
- Blueprint displays.
- Land ownership maps.
- Property models.
- Decorative plants.
- Wall posters.
- Farmhouse expansion advertisements.

Preserve the existing systems for purchasing land and expanding the farmhouse.

Where practical, the office's displayed land map should reflect the player's purchased expansion areas.

## 2.5 Fishing hut

Create a compact riverside tackle shop containing:

- Fishing rod racks.
- Bait displays.
- Fishing nets.
- Rope.
- Wooden crates.
- Fishing baskets.
- Barrels.
- Shelves.
- Decorative fishing equipment.
- A service counter.

This location should handle fishing rod purchases, fishing upgrades, and selling caught fish.

## 2.6 Community hall

Redesign the community hall as a welcoming shared village building.

Include:

- Tables.
- Chairs.
- Bookshelves.
- Noticeboards.
- Community request boards.
- Seasonal decorations.
- Indoor plants.
- A reception area.
- Decorative displays for town projects.
- An area suitable for gatherings.

Preserve the existing villager requests and community activities.

## 2.7 Interior quality requirements

Ensure NPCs can navigate around furniture.

Use logical walkable regions and correct collision data.

Characters should appear in front of or behind appropriate furnishings based on their position.

Avoid huge empty floors, oversized rooms, and visually repetitive interior layouts.

Each business should be immediately recognisable from its furnishings.

---

# SECTION 3 — NPC DAILY SCHEDULES AND A LIVING TOWN

## 3.1 Replace static NPC behaviour

NPCs should no longer remain stationary for extended periods without a logical reason.

Introduce a unified NPC schedule system connected to the existing game clock.

Every villager should have a distinctive daily routine.

### Required NPC properties

Each NPC should have:

- A unique identifier.
- Name.
- Home location.
- Occupation or usual activity.
- Preferred destinations.
- Typical waking time.
- Work schedule, where applicable.
- Social activities.
- Evening routine.
- Bedtime.
- Movement speed.
- Idle behaviour.
- Weather-related preferences.
- Seasonal schedule variations.

Keep these properties data-driven so additional villagers can be added easily.

## 3.2 Daily schedule example

| Time | Typical activity |
|---|---|
| 06:00–09:00 | Wake up, prepare for the day |
| 09:00–12:00 | Work, shop, garden, or explore |
| 12:00–15:00 | Lunch, shopping, socialising |
| 15:00–18:00 | Work or afternoon activities |
| 18:00–21:00 | Evening routines and community activities |
| 21:00–23:30 | Socialising, walking home, relaxing |
| 23:30–06:00 | Most villagers at home |

These times should vary between NPCs.

A shopkeeper may work late, while an elderly villager may return home much earlier.

A keen fisher might spend the early morning at the river.

A gardener might spend afternoons tending flowers.

## 3.3 Natural NPC behaviour

NPCs should:

- Walk along valid paths.
- Use building entrances correctly.
- Navigate around furniture and terrain.
- Occasionally stop and look around.
- Visit other villagers.
- Shop at local businesses.
- Sit on benches where possible.
- Visit community areas.
- Occasionally tend gardens.
- React to the weather.
- Return home at appropriate times.

Give different NPCs different preferred routes and walking speeds.

Avoid synchronising every villager's routine so they all leave buildings simultaneously.

Add a small amount of predictable variation to schedules based on day and weather.

## 3.4 Off-screen NPC simulation

**This is an important architectural requirement.**

NPCs must continue progressing through their schedules even when the player is elsewhere.

For example, a shopkeeper who is at home at 07:00 must be at work by the scheduled opening time even if the player has spent the morning farming.

### Implementation behaviour

Use two levels of simulation.

**Visible NPCs**

Run full movement, pathfinding, collisions, walking animations, and environmental interactions.

**Off-screen NPCs**

Update their logical schedule, destination, location, and progress without running unnecessary full-detail rendering or pathfinding.

When the player enters their area, resolve the NPC to a valid position consistent with their schedule.

Avoid visible teleportation.

Never spawn NPCs inside walls, shelves, water, or inaccessible tiles.

When an NPC is speaking with the player, pause their movement temporarily and resume their schedule afterward.

## 3.5 Weather-related routines

NPCs should react to weather.

For example:

- During rain, more villagers remain indoors.
- On sunny days, outdoor activities become more common.
- During snow, some NPCs visit the community hall.
- Festivals temporarily override normal routines.

Weather-related schedules must remain consistent with the actual forecast and current conditions.

---

# SECTION 4 — TIME AND SHOP OPENING HOURS

## 4.1 Unified game clock

Use the existing game clock as the single authoritative time system.

Set its default progression to:

**1 real second = 30 in-game seconds.**

Therefore:

- 1 in-game minute = 2 real seconds.
- 1 in-game hour = 2 real minutes.
- 1 complete in-game day = 48 real minutes.

All relevant systems must reference this clock:

- NPC movement.
- Shop hours.
- Crop progression.
- Weather.
- Fishing availability.
- Daily requests.
- Festivals.
- Market stall sales.
- Day/night lighting.

Do not create separate clocks that drift out of sync.

## 4.2 Shop opening hours

Implement the following initial schedule:

| Business | Opening | Closing |
|---|---|---|
| Grocery store | 08:00 | 23:00 |
| Blacksmith | 09:00 | 21:00 |
| Estate agency | 09:00 | 21:00 |
| Fishing hut | 07:00 | 21:00 |
| Community hall staffed services | 08:00 | 22:00 |

The grocery store should remain open later than other shops.

Show opening hours in appropriate interfaces or on signs near entrances.

## 4.3 Closing behaviour

When a shop closes:

- End normal purchasing and upgrade services.
- Update the shopkeeper's schedule.
- Display an appropriate closed message.
- Prevent new purchasing interactions.
- Allow the player to leave if already inside.
- Avoid trapping NPCs inside inaccessible rooms.

Ordinary shops may lock after closing.

The community hall may remain accessible for public activities even when staffed services are unavailable.

Shopkeepers should not instantly teleport while visible.

## 4.4 Pausing and sleeping

The game clock should pause appropriately during gameplay pauses and loading transitions.

Sleeping should advance the calendar through the existing sleep mechanic.

Daily crop, market, weather, and schedule transitions must be processed consistently when sleeping advances time.

Do not accidentally apply the same daily update twice.

---

# SECTION 5 — BACKPACK AND INVENTORY OVERHAUL

## 5.1 Replace the current bag interface

Replace the existing bag UI with a slot-based inventory matching the visual design of the hotbar.

The player starts with **10 inventory slots**.

Display them as a row of individual item slots.

Each slot should show:

- Item sprite.
- Stack quantity.
- Selected state.
- Item details when inspected.
- Drag-and-drop feedback.

## 5.2 Hotbar integration

The hotbar must use inventory slots 1–10 directly.

It must not contain a separate copy of those items.

For example, moving an axe into inventory slot 3 should immediately display that axe in hotbar slot 3.

Using a consumable item should update its quantity in both views.

## 5.3 Backpack upgrades

Add purchasable backpack upgrades to the grocery store's general equipment category.

Each upgrade adds another complete row of 10 slots.

| Backpack tier | Capacity |
|---|---:|
| Starter | 10 |
| Tier 1 | 20 |
| Tier 2 | 30 |
| Tier 3 | 40 |
| Tier 4 | 50 |

Further tiers may be introduced if appropriate.

Upgrade prices should increase sensibly.

Capacity upgrades must persist after saving and loading.

## 5.4 Inventory management improvements

Include:

- Drag-and-drop item movement.
- Touch-based item swapping.
- Item stacking.
- Splitting item stacks.
- Inventory sorting.
- Quick transfers into chests.
- Quick transfers out of chests.
- Item descriptions.
- Clear selected-item highlighting.
- Full-inventory notifications.
- A scrollable backpack on smaller screens.

Provide a convenient way to move several items of the same type without repeatedly performing unnecessary actions.

## 5.5 Prevent item loss and duplication

All inventory transactions should be validated.

Prevent:

- Selling more items than owned.
- Buying items without enough currency.
- Duplicating items through hotbar movement.
- Losing items during chest transfers.
- Deleting items when upgrading the backpack.
- Consuming cooking ingredients multiple times.
- Losing items through save migration.

If the inventory is full, collection should be blocked or the item should remain available in the world where appropriate.

Use one consistent item definition and transaction model across all game systems.

---

# SECTION 6 — FISHING EXPANSION

## 6.1 Purchasable fishing rods

Make fishing rods available at the Fishing Hut.

Introduce three equipment tiers:

**Basic Fishing Rod**

Affordable, suitable for common fish, with simple controls.

**Improved Fishing Rod**

More responsive controls and easier handling of moderately difficult fish.

**Advanced Fishing Rod**

Better performance when catching rarer or more difficult fish.

Prevent duplicate non-stackable equipment purchases unless the game explicitly supports multiple copies.

## 6.2 Casting

The player must equip the rod and approach suitable water.

The character should face the water and use the tool action to cast.

Include a casting animation and visible fishing line.

Fishing must only be possible in appropriate areas.

Do not allow casting through walls or into ordinary ground tiles.

## 6.3 Fishing minigame

Implement a functional skill-based fishing minigame.

Suggested mechanic:

- A fish marker moves vertically.
- The player controls a catching zone.
- Keeping the fish within the catching zone increases progress.
- Losing contact decreases progress.
- Filling the meter successfully catches the fish.

Different species should have different movement patterns and difficulty levels.

Support keyboard, mouse, and touchscreen input.

The minigame should remain readable on landscape mobile screens.

Include a simplified-control accessibility option.

## 6.4 Fish catalogue

Add multiple original fish varieties.

Each fish should define:

- Name.
- Icon.
- Rarity.
- Selling value.
- Difficulty.
- Preferred fishing location.
- Time-of-day availability.
- Seasonal availability.
- Optional weather preference.

Some fish should be more common in rain, while others should appear more often during particular seasons.

## 6.5 Fishing integration

Caught fish must enter the normal inventory.

Allow fish to be:

- Sold at the fishing hut.
- Used in suitable recipes.
- Delivered for community requests.
- Recorded in the collection journal.

Add sound effects, water ripples, catching animations, and a catch notification.

---

# SECTION 7 — WAYPOINT NAVIGATION FIXES

## 7.1 Fix permanent navigation overlays

The existing navigation system sometimes leaves destination markers or navigation arrows permanently visible.

Correct the underlying state-management problem.

## 7.2 Clear Waypoint button

Add an accessible **Clear Waypoint** button to:

- The full-screen map.
- The minimap's expanded controls.
- The active navigation indicator.

When selected:

- Clear the current destination.
- Remove route highlighting.
- Hide directional indicators.
- Remove active destination markers.
- Reset navigation-specific UI.
- Save the updated navigation state.

## 7.3 Automatic completion

When the player reaches the selected destination, display a brief arrival message and automatically end navigation.

The destination should not remain active after arrival.

## 7.4 Reliability

Use a single authoritative waypoint state.

Ensure cleared routes do not reappear after changing maps, opening menus, or loading a save.

---

# SECTION 8 — TERRAIN, VEGETATION AND ENVIRONMENTAL DETAIL

## 8.1 Remove artificial vegetation patterns

The existing plants and bushes are distributed in overly regular rows, especially around villagers' houses.

Replace these patterns with natural-looking arrangements.

Use controlled procedural placement combined with carefully arranged fixed scenery.

## 8.2 Vegetation distribution

Scatter:

- Grass tufts.
- Tall grasses.
- Flowers.
- Wild plants.
- Bushes.
- Small stones.
- Fallen leaves.
- Tree clusters.
- Isolated trees.
- Bare soil.
- Small ground details.

Use natural clustering and spacing rather than uniform intervals.

Distribution should depend on the area.

Town paths should remain relatively clear.

Gardens should be maintained and somewhat organised.

Open fields should have varied clusters.

Forest edges should be denser.

## 8.3 Grass textures

Introduce several distinct variants:

- Ordinary grass.
- Dark grass.
- Light grass.
- Flowered grass.
- Patchy grass.
- Grass with individual blades.
- Slightly worn grass.
- Grass with tiny stones.

Blend these visually without creating obvious grid repetition.

## 8.4 Path textures

Add varied paths, including:

- Dirt.
- Gravel.
- Cobblestone.
- Worn village roads.
- Wooden paths where appropriate.

Include correct transitions, corners, intersections, and edges.

Roads must remain continuous and functional.

## 8.5 Soil textures

Differentiate:

- Untilled ground.
- Prepared soil.
- Watered soil.
- Dry soil.
- Decorative bare ground.

Ensure visual states match the underlying farming mechanics.

## 8.6 Stable procedural generation

Use a deterministic world seed for appropriate terrain variation.

Do not randomly regenerate visible terrain whenever the player moves or reloads.

Existing player modifications, planted crops, paths, purchased land, and placed furniture must override background generation.

Preserve map compatibility with existing saves.

## 8.7 Environmental collision

Decorative vegetation must not obstruct critical routes.

Validate building entrances, farm access, NPC paths, bridges, and shop access.

Use sensible collision rules.

Small grass should generally be walkable.

Trees, large bushes, fences, and rocks may block movement.

---

# SECTION 9 — FARM POND AND WATERING CAN

## 9.1 Add a pond

Add a small, naturally shaped pond to the starting farm.

It should include:

- Irregular shoreline.
- Animated water.
- Ripples.
- Stones.
- Grass.
- Reeds or suitable plants.
- Gentle water ambience.

Place it where the player can conveniently reach it without obstructing farming expansion.

## 9.2 Watering-can capacity

Ensure the watering can uses a defined water capacity.

Watering crops should reduce the remaining quantity.

Upgraded watering cans may have greater capacity.

## 9.3 Refilling

When the player stands next to suitable water with the watering can equipped, display the contextual refill prompt.

Refilling should:

- Play an animation.
- Produce a water sound.
- Restore the can's capacity.
- Update the UI.
- Respect the character's interaction range.

Do not allow refilling from distant water tiles.

Prevent walking into deep pond water.

---

# SECTION 10 — LANDSCAPE MOBILE AND TABLET OPTIMISATION

## 10.1 Landscape-first layout

Optimise the game primarily for Android landscape orientation.

Preferred arrangement:

- Bottom-left: Movement joystick.
- Bottom-centre: Hotbar.
- Bottom-right: Tool-use and interaction buttons.
- Top-left: Time, season, weather.
- Top-right: Currency and pause menu.
- Suitable corner: Compact minimap.

No gameplay controls should overlap one another.

## 10.2 Responsive controls

Use touch-friendly button sizes and suitable spacing.

Include:

- Responsive movement joystick.
- Dedicated tool-use button.
- Dedicated interaction button.
- Touch inventory movement.
- Touch fishing controls.
- Touch cooking controls.
- Readable dialogue options.
- Accessible menus.

## 10.3 Orientation handling

Use a landscape layout whenever the device is in landscape orientation.

Where supported, request landscape orientation through available browser APIs.

Do not rely on orientation locking being available.

If portrait orientation is detected, display a clear rotation suggestion or an appropriately scaled fallback interface.

Never make the game impossible to exit because of orientation restrictions.

## 10.4 Camera and scaling

Maintain the previously requested slightly zoomed-out mobile camera.

Show more surrounding world without making the player sprite unreadable.

Use nearest-neighbour pixel-art scaling.

Avoid blurry textures, stretched sprites, or interface elements disappearing behind cutouts and system navigation areas.

## 10.5 Performance requirements

Use:

- Visible-area rendering.
- Cached static terrain where appropriate.
- Sprite and animation reuse.
- Efficient collision checks.
- Lightweight particle systems.
- Reduced off-screen NPC processing.
- Controlled canvas resolution.

Maintain responsive input on phones and tablets.

Preserve fully offline operation.

---

# SECTION 11 — NEW SKILL AND EXPERIENCE SYSTEM

Introduce five skill categories that reward normal gameplay.

## 11.1 Farming

Award experience for meaningful farming actions and successful harvests.

Higher levels may unlock:

- Improved crop handling.
- Better harvesting results.
- Fertiliser recipes.
- Farming-related crafting recipes.
- Small efficiency improvements.

## 11.2 Fishing

Award experience for catching fish.

Higher levels may unlock:

- Fishing rod improvements.
- Better fish-handling bonuses.
- New fishing-related recipes.
- Slightly more forgiving catching mechanics.

## 11.3 Cooking

Award experience for preparing completed food and drinks.

Higher levels may unlock:

- Additional recipes.
- Cooking equipment improvements.
- Better processing efficiency.
- Improved opportunities to produce higher-quality food.

## 11.4 Foraging

Award experience for gathering suitable natural resources.

Higher levels may provide:

- Better resource yields.
- Additional forageable discoveries.
- Useful crafting recipes.
- Improved identification of valuable wild plants.

## 11.5 Crafting

Award experience for producing items and completing suitable construction activities.

Higher levels may unlock:

- Furniture.
- Decorations.
- Better storage.
- Building materials.
- More advanced craftable equipment.

## 11.6 Level progression

Each skill should initially have 10 levels.

Use a consistent experience curve.

Show current level and experience progress in a Skills menu.

Make rewards meaningful but balanced.

At selected higher levels, allow small specialisations.

For example, farming could offer a choice between better harvest quality and modestly improved yield.

Specialisations must not permanently block essential recipes or gameplay progress.

Avoid awarding unlimited experience for actions that can be repeated without consuming resources or achieving anything.

---

# SECTION 12 — CRAFTING AND RESOURCE COLLECTION

## 12.1 Add a crafting system

Expand the game's production mechanics beyond cooking.

Cooking produces ingredients, food, and beverages.

Crafting produces furniture, building materials, decorations, and equipment.

These systems should share the same inventory and transaction logic.

## 12.2 Gatherable resources

Add suitable collectable materials:

- Wood.
- Stone.
- Clay.
- Plant fibres.
- Wildflowers.
- Berries.
- Seasonal mushrooms.
- Seeds.
- Basic ore.
- Other appropriate natural materials.

Resources should be obtainable through normal tools and exploration.

Make essential resources renewable or obtainable again through sensible gameplay.

## 12.3 Craftable objects

Include:

- Fences.
- Gates.
- Paths.
- Storage chests.
- Flower pots.
- Garden benches.
- Signs.
- Simple lighting.
- Decorative furniture.
- Basic building components.
- Appropriate processing equipment.

## 12.4 Crafting interface

Create a crafting menu that displays:

- Recipe name.
- Output.
- Required materials.
- Available quantities.
- Missing quantities.
- Crafting requirements.
- Craft action.

Validate transactions before consuming resources.

Do not consume items if the result cannot be added to inventory or delivered to a valid destination.

## 12.5 Building placement

Crafted objects should integrate with existing furniture and building placement systems.

Use correct placement previews, collision checks, and ownership data.

Removing appropriate placed objects should recover them rather than silently deleting their value.

---

# SECTION 13 — FOREST EXPLORATION AND FORAGING

## 13.1 Add a forest area

Expand the existing world by introducing a separate forest connected through a logical path.

The forest should have a distinct atmosphere.

Include:

- Dense trees.
- Narrow paths.
- Small clearings.
- Wildflowers.
- Bushes.
- Streams.
- Bridges.
- Fallen logs.
- Large rocks.
- Forageable plants.
- Hidden paths.
- Occasional discoveries.

Make exploration meaningful rather than simply adding a large empty map.

## 13.2 Foraging

Spawn collectable plants and resources according to the season.

Examples:

- Spring flowers.
- Summer berries.
- Autumn mushrooms.
- Winter-specific forageable materials.
- Fallen branches and suitable natural resources.

Use seeded, stable placement rules.

Collected renewable resources may respawn after an appropriate number of in-game days.

Do not regenerate all resources immediately upon leaving and re-entering the forest.

## 13.3 Exploration rewards

Allow players to discover:

- Rare seeds.
- Decorative furniture recipes.
- Seasonal resources.
- Small supply caches.
- New fishing locations.
- Crafting materials.
- Hidden scenic areas.

Keep rewards balanced and logically connected to exploration.

## 13.4 Quarry

Introduce a modest quarry or rocky clearing.

Allow the player to collect stone and ore using appropriate existing tools.

Mining should provide useful materials for blacksmith upgrades and crafting.

Avoid adding an unrelated combat or dungeon system during this update.

---

# SECTION 14 — CROP QUALITY AND FERTILISER

## 14.1 Crop quality levels

Introduce three crop quality levels:

- Standard.
- Good.
- Excellent.

Crop quality should influence selling price and potentially the quality of resulting cooked products.

## 14.2 Quality factors

Consider:

- Farming skill.
- Fertiliser.
- Crop type.
- Watering consistency.
- Growing conditions.

Use transparent, balanced probabilities.

Perfect results should not be guaranteed simply because the player has a high skill level.

## 14.3 Fertiliser

Add basic fertiliser to the grocery store or crafting system.

Fertiliser may slightly improve:

- Crop quality.
- Growing speed.
- Yield, where appropriate.

Different fertilisers should have clearly explained effects.

Prevent multiple incompatible fertilisers from stacking into unintended bonuses.

## 14.4 Crop and season consistency

Preserve existing crop growth stages.

Ensure growth remains aligned with game days and weather.

Prevent invalid planting when a crop cannot grow under the current conditions.

Give informative feedback rather than silently failing.

Do not allow crop quality changes to break existing cooking recipes or selling systems.

---

# SECTION 15 — COOKING DEPTH AND RECIPE PROGRESSION

## 15.1 Expand the current cooking system

Preserve existing cooking stations and minigames.

Do not replace them with instant-production buttons.

Expand available recipes and integrate them with the new crops, fish, forageables, skill levels, and economy.

## 15.2 Recipe categories

Organise recipes into:

- Bread and baking.
- Pizza and savoury dishes.
- Soups and stews.
- Desserts.
- Preserves.
- Coffee and drinks.
- Fish dishes.
- Seasonal specialities.

Each recipe should define:

- Ingredients.
- Required quantities.
- Necessary station.
- Processing stages.
- Preparation time.
- Output.
- Quality possibilities.
- Selling value.
- Unlock requirements.

## 15.3 Recipe unlocking

Allow recipes to unlock through:

- Cooking experience.
- Purchasing cookbooks.
- Completing NPC requests.
- Villager dialogue.
- Community projects.
- Festivals.
- Ingredient discovery.

Unlocked recipes should remain available permanently unless there is a specific gameplay reason otherwise.

## 15.4 Cooking quality

Determine finished food quality based on:

- Ingredient quality.
- Cooking skill.
- Cooking minigame performance.
- Equipment quality.

Use a predictable and understandable system.

Do not make high-quality ingredients automatically guarantee excellent food.

## 15.5 Equipment upgrades

Allow existing cooking machines to receive upgrades.

Examples include:

- Increased processing capacity.
- Improved consistency.
- Reduced preparation time.
- Expanded recipe availability.
- Better ingredient handling.

Avoid upgrades that completely remove the value of interactive cooking.

## 15.6 Ingredient availability

Every recipe must have an obtainable ingredient chain.

Ingredients that depend on future animal farming, such as eggs, milk, and cheese, must remain purchasable through existing shops.

Do not introduce livestock or animal-product production yet.

---

# SECTION 16 — ECONOMY, SHIPPING AND SEASONAL DEMAND

## 16.1 Preserve existing selling methods

Keep direct shop sales and the player-owned market stall.

Do not remove or replace these systems.

## 16.2 Add a farm shipping crate

Introduce an optional shipping crate on the farm.

Allow the player to deposit eligible items.

At the end of the in-game day, process the contents and award the appropriate coins.

The shipping crate should:

- Accept valid products.
- Display deposited items.
- Allow retrieval before the daily cutoff.
- Show estimated earnings.
- Process sales once per day.
- Display an end-of-day sales report.

Prevent repeatedly selling the same deposited items.

## 16.3 Improve the market stall

Preserve the player's market stall and expand its functionality.

Customers should occasionally visit based on the existing village population and daily routines.

When practical, villagers should visibly approach the stall.

Sales should depend on:

- Product type.
- Price.
- Product quality.
- Time of day.
- Seasonal demand.
- Customer preferences.
- Foot traffic.

Provide a clear report of sold goods, unsold stock, and earnings.

## 16.4 Seasonal demand

Introduce modest changes to demand.

Examples:

- Warm drinks are more popular in winter.
- Fresh fruit sells well in summer.
- Certain baked goods become popular during festivals.
- Seasonal produce may receive temporary demand bonuses.

Display useful information about current demand.

Avoid arbitrary, extreme price changes.

## 16.5 Economy balancing

Ensure purchasing, processing, and reselling loops cannot create unlimited profit without effort or resource constraints.

Processed products should generally offer greater value than their ingredients, accounting for processing costs and player time.

Maintain reasonable ways to recover financially if the player spends most of their coins.

---

# SECTION 17 — NPC FRIENDSHIPS AND RELATIONSHIPS

## 17.1 Expand existing relationships

Keep the existing dialogue and relationship systems.

Introduce more meaningful friendship progression through:

- Conversation.
- Gifts.
- Requests.
- Community events.
- Festivals.
- Small favours.

## 17.2 Gift preferences

Give each NPC preferred and disliked gift categories.

For example:

- Gardeners appreciate flowers.
- Bakers appreciate baked goods.
- Coffee enthusiasts appreciate prepared coffee.
- Fishing enthusiasts may enjoy suitable fish dishes.

Gift reactions should correspond to the NPC's personality.

Limit gift frequency to prevent trivial friendship farming.

## 17.3 Dynamic dialogue

Expand dialogue according to:

- Relationship level.
- Time of day.
- Weather.
- Season.
- Festival days.
- Completed community projects.
- Recent player achievements.
- NPC occupation.

Provide enough dialogue variation to avoid the same greeting appearing every day.

Keep the existing bottom-screen dialogue interface and character portraits.

Normal movement and tool controls should remain disabled during conversations.

Resume those controls when dialogue closes.

## 17.4 Relationship progression

Display a clear friendship indicator in the NPC profile interface.

Preserve the previously requested lightweight significant-other feature.

Keep this optional and dialogue-focused rather than introducing complex household or family systems.

---

# SECTION 18 — COMMUNITY HALL DEVELOPMENT PROJECTS

## 18.1 Add town improvement projects

Expand the community hall with projects requiring player contributions.

These should produce visible, permanent improvements to the game world.

### Example projects

**Repair the Riverside Bridge**

Contribute wood, stone, and coins.

Completion repairs the bridge and unlocks access to another small area.

**Restore the Community Garden**

Donate seeds, vegetables, and suitable construction materials.

Completion transforms an overgrown space into a maintained garden.

**Upgrade the Town Square**

Donate wood, stone, and coins.

Completion adds decorative improvements such as benches, flowers, paths, and lighting.

**Expand the Marketplace**

Complete deliveries and provide materials.

Completion improves the market area and creates additional opportunities for the player's stall.

## 18.2 Project tracking

Each project should have:

- Name.
- Description.
- Required items.
- Required quantities.
- Current contributions.
- Completion state.
- Reward or unlocked improvement.

Show progress clearly.

Players should be able to contribute items incrementally.

## 18.3 Actual world changes

Project completion must change the world.

A repaired bridge must become usable.

A garden restoration must visibly change the garden.

A town-square improvement must add the relevant scenery.

Update collision, navigation, and map data accordingly.

Completed projects must remain complete after reloading.

---

# SECTION 19 — TOWN REQUEST BOARD

## 19.1 Expand villager requests

Create a more dynamic request board at the community hall.

Villagers should periodically request suitable items.

Examples:

- Fresh vegetables.
- Coffee.
- Bread.
- Fish.
- Cooking ingredients.
- Crafting resources.
- Prepared meals.

## 19.2 Request rules

Every request should specify:

- Requesting villager.
- Requested item.
- Quantity.
- Reward.
- Optional deadline.
- Current progress.

Rewards may include coins, friendship, experience, or useful materials.

## 19.3 Prevent impossible requests

Do not generate requests for:

- Inaccessible locations.
- Locked ingredients with no obtainable alternative.
- Unavailable recipes.
- Items that cannot be produced during the deadline.
- Materials removed from the current game.

Use the player's current unlocks and game season to determine suitable requests.

Limit the number of active requests.

---

# SECTION 20 — SEASONAL FESTIVALS AND VILLAGE ACTIVITIES

Introduce original seasonal town events.

Each season should have at least one major festival.

## 20.1 Spring Planting Fair

Add a spring event celebrating the new growing season.

Include:

- Special decorations.
- Seasonal seed sellers.
- NPC gathering areas.
- Unique dialogue.
- A small farming-related activity.
- Modest participation rewards.

## 20.2 Summer Food Festival

Create an interactive village food event.

Allow the player to prepare a dish using existing cooking systems.

Judge or reward entries based on recipe choice, quality, and preparation performance.

Include original festival dialogue and food stalls.

## 20.3 Autumn Harvest Market

Create a seasonal market where the player can display or submit harvested produce.

Include:

- Decorated stalls.
- Autumn foliage.
- Special NPC schedules.
- Harvest-related activities.
- Appropriate rewards.

## 20.4 Winter Lantern Evening

Create an atmospheric winter event.

Include:

- Lanterns.
- Warm lighting.
- Seasonal decorations.
- Special music.
- Villager gatherings.
- A small optional community activity.

## 20.5 Festival scheduling

Festivals must follow the existing calendar.

Announce them in the community calendar before they begin.

On festival days:

- Update NPC schedules.
- Display festival decorations.
- Enable event interactions.
- Restrict incompatible normal activities only where necessary.
- Return the world to normal afterward.

Festivals should be optional.

Missing an event must not permanently block essential gameplay progression.

Use original character dialogue, event names, art, and music rather than copying existing farming games.

---

# SECTION 21 — JOURNAL, COLLECTIONS AND ACHIEVEMENTS

## 21.1 Add a journal

Introduce a journal accessible through the existing game menu.

It should contain several clearly organised categories.

### Daily activities

Display a few optional suggested activities.

Avoid creating an overwhelming task list.

### Crop collection

Track crops that have been grown and harvested.

### Fish collection

Track discovered and caught fish.

Display relevant information such as season, location, and notable conditions.

### Cooking collection

Track unlocked recipes and dishes prepared successfully.

### Crafting collection

Track discovered crafting recipes and crafted items.

### Town improvements

Display community projects and completed upgrades.

### Villager profiles

Show known villagers, friendship levels, and limited information discovered through interaction.

## 21.2 Achievements

Introduce optional achievements for meaningful milestones.

Examples:

- First harvest.
- First fish caught.
- First cooked meal.
- First backpack upgrade.
- First community project completed.
- Reaching a skill milestone.
- Discovering several forageable items.

Achievements should provide feedback and optional modest rewards.

Do not fill the screen with excessive notifications.

---

# SECTION 22 — OPTIONAL ENERGY SYSTEM

Introduce a lightweight, configurable energy system.

The system should reward sensible daily planning without making the game unnecessarily restrictive.

## 22.1 Energy consumption

Energy may be consumed by:

- Tilling soil.
- Chopping wood.
- Mining stone.
- Clearing large obstacles.
- Certain demanding farming activities.

Ordinary walking should not consume energy.

Conversations, navigation, and basic exploration should remain available when energy is low.

## 22.2 Energy restoration

Restore energy through:

- Sleeping.
- Eating appropriate prepared food.
- Other suitable existing rest mechanics.

Food should provide different recovery values depending on its type.

## 22.3 Accessibility

Include a relaxed gameplay option that disables or reduces energy consumption.

Do not create softlocks where the player cannot earn food or reach their bed because of depleted energy.

Use one consistent energy state.

---

# SECTION 23 — WORLD ATMOSPHERE AND SEASONAL VISUAL CHANGES

## 23.1 Improve environmental animation

Add more subtle movement to the world.

Examples:

- Trees swaying.
- Bushes moving in the wind.
- Grass reacting slightly to movement.
- Water ripples.
- Animated chimneys.
- Doors opening.
- Rain splashes.
- Decorative butterflies.
- Occasional birds.
- Gentle falling leaves.

Animation should be varied rather than synchronised across every plant.

## 23.2 Seasonal environment changes

Expand the existing weather and seasonal system.

**Spring**

Bright vegetation, fresh flowers, soft lighting, green foliage.

**Summer**

Lush vegetation, strong sunlight, dense leaves, vibrant colours.

**Autumn**

Orange and brown foliage, fallen leaves, warmer lighting, visibly changing trees.

**Winter**

Bare or frosted trees, muted grass, cold lighting, and snow during appropriate weather.

Apply seasonal effects consistently across the farm, town, forest, and surrounding environments.

## 23.3 Day and night

Improve lighting transitions.

Morning should appear soft and warm.

Midday should be brighter.

Evening should gradually become darker.

Night should feature suitable streetlights, indoor lighting, and warm windows.

Ensure night remains playable and important objects remain visible.

## 23.4 Environmental audio

Use existing audio settings.

Improve ambient sounds so different areas feel distinct.

Examples:

- Forest birds and wind.
- River water.
- Rain.
- Town ambience.
- Interior workshop sounds.
- Footsteps on different surfaces.
- Gentle environmental sounds at night.

Keep sound transitions smooth.

## 23.5 Decorative wildlife

Add occasional birds and butterflies for ambience.

These should function as decorative environmental details only.

Do not implement livestock, animal care, or animal farming during this update.

---

# SECTION 24 — GAMEPLAY FEEDBACK AND USABILITY

## 24.1 Feedback for successful actions

Provide subtle feedback when:

- Harvesting.
- Buying.
- Selling.
- Crafting.
- Catching fish.
- Completing requests.
- Levelling skills.
- Unlocking recipes.
- Finishing community projects.

Use appropriate sounds, particles, and small notifications.

## 24.2 Feedback for failed actions

Display concise messages for situations such as:

- Inventory full.
- Insufficient coins.
- Missing crafting ingredients.
- Locked recipe.
- Empty watering can.
- Shop closed.
- Invalid placement.
- Incorrect tool.
- Inaccessible interaction target.

Do not silently ignore player actions.

## 24.3 Interface accessibility

Add or preserve settings for:

- UI scaling.
- Dialogue speed.
- Reduced motion.
- Sound volumes.
- Simplified fishing.
- Simplified cooking.
- Optional energy usage.
- Reduced screen shake.
- Clearer interaction highlighting.

Ensure these settings work across desktop, mobile, and tablet layouts.

---

# SECTION 25 — ECONOMY AND PROGRESSION INTEGRATION

All new gameplay systems must contribute to a coherent progression loop.

For example:

1. The player grows crops.
2. Harvesting improves farming experience.
3. Crops can be sold, cooked, or donated.
4. Cooking improves the Cooking skill.
5. Cooked products sell for more than appropriate raw ingredients.
6. Earnings purchase backpack upgrades or equipment.
7. Crafting and exploration provide new materials.
8. Materials allow town projects and building upgrades.
9. Town projects unlock new destinations or benefits.
10. Exploration reveals new ingredients, recipes, and opportunities.
11. New opportunities expand the original farming and cooking loop.

Avoid isolated systems with no meaningful connection to the rest of the game.

### Progression requirements

- Skill rewards must be useful.
- Recipes must be obtainable.
- Equipment upgrades must offer meaningful benefits.
- Exploration must contain worthwhile discoveries.
- Community projects must change something tangible.
- Festivals must offer activities beyond decorative scenery.
- The economy must remain balanced.
- No required resource should become permanently unobtainable.
- New players should retain reasonable ways to earn money.

---

# SECTION 26 — CONSISTENCY BETWEEN GAME SYSTEMS

This section is critical.

## 26.1 Single inventory system

All systems must use the same item and inventory data.

This includes:

- Farming.
- Fishing.
- Cooking.
- Crafting.
- Shopping.
- Storage.
- Shipping.
- Market stall sales.
- Quests.
- Community donations.

Do not create separate incompatible inventory representations.

## 26.2 Single clock

NPCs, shops, crops, events, weather, and sales must reference the same game time.

Sleeping must process relevant daily events in the correct order.

## 26.3 Single navigation system

Waypoint arrows, destination markers, route highlights, full-screen map, and minimap must derive from a shared navigation state.

## 26.4 Shared NPC scheduling

Do not maintain separate schedule systems for NPCs in the town and NPCs inside buildings.

NPC location, activity, and destination must remain consistent across area transitions.

## 26.5 Shared world data

Terrain, building placement, collision, navigation, and minimap information should reference the same authoritative world representation wherever appropriate.

Completing a community project or purchasing land must update all affected systems.

## 26.6 Shared economy transactions

Selling, purchasing, donating, crafting, and processing must validate resource and currency changes.

Prevent duplicated or partially completed transactions.

## 26.7 Save compatibility

Preserve existing game data.

Include newly introduced state such as:

- Backpack upgrades.
- Skills and experience.
- Fishing progression.
- Crafted objects.
- Community projects.
- NPC schedule state where necessary.
- Journal progress.
- Foraging discoveries.
- Energy settings.
- Waypoint state.
- Market and shipping state.

Use versioned save migration.

Do not reset existing saves when new systems are added.

Maintain the existing automatic saving system and maximum of four rolling autosave restore points per save.

---

# SECTION 27 — IMPLEMENTATION ORDER AND DEPENDENCIES

Implement the update in the following stages.

This order is designed to prevent one system being added before the systems it depends on are ready.

## Stage 1 — Existing system corrections

Complete:

- Removal of floating furniture labels.
- Contextual interaction prompts.
- Waypoint cancellation.
- Permanent navigation overlay fixes.
- Landscape mobile control improvements.
- Backpack and hotbar integration.

Validate these before proceeding.

## Stage 2 — World and interior improvements

Complete:

- Compact shop interiors.
- Detailed shop furnishings.
- Correct interior collisions.
- Natural vegetation distribution.
- New terrain textures.
- Stable procedural variation.
- Farm pond and watering-can refilling.

Check that all important locations remain accessible.

## Stage 3 — NPCs and time

Complete:

- Unified NPC schedules.
- Visible movement and pathfinding.
- Off-screen schedule simulation.
- Shop opening and closing.
- Evening activities.
- Weather-related routines.

Verify transitions between buildings and outdoor maps.

## Stage 4 — Fishing and inventory progression

Complete:

- Fishing rod purchases.
- Fishing minigame.
- Fish varieties.
- Selling caught fish.
- Backpack capacity upgrades.
- Item transfer and stacking improvements.

Verify all related inventory transactions.

## Stage 5 — Skills and crafting

Complete:

- Five skill categories.
- Experience and level progression.
- Skill rewards.
- Crafting recipes.
- Resource gathering.
- Craftable decorations and equipment.

## Stage 6 — Exploration

Complete:

- Forest area.
- Seasonal foraging.
- Quarry.
- Resource regeneration.
- Exploration discoveries.
- New map and navigation connections.

## Stage 7 — Farming and cooking expansion

Complete:

- Crop quality.
- Fertiliser.
- Additional recipes.
- Recipe unlocking.
- Cooking quality integration.
- Processing equipment upgrades.

## Stage 8 — Community and economy

Complete:

- Expanded request board.
- Community projects.
- World improvements.
- Shipping crate.
- Market stall enhancements.
- Seasonal product demand.

## Stage 9 — Village life

Complete:

- NPC gifting.
- Friendship progression.
- Dynamic dialogue.
- Seasonal festivals.
- Festival-specific NPC schedules.

## Stage 10 — Long-term progression

Complete:

- Journal.
- Collections.
- Achievements.
- Optional energy system.
- Skill specialisations.
- Progression balancing.

## Stage 11 — Environmental and interface polish

Complete:

- Seasonal terrain transformations.
- Improved environmental animation.
- Lighting.
- Environmental audio.
- Mobile interface refinements.
- Accessibility improvements.

## Stage 12 — Feature integration and handover

Verify that all new features work alongside existing systems.

Do not begin a substantial new feature expansion after this stage.

Prepare the completed game for the next development phase, which will focus on stability, regression testing, bug fixing, and performance.

---

# SECTION 28 — REQUIRED FUNCTIONAL TESTS BEFORE HANDOVER

Before completing this update, verify at least the following scenarios.

### Inventory

- Start with 10 inventory slots.
- Purchase an upgrade and confirm 20 slots.
- Move an item between inventory and hotbar.
- Transfer items to and from a chest.
- Sell items and verify correct quantities.
- Attempt collection with a full backpack.
- Save and reload without losing inventory.

### Shops

- Enter every shop.
- Confirm interiors are compact and furnished.
- Verify counters remain accessible.
- Verify normal purchasing works.
- Verify shops close at the correct times.
- Confirm the player can leave after closing.

### NPCs

- Observe an NPC following a daily routine.
- Leave their area and return later.
- Confirm their position reflects elapsed time.
- Speak with an NPC.
- Confirm movement resumes after dialogue.
- Confirm shopkeepers follow working hours.
- Verify that visible NPCs do not teleport.

### Fishing

- Purchase a rod.
- Equip it.
- Cast into suitable water.
- Complete the fishing minigame.
- Receive the caught fish.
- Sell or cook it.
- Confirm inventory and currency update correctly.

### Environment

- Check natural vegetation placement.
- Confirm terrain variety persists after loading.
- Verify no essential pathways are obstructed.
- Refill the watering can at the farm pond.
- Confirm forest and quarry areas are accessible.

### Skills and crafting

- Earn experience.
- Increase a skill level.
- Unlock a recipe.
- Craft an item.
- Place the crafted object.
- Save and reload.
- Confirm progression persists.

### Cooking

- Process ingredients.
- Complete a cooking minigame.
- Produce a quality result.
- Sell the finished product.
- Verify correct ingredient consumption.

### Town improvements

- Donate resources.
- Complete a project.
- Confirm the world changes.
- Verify navigation reflects those changes.
- Save and reload without losing progress.

### Festivals

- Reach the scheduled festival date.
- Confirm special decorations appear.
- Verify NPC schedules adjust.
- Participate in the activity.
- Confirm rewards.
- Confirm normal behaviour resumes afterward.

### Navigation

- Set a waypoint.
- Follow the route.
- Cancel it.
- Confirm all indicators disappear.
- Set another destination.
- Reach the destination.
- Confirm automatic navigation completion.

### Mobile

- Test landscape controls.
- Verify joystick responsiveness.
- Check hotbar access.
- Test fishing and cooking touch interactions.
- Verify minimap placement.
- Confirm no important UI overlaps.

### Saves

- Autosave during gameplay.
- Load the current save.
- Restore an earlier autosave.
- Confirm no more than four restore points are retained.
- Verify existing saves migrate correctly.
- Confirm purchased land, furniture, inventory, skills, NPC relationships, and community projects persist.

These scenarios form the preliminary regression checklist for the dedicated stability phase.

---

# SECTION 29 — FINAL DELIVERY AND QUALITY HANDOVER

The final result should be a significantly more complete version of the existing game.

It should have:

- Detailed and believable shop interiors.
- Naturally moving villagers.
- Functional daily routines and business hours.
- Improved inventory and backpack progression.
- Fully functioning fishing.
- Natural terrain variety.
- Expanded world exploration.
- Skills and crafting.
- Richer farming and cooking.
- Improved NPC relationships.
- Seasonal festivals.
- Community development projects.
- More meaningful economic progression.
- A functional collection journal.
- Better environmental detail and atmosphere.
- Comfortable landscape mobile controls.

**Do not deliver a collection of disconnected demonstrations. All completed features must work within the existing playable game.**

Deliver the updated, offline-compatible `index.html`.

At the end, provide a development summary containing:

1. Completed features.
2. Existing features modified.
3. Bugs fixed during implementation.
4. Gameplay systems actually tested.
5. Any incomplete features.
6. Known bugs or limitations.
7. Major performance concerns.
8. Save compatibility status.
9. Recommended priorities for the upcoming stability phase.

Also prepare a concise technical handover identifying the important game-state structures, inventory transactions, clock functions, NPC scheduling logic, save format, and existing test or debugging interfaces.

This information will be needed by an automated QA agent.

### Future development roadmap — do not implement yet

**Animal farming:** Chickens, cows, barns, feeding, animal products, and related systems.

**Android APK:** Standalone offline Android version, created only when explicitly requested.

**iPad IPA:** Standalone offline iPad version supporting iOS 15+, created only when explicitly requested and when suitable build and signing facilities are available.

These remain planned future milestones.

### FINAL PRIORITY

After integrating this specification, **stop adding major features and prioritise stability**.

The next development stage will concentrate on automated testing, gameplay regression detection, save reliability, rendering problems, NPC pathfinding bugs, mobile performance, and systematic bug fixing.

Aim to leave the codebase in a condition where an automated testing agent can inspect the game's state, reproduce problems, run repeatable tests, and verify fixes without needing to rewrite the gameplay systems.
