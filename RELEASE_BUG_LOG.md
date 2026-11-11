# FarmingStar 1.0.0 packaging ledger

- The four independent HTML QA defects are fixed and regression-tested; see `bug reports/QA_REPAIR_CHANGELOG_2026-11-11.md`.
- Local production HTML, desktop storage and actual Linux Electron wrapper tests pass for version 1.0.0.
- Native Windows execution, Intel Mac execution/Universal binary checks and Android build/signature/source/lint gates passed. Apple Silicon execution remains unverified because no hosted ARM runner was allocated; this is disclosed in release notes and manifest.
- Direct GitHub release API access remains unavailable from the cloud execution environment. Git transport works; the authorised GitHub Actions workflow publishes using its own scoped token.
- No commercial signing/Apple notarisation credentials are configured. Windows is unsigned, Mac ad-hoc signed, and Android explicitly test-signed, as described in the release notes.
- The old ignored Android test keystore is absent in this restored environment. The new build's verifier compares certificate fingerprints with the old beta. Users must export before uninstalling if a signing change blocks installation. CI caches the new test identity for subsequent builds; cache eviction remains a test-build limitation.
- Historical 0.4.0 records are preserved under `release/history/0.4.0/` and in Git history.

- Publication investigation: the scoped Actions token could not create the missing version tag (HTTP 403). The verified build was tagged through the authorised Git transport; publication now requires that existing tag. No binaries were rebuilt or substituted to bypass a check.
