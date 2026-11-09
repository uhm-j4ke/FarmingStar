# Android test builds

[Download FarmingStar Alpha 0.4.0 — Android test APK](FarmingStar-Alpha-0.4.0-Android-TEST.apk?raw=true)

- Version: **0.4.0**, Alpha channel.
- Android: **8.0 or newer**, with a compatible Android System WebView.
- Signing: **test key**, not release signing.
- Includes the original forest portrait icon, offline game, native save storage and portable save transfer.
- Build and seven native save/import tests pass. Phone launch, touch, audio and lifecycle testing are pending; the cloud emulator fails in an independent WebView control app too.

Download the APK using the link above or GitHub’s **Download raw file** action, then open it on Android. Android may ask you to allow installation from your browser.

For this test, check launch, landscape controls, inventory, audio, saving, closing/reopening and portable save export/import. Record the phone model, Android version and steps for any failure.

This test package uses `io.github.uhmj4ke.farmingstar.test`. Installing an update with the same test key preserves its private saves. Export farms before uninstalling, because Android removes private app data on uninstall.

The SHA-256 hash is in [SHA256SUMS.txt](SHA256SUMS.txt). No private signing key is stored in this repository.
