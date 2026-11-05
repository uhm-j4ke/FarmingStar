# Independent QA and stability verification

The four imported reports are preserved exactly as attached. Their links to separate evidence/scripts refer to files that were not included; do not infer those original 83 checks were rerun here.

- [Repair changelog and retest instructions](REPAIR_CHANGELOG.md)
- [Running fixed/unresolved/new issue ledger](FIX_STATUS.md)
- [Original bug report](QA_BUG_REPORT.md)
- [Original developer handoff](QA_DEVELOPER_HANDOFF.md)
- [Original coverage report](QA_TEST_COVERAGE.md)
- [Combined original report](FarmingStar-QA-Report.txt)
- [Baseline reproduction results](verification/baseline.json)
- [Additional legacy migration reproduction](verification/baseline-migration.json)
- [Final results and game SHA-256](verification/final.json)
- [Full npm validation log](verification/final-validation.txt)

`tests/stability.cjs` reconstructs the documented reproductions using disposable browser saves. Baseline failures are intentional evidence of the original defects; final PASS means expected behaviour now holds. Intermediate group results document staged checks and can have fewer cases than the final suite. The HTML hash identifies the tested artifact; `source` identifies the commit checked out while collecting the result, including before a repair commit exists.

Imported file SHA-256 values:

| File | SHA-256 |
|---|---|
| QA_DEVELOPER_HANDOFF.md | `7d32dc423efffb4025bd0e8b186642e1ad46d970d0ce32d7388e73cad4027d86` |
| QA_TEST_COVERAGE.md | `98de7131c19f59c55c8164b05f0cb55c77f1ca1916e1d2bf09035654bf64eff2` |
| QA_BUG_REPORT.md | `aa04ad53ade0959cea4c08f3ffbf2156a64f64a293cb695df31cd32ea1938630` |
| FarmingStar-QA-Report.txt | `319faa1b4fe6fa174bfb0c5e0b9b0f9726a883dbb3b48927242443bd0ddfd26b` |

No real-player saves, browser profiles or credentials are included. This is a stability candidate for independent rechecking, with physical-device and alternate-engine work still outstanding.
