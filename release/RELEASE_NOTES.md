# Alpha 0.4.0

FarmingStar’s existing offline farming, cooking and village game now has native package candidates and portable save transfer. The prior independent QA repairs are retained, including cooking recovery, exact-quality sales, isolated save histories and transactional inventory updates. This is an alpha, not a stable release.

## Changes

- Shared self-contained game code across Android, macOS and Windows, with the original farmer-and-autumn-forest icon on each platform.
- Persistent app-private native saves, lifecycle pausing and save acknowledgement before closing.
- Validated portable JSON save export/import, compatible with logical save schemas 1–4. Imports fully replace the selected slot after confirmation, retain a recovery backup and preserve up to four same-farm history points. Preferences stay local.
- Desktop window resizing, fullscreen, native save file dialogs and an isolated renderer without unrestricted Node access or remote content.
- Production builds omit the diagnostic state-mutation API. Windows and Unix line endings now compile to identical HTML with a matching script-security hash.

## Defects repaired during packaging

- Imported labels and identifiers are escaped before menu rendering.
- Desktop export uses exclusive temporary files, preserving unrelated sibling files.
- Repeated window-close requests wait for the outstanding save acknowledgement.
- Cancelled browser imports cannot apply a stale file read to a later selection.
- Fresh native test checkouts generate their reference HTML before checking packaged source integrity.
- Windows archive inspection normalises nested paths for the host platform rather than falsely reporting the bundled HTML as missing.

Reproduction steps, original failures and retest limits are retained in [RELEASE_BUG_LOG.md](../RELEASE_BUG_LOG.md). Actual platform results are in [RELEASE_TEST_REPORT.md](../RELEASE_TEST_REPORT.md); build procedures are in [BUILD_INSTRUCTIONS.md](../BUILD_INSTRUCTIONS.md).

## Distribution status

The Android test APK is available in the repository’s `betas/` folder. The user reports that this build functions perfectly on their phone; no device model or OS version was supplied. Android work is paused and that binary is unchanged.

Desktop candidates are built by the **Alpha 0.4.0 desktop candidates** Actions workflow. The macOS target is one Universal 2 DMG containing Intel and Apple Silicon binaries; Windows is an x64 game in a portable EXE. Native Windows packaging, source integrity, UI/storage/fullscreen/transfer checks and the portable launcher pass on windows-2022. Native Intel Mac runtime passes; Apple Silicon execution remains unverified while its runner is queued. Windows 10/11 manual testing remains separate. Native artifact archives include their own payload SHA-256 sidecars; a GitHub artifact ZIP digest is a different value.

Android is test-signed, Windows is unsigned, and macOS is ad-hoc signed without Apple notarisation. Audible playback and native file-picker interaction require manual verification beyond automated WebAudio and real-file-I/O checks. No device performance guarantees are made.

No GitHub Release is published by the build workflow. The intended final release is the pre-release `v0.4.0-alpha`; publication remains a separate gated step.

Controller support, animal farming and any iOS/iPadOS package remain future work. No unrelated gameplay expansion is included.
