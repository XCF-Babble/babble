#!/bin/bash
set -euo pipefail

FILES=(
    'package.json'
    'package-lock.json'
    'platform/chromium/manifest.json'
    'platform/firefox/manifest.json'
)

function update_version() {
    jq ".version = \"$2\"" "$1" | sponge "$1"
}

if [[ "$#" != 1 ]]; then
    echo "usage: $0 version"
    exit 1
fi

cd "$(dirname "$0")/.."
for file in "${FILES[@]}"; do
    update_version "$file" "$1"
done
