# FarmingStar 0.4.0 — stability handover

The playable artifact is the self-contained `index.html`. No build, external images, hosted fonts, network APIs or runtime packages are required. Node/Playwright/Chromium are development-only. The current master update is [IMMERSION-PROGRESSION-SPEC.md](IMMERSION-PROGRESSION-SPEC.md).

## State and invariants

`window.FarmingStar.state` exposes the current game state for inspection. `start(state)` replaces that state; always reacquire `FarmingStar.state` afterward. References held before `start` or restore point loading are obsolete.

- `bagSlots`: **canonical carried inventory**, an array of null or `{id,n,q}` stacks. `q` is 0/1/2; ordinary stacks max 99; reusable tools max 1 per stack. `bagTier` 0–4 gives 10/20/30/40/50 slots. `equippedSlot` selects the actual stack; the hotbar directly renders indices 0–9. Equipping from a later row moves/swaps the stack into the first row.
- `inv`: computed compatibility proxy over `bagSlots`, not a second item store. Its enumerable quantities and JSON form are derived totals. Existing gameplay/fixtures may read totals; production changes should use transactions. Do not replace `inv` with a dictionary. Its debug quantity setter capacity-checks changes but is not an application-level multi-item transaction.
- `containerSlots`: canonical arrays for `chest`, `market`, `shipping` and furniture chest UIDs. `chest`, `stock` and entries in `furnitureChests` are computed quantity views. Storing/moving a chest preserves its UID and stack data. Quality persists through transfers. Do not mutate a quantity view and its backing array separately.
- `inventoryOverflow`: preserved legacy quantities that exceed 50 slots. The bag can recover up to one normal stack per action when space exists. Migration never discards these quantities.
- `plots`: tile-keyed soil/crop records, including age, water, fertiliser and watered-day history. `clearedScenery`, `cleared`, `gathered` and `discoveries` preserve modifications to background generation. Forage/quarry regeneration uses a three-day epoch; area visits do not regenerate resources.
- `skills`: XP totals for farming/fishing/cooking/foraging/crafting; level = `min(10,floor(sqrt(XP/35)))`. `specialisations`, `recipeUnlocks`, `stationLevels`, `collections`, `achievements`, `events` and the starter `journal` persist progression. Achievements and journal rewards have independent once-only flags.
- `parcels`, `homeLevel`, `furniture`, `stowedFurniture`, `ownedFurniture` and `stations` preserve the existing estate/building system. Starter land is owned and can be furnished; purchased parcels add space. Blocking furnishings cannot cover critical farm lanes or utilities. Home placement includes reachability checks.
- `projects`, `activeRequests` (maximum three), `requestDone`, `festivalDone`, `festivalProgress`, `shippingProcessedDay` and `shippingReport` retain community/economy state. A festival reward is keyed by year and season. Shipping clears its source and records the processed day before it can pay again.

## Transaction entry points

- `planInventory(needs,gains,quality)` clones and simulates a change, returning a candidate array or null.
- `transact(needs,gains,cost,quality)` validates every amount, affordability, ingredient availability and resulting capacity, then commits items and coins together. Full-inventory failures leave source world resources/crops uncollected.
- `moveBag(from,to)` swaps/merges without copying stacks into a second hotbar.
- `transferToStorage(uid,index,all)` and `transferFromStorage(uid,id,amount)` preserve quantity and quality. Bulk withdrawal clones both sides before committing; it fails entirely if capacity is insufficient.
- Cooking reserves room for every possible output grade before consuming ingredients. Fishing reserves room for its possible grades before casting. This avoids a locked minigame with nowhere to put its result.
- `buyRod`, `upgradeBackpack`, `craft`, `donateProject`, `deliverRequest`, `finishFestival`, `buyParcel`, `upgradeHome` and `finishFurniture` are the domain operations. Tests should use these or actual UI actions instead of fabricating success flags.

## Time and daily processing

`day` is a monotonically increasing calendar day and `time` is minutes since midnight. `update(dt)` advances by `dt * 0.5`: one real second equals 30 game seconds. A natural 24-hour cycle is 48 real minutes. Menus, inactive tabs and loading/pause states suspend world time. Fishing/cooking count toward active playtime while keeping the world clock paused.

`nextDay(wake=true)` runs daily processing. Sleeping advances the date and returns home at 08:00; natural midnight calls `nextDay(false)` and stays in the world at 00:00. Both settle shipping, update crop growth/season eligibility and daily weather once. `settleShipping` has its own processed-day guard. Forecast generation is saved and independent of opening the TV.

Shop hours in minutes are in `shopHours`: grocery 08:00–23:00; smith/estate 09:00–21:00; hut 07:00–21:00; staffed hall services 08:00–22:00. `shopOpen(area)` checks the single clock. The public hall remains accessible. Existing occupants can always exit closed shops.

## NPC simulation and geometry

`npcSchedules`, `npcPlan(i)` and `npcRuntime` are shared by all areas. `updateNPC(dt)` follows visible collision-aware routes and building entrances. Off-screen actors resolve their logical work/home/social/weather/festival destinations without running full-detail movement. Entering a visible area uses its entrance rather than teleporting to an arbitrary counter. Saving captures plain `npcState` snapshots, with schedules re-evaluated on load.

`worldSize`, `interiors`, `buildings`, `pathTile`, `blocked`, `interiorBlocked`, `rawWater`, `mapBridge` and `worldWater` are authoritative geometry. Compact shop layouts include props, doors and service points. `route(area,from,to)` uses the same collision model. `validScenePoint` prevents NPC placements in fixtures or water.

`resolveInteraction()` returns one `{id,label,run,...}` target using range, facing, distance and stable ID tie breaking. `updateInteraction` displays that exact resolution; `interact` uses it. Tab cycles nearby targets. Do not reintroduce separate hard-coded prompt and E-action lists.

`waypoint` is the authoritative navigation state. `clearWaypoint` clears it and `wayRoute`, removes the active HUD and disables stale atlas actions. `updateNavigation` completes arrival. Minimap and atlas use shared world data and a cached illustrated terrain layer. Project and clearing changes invalidate the relevant map cache.

## Browser checks

Run from the checkout:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The seven scripts are `immersion.cjs`, `systems.cjs`, `smoke.cjs`, `update.cjs`, `expansion.cjs`, `compatibility.cjs`, and `bedtime.cjs`. They start ephemeral local servers and close them afterward. `CHROMIUM_PATH` defaults to `/usr/bin/chromium`. Host policy must permit browser launch; do not modify managed browser policy. Managed Chromium blocks file URLs, so direct file launch remains a manual check on unrestricted browsers.

Tests combine actual pointer/touch/keyboard interactions with controlled state scenarios. Browser errors and external requests are checked. Screenshots under `tests/*.png` are ignored local review artifacts. Checks cover core farming/shop/cooking/building gameplay, bounded slots, drag/touch swapping, full-bag rollback, quality storage, rod tiers/activity/catch sale, off-screen/visible NPC state, terrain/resource stability, forest/quarry access, skills/crafting, project geometry, requests/festivals, navigation cancellation/arrival, slot migration/overflow, autosave rollover/restore, input colours, eye stability and mobile/tablet layout.

Useful debug entry points are exposed on `window.FarmingStar` and documented by name above. `activity`, `action`, `camera`, `atlas`, `dialogueState` and `building` getters expose transient state. Tests can step `stepAction(dt)` and `update(dt)`. The actual frame loop caps a delta at 0.05; large direct test steps intentionally exercise transition guards. Use `start(defaults())` for isolation, then reacquire state. Fixtures may enlarge the bag with matching `bagTier` and null slots before testing unrelated late-game systems.

## Save format and recovery

Save schema 4 accepts versions 1–3. First-time migration converts quantities into bounded stacks and expands a legacy backpack enough to preserve its contents, up to 50 carried slots; excess goes into recoverable overflow. New farms start at 10 slots. Existing coins, dates, relationships, land, furniture, equipment and old unlocked recipes remain.

Primary slots use `farmingstar.moss-ember.slot.1` through `.3`; `.history` holds at most four autosave points; `.before-restore` holds one undo copy. The original single-save key remains a backup. Autosaves occur at roughly 60 seconds of active gameplay and defer until a minigame is safely complete. Nearby meaningful-action saves coalesce. `save(true)` flushes a fixture/manual save immediately. `validateSave` rejects invalid stack amounts/qualities and malformed collections. `restorePoint` requires UI confirmation and does not mingle farm histories.

LocalStorage writes are atomic per key, not a transaction spanning all keys. A failed history write can coexist with a successful primary save and is reported. A browser or OS clearing local data is outside the game's control. Export/import and native durable storage remain future reliability work.

## Stability priorities and limitations

1. Run long multi-day/season playthroughs across farming, shipping and daily rollover; exercise saving during mobile background/foreground transitions.
2. Measure frame time and memory on physical Android/iPad hardware. Current tests emulate devices; no measured physical-device 60 FPS claim is made.
3. Stress NPC visible/off-screen transitions, closing-hour departures, weather sheltering, dense forest routes and furnishings near doors.
4. Fuzz stack swaps, quality merges, capacity edges, quantity proxies, partial legacy data and storage quota failures.
5. Balance the slower clock, backpack prices, crafting XP, forest renewal and festival/project rewards with sustained real play.

Known simplifications: there is no seated bench/chair pose; resting uses a short message. Schedules model home/work/social/weather/festival destinations and movement rather than a dialogue-heavy social simulation. Current shelf artwork uses several original product motifs rather than unique art for every catalogue item. Cooking retains timing-based activities; pizza uses the ingredient/station chain rather than a bespoke topping-drag minigame. Equipment has two consistency upgrades rather than parallel batch queues. Requests use three feasible daily offers with optional acceptance and no expiry, rather than a large authored quest catalogue. Terrain/lighting/audio are lightweight pixel effects, not a dynamic lighting engine. Rare, extended balance and performance defects remain possible despite passing checks.

Stop major expansion here: use this handover for systematic stability work.

**Future only:** animal farming; fully offline Android APK on explicit request; iPad IPA targeting iOS 15+ on explicit request with suitable build/signing facilities. Neither package is generated in this update.

## Bedtime and art follow-up

`interactFurniture` → `sleepPrompt` → `sleepInBed` requires proximity to a physical farmhouse bed. It commits the save once before a short runtime-only `resting` scene. Repeated buttons and closing the modal are blocked during that scene; hidden tabs pause it. Sleep before midnight uses `nextDay()`. Sleep at 00:00–05:59 restores energy and sets 08:00 on the same date, since natural midnight already advanced crops/shipping. Daytime early sleep remains available. `nextDay` remains unchanged for controlled calendar fixtures. Storage failures are shown rather than reporting a successful save.

Rendering keeps logical coordinates but doubles the world backing canvas. `micro` snaps extra details to half units; existing `rect`, physics and pointer conversion retain their original grid. Icons are 32×32 canvases for a 16-unit design. Action caches include the tool tier. Nine station types have distinct art. Furniture dimensions, shop prop layouts, character eye anchors and all saved data retain their original meaning.

`menuAmbience` is one recycled background canvas with 32 deterministic seasonal particles, capped at 30 updates per second. It sits behind the sheet, ignores pointer input and clears in reduced motion. No new timers or external assets are used. `bedtime.cjs` exercises real bedside keyboard/touch interaction, one-shot growth/save, after-midnight wake, reload, all four menu palettes, reduced motion and phone landscape message visibility. Screenshots `art-home.png`, `art-grocery.png`, `art-buildings.png`, `seasonal-menu.png` and `bedtime-mobile.png` support local visual review. Hardware performance is still a manual follow-up.
