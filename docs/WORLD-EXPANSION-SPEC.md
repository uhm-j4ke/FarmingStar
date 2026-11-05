# FARMING GAME — MAJOR WORLD EXPANSION, ANIMATION & QUALITY UPDATE

## 1. Overall development objective

Continue developing the existing 2D pixel-art farming and cooking simulator according to the original master specification.

This update should substantially improve the game's visual quality, character animations, world detail, building and land ownership systems, household interactions, NPC dialogue, seasonal weather, navigation, and save management.

**Do not rebuild the game from scratch or remove existing features.** Treat this as an expansion and refinement of the current game.

The result should feel like a more complete, living pixel-art world, with particular attention to environmental detail, smooth animations, intuitive interactions, and consistent art direction.

All new systems must integrate with the existing farming, cooking, inventory, economy, time, and NPC systems.

Continue using a self-contained, offline-compatible `index.html` file, with Android phones as the primary target while improving support for larger tablets and desktop devices.

---

## 2. Character animation improvements and eye glitch fix

### Fix the eye-rendering bug

Currently, the character's eyes sometimes appear to glitch, shift incorrectly, or become distorted while walking.

Investigate and correct the root cause of this bug.

Ensure:

- Eye positions remain correctly aligned with the head during every animation frame.
- Eyes do not flicker, detach, duplicate, stretch, or shift outside the face.
- Character facial features use consistent pixel coordinates.
- Sprite rendering uses stable frame alignment and correct layering.
- Movement animations do not interfere with facial rendering.
- Pixel-art scaling does not introduce fractional-pixel distortion.

Avoid simply hiding the eyes or removing facial details to conceal the issue.

### Four-direction character sprites

The character must visibly face the direction of movement.

Implement distinct animations for:

- Walking north (back facing camera).
- Walking south (front facing camera).
- Walking east (facing right).
- Walking west (facing left).

The east and west poses must clearly show the character in profile. Do not continue displaying a front-facing character while walking sideways.

Each direction should have its own properly aligned walking and idle animations.

When the character stops, they should remain facing their last movement direction.

Movement should be smooth and consistent, without animation restarting unnecessarily every frame.

Use a proper sprite animation state system, separating direction, movement state, equipped tool, and current action.

---

## 3. Tool animations and directional interactions

Add distinct, polished animations for every existing tool.

Examples include:

- **Hoe:** The character raises the hoe and swings it into the ground, with a small soil particle effect.
- **Axe:** A chopping animation with wood-chip particles when striking trees.
- **Pickaxe:** A mining swing accompanied by stone particles and an impact sound.
- **Watering can:** The character tilts the can, producing animated droplets of water.
- **Scythe:** A sweeping arc that cuts eligible grass or crops.
- **Fishing rod:** A casting animation, line movement, waiting pose, and reeling animation.

Animations must adapt correctly to all four character-facing directions.

### Correct tool targeting

Currently, clicking can cause the tool to affect the tile where the mouse or finger is positioned.

**Change this completely.**

The default tool-use action must instead affect the appropriate tile immediately in front of the character, based on their facing direction.

For example:

- Facing north and using the hoe tills the tile directly above the character.
- Facing south affects the tile below.
- Facing east affects the tile to the right.
- Facing west affects the tile to the left.

The mouse click or mobile tool button should trigger the action, not determine the target position.

Use the player's logical tile position and facing direction to calculate the target. Ensure accurate collision, interaction range, and tile alignment.

Do not allow tools to affect tiles through walls, outside the current area, or beyond the tool's permitted range.

Upgraded tools may affect multiple tiles in the facing direction according to their upgrade abilities.

Keep contextual interactions with shops, NPCs, furnishings, and other objects separate from destructive tool use.

Tool actions should include sensible animation timing and cooldowns to prevent accidental repeated actions.

---

## 4. New estate agency and land expansion system

Introduce a new town building: **The Estate Agency**.

It should be visually distinct, have a proper interior, opening hours, an NPC shopkeeper, and a functional purchasing interface.

The estate agency specialises in farm expansion, building plots, and farmhouse improvements.

### Purchasing additional land

Allow the player to purchase additional parcels of land to expand the farm.

The farm should initially contain several locked expansion areas around its boundaries.

Each expansion must:

- Have a clearly defined location and size.
- Cost a suitable amount of in-game currency.
- Become permanently owned after purchase.
- Connect logically to the existing farm.
- Increase usable space without blocking important paths.
- Remain unlocked after saving and reloading.

Land purchases should become progressively more expensive while offering increasingly valuable space.

Use a visual preview showing exactly which land parcel will become available before the purchase is confirmed.

### Choosing the purpose of purchased land

After purchasing a parcel, allow the player to choose its initial development type.

Options should include:

**Agricultural plot**

- Adds more farmable tiles.
- Supports normal crop planting and watering.
- Can connect to existing crop fields.

**Storage area**

- Provides space for additional chests, storage buildings, or equipment.
- Allows the player to expand available inventory storage.

**Flexible building plot**

- An empty cleared area where permitted buildings, furnishings, and machines can be placed.
- Useful for outdoor processing stations, decorations, or future structures.

**Garden or decorative plot**

- Allows paths, fences, flowers, trees, benches, and other decorative items to be placed.

These choices should determine the parcel's initial layout, rather than permanently preventing the player from changing it.

Allow redevelopment later for a reasonable fee.

Maintain a consistent tile-based placement system for all expansion areas.

---

## 5. Farmhouse expansion through the estate agency

Add a second section to the Estate Agency called **Home Improvements**.

The player should be able to upgrade their farmhouse in multiple stages.

### Suggested progression

**Level 1 — Starter farmhouse**

A small furnished home containing the essentials.

**Level 2 — Expanded cottage**

Additional floor space for cooking equipment, decorations, and storage.

**Level 3 — Large farmhouse**

A larger interior with room for more advanced cooking stations, additional storage, and decorative furniture.

**Level 4 — Premium farmhouse**

A spacious upgraded home with a larger kitchen and multiple customisable areas.

Each upgrade should have its own price and visual improvement.

### Important expansion behaviour

- The exterior of the farmhouse must change to reflect its upgrade level.
- The interior should expand proportionally and logically.
- Existing furniture and stored items must be preserved.
- Expansions must not destroy or overwrite previously placed equipment.
- New interior tiles must be accessible.
- The position of doors and walls must remain logically consistent.
- Furniture must not suddenly become trapped inside walls.

If furniture would conflict with a new layout, automatically relocate it to a valid position or place it into safe storage.

---

## 6. Fully furnished and interactive starter farmhouse

The farmhouse should no longer feel like an empty placeholder.

Ensure that every new game begins with a furnished home containing:

- A bed.
- A television.
- A basic stove.
- A kitchen counter.
- A dining table.
- A chair.
- A storage chest.
- A few decorative furnishings.

All furniture should be designed in the same detailed pixel-art style as the rest of the game.

### Interactive furniture

**Bed:** Allows the player to sleep and advance to the next day.

**Television:** Displays the in-game weather forecast for the current day. It may also provide tomorrow's forecast if that weather has been generated in advance.

**Stove:** Opens the appropriate cooking interface.

**Chest:** Opens a separate storage inventory, allowing items to move between the player's inventory and the chest.

**Kitchen furnishings:** Function as decorative objects or interactable cooking stations where appropriate.

Furniture must have correct collision boundaries and depth layering.

### Building and furnishing menu

Add a dedicated **Build & Furnish** menu accessible inside the farmhouse.

This menu should contain three categories:

1. **Furniture Shop:** Purchase tables, chairs, counters, decorations, shelves, lighting, and other household furnishings.
2. **Owned Furniture:** View furniture and equipment already purchased but not currently placed.
3. **Build Mode:** Move, rotate where appropriate, place, and remove furniture.

Allow the player to preview furniture placement before confirming it.

Use visible valid/invalid placement indicators.

Furniture cannot overlap walls, doors, other furniture, or important interaction tiles.

Removing furniture should return it to the player's owned furniture inventory instead of deleting it.

Cooking machines should use the same placement rules and retain their contents where applicable.

Keep furniture inventory separate from the player's ordinary carried-item hotbar to avoid unnecessary inventory clutter.

---

## 7. Major map and world expansion

Substantially enlarge both the farm and town maps to accommodate the new features.

The expanded world should feel intentional and naturally designed, not like empty land added around existing buildings.

### Environmental details

Populate the world with:

- Dense patches of grass.
- Many individual tufts of grass.
- Flower clusters.
- Bushes with gently animated leaves.
- Trees of varying sizes and shapes.
- Fallen leaves and small stones.
- Wooden fences.
- Garden gates.
- Dirt and cobblestone pathways.
- Small ponds and riverbanks.
- Wooden bridges.
- Benches, lamps, signs, and crates.
- Natural transitions between terrain types.

Avoid making every tile identical. Use several grass, soil, stone, path, and vegetation variants to create a natural appearance.

### Trees and bushes

Trees should have detailed trunks, shaded foliage, and multiple layers of leaves.

Bushes should use subtle looping animations to suggest movement in the wind.

The animation should be gentle, with different plants moving slightly out of sync rather than all swaying identically.

Use efficient rendering methods so the extra detail does not significantly reduce performance on Android.

### Villager homes and gardens

Add multiple unique houses around the town.

Each house should have:

- A recognisable exterior design.
- A roof, walls, windows, and entrance.
- A small garden.
- Plants or flower beds.
- Fences or hedges where appropriate.
- Paths connecting the house to the town road.
- Suitable outdoor decorations.

Give different villagers distinct home styles.

Where appropriate, connect NPC daily schedules to their respective homes.

If an NPC's house has an accessible interior, ensure entry and exit work correctly.

### World layout

Maintain clear pathways between the farm, town, shops, river, homes, and other destinations.

Expand the camera's scrollable boundaries and update collision geometry, navigation data, NPC routes, and map coordinates.

Do not introduce large decorative areas that cannot be explored.

---

## 8. Complete minimap visual redesign

The current minimap needs a substantial graphical improvement.

Redesign it as a more detailed, accurate miniature representation of the world.

### Visual quality

- Increase the effective drawing resolution of the minimap.
- Represent terrain using more detailed pixel patterns.
- Display roads, rivers, bridges, trees, fences, and building outlines.
- Give buildings recognisable top-down roof shapes.
- Maintain a consistent scale and coordinate mapping.
- Display the player's position accurately.
- Use a small directional arrow for player orientation.
- Include a subtle frame and readable background.
- Ensure the minimap remains legible when scaled down.

The minimap should represent the actual game world, not a separate decorative illustration that can become inaccurate.

### Building representation

Each major house and shop should have a miniature top-down appearance.

Represent their correct roof footprint, relative size, location, and orientation.

Houses should not all be identical generic squares.

### Replace labels with icons

Remove the permanent text labels displayed directly over locations on the minimap.

Replace them with small, clear pixel-art icons representing:

- Player position.
- Farmhouse.
- Grocery store.
- Blacksmith.
- Estate agency.
- Community hall.
- Fishing hut.
- Market stall.
- Villager houses.
- Selected destination.

### Map legend

Add a compact expandable legend beneath the minimap explaining the icons.

The legend should use the same icons as the map.

On smaller screens, allow the legend to collapse to save space.

### Navigation improvements

Preserve existing waypoint and fast-travel functionality.

Selecting a destination should provide a clear direction indicator and route using the actual accessible world paths.

Keep the full-screen world map consistent with the redesigned minimap.

Use a shared map data source so both map views update correctly after land expansion or building changes.

---

## 9. Dynamic seasonal weather system

Expand the existing weather system into a more varied, season-aware simulation.

Weather should be generated once per in-game day, rather than changing unpredictably every few seconds.

Include:

- Sunny.
- Partly cloudy.
- Overcast.
- Rain.
- Heavy rain.
- Snow (winter only).

Weather must follow sensible seasonal probabilities.

### Suggested starting weather probabilities

These are initial balancing values and may be adjusted during testing.

| Weather | Spring | Summer | Autumn | Winter |
|---|---:|---:|---:|---:|
| Sunny | 30% | 55% | 20% | 15% |
| Partly cloudy | 25% | 20% | 20% | 20% |
| Overcast | 15% | 10% | 20% | 20% |
| Rain | 20% | 10% | 25% | 5% |
| Heavy rain | 10% | 5% | 15% | 5% |
| Snow | 0% | 0% | 0% | 35% |

Each season's probabilities must total 100%.

### Weather effects

**Rain**

- Animated rainfall particles.
- Darker ambient lighting.
- Wet-looking ground.
- Appropriate rain ambience.
- Automatic watering of outdoor crops.

**Heavy rain**

- More intense rainfall.
- Stronger rain sound.
- Reduced atmospheric brightness.
- More pronounced water effects.

**Snow**

- Falling snow particles.
- Snow-covered ground and rooftops.
- Appropriate winter ambience.
- Snow accumulation or seasonal ground overlays where practical.

**Sunny weather**

- Clear lighting.
- Bright environmental colours.
- Gentle shadows.

### Forecasting

Generate the weather using a consistent day-based system.

The television's daily forecast must match the actual weather that the player experiences.

Do not generate a different forecast each time the television is opened.

If a tomorrow forecast is displayed, that forecast must also remain consistent when the next day begins.

Store weather data as part of the saved game.

Make sure seasonal transitions and weather changes do not damage crop progression or break environmental audio.

---

## 10. Main menu and loading-screen overhaul

Completely redesign the game's opening screen.

Create a detailed animated pixel-art background featuring a peaceful countryside landscape with highly detailed trees and vegetation.

### Background design

Include:

- Several layers of trees.
- Richly detailed individual leaves.
- Bushes and tall grass.
- A visible sky.
- Distant hills or woodland.
- Gentle wind-driven foliage movement.
- Subtle atmospheric animation.

The trees should sway smoothly, with branches and foliage moving naturally rather than entire tree sprites sliding from side to side.

Use layered parallax and subtle movement to create a sense of depth while preserving a crisp pixel-art appearance.

The scene should look visually polished rather than like a static background with a few moving rectangles.

### Main menu behaviour

The main menu should contain:

- Continue / Load Game.
- New Game.
- Settings.
- Optional credits.

Selecting an existing save should:

1. Load the correct save data.
2. Display a brief loading transition if needed.
3. Close the main menu completely.
4. Enter the actual game world.
5. Restore the character to the saved location.

The menu must not remain visible or interfere with gameplay after a save loads.

Provide a reliable way to return to the main menu through the pause menu.

Use original, offline-compatible graphics and audio.

---

## 11. Improved NPC conversations and portraits

Redesign NPC interactions to feel more polished and personal.

### Dialogue layout

When interacting with a villager:

- Display the dialogue panel at the bottom of the screen.
- Display the NPC's name.
- Show a detailed pixel-art portrait of the NPC.
- Display the dialogue text using a subtle typewriter effect.
- Provide clear dialogue choices when relevant.

Portraits must match the character's in-world sprite in terms of hair, clothing, and general appearance.

Use original portraits rather than generic placeholders.

### HUD behaviour during conversations

When dialogue opens, temporarily hide normal gameplay interface elements, including:

- Hotbar.
- Minimap.
- Mobile movement joystick.
- Tool-use controls.
- Other nonessential gameplay buttons.

**Keep the main menu/pause button visible**, and keep the dialogue controls accessible.

Disable world movement and tool use while a conversation is active.

When the conversation ends, restore the normal HUD and gameplay controls.

### Dialogue responses

Make conversations respond appropriately to the selected option.

For example, selecting **Hello** should produce a natural response such as:

"Hello to you too!"

"Good morning! Lovely day, isn't it?"

"Oh, hello! Nice to see you."

Each villager should have a selection of personality-appropriate greetings.

After the greeting response has finished displaying, allow the player to dismiss it, then close that short interaction.

Other conversation options, such as requests, gifts, shops, or longer conversations, should continue normally rather than ending prematurely.

Preserve existing NPC relationships and dialogue progression.

Retain appropriate 8-bit-inspired dialogue sounds.

---

## 12. Seasonal leaf animations for pop-up menus

Add a subtle seasonal particle effect whenever a significant game popup or menu opens.

A small number of leaves should drift gracefully across the popup or its surrounding area.

### Seasonal colours

**Spring:** Fresh light-green leaves.

**Summer:** Rich green leaves.

**Autumn:** Orange, red, and golden-brown leaves.

**Winter:** Pale brown or frosted leaves, optionally accompanied by a few soft snow particles.

The particles should:

- Move gently with slight rotation.
- Appear in small quantities.
- Fade in and out smoothly.
- Never obscure important text or buttons.
- Use lightweight animations.
- Stop when the popup closes.

Avoid restarting the effect continuously while the popup remains open.

Provide a reduced-motion option in settings to disable decorative particle animations for accessibility or performance.

---

## 13. Improved mobile and tablet camera support

### Mobile camera zoom

On mobile phones, zoom the gameplay camera out slightly compared with the existing view.

Aim to display approximately 10–15% more world area in each direction, subject to maintaining readable characters and usable controls.

Avoid simply making sprites blurry or stretching the canvas.

The player should be able to see more surrounding terrain, buildings, and interactable objects.

Maintain sharp nearest-neighbour pixel-art rendering.

### Tablet interface support

Introduce adaptive layouts suitable for larger Android and iPad displays.

Support:

- Small smartphones.
- Large smartphones.
- 7–9-inch tablets.
- 10–13-inch tablets.
- Desktop browsers.

On tablets:

- Use the extra available screen space appropriately.
- Avoid oversized buttons and excessive empty space.
- Keep the hotbar centred and easy to reach.
- Position the movement joystick and action buttons ergonomically.
- Allow the minimap to display more detail.
- Use appropriately scaled menus.
- Maintain readable dialogue and inventory interfaces.

Support different aspect ratios, pixel densities, and screen orientations.

Respect safe display areas and avoid interface elements being hidden behind camera cutouts, rounded corners, or operating-system navigation regions.

Preserve Android-first performance and functionality.

---

## 14. Automatic saving and save history

Implement a reliable automatic save system.

### Autosave timing

Automatically save approximately every 60 seconds of **active gameplay time**.

The timer should pause when the game is paused, loading, or inactive.

Also trigger saves at important progression points where appropriate, such as:

- Sleeping and starting a new day.
- Purchasing a land expansion.
- Upgrading the farmhouse.
- Completing a major purchase or unlock.
- Exiting to the main menu.

Avoid excessive repeated writes when several save triggers occur close together.

### Autosave history

Each manual save slot should maintain a rolling history of **the four most recent autosave restore points**.

When a new autosave is created and four restore points already exist, delete the oldest restore point.

Do not accumulate unlimited backups.

Maintain the main current save state separately so automatic backups do not overwrite or corrupt the primary save.

### Save-slot management

On the main menu's save-selection screen, place a three-dot menu (`⋯`) beside each existing save slot.

This menu should contain:

- View Autosave History.
- Rename Save.
- Delete Save.

### Autosave history interface

Selecting View Autosave History opens a list showing the four most recent restore points.

Display:

- Date and time of the save.
- In-game day and season.
- Player location.
- Playtime, if available.

The player should be able to select a restore point and restore the game to that state.

Before restoring an older autosave, display a clear confirmation explaining that the current progress may be replaced.

Preserve backup history safely where practical and never allow one save slot's data to interfere with another.

### Reliability

- Validate save data before loading.
- Use versioned save formats.
- Handle failed writes and insufficient browser storage.
- Protect against interrupted or partially written saves.
- Preserve land ownership, furniture, crops, weather, NPC progress, inventory, and location.
- Do not silently reset existing saved games after this update.

Because browser storage can be cleared by the browser or operating system, retain the ability to export and import save files as a future reliability enhancement.

---

## 15. Future Android APK and iPad IPA support

Do not package the game into an APK or IPA during this update.

However, add both to the permanent development roadmap.

### Android APK — future milestone

When specifically requested, prepare the game for conversion into a standalone Android APK.

Target:

- Offline gameplay.
- Proper Android touch controls.
- Full-screen or immersive display.
- Persistent save storage.
- Appropriate orientation behaviour.
- Native Android back-button handling.
- An original application icon.

### iPad IPA — future milestone

When specifically requested, prepare the game for an iPad-compatible iOS application, with **iOS 15 as the minimum supported version**.

The future iOS build should include:

- An offline-compatible application bundle.
- Tablet-optimised layouts.
- Touch controls.
- Correct safe-area handling.
- Persistent local saving.
- Appropriate iPad screen orientations.
- Original app icons and launch imagery.

Plan to use a suitable native iOS wrapper or application architecture when this stage begins.

An actual installable and sideloadable IPA will require the relevant iOS build tools and appropriate code signing or provisioning. Do not assume simply renaming or packaging `index.html` will produce a functioning IPA.

Keep platform-specific implementation details isolated from the main game logic so the same gameplay systems can later support browser, Android, and iPad releases.

**Do not attempt to generate either mobile application package until I explicitly request it.**

---

## 16. Implementation order

Implement this update in the following order to minimise bugs and preserve existing functionality.

### Priority 1 — Core gameplay fixes

- Correct eye-rendering glitches.
- Implement four-direction walking animations.
- Implement directional tool-use targeting.
- Add dedicated tool animations.
- Preserve all existing farming functionality.

### Priority 2 — World expansion

- Expand farm and town maps.
- Add detailed vegetation and environmental decoration.
- Add villager houses and gardens.
- Implement the Estate Agency.
- Add purchasable farm expansions.

### Priority 3 — Housing and interiors

- Improve the starter farmhouse.
- Add functional pre-furnished objects.
- Add farmhouse upgrade levels.
- Implement furniture purchasing and placement.
- Preserve existing interior inventories.

### Priority 4 — Navigation and presentation

- Redesign the minimap.
- Add map icons and a legend.
- Create more accurate building representations.
- Improve the main menu background.
- Add seasonal popup particles.

### Priority 5 — Living-world systems

- Implement seasonal weather generation.
- Link television forecasts to the real weather state.
- Improve NPC conversation panels and portraits.
- Refine character interaction behaviour.

### Priority 6 — Platform and saving improvements

- Adjust mobile camera zoom.
- Improve tablet layouts.
- Implement 60-second autosaving.
- Add four-slot rolling autosave history.
- Add save-slot management menus.
- Test save migration and recovery.

### Priority 7 — Final quality assurance

Test the complete game with the new systems integrated.

---

## 17. Critical testing and acceptance requirements

Before considering the update complete, verify the following:

**Character and controls**

- Walking in every direction displays the correct character sprite.
- Eyes remain correctly positioned during every animation.
- Tools affect the correct tile in front of the character.
- Tool animations and tool effects are synchronised.
- Touchscreen and keyboard controls behave consistently.

**World and buildings**

- Newly purchased farm parcels unlock permanently.
- Farm expansions connect correctly to existing terrain.
- Buildings have functional collision and entrances.
- Villagers can still navigate correctly.
- Farmhouse upgrades preserve all owned furniture and items.

**Map and navigation**

- The minimap accurately represents world geography.
- New buildings appear in the correct positions.
- Player markers update correctly.
- Map waypoints lead along valid paths.
- Minimap icons correspond to their legend.

**Weather and time**

- Winter is the only season where snow can occur.
- Summer has a lower rain probability than spring and autumn.
- The television forecast matches generated weather.
- Weather does not change randomly whenever a menu is opened.
- Rain waters outdoor crops correctly.

**Menus and NPCs**

- Dialogue appears at the bottom of the screen with an accurate portrait.
- Normal gameplay controls disappear during dialogue.
- The pause/menu button remains accessible.
- Greetings trigger appropriate NPC responses.
- The HUD is restored when conversations end.
- Decorative leaf particles do not block interface elements.
- Selecting a save closes the main menu and enters the game.

**Saving**

- Autosaves occur at approximately 60-second gameplay intervals.
- Each save maintains no more than four autosave restore points.
- Restore points can be selected from the three-dot menu.
- Restoring a save loads the correct world state.
- Existing saves remain compatible or are safely migrated.
- Autosaving does not cause noticeable freezes.

**Performance**

- The game remains responsive on Android phones.
- Tablet layouts scale appropriately.
- Animated foliage does not consume excessive resources.
- Pixel-art rendering remains crisp.
- All gameplay works without an internet connection.

---

## 18. Final instructions

This is a significant upgrade, but visual improvements must not come at the expense of functional gameplay.

Preserve the existing:

- Farming system.
- Crops and seasons.
- Inventory and hotbar.
- Tool upgrades.
- Cooking equipment and recipes.
- Town shops.
- Fishing.
- NPC relationships.
- Market stall.
- Navigation.
- Existing player progression.

Do not remove, replace with mockups, or silently simplify any existing working systems.

Keep the source maintainable, even if the playable output remains a single self-contained `index.html` file.

Prioritise functional completeness, reliable saving, and visual consistency.

For major features, fully implement the underlying gameplay rather than only adding buttons or decorative screens.

If a feature requires more work than can be completed reliably in the current development pass, finish and test the current implementation stage first. Clearly report anything incomplete.

**Final deliverable:** Provide the updated, fully playable offline `index.html` file with all completed changes integrated into the existing game.

At the end of the development response, provide a concise summary of implemented features, outstanding issues, and next development priorities.

Also retain these future roadmap items and remind me of them at the end of every subsequent game-development response:

1. Animal farming — future update only.
2. Offline Android APK — create when explicitly requested.
3. iPad IPA with minimum iOS 15 compatibility — create when explicitly requested, subject to the necessary build and signing environment.

The goal is to transform the existing project into a much more detailed, atmospheric, interactive, and visually polished farming simulator while preserving its stability, progression, and Android-focused design.
