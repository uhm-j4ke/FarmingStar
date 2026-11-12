# Arcade and menu repair tracker — 12 November 2026

Shared source: index.html. Release target: 1.0.1, Android build 10002. Save schema remains 5; no farm reset is required.

## Fixed and reproduced in browser regression tests

| ID | Report / root cause | Fix and verification |
| --- | --- | --- |
| ARC-001 | Memory sprites become enormous and overwrite other cards. The shared icon renderer resets its target canvas transform to canvas size. | Render icons into cached 32px canvases and draw bounded images inside cards. The original build changed 149,632 pixels outside the revealed last card; repaired build changes zero. |
| ARC-002 | Maze leaves the display and quick replays repeat a layout. It had no cabinet camera and seeded layouts from rounded farm playtime/day. | Fresh randomized 35×23 maze per round, verified solvable; dedicated camera follows and clamps to maze bounds. Walk 16 generated mazes, verify distinct layouts and player containment. |
| ARC-003 | Rhythm taps do not register. Early taps consume a beat, button click fires on release, sound cue leads the visual target, and capped frame time slows the clock. | Judge input on press against elapsed round time, ignore out-of-window taps without consuming beats, suppress compatibility clicks, align cues, and pause on background/resume. Test keyboard/touch/mouse, retry, all 16 perfect hits, misses, slow frames and focus changes. |
| ARC-004 | Results do not explain scores. | Show explicit formulas: maze finish/route/time; memory pairs/guess efficiency; rhythm hit grades/accuracy/misses. Perfect memory = 1,200; rhythm = 1,600; maze maximum = 2,000. |
| ARC-005 | Records requested for each game. | Per-farm top 10, exactly three uppercase letters; optional record submission, no duplicate round entries, atomic rollback/retry on full storage. Save/reload, legacy best migration and malformed-record rejection pass. |
| UI-001 | Button columns escape borders or scroll containers. Action rows inherit flex wrapping, controls shrink, and width plus margins exceeds parents. | Prevent column wrapping/shrink, constrain widths, preserve scroll padding and wrap long text. Test every visible button’s text, viewport bounds, overflow ancestors and hit target after scrolling. |
| UI-002 | Book chapter buttons and page footers clip. Negative tab margins/selected widths exceed scrollports; minimum page height exceeds short screens. | Contained tab widths and book flex layout with fixed footer, independently scrolling pages, viewport-aware sizing and actual page-space calculation. |
| UI-003 | Settings sticky Save overlaps scrolling controls. | Save occupies its own row; action settings have a separate inner scrollport. Phone tests verify Save remains on-screen and settings persist. |
| UI-004 | Appearance category tabs clip at the ends. | Remove conflicting scroll snapping and provide end spacing. Included in 152-screen containment audit at 115% UI scale. |

| ARC-006 | Space fails on focused cabinet buttons because the global movement handler cancels its native activation before arcade handling. | Route arcade keys before global movement cancellation; the real production UI test reproduces the failure before the fix and verifies New round/Exit with Space afterward. |

## Regression evidence

- `node tests/arcade-production.cjs`: play memory and rhythm through actual touch controls and frame timing, save initials under production CSP, and activate New round/Exit with keyboard; no mutation hooks.
- `npm test`: all eight existing gameplay/save suites passed.
- `node tests/arcade-repair.cjs`: reported arcade reproductions, camera, touch/timing/scoring, initials persistence, full-storage rollback and legacy scores passed.
- `node tests/qa-arcade-back.cjs`: 24 active/completed/native/Escape/controller/touch exits passed, repeated Back conserves farm items/coins/time; cooking and sleep guards preserved.
- `node tests/menu-containment.cjs`: 19 menus × 8 viewports = 152 cases at 115% UI scale passed; screenshots and structured report generated under tests/artifacts/arcade-repair/.
- Existing activities, production HTML, portable saves, controller, phone layouts, compact menus, phone/controller layout and 186-case UI precision tests passed.
- Controller Back fixture now sends a neutral controller poll between rounds, respecting the existing held-input release guard.

## Unresolved / pending verification

- This release’s native Android emulator and physical-phone checks remain pending; previous APK feedback is not counted as verification of this build.
- Actual speaker output, physical controllers and prolonged device performance require device testing.
- Apple Silicon execution remains pending; the Universal DMG includes both architectures and has an Intel runtime gate.
- Shared source is repaired for every platform. Installer delivery is tracked separately in the release workflow; do not claim an installer passed until its build and runtime gates succeed.

The first Mac-hosted browser run exposed a test assumption: Home/End move the caret differently on macOS. The text-input regression now uses the native Command+Left/Right shortcuts on Mac and Home/End elsewhere; its input-editing assertion is retained.

## Compatibility and scope

Leaderboards are local to each farm and travel with exported saves. They are not online/global scores. Older saves lacking the optional records field are accepted; each existing personal best is seeded once as `OLD` and labelled as a previous best. No items, coins, crop data or other farm progression are removed. Only arcade gameplay, the requested record feature, menu containment and release tooling changed.
