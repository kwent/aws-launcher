# AWS Launcher

Launch your AWS Services from your macOS dock.

[![npm version](https://img.shields.io/npm/v/aws-launcher.svg?style=flat)](https://www.npmjs.com/package/aws-launcher)
[![CI](https://github.com/kwent/aws-launcher/actions/workflows/ci.yml/badge.svg)](https://github.com/kwent/aws-launcher/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24-brightgreen.svg)](https://nodejs.org)

[![AWS Launcher](https://github.com/kwent/aws-launcher/blob/master/doc/aws-launcher.gif?raw=true)](https://github.com/kwent/aws-launcher/)

[![Grid](https://github.com/kwent/aws-launcher/blob/master/doc/grid.jpeg?raw=true)](https://github.com/kwent/aws-launcher/)

## Installation

```bash
npm install -g aws-launcher
```

This creates a `~/aws-launcher/` folder with 200+ shortcuts to AWS console services, each with its official icon.

Drag and drop the generated folder into your macOS Dock (right by the Trash item).

## Usage

```bash
# Rebuild shortcuts
node compile.js

# Preview without creating files
node compile.js --dry-run

# Custom output directory
node compile.js --dest ~/Desktop/my-aws-shortcuts
```

## Customization

By default, `aws-launcher` generates shortcuts for all AWS services.
You can customize your launcher folder by deleting files in the `~/aws-launcher/`
folder. Drag and drop the folder again in your macOS dock to see your
updated launcher.

## Spotlight

Since `aws-launcher` is basically just a folder, you can use macOS Spotlight
to quickly access your shortcuts as well.

## Contributing

Service definitions live in `services.json`. To add or update a service, edit that file. Each entry maps an icon filename to a console URL:

```json
{
  "Amazon-EC2": {
    "name": "Amazon EC2",
    "namespace": "ec2"
  }
}
```

Use `namespace` for standard `console.aws.amazon.com/{namespace}/home` URLs, or `url` for services with non-standard console URLs.

### Updating Icons

Icons are sourced from the [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) pack. To update:

```bash
./scripts/update-icons.sh
```

See the script for instructions on updating the download URL when AWS releases a new icon pack.

## Requirements

- macOS (uses `SetFile` from Xcode command line tools)
- Node.js >= 24

## History

View the [changelog](https://github.com/kwent/aws-launcher/blob/master/CHANGELOG.md)

## Authors

- [Quentin Rousseau](https://github.com/kwent)

## License

MIT - Copyright (c) 2017-2026 Quentin Rousseau
