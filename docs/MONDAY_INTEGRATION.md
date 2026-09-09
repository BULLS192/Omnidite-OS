# Omnidite OS ↔ Monday.com Integration

Omnidite OS is the canonical system of record for the portfolio. Monday.com is the visual operating layer for dashboards, Gantt views, portfolio health, calendar visualization, and weekly execution review.

## Monday workspace
- Workspace: `Omnidite Advisory`
- Workspace ID: `3233890`
- Folder: `Omnidite OS`
- Folder ID: `21316621`

## Master boards
### Omnidite Portfolio Master
- Board ID: `18430366741`
- One item per project/business/product/client engagement.
- Stable synchronization key column: `Omnidite OS Key`.
- Primary visual dimensions: Tier, Priority, Portfolio Status, Progress %, Timeline, Lane, Parent / Business Unit, Relationship, 6-Month Outcome.

### Omnidite Milestone Roadmap
- Board ID: `18430366774`
- One item per hard milestone.
- Stable synchronization key: canonical `Milestone ID` such as `OS-001`, `ATL-003`, `NEX-005`, `OMD-006`.
- Tracks Tier, Priority, Milestone Status, Progress %, Timeline, Exit Criteria, Dependency, Execution and Review Cadence.

## Dashboard
- Name: `Omnidite OS — Portfolio Command Center`
- Dashboard ID: `39391038`
- Connected to both master boards.
- Current widgets:
  - Six-Month Master Gantt
  - Milestone Completion
  - Projects by Priority Tier
  - Milestone Health
  - Milestone Calendar
  - Portfolio by Strategic Lane
  - Total Roadmap Milestones
  - Total Portfolio Projects
  - Average Portfolio Progress

## Ownership contract
1. Omnidite OS owns canonical hierarchy, IDs, tier/priority logic, roadmap dates, milestone dependencies, and exit criteria.
2. Monday.com visualizes and supports operational status/progress review.
3. A milestone is `Done` only after its Exit Criteria is verifiably satisfied.
4. Future automated synchronization must upsert using stable keys; never match only by display name.
5. Controlled two-way sync should initially be limited to operational fields such as Status, Progress %, actual dates and blockers.

## Integration phases
### Phase A — current
ChatGPT-assisted/manual sync between Omnidite OS roadmap data and the Monday master boards.

### Phase B — one-way automated sync
Omnidite OS pushes projects and milestones to Monday through the monday.com API, upserting by stable keys.

### Phase C — controlled two-way sync
Selected Monday operational fields reconcile back to Omnidite OS while canonical fields remain protected.

The automated portion should be implemented as part of the Omnidite OS integrations layer and must preserve the no-duplicate/stable-ID contract above.
