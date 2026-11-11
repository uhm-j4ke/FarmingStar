# Browser UI precision candidate — review handoff

This update is on `feature/1.0-world-expansion`. The playable deliverable is the self-contained `index.html`. Native apps, beta binaries, main, release/package versions and GitHub Releases are unchanged. App packaging waits for the user's next instruction.

## Changes to verify

- **Appearance:** Start a new farmer, or approach the wooden mirror in the farmhouse and interact. The farmer preview is on the left with rotation arrows underneath. Six icon-labelled categories on the right are Eyes, Mouth, Hair, Body, Clothes and Facial features. Rotate, walk/stand, compare, randomise, reset, Save and Cancel work. The carved silver frame includes a top-right glint; the phone heading is centred and controls sit inside its safe padding.
- **Persistence:** New appearance fields use validated defaults for older profiles. Legacy long hairstyles retain long hair. Old homes receive one mirror without moving existing furniture: use a free tile, or furniture storage if no suitable tile remains. Moving/storing the mirror retains its identity and interaction. Pause no longer offers appearance editing; arbitrary-location editing is rejected.
- **Sprites:** Facial/hair/cloth accents use a finer character grid; the Ember font binary is unchanged. Side profiles remain slim, foot directions mirror properly, and tools retain the approved constant 5/8 scale. Hats, scarves, glasses and ribbons now follow facing. Villagers own separate appearances rather than inheriting the player's choices.
- **Readability:** Larger labels/counts, a separate quantity footer in slots, contrast, wrapping and safe inset spacing. Quantities use compact thousands when necessary; exact values remain in accessible labels and item details. Actual inventory stacks still cap at 99. The phone hotbar remains at most 52px high.
- **Themes:** Paper/leather books remain for bag, journal and recipes. Other menus use blueprint, carved wood, parchment, workshop metal/rivets, grocery product cards, farm-care wood, fishing colours, arcade cabinet, skill emblems, wooden storage and clean settings. Shared stepped button outlines remain consistent. Journal folios scroll with their page content; footer space is reserved on short screens.
- **Map:** Area/zoom/Centre controls sit in a grey horizontal strip below the map, waypoint actions below it, and locations on the right. Illustrated landmarks and compass follow the latest atlas specification. The desktop minimap is larger with a size-aware backing canvas and clear marker. Phone A/C dimensions remain compact, with A the default. The legend opens above its own toggle.
- **TV:** Valley Weather shows an original presenter pointing at a decorative graph, beside a speech panel with the existing current/tomorrow forecast. The chart does not encode forecast values. Tomorrow's text still matches the weather after the next day.

## Developer tools and ordinary-save protection

In this development HTML, `BUILD_FLAGS.developerTools` is deliberately true. Open Settings → Developer section, enter **0000**, then Unlock test tools. This code is a local convenience, not a security boundary.

Entry first saves the ordinary farm, then creates a marked clone with a new farm identity. All storage keys are remapped into the `.developer.` namespace while the sandbox is active. The Developer badge reopens tools. **Leave test farm** restores the exact original live state, active slot and NPC runtime; commands do not write ordinary farm bytes. Test copies are disposable and are not the ordinary save picker slots.

Controls include item/coin grants, tool/rod/backpack upgrades, station/furniture storage, safe travel, clock/day/season/weather, crop stages/watering/confirmed clearing, feed/medicine/care/egg time, skill XP, recipe unlocks, project completion, diagnostics and an action log. Commands use shared inventory/save validation and transaction rollback. Time advances use the authoritative day/care/weather/crop systems. Destructive crop clearing has an explicit confirmation screen.

The existing `prepareHTML()` production transform forces the developer flag false and strips unrestricted test hooks. The production variant was tested in memory through Chromium. `prepareWeb()` and native builds were not run, so no app payload was updated.

## Systematic UI audit

The repeatable audit opens **30 screen types at six sizes**, plus quantity fixtures at each size: **186 cases**. Sizes: 1920×1080, 1366×768, 915×412 mobile, 740×360 mobile, 1024×768 and 1366×1024. Screens include title, saves, pause, settings, bag, chest, grocery, smith, estate/parcel, crafting/recipes/cooking, building/editor, journal, map, dialogue, animal shop/care, seasonal shop, arcade, fishing hut/activity, skills, projects, collections, TV, appearance and developer tools.

Checks cover popup viewport bounds, horizontal overflow, button text bounds, projecting tab bounds, footer/folio safety, safe quantity insets and icon separation. Selected bag slots and hotbar fixtures use 1, 9, 10, 99, 100, 999 and 1000 without changing production inventory limits. Exact accessible quantities are asserted. Embedded font SHA-256 remains `2a6ba6132153190db4600dbefa918f5352628d8fa43f1e414d2434e14b2144ad`.

The [machine-readable audit](bug%20reports/ui-precision/ui-audit.json) records all cases with zero remaining findings. Desktop/phone screenshots are generated under ignored `tests/artifacts/precision/`. Key title, editor, workshop, skills, journal, map, TV and accessory pictures were visually inspected. This is systematic structural coverage plus selected visual review, not a claim that every possible text length, language, browser or user farm has been manually inspected.

## Reproduce checks

Install the pinned development dependencies and provide Chromium (`CHROMIUM_PATH` can override `/usr/bin/chromium`). Tests use fresh disposable browser origins and local HTTP; no player saves are used.

```sh
npm test
node tests/ui-precision-audit.cjs
node tests/appearance.cjs
node tests/character-details.cjs
node tests/accessories.cjs
node tests/developer-tools.cjs
node tests/map-television.cjs
node tests/production-html.cjs
node tests/controller.cjs
node tests/furnishing.cjs
node tests/book-storage.cjs
node tests/animals.cjs
node tests/chicken-loop.cjs
node tests/activities.cjs
node tests/seasonal.cjs
node tests/portable.cjs
node tests/phone-controller.cjs
node tests/phone-compact.cjs
node tests/menu-layout.cjs
node tests/town-services.cjs
node tests/phone-layouts.cjs
node tests/tool-audio.cjs
node tests/profile.cjs
node tests/tool-scale.cjs
```

Existing fixtures changed only for intended UI behavior: creation fields live in their selected tabs, the creator has a dedicated two-pane layout, the preview has a checkerboard background, and the map uses the current Centre / Set waypoint labels. Conservation, collisions, corrupt-data handling, migration, save rollback, tool timing and eye stability assertions remain enforced.

## Final automated result

All eight established `npm test` suites passed, including the independent QA reproductions. All additional suites listed above passed. The final UI matrix and book/storage pass include the last folio repair. See the [verification record](bug%20reports/ui-precision/verification.json) and retained [main regression log](bug%20reports/ui-precision/main-regressions.log). Earlier failed integration runs are superseded only by passing original reproductions, as described in the issue ledger.

## Remaining review and limits

- Latest map/TV designs await user feedback. Further refinement to those designs pauses for that response.
- Physical Android/iPad, native apps, real controllers, alternate browser engines and audible-output review remain outstanding. This update is browser-only.
- The [renderer measurements](bug%20reports/ui-precision/renderer-performance.json) are warmed headless Chromium update/draw CPU submissions on shared Linux: farm median/p95 3.9/16.8ms, rainy town 5.9/21.9ms, evening forest 3.8/18.4ms, home 2.1/16.5ms. They exclude compositor/audio/device presentation and do not certify 60 FPS or Android performance.
- Managed Chromium blocks file URLs. Offline behavior is tested over local HTTP with no external game dependencies; direct file launch remains a manual unrestricted-browser check.
- No new confirmed save-corruption, duplication, crash or progression blocker remains from this pass. This is a regression-tested candidate for independent QA, not a claim that the game has no bugs.

Latest screenshots are on the separate [`review/1.0-menu-previews` branch](https://github.com/uhm-j4ke/FarmingStar/tree/review/1.0-menu-previews/previews). The [running issue ledger](bug%20reports/UI_PRECISION_FIX_STATUS.md) distinguishes fixed issues from remaining review.
