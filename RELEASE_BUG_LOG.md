# Alpha 0.4.0 release bug and blocker log

Starting commit: `98baeace979ae0bb8dce0012efde1e780585ae49`; release branch: `release/v0.4.0-alpha`. Previous stability fixes are retained. Public package version 0.4.0 is explicitly requested, independently of the prior browser repair label 0.4.1.

## Current issue status

| Issues | Current result |
|---|---|
| Prior independent QA-001–QA-010 | Repairs retained; shared regression run passes |
| REL-001, REL-006–REL-009 | Original targeted regressions pass; fixes retained |
| REL-002–REL-005 (Android wrapper) | Fixes built/linted and targeted storage/shared tests pass; user accepts the phone beta. Detailed emulator UI cases remain unavailable; Android work is paused |
| REL-010 (line-ending security hash) | RESOLVED: original reproduction and native Windows startup pass |
| REL-011 (missing reference fixture) | RESOLVED: fresh-reference reproduction and native Intel Mac package tests pass |
| REL-012 (Windows nested ASAR path) | RESOLVED: original dependency reproduction and native Windows artifact inspection pass |
| ENV-001 / ENV-002 | OPEN: GitHub API policy blocks publication; release signing credentials unavailable |
| ENV-004 | OPEN environment issue: emulator control WebView also crashes; user phone success is recorded separately |
| Apple Silicon runtime | UNVERIFIED: Universal architecture inspection passes; ARM runner remains queued |

Latest Windows verification: [native job 129293790231](https://github.com/uhm-j4ke/FarmingStar/actions/runs/42655400937/job/129293790231). No additional gameplay defect was confirmed in this desktop packaging group.

## Baseline

All eight existing browser suites passed before changes, including 29 stability checks. This covers startup/new/load, movement, bag/hotbar, shop transactions, persistence, crops, cooking, fishing, schedules and navigation. No new baseline gameplay failure reproduced. All runtime assets/audio are embedded/generated; the SVG namespace URL is not an external fetch. No native packaging existed.

## ENV-001 — GitHub release API inaccessible

- Platform/severity: release infrastructure; blocking publication.
- Reproduction: normal configured `gh api repos/uhm-j4ke/FarmingStar` through the managed proxy.
- Expected/actual: repository permission data / HTTP Forbidden. Git transport works. `gh auth status` cannot establish a usable API token. No credential values were inspected.
- Cause: API destination access/authorization is not ready in this environment.
- Fix/retest/status: pending supported configuration; do not publish or claim a draft/release URL until the actual API operation succeeds.

## ENV-002 — release signing credentials unavailable

- Platform: Android/macOS; release signing/notarisation blocker.
- Evidence: environment reports no configured secret bindings.
- Plan: build a clearly labelled test-signed Android APK if no release key becomes available. Never commit signing keys. Apple signing/notarisation must remain accurately marked unavailable.

## ENV-003 — platform runtimes absent initially

- Platform: Android/Windows/macOS; testing prerequisite.
- Evidence: Linux x64, Java runtime only; no Android SDK/emulator, no /dev/kvm, no Windows/macOS runtime.
- Action: installing official Android tools and a JDK; attempt available emulator checks. Windows/macOS testing remains unverified until a suitable host actually runs the packaged apps.

## REL-001 — unrestricted browser diagnostic hooks exposed by default

- Platform/severity: shared production packaging / P1 release requirement.
- Reproduction: ordinary HTML load exposes `window.FarmingStar.state` and mutation methods.
- Expected: release apps have no unrestricted diagnostic state-mutation interface.
- Root cause: regression hooks are exported unconditionally by the source.
- Fix/retest: test-only gating plus production stripping implemented. Production packaging regression passes with no diagnostic state interface and no external asset requests. Shared gameplay implementation retained. RESOLVED for the prepared HTML; native package runtime gates remain separate.

## REL-002 — predictive Back integration flagged by Android lint

- Platform/severity: Android 16+ / P1 input compatibility.
- Reproduction: `:app:lintDebug` against target SDK 36.
- Expected/actual: supported back dispatch / legacy override flagged even with a newer API callback.
- Root cause: manually split modern and legacy Activity back integration.
- Fix: maintained AndroidX ComponentActivity/OnBackPressedDispatcher for all supported APIs; no lint suppression.
- Retest/status: rebuilt Android lint passes with no errors. Real emulator Back input remains UNVERIFIED while ENV-004 is open.

## REL-003 — cutout style used below its supported API

- Platform/severity: Android 8 compatibility / P2.
- Reproduction: SDK lint on the initial wrapper.
- Expected/actual: API-appropriate resources / NewApi error for cutout mode in the base style.
- Root cause: Android P display-cutout attribute placed in an unqualified resource.
- Fix: base theme plus values-v28 override; runtime insets APIs also guarded by API level.
- Retest/status: rebuilt lint passes; API-qualified resources verified. RESOLVED lint reproduction; actual Android 8 execution is not available here.

## Updated platform priority

User steering: after Android and shared save transfer, macOS is the next platform priority, followed by Windows. Intel/Apple Silicon architecture checks must remain separate from actual Mac execution. Controller support is future work in ROADMAP.md.

## ENV-004 — emulator WebView renderer crashes in game and independent control

- Platform/severity: Android API 35 x86_64 software-emulated runtime / blocking the runtime gate.
- Reproduction: launch FarmingStar, then a separate minimal WebView app containing only local HTML/one trivial script. Neither uses Internet access.
- Expected/actual: document loads / both renderers terminate with SIGTRAP at `libwebviewchromium.so+0x17971cc`; the unhandled system renderer failure terminates their host apps.
- Evidence: release/evidence/android-control-crash.txt and android-renderer-crash.txt. Device WebView is 124.0.6367.219. No /dev/kvm is available; SDK warns that software x86_64 emulation may not work.
- Root cause: isolated to this WebView/runtime path, independently of FarmingStar content. Exact native-engine cause remains unconfirmed.
- Action: try a current official runtime image. Wrapper additionally handles renderer termination with an explicit retry/close screen and retained private saves; this recovery does not count as resolving the renderer fault.
- Status: OPEN / runtime verification blocked; do not classify the APK as verified.

## REL-004 — native lifecycle cleanup and renderer failure containment

- Platform/severity: Android / P1 lifecycle hardening.
- Reproduction/inspection: delayed onPause JS callback can outlive a resume; default WebView behavior aborts the host when its renderer stops.
- Fix: foreground/generation guards for delayed pause, singleTask main activity, explicit WebView teardown, public annotated bridge class and onRenderProcessGone retry/close feedback. Private saves remain separate from renderer/cache state.
- Retest: updated APK builds and lint passes. Four native instrumentation tests PASS on API 35: persistence across store recreation, unknown-key rejection, rejected oversized write preserves old data, malformed native store is preserved. Lifecycle UI remains unverified while ENV-004 is open.

## REL-005 — explicit close could destroy the WebView before save completion

- Platform/severity: Android / P1 lifecycle data loss risk found during wrapper review.
- Cause: the quit confirmation queued an asynchronous JavaScript save and immediately called finish().
- Fix: wait for the save callback before closing; a failed save leaves the app open with a clear error. Guard against callbacks from destroyed/replaced WebViews. The limited lifecycle suspend API now returns save success.
- Retest: production lifecycle regression PASS, including false save acknowledgement and unchanged prior save bytes on native write failure. Wrapper rebuild/lint PASS. Native close/relaunch UI remains part of the blocked runtime gate.

## Current Android checkpoint

- All eight original browser suites PASS (36 reported assertion groups, including 29 stability checks); no original reproduction has been newly marked fixed based only on packaging.
- Production HTML suite PASS after the final save-acknowledgement change.
- Android debug/test build and lint PASS (0 errors, 8 warnings).
- Four store instrumentation tests PASS on the actual API 35 guest. These tests do not launch the game UI.
- Current APK identity, byte count and SHA-256 are recorded in release/evidence/android-build.json. It is test-signed, not release-ready.
- API 36 / WebView 133 control launch is being checked. Android UI, force-stop/relaunch, Back and physical-device performance remain UNVERIFIED. Portable save transfer is implemented; native picker/runtime verification remains pending.

### 9 November checkpoint

All seven native store/import instrumentation tests pass on API 36 when run in isolation. The first concurrent attempt was killed by a system startup ANR before reporting tests; that failed attempt is retained. The independent WebView control still terminates with native SIGTRAP on API 36/WebView 133, including after an isolated retry with the emulator's failing Bluetooth service disabled. Native game launch remains BLOCKED here; exact native engine cause is unknown. The emulator is stopped after evidence capture. The user has been given the test APK for physical-phone testing; feedback is pending.

## REL-006 — imported identifiers could become HTML

- Platform/severity: shared save import / P1 content isolation.
- Reproduction: import a structurally valid farm containing HTML in a collection/achievement label or furniture/request identifier, then open the corresponding menu.
- Cause: saved identifiers were interpolated into HTML labels/attributes without escaping. Existing ordinary saves did not trigger the issue; portable files make detached input validation especially important.
- Fix: escape collection/achievement text and furniture/request attributes. Production copies also use a hashed-script content policy with no inline event handlers.
- Retest/status: portable-save regression imports HTML-shaped labels and verifies text rendering, no inserted image and no event execution. PASS; resolved reproduction.

## Portable save implementation checkpoint

- Export/import uses the existing logical save validator and accepts schemas 1–4, with at most four same-lineage history points. Portable files exclude local preferences.
- Replacement requires confirmation and retains one destination backup; repeated imports replace rather than merge.
- Browser transactions retain a bounded write-ahead record and roll back before save reads after interruption. Failed recovery blocks further writes instead of silently replacing data.
- Android commits all related records with one AtomicFile write; new batch instrumentation is pending execution.
- Eight portable regression groups and the production HTML suite pass. Reproducible Android test build passes. The test APK has not yet passed its native UI gate.

## Environment access checkpoint

- A fresh escalated `gh api repos/uhm-j4ke/FarmingStar` still returns Forbidden.
- Saved an additive configuration draft for `api.github.com` and `uploads.github.com`, retaining the package-manager preset and all other fields. Backend confirmed `status: saved`, `requires_publish: true`.
- This draft is not active access, release authentication or publication. User environment-settings review/save/publication is required before retesting. No token values were requested or inspected.

## REL-007 — desktop export deleted a pre-existing sibling file

- Platform/severity: desktop export / P1 unrelated local file loss.
- Reproduction: create `export.json.next` with sentinel contents, export to `export.json`, then read the sibling.
- Actual: original writer reused/removes the fixed `.next` path; regression observed ENOENT for the sentinel.
- Root cause: a private-store temporary-file convention was reused for arbitrary user-chosen export destinations.
- Fix: exclusive, randomly named temporary files; cleanup removes only the writer's own file. Stale managed save temporaries are cleaned only inside the private app data directory.
- Retest/status: sentinel preserved, failed rename retains all original table bytes, and native desktop export/import passes in source and packaged execution. RESOLVED.

## REL-008 — repeated close bypassed the save acknowledgement

- Platform/severity: desktop lifecycle / P1 save-close ordering risk.
- Reproduction: delay the lifecycle save acknowledgement 400 ms; call the native window's close method twice; require the acknowledgement marker to reach private storage before close.
- Actual: second request bypassed the pending acknowledgement. Ordinary primary data was preserved by the pagehide fallback in this reproduction; no primary-save loss was claimed.
- Root cause: the already-closing branch returned without cancelling the second native close event.
- Fix: cancel every close request until save completion, then destroy explicitly. Track application quit intent so macOS Quit completes after saving while ordinary window close retains normal Mac behaviour.
- Retest/status: actual source and packaged Electron tests preserve movement and complete the delayed acknowledgement before repeated close. RESOLVED reproduction; Mac execution remains a native-runner gate.

## REL-009 — browser file read could outlive cancellation and a later selection

- Platform/severity: portable browser import / P2 asynchronous selection integrity.
- Investigation: a final negative-file test read its toast before asynchronous file parsing finished. Corrected the test to await the actual rejection instead of assuming synchronous file reads.
- Root issue: browser reads lacked the native path's busy state and a detached request identity, allowing an old completion to use a later pending slot.
- Fix: visible cancellable read phase, operation identity checks and busy controls; cancelled results are discarded before preview or writes.
- Retest/status: deterministically hold one read, cancel it, select a different file/slot, release the old read, then confirm. Only the later file reaches its intended slot; existing other-slot bytes remain unchanged. Nine portable regression groups and production HTML transfer checks PASS.

## Desktop build checkpoint

- Shared Electron source and a real packaged Linux QA app pass startup/security, keyboard movement, bag/hotbar, WebAudio synthesis, actual viewport resizing, native files, four-point history transfer, repeated import, force-exit/relaunch and repeated-close acknowledgement checks.
- Windows portable EXE cross-build succeeds. PE/AMD64 payload, version, custom icons, unsigned certificate status and packaged source are independently checked. Actual Windows execution is pending.
- macOS Universal build reaches the merger, which explicitly requires darwin. No DMG is fabricated from Linux intermediates. Native Mac build and Intel/Apple Silicon runtime jobs are prepared.
- User steering: focus on desktop applications while physical Android testing proceeds; macOS remains first desktop priority, Windows follows its native build/testing attempt. GitHub release remains last and unpublished.

## Desktop native-run findings — 9 November

- Android is checked off following the user's physical-phone report that it functions perfectly. This is user-reported verification of the GitHub beta, not invented device telemetry. Its build remains unchanged and no Android CI job runs in the current workflow.
- The Universal macOS DMG built on a real Intel Mac and passed all Mach-O architecture, signature, icon/version and DMG integrity checks. Intel runtime testing exposed a missing generated reference fixture in a fresh checkout; Apple Silicon scheduling was delayed.
- Windows native build succeeded but stopped at artifact verification before runtime tests. Detailed failure annotation has been added without relaxing assertions.

## REL-010 — CRLF input generates an incorrect script security hash

- Platform/severity: Windows packaging / P0 potential blank startup.
- Reproduction: compile the same source with CRLF line endings; compare its script digest against browser-normalised LF content. Original digests differ, so the security policy rejects the script.
- Root cause: hashing raw file line endings before HTML parsing normalises them.
- Fix: canonical LF compilation and explicit source text attributes. Script policy remains strict; no unsafe script execution is enabled.
- Retest: LF and CRLF compilation produce identical output and the browser-normalised digest matches; production browser startup/file-transfer checks PASS. Native Windows startup and packaged UI checks also PASS in job 129293790231; the original compilation reproduction no longer fails. RESOLVED.

## REL-011 — native package integrity test lacks its prepared reference HTML

- Platform/severity: fresh native runner / P1 test setup blocker.
- Reproduction: remove the generated `dist/web` reference, run the packaged app test directly; it raises ENOENT for `dist/web/index.html`. The app payload itself remains intact.
- Cause: the Mac runtime job checked out source and downloaded the DMG but did not prepare the reference used by source-hash comparison.
- Fix: the desktop test command generates its reference automatically, using desktop-only preparation.
- Retest: original missing-reference failure reproduced; corrected command passes against the same packaged app in a fresh-reference condition. Native Intel Mac mounted-DMG execution PASS in job 129287445974. RESOLVED.

## REL-012 — Windows archive inspection uses an unnormalised nested path

- Platform/severity: Windows native package verification / P1 test blocker.
- Reproduction: native run 42652576012 builds the EXE, then ASAR inspection raises `"dist/web/index.html" was not found in this archive`.
- Root cause: ASAR 3.4.1 splits directory components using the host separator; the verifier supplied literal forward slashes. Single-directory paths happened to work because the host basename/dirname helpers accept them, while nested `dist/web` was treated as one archive key. The payload is present.
- Fix: normalise every ASAR extraction path using the host path API. No missing-file check or source-integrity assertion was removed.
- Retest: a real temporary ASAR and the dependency's actual filesystem implementation reproduce the original failure under Windows path semantics; normalised lookup passes on Windows and Unix semantics. The complete local Windows PE/icon/version/source verification passes. Native Windows job 129293790231 passes the archive-path regression, full package inspection, storage tests, packaged UI scenarios and actual portable launcher. RESOLVED.

Native Intel Mac runtime passed in job 129287445974, including actual mounted-DMG execution, fullscreen, save import/export, restart and delayed repeated-close acknowledgement. Apple Silicon runtime remained queued at this checkpoint.

### Final desktop verification checkpoint

- Run 42655400937: shared regressions, native Universal DMG build/verification, native Windows build/integrity/storage/UI/fullscreen/portable-launch checks, and Intel Mac mounted-DMG runtime all PASS. Intel runtime job: 129295994720; Windows job: 129293790231.
- Apple Silicon execution remains unverified: the ARM runner is queued. Actual x86_64/arm64 binary coverage was inspected on a native Mac and passed.
- Original REL-010, REL-011 and REL-012 reproductions no longer fail under their targeted regressions and available native platform checks. No assertions were suppressed.
- No GitHub Release or tag was created. API access policy remains unchanged; the saved two-domain environment-settings draft is not active. Signing/notarisation credentials remain unavailable.
- Android is checked off from user phone feedback and its accepted beta bytes remain unchanged.
