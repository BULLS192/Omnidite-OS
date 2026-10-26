# Omnidite OS protected cloud preview

This static build deploys only application assets, excluding Electron, developer tests and infrastructure source.

**Protection prerequisite:** The standalone Vercel project must use Vercel Authentication on ALL deployments before any preview is shared.

- This is a browser-local proof of concept, with no custom account login and no shared cloud records.
- No production financial/customer/employee data; do not expose an unprotected public deployment.
- Cloud synchronization requires a separate backend using authenticated PostgreSQL access and enforced workspace rules.
- Never replace the Omnidite public marketing website or current TTT-OS.
- Vercel deploy and installed PWA are different app origins from Electron and localhost, so browser records are not shared.
