#!/usr/bin/env bash
# PTR-28 spike: build and measure each variant of the home page topology.
set -euo pipefail
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
export OUT_DIR=${OUT_DIR:-spike-results}
mkdir -p "$OUT_DIR"
for v in ${VARIANTS:-static css r3f}; do
  if [ "$v" = static ]; then unset NEXT_PUBLIC_TOPOLOGY; else export NEXT_PUBLIC_TOPOLOGY=$v; fi
  VERCEL_ENV=production npm run build >"$OUT_DIR/build-$v.log" 2>&1
  node node_modules/next/dist/bin/next start -p 3210 >"$OUT_DIR/server-$v.log" 2>&1 &
  for i in $(seq 1 30); do curl -sf http://localhost:3210/ >/dev/null && break; sleep 1; done
  curl -s http://localhost:3210/ | grep -q "data-topology=\"$v\"" || { echo "server is not serving $v"; exit 1; }
  node scripts/spike/measure.mjs "$v" http://localhost:3210 >/dev/null || echo "measure failed for $v"
  pkill -f "next-serve[r]" || true; pkill -f "bin/nex[t] start" || true; sleep 2
done
