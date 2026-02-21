# Changelog

* **v2.0.0** (2026-02-21):
  * Modernize to ESM with async/await.
  * Require Node.js >= 24.
  * Update all icons from official AWS Architecture Icons pack (July 2025).
  * Expand from 71 to 206 AWS services.
  * Add `services.json` manifest (replaces inline namespace mappings).
  * Add `--dry-run` flag to preview without creating files.
  * Add `--dest` flag to customize output directory.
  * Concurrent shortcut creation using worker pool.
  * Remove `Amazon-`/`AWS-` prefixes from shortcut names.
  * Update `fileicon` dependency to ^0.3.3 (fixes macOS 12.3+).
  * Add ESLint (flat config, v10) and Vitest.
  * Add GitHub Actions CI and release workflows.
  * Add Dependabot for npm and GitHub Actions.
  * Add reusable `scripts/update-icons.sh` for future icon updates.

* **v1.0.2** (2017-06-24):
  * Bump fileicon to 0.2.0.

* **v1.0.1** (2017-06-21):
  * Fix EMR link.

* **v1.0.0** (2017-05-27):
  * Initial release.
