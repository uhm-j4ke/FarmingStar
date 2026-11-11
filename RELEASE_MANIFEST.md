# FarmingStar 1.0.0 downloads

Published as the latest non-prerelease [GitHub Release](https://github.com/uhm-j4ke/FarmingStar/releases/tag/v1.0.0), with a brief description and the four game downloads. SHA-256 checksums, metadata and platform integrity records are preserved in this repository.

| Download | Bytes | SHA-256 |
| --- | ---: | --- |
| [index.html](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/index.html) | 528,541 | `550be231aa125b70db01f9307a59376ee7818ca1958bb29ccd377ca30c1b421a` |
| [FarmingStar-1.0.0-Android-TEST.apk](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-Android-TEST.apk) | 2,542,948 | `77d856a11f6b078d487383b47e56932f51a440eb3161752e21fd8f2d72870c11` |
| [FarmingStar-1.0.0-Windows-x64.exe](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-Windows-x64.exe) | 112,150,129 | `b1f89d2b90be42018de1b7c68d39c08b46525415c5a3d86a3fbf64de6453f776` |
| [FarmingStar-1.0.0-macOS-Universal.dmg](https://github.com/uhm-j4ke/FarmingStar/releases/download/v1.0.0/FarmingStar-1.0.0-macOS-Universal.dmg) | 231,342,739 | `79d4279a3ca29391c1648d35d9bbd97be7eced010d8dcc075c58206f81559f10` |

[Published machine-readable manifest](release/published-manifest.json) · [Checksums](SHA256SUMS.txt) · [Native test results](RELEASE_TEST_REPORT.md)

Build commit: `580ed820abbc87b0992f05004d4493debf29ea97`. [Publication run](https://github.com/uhm-j4ke/FarmingStar/actions/runs/43061837834). All four public downloads were downloaded again and independently checked against the manifest. The standalone HTML, website and APK's embedded game match the verified production HTML exactly; the release APK matches the early beta download.

Windows is unsigned. macOS uses an ad-hoc signature, without notarisation; Intel runtime passed and Apple Silicon execution remains unverified. Android is test-signed for the user's phone check; export the old app's farm before uninstalling if its certificate prevents an update. The forest/farmer icon is retained across apps.
