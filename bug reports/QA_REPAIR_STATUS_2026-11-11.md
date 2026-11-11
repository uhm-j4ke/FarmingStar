# 11 November 2026 independent QA — repair ledger

Report: [QA_REPORT_2026-11-11_HTML_cf8ad944.md](QA_REPORT_2026-11-11_HTML_cf8ad944.md). Its exact audited HTML is commit `3d3b933`, SHA-256 `cf8ad944e857ea60ed85a967be4e717d9dda92280fdc7d2229e2cec925b28f9e`. The current repair base is `92fbc2c`, which additionally contains the requested hotbar icon fix. Main's older game is not the repair target.

| Repair order | Issue | Initial reproduction | Current status |
| --- | --- | --- | --- |
| 1 | HTML-001: occupied resource renewal | Report harness reproduced forest/mine trap, including ordinary-loop touch, on audited and current builds | Fixed: renewal, footprint/load recovery and normal-loop touch checks pass |
| 2 | HTML-003: unreachable coop entrance | Report harness reproduced accepted south-edge housing and recovery after moving it north, three repetitions per build | Fixed: original rejection, 72 boundary/rotation cases and legacy housing recovery pass |
| 3 | HTML-002: hen fence detour | Report harness reproduced the stall and removal recovery, three repetitions per build | Fixed: fence/L/supplies routes, three hens, sealed waiting, replan, reload/dawn and moved coops pass |
| 4 | HTML-004: arcade native Back | Report harness reproduced all three games remaining active | Fixed: all 24 exit/completion/input cases and cooking/sleep protection pass |

No P0/P1 was reported. Four P2 defects are tracked separately; forest and mine renewal are the same issue. Test limitations and old-suite fixture mismatches in the report are not counted as additional bugs. Saves, chicken identities/eggs, transactions, prior QA repairs and the recent hotbar fix must be preserved. Browser HTML only: no native build or release is authorised for this repair pass.

## Final result

**4 fixed, 0 unresolved reported defects.** Each targeted acceptance suite failed on its original reproduction before the relevant repair, then passed. The original report harness reproduced all five verification groups on both the byte-verified audited file and the repair-base HTML. Its bug-expecting assertions are retained in the original report; repaired behavior is asserted by the four new regression suites.

- Full eight-suite `npm test` pass, including the retained independent save/cooking/quality/history/placement regressions.
- Housing, care, egg/cake/request/shipping, furnishing ownership/UID/quality and write rollback, arcade completion, controller, portable save and developer isolation suites pass.
- Production HTML compilation passes without generating any platform payload. Schema 5 and older supported save migration remain intact.
- [Repair changelog](QA_REPAIR_CHANGELOG_2026-11-11.md), [verification record](verification/2026-11-11/verification.json), [original reproduction evidence](verification/2026-11-11/baseline-reproductions.json) and [full regression log](verification/2026-11-11/main-regressions.txt).

## Related findings handled within these repairs

The existing feeder/bowl movement target was inside its own collision margin. It now uses the same clear approach geometry as housing, so the new route system can actually reach food/water fixtures. The generic invalid-position recovery now searches interiors as well as outdoors and checks the farmer's full movement footprint. These are parts of the reported collision/navigation causes, not additional independent report entries.

## Remaining review / intentionally unchanged

No unrelated feature work was added. The recent hotbar icon fix remains present. The original report's hardware/engine/audio/long-soak limitations remain unverified, rather than being counted as bugs. In particular, HTML native Back is fixed; the existing Android APK is unchanged and real system Back requires verification after an explicitly authorised packaging update. No release, version bump or installer was produced.
