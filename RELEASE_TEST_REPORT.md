# FarmingStar 1.0.0 — verification results

Build commit: `580ed820abbc87b0992f05004d4493debf29ea97`.
[Build and test run](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406).

| Check | Result |
| --- | --- |
| Shared game / independent QA | PASS: eight browser suites and all four targeted 11 November repair suites repeated in release CI |
| Production HTML | PASS: offline/CSP, developer/test API removed, creation, controls, saves, lifecycle/Back, portable transfer and failed writes |
| Desktop save store | PASS: persistence, atomic replacement, malformed data and related-record rollback |
| Linux Electron wrapper | PASS: 1.0.0/source hashes, isolated offline startup, movement/bag/hotbar/audio synthesis, resize, native file transfer, force-stop/relaunch and save-before-close |
| Windows x64 EXE | PASS on native Windows 2022: PE architecture, version, icon, source, packaged UI/save/transfer/fullscreen and actual portable launcher |
| macOS Universal DMG | PASS on Intel macOS 15: DMG verification/mount, both architectures in all bundled Mach-O files, ad-hoc signatures, version/icon/source and actual packaged runtime |
| macOS Apple Silicon execution | UNVERIFIED: both hosted ARM runner pools were unavailable; original job failed before acquiring a runner, not during app execution |
| Android test APK | PASS: Gradle build/lint, APK signature, version 1.0.0/code 10000, package, permissions, icon and exact production HTML. Physical phone testing assigned to the user |

## Evidence

- [Shared checks](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406/job/130641379827)
- [Android checks](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406/job/130643996558)
- [Windows execution](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406/job/130643996630)
- [Intel Mac execution](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406/job/130643996464)
- [ARM runner provisioning failure](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406/job/130648556167): “The job was not acquired by Runner of type hosted even after multiple attempts.” The overall build run is red for this infrastructure failure; completed platform checks above passed.

The packaging instructions permit unavailable native environments to be disclosed. Universal architecture verification and Intel execution do not establish an Apple Silicon runtime pass. No claims of physical-phone, audible-output, real-controller or long-session performance certification are made. Earlier 0.4.0 device feedback does not verify this build.

## Save and signing compatibility

The shared source and schema 5 are unchanged by packaging; compatible older saves remain supported. Browser and native app storage are separate; use **Save files & transfer** to move farms. Production builds disable developer access.

Android retains `io.github.uhmj4ke.farmingstar.test`. Its new test certificate differs from the old 0.4.0 beta because the previous ignored keystore was absent in the restored environment. **Export from the old app before uninstalling it**, then install and import. Never uninstall your only saved copy. The new test key is privately cached in CI; cache eviction remains a signing-identity limitation.

Windows is unsigned; macOS uses an ad-hoc signature without Developer ID notarisation. Android is deliberately test-signed. Historical records are in `release/history/0.4.0/`.

## Public distribution check

[Publication succeeded](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43061837834). [GitHub Release 1.0.0](https://github.com/uhm-j4ke/FarmingStar/releases/tag/v1.0.0) is public, marked latest, and is not a prerelease. All four payloads were downloaded from the public release and independently verified for byte size and SHA-256. The standalone HTML matches local production output and the website exactly; APK embedded HTML and the early beta APK also match. Published checksums, platform integrity records and the build commit are preserved in this repository.

Remote branches are exactly `main` and `website`; old preview/release histories remain archived in main and tags. No game source or save schema changed during packaging.
