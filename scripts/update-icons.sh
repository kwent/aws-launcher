#!/usr/bin/env bash
#
# Downloads the official AWS Architecture Icons pack and extracts 64px PNGs
# into the icons/ directory with clean filenames.
#
# Usage: ./scripts/update-icons.sh
#
# To update when AWS releases a new icon pack:
# 1. Visit https://aws.amazon.com/architecture/icons/
# 2. Find the new download URL (Asset-Package_MMDDYYYY.<hash>.zip)
# 3. Update ICON_PACK_URL below
# 4. Run this script
# 5. Review changes to icons/ and update services.json if new services were added

set -euo pipefail

ICON_PACK_URL="${1:-https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/architecture/approved/architecture-icons/Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ICONS_DIR="$PROJECT_DIR/icons"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Downloading AWS Architecture Icons pack..."
curl -L -o "$TMP_DIR/icons.zip" "$ICON_PACK_URL"

echo "Extracting..."
unzip -q -o "$TMP_DIR/icons.zip" -d "$TMP_DIR/extracted"

echo "Clearing old icons..."
rm -f "$ICONS_DIR"/*.png

echo "Copying 64px service icons..."
count=0
find "$TMP_DIR/extracted" -path "*/Architecture-Service-Icons*/64/*_64.png" -not -path "*__MACOSX*" | sort | while read -r src; do
  # Strip Arch_ prefix and _64 suffix: Arch_Amazon-EC2_64.png -> Amazon-EC2.png
  basename=$(basename "$src")
  clean_name="${basename#Arch_}"
  clean_name="${clean_name%_64.png}.png"

  # Skip Dark/Light theme variants
  if [[ "$clean_name" == *"_Dark"* ]] || [[ "$clean_name" == *"_Light"* ]]; then
    continue
  fi

  cp "$src" "$ICONS_DIR/$clean_name"
  count=$((count + 1))
done

echo "Done! Copied icons to $ICONS_DIR"
ls "$ICONS_DIR"/*.png | wc -l | xargs echo "Total icons:"
