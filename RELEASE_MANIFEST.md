# FarmingStar 1.0.0 downloads

The gated [release workflow](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43054835406) is building:

- `FarmingStar-1.0.0-Windows-x64.exe`
- `FarmingStar-1.0.0-macOS-Universal.dmg`
- `FarmingStar-1.0.0-Android-TEST.apk`
- `index.html`

When checks pass, all four appear in the [actual GitHub Release](https://github.com/uhm-j4ke/FarmingStar/releases/tag/v1.0.0), alongside SHA-256 checksums, per-platform integrity records and `release-manifest.json`. The manifest ties every payload to the same build commit.

Windows is unsigned. macOS uses an ad-hoc signature, without notarisation. Android is deliberately test-signed for the user's phone check. The original forest/farmer icon is retained. No missing build is substituted with an archive or a renamed intermediate.
