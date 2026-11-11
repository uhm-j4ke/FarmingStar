# FarmingStar — Moss & Ember

A cosy, original pixel-art farming and cooking game. Grow crops, explore the valley, cook meals, care for chickens, fish, meet neighbours and furnish your farmhouse. The game works offline and includes keyboard, touch and controller controls.

## Version 1.0.0

The [1.0.0 GitHub Release](https://github.com/uhm-j4ke/FarmingStar/releases/tag/v1.0.0) is available with all four downloads:

| Platform | Download |
| --- | --- |
| Windows x64 | [Portable EXE](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-Windows-x64.exe) |
| macOS, Intel and Apple Silicon | [Universal DMG](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-macOS-Universal.dmg) |
| Android phone testing | [Android APK](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-Android.apk) |
| Any modern browser | [Standalone index.html](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/index.html) |

[Published release verification](RELEASE_TEST_REPORT.md) · [What's new](release/RELEASE_NOTES.md) · [QA repairs](bug%20reports/QA_REPAIR_CHANGELOG_2026-11-11.md)

The Android refresh (build 10001) installs over the original 1.0.0 app and preserves its saves. It retains the same test-signing identity. When upgrading from the older 0.4.0 beta, export your save before uninstalling if its different certificate blocks installation. Windows is unsigned; the Mac build is ad-hoc signed and not Apple-notarised. Windows and Intel Mac execution passed native tests. Apple Silicon binaries are included and verified, but execution is unverified because hosted ARM runners were unavailable. Checksums and integrity records are preserved in the repository.

## Play

Desktop: WASD/arrows to walk, Space to use your facing tool, E to interact, I for the bag and M for the map. Mobile: landscape joystick, interaction button and swipeable hotbar. Settings → Help & controls explains the game; Bag → Journal provides starter tasks.

For the browser edition, download `index.html` and open it in a modern browser. It contains the game, pixel artwork, font and generated audio, with no hosted assets. Keep the same browser/location for local saves. The `website` branch contains the production browser edition; `main` contains the full source and build tools.

Existing compatible saves are preserved. Use **Save files & transfer** to export backups or move farms between platforms. Browser and app storage are separate. See the [game guide](docs/GAME_GUIDE.md) for farming, cooking, controls and save details.

## Development and verification

```sh
npm ci --ignore-scripts
npm test
npm run test:portable
npm run test:packaging
```

`index.html` is the shared source. Production compilation disables developer tools and strips the test API. The development copy retains the disposable developer farm under Settings → code `0000`.

[Build instructions](BUILD_INSTRUCTIONS.md) · [Release verification](RELEASE_TEST_REPORT.md) · [Development tracker](DEVELOPMENT_TRACKER.md) · [Roadmap](ROADMAP.md)

The repository keeps two branches: `main` and `website`. Older work remains in main's Git history, with archived preview/alpha tags. Additional animal species and further improvements remain planned.
