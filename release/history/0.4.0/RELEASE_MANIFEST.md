# Alpha 0.4.0 artifact manifest

These are candidates, not a completed public release. Local output SHA-256 values are in `SHA256SUMS.txt`; machine-readable details and source hashes are in `release/manifest.json`. Native CI candidates are listed separately below: their artifact ZIP digests do not substitute for payload checksums.

| Platform | Local artifact path | Build | Local size (bytes) | Runtime status |
|---|---|---|---:|---|
| Android | `artifacts/FarmingStar-Alpha-0.4.0-Android-TEST.apk` | built locally | 2558519 | PASS — user reports the unchanged GitHub beta functions perfectly on their phone; device/OS not supplied |
| Windows | `artifacts/desktop/FarmingStar-Alpha-0.4.0-Windows-x64.exe` | built locally | 111748902 | Local cross-built EXE has not been executed on Windows; native CI candidate evidence is separate below |
| macOS | `artifacts/desktop/FarmingStar-Alpha-0.4.0-macOS-Universal.dmg` | built on native CI; not downloaded locally | — | PASS on Intel macOS 15; Apple Silicon runtime unverified (runner remained queued) |
| Standalone HTML | `artifacts/FarmingStar-Alpha-0.4.0.html` | built locally | 282657 | Production browser suite passed |

macOS native candidate: [download archive](https://github.com/uhm-j4ke/FarmingStar/actions/runs/42655400937/artifacts/13693450045) — PASS on Intel macOS 15; Apple Silicon runtime unverified (runner remained queued). Source commit: `c922969d50ed962572712f2da0a77ef99e6c6872`. ZIP SHA-256: `85f3081c19e01c83fed98d4c3d345b48799f3313a5ebdefef71e9b6781a7415c`; payload SHA-256 is in the archive sidecar.
Windows native candidate: [download archive](https://github.com/uhm-j4ke/FarmingStar/actions/runs/42655400937/artifacts/13692316437) — PASS on native windows-2022 runner, including packaged x64 UI tests and actual portable launcher; Windows 10/11 manual checks not performed. Source commit: `c922969d50ed962572712f2da0a77ef99e6c6872`. ZIP SHA-256: `caab5191b131ddfa7881451d1ad35f5045d4ee38fda53799e609469b59810362`; payload SHA-256 is in the archive sidecar.

Android is test-signed. Windows is unsigned. The macOS target uses ad-hoc signing and has no notarisation credentials. A missing DMG is not replaced with a renamed archive or Linux intermediate app.

The uploaded Android beta is on GitHub main under `betas/`, independently of the final GitHub release. The requested release tag remains `v0.4.0-alpha`; draft creation and publication are final gated steps.
