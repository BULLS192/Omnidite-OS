# Omnidite OS V0.1 — Project 001

This is the first standalone foundation build for Omnidite OS.

## What works now
- Portfolio Command Center dashboard
- 19 seeded projects across Core, Industrial, Darts, Commercial, R&D, Commerce and Personal lanes
- Priority/status/progress tracking with local persistence
- Seeded milestone roadmap and Gantt view
- 26-week Sunday accountability view
- Infrastructure registry with current known repositories
- P0/P1 Focus Mode
- JSON export/import backup
- Add-project flow

## Run on Windows
Double-click `START-OMNIDITE-OS.bat`.

Or from a terminal:

```bash
node server.mjs
```

Then open `http://localhost:8788`.

## Data
V0.1 stores changes in browser `localStorage` intentionally, so no new database/project is required during the foundation gate. Export JSON regularly from the header.

## V0.1 boundaries
This is not yet the cloud-backed version. Cloud persistence/auth is intentionally scheduled later in the six-month roadmap after the portfolio, roadmap/task, infrastructure and CRM models are stable.

## Next build gate
**OS-002 — V0.1 Portfolio Registry + dashboard**

Exit criterion: create/view/edit projects, business units, priorities, status, progress and six-month outcomes in one coherent dashboard.


## V0.2 OS Core — standalone reusable operations (feature branch)

**This is separate from Gauzy.** A new independent OS kernel lives in oskit/ and is intended to be reconfigured for different companies using brand profiles rather than copying Gauzy software. The original Portfolio, Roadmap, Weekly Focus and Infrastructure views are preserved.

The V0.2 prototype adds workspace-scoped CRM contacts, sales opportunities, projects, tasks, invoices and expenses; deal-to-project conversion; a small activity history; and OS Core JSON backups. It includes Omnidite branding and a TTT-OS profile example but does NOT modify the existing TTT-OS repo.

### Run and test
Run START-OMNIDITE-OS.bat on Windows, or run node server.mjs, then visit http://localhost:8788. The new sidebar modules appear alongside the original views. Run the domain tests using:

    node --test oskit/tests/*.test.mjs

See oskit/ARCHITECTURE.md for technical scope and limits. The existing legacy portfolio uses its own independent localStorage data. You can explicitly copy legacy projects into the new core from OS Settings, but the two project lists do not automatically synchronize.

### Important
This is a **local-only proof of concept** with browser localStorage. It has no authentication, secure server-side permissions or cross-device database. Do not expose it to the public internet or store sensitive client/employee/payment data. Server-backed auth, organization isolation and backup hardening are required before production deployment.
