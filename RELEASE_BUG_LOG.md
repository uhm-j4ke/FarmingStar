# FarmingStar 1.0.0 packaging ledger

- The four independent HTML QA defects are fixed and regression-tested; see `bug reports/QA_REPAIR_CHANGELOG_2026-11-11.md`.
- Local production HTML, desktop storage and actual Linux Electron wrapper tests pass for version 1.0.0.
- Native Windows execution, Intel Mac execution/Universal binary checks and Android build/signature/source/lint gates passed. Apple Silicon execution remains unverified because no hosted ARM runner was allocated; this is disclosed in release notes and manifest.
- Direct GitHub release API access remains unavailable from the cloud execution environment. Git transport works; the authorised GitHub Actions workflow publishes using its own scoped token.
- No commercial signing/Apple notarisation credentials are configured. Windows is unsigned, Mac ad-hoc signed, and Android explicitly test-signed, as described in the release notes.
- The old ignored Android test keystore is absent in this restored environment. The new build's verifier compares certificate fingerprints with the old beta. Users must export before uninstalling if a signing change blocks installation. CI caches the new test identity for subsequent builds; cache eviction remains a test-build limitation.
- Historical 0.4.0 records are preserved under `release/history/0.4.0/` and in Git history.

- Publication investigation: release creation with an explicit old target_commitish failed under the scoped Actions token (HTTP 403). The verified build was tagged through the authorised Git transport; publication requires that existing tag and omits the unnecessary old target_commitish override. This resolved the 403; the public release upload passed. No binaries were rebuilt or substituted to bypass a check.

- Public distribution verification passed: all four downloaded payloads match their published sizes/hashes; website/standalone/APK HTML match, and the released APK is identical to the early beta. No new game defects were discovered during packaging. Apple Silicon execution and the new APK physical-device test remain open verification items, not claimed passes.
