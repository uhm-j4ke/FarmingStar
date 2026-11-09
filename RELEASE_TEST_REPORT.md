# Alpha 0.4.0 test report — work in progress

Source branch: `release/v0.4.0-alpha`, based on `98baeace979ae0bb8dce0012efde1e780585ae49`. This report separates browser checks, native storage instrumentation and packaged game execution. A successful build is not a runtime pass.

| Check | Result | Evidence / limits |
|---|---|---|
| Eight existing browser suites | PASS | 36 reported assertion groups, including 29 stability checks; retained run after portable-save changes |
| Portable-save browser suite | PASS | Nine groups, including cancellation of delayed reads, replacement/backup, malformed files, rollback, interruption recovery, native contract and HTML-label safety |
| Production HTML suite | PASS | No diagnostic state API, hashed script policy, offline assets, save/reload, lifecycle acknowledgement, failed writes, actual portable download/import |
| Reproducible Android build command | PASS | Gradle wrapper, assembled APK and lint; test-signed output only |
| Android lint | PASS with warnings | 0 errors, 8 warnings, including orientation recommendations and intentional JavaScript support |
| Original native store instrumentation, API 35 | PASS | Four tests; these do not open the game |
| Extended native import instrumentation | PASS, isolated | Seven cases on API 36 including batch commit, invalid member rejection and filesystem failure; first concurrent run was killed by a startup ANR before tests |
| Packaged game on API 35 / WebView 124 | BLOCKED | Native renderer SIGTRAP reproduced in an independent minimal WebView app |
| Packaged game on API 36 / WebView 133 | BLOCKED | Independent control also terminates with native SIGTRAP, including isolated retry; exact engine cause unknown |
| Physical Android device | PASS — user reported | User reports the GitHub beta functions perfectly; device/OS details not supplied. Android is checked off and further work is paused |
| Desktop store tests | PASS | Five groups, including whole-batch rejection, simulated rename failure, damaged-store preservation and unrelated export sibling preservation |
| Electron source and packaged Linux QA app | PASS | Eleven scenario groups in each mode: exact embedded source/version, isolation, controls, bag/hotbar, WebAudio synthesis, viewport resizing, real file I/O, transfer, restart, errors and repeated-close acknowledgement |
| Windows portable executable cross-build | PASS | Actual PE, AMD64 payload, correct icon/version, unsigned certificate status, exact production source |
| Actual Windows execution | NOT RUN LOCALLY | Native Windows runner workflow prepared; Linux pass does not substitute for Windows |
| macOS Universal/DMG build | BLOCKED LOCALLY | Supported merger explicitly requires darwin. Native Mac build and Intel/Apple Silicon checks are prepared |
| Release signing / Apple notarisation | BLOCKED | No configured signing credentials |
| GitHub release API | BLOCKED | Explicit destination denial; two-domain environment-settings draft saved, not applied |

The emulator uses software CPU/GPU and no audio device. WebAudio state/synthesis checks cannot establish audible output. No FPS or battery claims are made from this environment.

Native desktop dialog return paths are controlled in automation, while storage and portable file I/O are real. OS dialog interaction and audible playback remain manual/native checks. Linux QA uses a headless backend with `--no-sandbox` because of execution restrictions; the production wrapper requests renderer sandboxing, and the Mac/Windows tests use normal native launch flags.

Publication remains gated. The Android APK has been committed to the user-requested `betas/` folder on GitHub main; this is separate from a GitHub Release. No release/tag has been created or published, and untested desktop execution is not represented as complete.
