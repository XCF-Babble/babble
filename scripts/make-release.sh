#!/bin/sh
set -euo pipefail

cd "$(dirname "$0")/.."
npm install
npm run build

npm run chromium
zip -r9 babble-chromium.zip assets dist manifest.json

npm run firefox
zip -r9 babble-firefox.zip assets dist manifest.json
