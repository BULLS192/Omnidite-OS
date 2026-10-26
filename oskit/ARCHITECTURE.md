# OS Core — independent white-label operating system

Independent original code. No Ever Gauzy source, runtime, API, trademark, or assets are included. Gauzy's feature categories serve only as inspiration.

Architecture: oskit/core.mjs defines six reusable entity models (contacts, opportunities, projects, tasks, invoices, expenses), workspace scoped CRUD, audit trail, workflow conversion, exact cents, and storage adapter. Profiles customize the OS identity, workspaces and modules; they are not a new code fork. Browser UI is separate and can be replaced without rewriting business logic.

Omnidite profile and TTT example use identical core code but different local browser storage namespaces. This is not security isolation; it is only a local prototype. Actual TTT-OS remains untouched.

Prototype limitations: browser localStorage has NO authentication, database-level access isolation, multi-user integrity, encryption at rest, encrypted backups, or sync. Do not expose this internal application publicly or enter sensitive customer/employee/payment data. Production requires server-backed PostgreSQL, authentication, enforced tenant permissions, validated migrations, HTTPS, secure backups and monitoring.

Legacy Omnidite v0.1 portfolio remains available. OS Core can COPY its project registry one time using legacy IDs, but changes are NOT synchronized back to the legacy dashboard. Existing localStorage keys remain intact.

From repository root:
  node --test oskit/tests/*.test.mjs
  node server.mjs

All new source is copyright Omnidite Advisory; no claim of ownership over Gauzy.


## Configuration-defined custom modules
A profile can declare independent collections without patching the core:
- Omnidite example: asset register.
- TTT example: vehicle register.

Each extension supplies an id, group, label, fields and optional listColumns. Currently supported field kinds: text, date, number, select. The browser UI discovers these extensions and displays CRUD tables and input forms. They receive the same workspace-scoped storage, export/import and audit behavior. Complex relational workflows, unique constraints and migrations require a real backend before production.
