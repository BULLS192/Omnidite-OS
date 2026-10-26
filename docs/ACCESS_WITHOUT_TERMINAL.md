# OmniditeOS access without PowerShell

## Desktop install on Windows
Download the .exe artifacts from the latest passing **Build Omnidite OS desktop (Windows)** GitHub Actions run. It creates an installer and a portable executable. You can install the first or double-click the second. No Node.js, PowerShell, or development tools are needed on your Windows PC.

**Important**: These development builds are unsigned. Windows SmartScreen may warn because the publisher is not yet verified. Only use artifacts from this repository's official GitHub Actions runs, and never bypass a warning for an untrusted download.

Electron loads the local application through the stable 'osapp://omnidite' secure custom protocol, with Node integration disabled, context isolation and sandbox on. OS Core data is stored in the local Electron profile and is **not** synchronized with browser storage, another computer, or the cloud. Do not enter sensitive production records.

## Cloud / iPhone / iPad
The project includes a PWA manifest and an offline shell service worker; when this branch is deployed over HTTPS, open the protected preview URL. On Safari choose Share -> Add to Home Screen. On supported desktop browsers choose Install App.

Publishing it does not provide shared records. Cloud data needs real authentication and a server-side database (such as Supabase Postgres with row-level security), with a careful migration path from per-browser storage.

Before any online publication, ensure deployment protection covers **all deployment URLs** and only trusted team members can sign in. No unprotected public deployment is approved for actual customer data. Do not change the existing Omnidite public site or other projects.
