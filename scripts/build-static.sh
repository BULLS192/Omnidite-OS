#!/usr/bin/env bash
set -euo pipefail
mkdir -p out/oskit/profiles out/assets
cp index.html styles.css app.js seed.js manifest.webmanifest service-worker.js out/
cp oskit/core.mjs oskit/ui.mjs oskit/boot.mjs oskit/ui.css oskit/access.css out/oskit/
cp oskit/profiles/omnidite.mjs out/oskit/profiles/
cp assets/os-icon.svg out/assets/
echo "Omnidite OS static shell staged in out/"
