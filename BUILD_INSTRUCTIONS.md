# Alpha 0.4.0 build instructions

All targets use the same root `index.html`. `npm run prepare:web` produces an offline copy with a hashed script policy and removes the diagnostic game-state API. No web server is needed by a packaged app. The original standalone HTML remains playable.

## Prerequisites

- Node.js 24.22.1 (the CI pin) and `npm ci`. Electron 45.2.3 and electron-builder 26.18.0 are pinned development dependencies.
- Android: JDK 21, Android SDK platform 36, build-tools 36.0.0 and platform-tools. Set `JAVA_HOME` and `ANDROID_HOME`, or use an ignored `android/local.properties` containing `sdk.dir=...`.
- The checked-in Gradle wrapper pins Gradle 8.13 and its distribution checksum. Android Gradle Plugin is 8.13.2; resolved dependencies are locked.
- Preserve system proxy and CA trust where required. In this cloud environment the separately installed JDK uses `-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts`; the outer executor requires its configured proxy for SDK/Maven downloads. Do not disable TLS verification.

## Shared game checks

```sh
npm ci
npm test
npm run test:portable
npm run test:packaging
```

The eight existing gameplay suites retain their assertions and use test-only instrumentation. Portable-save tests cover full replacement, cancellation, malformed data, lineage, duplicate prevention and browser transaction recovery. Production HTML tests run without game-state mutation hooks.

## Android

```sh
npm run build:android:test
# Optional, with a connected emulator or device:
npm run build:android:test -- --instrument
```

Output: `artifacts/FarmingStar-Alpha-0.4.0-Android-TEST.apk`. The script creates an ignored local test keystore only if absent. Its conventional Android debug password is public by design; this is not release signing. Keep the local test key to update an existing test installation. Test package ID: `io.github.uhmj4ke.farmingstar.test`.

For release signing, securely configure `FARMINGSTAR_KEYSTORE`, `FARMINGSTAR_STORE_PASSWORD`, `FARMINGSTAR_KEY_ALIAS` and `FARMINGSTAR_KEY_PASSWORD`, then run:

```sh
npm run build:android:release
```

Release output: `artifacts/FarmingStar-Alpha-0.4.0-Android.apk`. Release package ID: `io.github.uhmj4ke.farmingstar`. Never commit the keystore or passwords. Verify the actual APK using Android SDK `apksigner verify --verbose --print-certs` before distribution.

Minimum Android API is 26; target API is 36. The APK contains Java bytecode and embedded HTML, with no ABI-specific native game libraries. It needs a compatible Android System WebView. Actual tested OS/engine combinations are recorded separately; minimum API metadata is not proof that an old, unupdated WebView can render the game.

The native wrapper bundles the game and uses no Internet, location, microphone, contacts or camera permission. Its small platform bridge provides only app-namespaced storage, atomic record replacement and Android document pickers. Saves live in the private files directory through `AtomicFile`, independently of WebView caches. The Android framework/AndroidX wrapper preserves the existing Canvas implementation without adding a second game framework.

Native store instrumentation runs with `:app:connectedDebugAndroidTest`. Game UI/lifecycle checks use `ANDROID_SERIAL=<serial> ANDROID_API=<api> ADB=<sdk>/platform-tools/adb node tools/android_runtime.cjs`. These are distinct tests; native store tests alone do not validate startup, controls or audio. Physical device and audible-output checks must be reported separately.

## Portable saves

Use **Load Game → Import save here**, or **Save options → Export portable save**. In-game, open the pause menu and choose **Save files & transfer**. Imports require confirmation and replace the entire destination without merging. A single import backup retains the previous farm and restore records; **Restore before last import** recovers it. Exports include up to four same-farm restore points, exclude device preferences, and accept compatible logical save schemas 1–4. Files are limited to 4 MB. Invalid files leave existing saves untouched.

Browser replacement uses a write-ahead rollback journal. If interrupted, the old records are recovered before save loading. If recovery cannot finish because storage is unavailable, writes remain blocked until storage is freed and the page is reloaded. Native replacement writes all related records in one atomic file operation. A failed storage write never grants a successful import acknowledgement.

## Shared desktop wrapper

Electron preserves the existing Canvas, WebAudio and touch/keyboard implementation in a maintained local Chromium runtime. Only the host storage and native file dialogs differ by platform. The renderer has context isolation, no Node integration, a sandbox, blocked remote requests/navigation and a restricted preload bridge. One instance owns the private save table, stored beneath Electron's persistent `userData` directory. File-dialog selections never grant the renderer arbitrary filesystem access.

```sh
npm run desktop:install
npm run test:desktop-store
npm run prepare:web
npm run test:desktop
```

Electron 45's package requires an explicit runtime installation; `desktop:install` runs the official checksum-verifying installer. The packaged UI test compares the actual bundled HTML/main/preload/store hashes against the source before exercising controls, WebAudio synthesis, resizing, native file I/O, import/export, forced exit/relaunch and repeated close requests. Its native file-dialog return paths are controlled by the test; actual OS dialog interaction and audible sound remain separate manual checks. Linux QA uses a headless backend and `--no-sandbox` in the restricted test environment; shipped desktop apps and Mac/Windows tests do not use that switch.

On Linux, `npm run build:desktop:test` creates an internal QA bundle, not an additional public release target. Run the packaged tests with `FARMINGSTAR_DESKTOP_EXE=artifacts/desktop/linux-unpacked/farmingstar npm run test:desktop`.

## macOS Universal 2

On a real Mac with Xcode command-line tools:

```sh
npm ci
npm run desktop:install
npm run build:macos
node tools/verify_macos.cjs
hdiutil verify artifacts/desktop/FarmingStar-Alpha-0.4.0-macOS-Universal.dmg
```

The verifier inspects the actual main executable and every Mach-O dependency using `lipo`, requires x86_64 and arm64, checks version/icon metadata and verifies the ad-hoc signatures. The current configuration uses ad-hoc signing and disables notarisation because Developer ID/notarisation credentials are unavailable. This is not Apple-trusted distribution signing. Configure appropriate signing/notarisation before advertising those properties.

The supported Universal merger explicitly rejects Linux. Linux-generated intermediate thin app directories are not distributable Mac releases and are not offered as substitutes for a DMG. Native execution on Intel and Apple Silicon is required separately from architecture verification.

## Windows x64

```sh
npm ci
npm run desktop:install
npm run build:windows
node tools/verify_windows.cjs
```

Output: `artifacts/desktop/FarmingStar-Alpha-0.4.0-Windows-x64.exe`, a genuine NSIS portable executable containing the AMD64 game and runtime. Its bootstrapper may be x86; the game payload is x64. The resource verifier checks both PE files, public version, original icon images, absent signing certificates and exact packaged source. A successful Linux cross-build does not validate Windows execution.

On Windows, set `FARMINGSTAR_DESKTOP_EXE` to `artifacts/desktop/win-unpacked/FarmingStar.exe` and run `npm run test:desktop`. The native workflow also launches the actual portable executable to check extraction/startup. No Windows signing certificate is configured; current candidates are unsigned.

## Native runner workflow and publication

`.github/workflows/alpha-packages.yml` uses pinned Action commits. It runs desktop/shared regressions, a native macOS Universal build on Intel, tests the same DMG on Intel and Apple Silicon, and builds/tests Windows x64 alongside Mac rechecks after the shared tests. Intel Mac packaging and native runtime have already passed. Android is paused at the user's request and has no job in this workflow. Desktop builds proceed after shared checks independently of Android's unresolved emulator issue, following the user's updated desktop priority. Native outputs are CI candidates, not automatic releases. Native artifact downloads include SHA-256 sidecars and metadata. Each job starts with fresh evidence so retained old reports cannot masquerade as a current pass.

The workflow never publishes a release. The final GitHub release step uses tag `v0.4.0-alpha`, title **Alpha 0.4.0**, and pre-release classification. Create a draft first and publish only after the release gates in the master specification pass. Current blockers and actual test status are recorded in `RELEASE_BUG_LOG.md`, `RELEASE_TEST_REPORT.md` and `RELEASE_MANIFEST.md`.
