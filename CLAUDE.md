# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS Launcher is a macOS-only npm package that generates a folder (`~/aws-launcher/`) of `.url` Internet Shortcut files for 200+ AWS console services, each with a custom icon. Users drag this folder into the macOS Dock for quick access.

## Build / Test / Lint

```bash
npm install              # installs deps + runs postinstall (builds shortcuts)
node compile.js          # manual rebuild
node compile.js --dry-run # preview without creating files
npm test                 # run vitest
npm run lint             # run eslint
```

## Architecture

- **compile.js** — Main build script (ESM). Reads `services.json`, creates `.url` shortcut files in `~/aws-launcher/`, attaches icons via `fileicon`, sets macOS file attributes with `SetFile -a E`.

- **services.json** — Source of truth for all AWS services. Maps icon filename keys to `{ name, namespace }` or `{ name, url }`. The `namespace` generates `https://console.aws.amazon.com/{namespace}/home`; `url` is a full override for non-standard console URLs.

- **icons/** — 305 PNG icons (64×64) from the official AWS Architecture Icons pack. Only the ~206 services listed in `services.json` get shortcuts; extra icons are kept for future use.

- **scripts/update-icons.sh** — Reusable script to download and extract the latest AWS Architecture Icons pack into `icons/`. Update the URL in the script when AWS releases a new pack.

- **test/** — Vitest tests validating `services.json` integrity (icon existence, namespace uniqueness, URL format) and compile.js behavior (dry-run, URL generation).

## Adding a New Service

1. Ensure the icon exists in `icons/` (run `scripts/update-icons.sh` if needed)
2. Add an entry to `services.json` with the icon filename as key
3. Run `npm test` to validate

## Platform

macOS only — depends on `SetFile` (Xcode command line tools) and the `fileicon` npm package for icon attachment.
