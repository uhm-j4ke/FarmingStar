# FarmingStar 1.0.0 packaging ledger

- The four independent HTML QA defects are fixed and regression-tested; see `bug reports/QA_REPAIR_CHANGELOG_2026-11-11.md`.
- Local production HTML, desktop storage and actual Linux Electron wrapper tests pass for version 1.0.0.
- Native Windows, Intel/Apple Silicon macOS and Android packaging gates are running. Failed gates block publication; platform results are not inferred from cross-builds.
- Direct GitHub release API access remains unavailable from the cloud execution environment. Git transport works; the authorised GitHub Actions workflow publishes using its own scoped token.
- No commercial signing/Apple notarisation credentials are configured. Windows is unsigned, Mac ad-hoc signed, and Android explicitly test-signed, as described in the release notes.
- The old ignored Android test keystore is absent in this restored environment. The new build's verifier compares certificate fingerprints with the old beta. Users must export before uninstalling if a signing change blocks installation. CI caches the new test identity for subsequent builds; cache eviction remains a test-build limitation.
- Historical 0.4.0 records are preserved under `release/history/0.4.0/` and in Git history.
