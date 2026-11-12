# FarmingStar 1.0.1 — verification

[Build and test workflow](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43207908131) · Source `784569142e715229520d3c374fb6a7be214c9e73`

| Check | Result |
| --- | --- |
| Shared game | PASS: eight browser regression suites |
| Arcade repair | PASS: bounded memory sprites; 16 fresh solvable mazes/camera; precise rhythm input; scores, records, save/retry and Back |
| Menu layout | PASS: 152 menu/viewports at 115% UI scale; compact Android controls |
| Offline HTML / save transfer | PASS: production CSP, stripped diagnostics, portable saves and failed-write recovery |
| Android APK | PASS: build/lint, signature continuity, increasing version code, label, permissions and exact production HTML |
| Windows x64 EXE | PASS: PE/source/version/icon, packaged runtime/store/transfer and actual portable launcher |
| Intel macOS DMG | PASS: Universal binaries/signatures, DMG verify/mount and packaged runtime |
| Apple Silicon runtime | PENDING: not executed in this update; both architectures are present |
| Android native/device runtime | PENDING for this build: user will test the APK |

Completed shared suites can be reused only after all game, test, dependency and version blobs are verified identical to a previously successful shared step; the proof is retained in release/evidence/. Changed inputs rerun all eight suites. Arcade and production-input checks run again.

No physical-speaker, physical-controller or long-session Android performance pass is claimed. The APK is test-signed with the same certificate and package as 1.0.0. Windows remains unsigned; macOS is ad-hoc signed, without Apple notarisation.

Earlier release reports are archived in release/history/. [Repair changelog](bug%20reports/ARCADE_MENU_REPAIRS_2026-11-12.md).
