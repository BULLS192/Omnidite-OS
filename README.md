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
