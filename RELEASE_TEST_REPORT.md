# FarmingStar 1.0.0 — verification status

Release run: https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406

The user authorised all platform packages and actual GitHub Release publication. The previous packaging hold is superseded. This document records current results; the release is published only after the workflow gates pass.

| Check | Status |
| --- | --- |
| Shared game / independent QA | Eight browser suites and four targeted repair suites passed before packaging; repeated in release CI |
| Production HTML | Local PASS: offline/CSP, no developer/test API, creation, controls, saves, native lifecycle/back, portable transfer and failed writes |
| Desktop save store | Local PASS: persistence, atomic replacement, malformed data and related-record rollback |
| Linux Electron wrapper | Local PASS: 1.0.0/source hashes, isolated offline startup, movement/bag/hotbar/audio synthesis, resize, native file transfer, force-stop/relaunch and save-before-close |
| Windows EXE | Native CI running / queued |
| macOS Universal DMG / Intel runtime | Native CI running / queued |
| macOS Apple Silicon runtime | Native CI running / queued |
| Android test APK | Build/signature/source/lint verification running; physical phone testing is assigned to the user |
| Public release assets | Pending all gates |

No claims of physical-phone, audible-output or real-controller certification are made. Earlier 0.4.0 device feedback is historical and does not verify the new build. See `release/history/0.4.0/` for the earlier packaging records.
