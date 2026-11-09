# Alpha 0.4.0 artifact manifest

These are candidates, not a completed public release. Full SHA-256 values are in `SHA256SUMS.txt`; machine-readable details and source hashes are in `release/manifest.json`.

| Platform | Artifact | Build | Size (bytes) | Runtime status |
|---|---|---|---:|---|
| Android | `artifacts/FarmingStar-Alpha-0.4.0-Android-TEST.apk` | built | 2558519 | Blocked on cloud emulators; physical phone feedback pending |
| Windows | `artifacts/desktop/FarmingStar-Alpha-0.4.0-Windows-x64.exe` | built | 111748902 | Windows execution pending; shared packaged Linux runtime passed |
| macOS | `artifacts/desktop/FarmingStar-Alpha-0.4.0-macOS-Universal.dmg` | blocked/unavailable | — | Native Mac build and execution required |
| Standalone HTML | `artifacts/FarmingStar-Alpha-0.4.0.html` | built | 282657 | Production browser suite passed |

Android is test-signed. Windows is unsigned. The macOS target uses ad-hoc signing and has no notarisation credentials. A missing DMG is not replaced with a renamed archive or Linux intermediate app.

The uploaded Android beta is on GitHub main under `betas/`, independently of the final GitHub release. The requested release tag remains `v0.4.0-alpha`; draft creation and publication are final gated steps.
