# FarmingStar build instructions

All platforms compile the same root `index.html`. The production copy disables developer tools, removes test hooks and adds an offline script policy. Version and Android version code live in `release/release-config.json`; `package.json` and its lockfile must use the same release version.

## Prerequisites and shared checks

Node 24.22.1, pinned npm dependencies, and Chromium for browser tests:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:portable
npm run test:packaging
npm run test:desktop-store
npm run desktop:install
npm run test:desktop
```

The official Electron installer verifies its downloaded runtime. A managed environment using a proxy may need `NODE_USE_ENV_PROXY=1` with Node 24; retain the supplied proxy/CA settings and never disable TLS checks. GitHub runners use their normal outbound access.

## Android phone-test APK

Use JDK 21 and Android SDK platform 36/build-tools 36.0.0; set `ANDROID_HOME` and `JAVA_HOME` as appropriate.

```sh
npm run build:android:test
node tools/verify_android.cjs
```

Output: `artifacts/FarmingStar-1.0.0-Android-TEST.apk`. It uses package `io.github.uhmj4ke.farmingstar.test`, app-private atomic saves, landscape controls, native Back and document save transfer, with no Internet permission. The test key is ignored by Git and cached privately by the Android workflow. Cache loss/older independently generated keys can change the test certificate: export the old app's save before uninstalling if Android rejects an update.

Release signing remains a separate option: securely configure `FARMINGSTAR_KEYSTORE`, `FARMINGSTAR_STORE_PASSWORD`, `FARMINGSTAR_KEY_ALIAS` and `FARMINGSTAR_KEY_PASSWORD`, then `npm run build:android:release`. Never commit signing keys or passwords. Public 1.0.0's Android asset is explicitly the requested **test** APK; user device verification follows distribution.

`verify_android.cjs` verifies the real APK signature, version/code, package, permissions, icon and exact production HTML. It compares the old beta's signing certificate and writes an integrity record. Native instrumentation/device tests are distinct from these build checks.

## Windows x64

On Windows:

```sh
npm run desktop:install
npm run build:windows
node tools/verify_windows.cjs
node tests/windows-archive.cjs
```

Output: `artifacts/desktop/FarmingStar-1.0.0-Windows-x64.exe`, an unsigned NSIS portable application with an AMD64 game payload. The native workflow verifies version/icon/embedded source, runs the packaged application through Playwright and launches the actual portable EXE. A Linux cross-build alone is not a Windows runtime pass.

## macOS Universal

On a real Intel Mac with Xcode command-line tools:

```sh
npm run desktop:install
npm run build:macos
node tools/verify_macos.cjs
hdiutil verify artifacts/desktop/FarmingStar-1.0.0-macOS-Universal.dmg
```

The DMG contains Intel and Apple Silicon code. Verification checks every Mach-O file with `lipo`, version/icon metadata and ad-hoc code signatures. The normal workflow mounts and runs this same DMG on Intel and Apple Silicon. For 1.0.0, Intel execution passed; hosted ARM runners were unavailable and Apple Silicon execution is disclosed as unverified. It is not Developer ID signed or notarised; no such credentials are configured. Linux intermediates are never presented as a Mac release.

## Standalone HTML and release automation

```sh
node tools/stage_html_release.cjs
```

This stages the production `index.html` and checksums. Root source retains developer/testing conveniences; downloadable release/website copies have developer access disabled.

`.github/workflows/release.yml` runs on main source/version/build changes, or manual dispatch. It runs shared tests, builds Windows/macOS/Android, verifies native desktop execution on both Mac architectures and Windows, uploads the early Android phone-test APK to `betas`, then publishes an actual non-prerelease GitHub Release only after all gates pass. `index.html`, EXE, DMG and test APK are separate assets, with SHA-256 sidecars and a manifest. The workflow's scoped token handles publication; no personal token is embedded in source.

Automatic pushes skip an already tagged version to avoid duplicate builds; manually dispatch to resume an unpublished tag. A `[release maintenance]` commit cancels obsolete builds and skips new ones. The publisher verifies an existing tag and omits a target override; the normal publish job creates the tag through Git after build gates pass.

Use a fresh version/tag for each public update; published versions are not silently replaced. Keep `main` for source and `website` for production HTML. Preview and alpha history remains under archive tags. Physical phones/controllers, audible output and extended hardware performance remain separate checks.
