# Omnidite OS — Foundation Architecture

**Project:** OS-001  
**Program:** September 7, 2026 — March 7, 2027

## 1. Purpose
Omnidite OS is the portfolio operating system and system of record for Kevin Yap's owned businesses, products, client engagements, internal platforms, projects, milestones, infrastructure, and recurring execution reviews.

The first design rule is that Omnidite OS must be useful for the real portfolio before it tries to become a generalized Monday.com competitor.

## 2. Canonical hierarchy

```text
Portfolio
  └─ Organization
      └─ Business Unit
          └─ Brand / Client / Product
              └─ Project
                  └─ Milestone
                      └─ Task
```

The hierarchy is flexible rather than mandatory at every level. A project may belong directly to a business unit when no separate brand/product layer is needed.

## 3. Entity types

### Portfolio
Top-level collection of all owned ventures, client engagements, and internal projects.

### Organization
A legal entity, master brand, or major operating group. Initial examples: Omnidite, Personal Brand, Camarillo Darts.

### Business Unit
An operating division within an organization. Initial examples: Omnidite Advisory, Omnidite Labs, Omnidite Ventures, Aedificatus.

### Brand
An owned identity that can contain products or projects. Examples: Kevinbullsyap, bull.s.tudio, AIXIA.

### Client
An external organization or engagement managed through Omnidite Advisory. Examples: Culinary Canvas Texas, Thompson Transportation Technologies, Texas Double Top, JJ's Bar.

### Product
A reusable owned product/platform. Examples: Atlas, NEXUS, PROVIDENCE, OMNIA, Investment Buddy.

### Project
A bounded body of work with a six-month outcome, priority, status, progress, milestones, and owner.

### Milestone
A dated outcome gate. A milestone is complete only when its written exit criterion is satisfied.

### Task
A concrete action that contributes to a milestone. Tasks are introduced as a first-class entity in OS-003.

### Infrastructure Record
Tracks where a project lives: repository, hosting, database, domain, deployment, and documentation links. Secrets are explicitly excluded.

### Contact / Company / Opportunity
CRM entities introduced in OS-005.

## 4. Relationship classes
Omnidite OS distinguishes ownership from client delivery.

- **Owned** — Kevin/Omnidite controls the business, brand, product, or project.
- **Client Engagement** — work performed for an external client through Omnidite Advisory.
- **Operated Community** — community/operating entity managed by Kevin but not necessarily treated as a standalone owned company.
- **Internal Platform** — technology used to run the portfolio itself.
- **Incubation** — concept retained in the portfolio but not entitled to active development capacity.

## 5. Priority model

- **P0 — Critical:** Must-win work. Receives capacity before all lower priorities.
- **P1 — Strategic:** Important active work, but cannot displace unfinished P0 commitments without explicit re-planning.
- **P2 — Scheduled:** Valuable work with a defined window; may be delayed to protect P0/P1 commitments.
- **P3 — Incubation:** Definition/prototype gate only unless explicitly promoted.

## 6. Project status model

- **Active** — currently receiving execution capacity.
- **Scheduled** — approved and dated, but not yet the current execution focus.
- **Incubation** — retained as an option; substantive work is restricted.
- **On Hold** — intentionally paused pending a dependency or decision.
- **Completed** — six-month outcome and required milestone criteria are satisfied.
- **Archived** — intentionally ended or retained only as reference.

## 7. Milestone status model

- **Not Started**
- **In Progress**
- **At Risk**
- **Blocked**
- **Done**
- **Deferred**

`Done` is not a subjective progress label. The exit criterion is the acceptance test.

## 8. Execution lanes
The six-month roadmap uses capacity lanes to prevent unrelated work from competing invisibly.

- Core
- Industrial
- Darts
- Commercial
- R&D
- Commerce
- Personal

## 9. Discipline rules
1. Omnidite OS is Project 001 and the portfolio system of record.
2. P0 work receives capacity before P1/P2/P3 work.
3. Incubation work cannot start early without an explicit roadmap change.
4. Every milestone requires a dated exit criterion.
5. Every Sunday review records what completed, what slipped, why, and the next commitments.
6. Unverified work is not assumed complete.
7. At the end of the six-month cycle, every project receives one portfolio decision: **Scale / Maintain / Incubate / Archive**.

## 10. V0.1 persistence decision
V0.1 intentionally uses browser `localStorage` plus JSON export/import. This avoids prematurely consuming cloud/database capacity before the information architecture stabilizes.

Cloud persistence, authentication, and backup are explicitly scheduled for OS-006.

## 11. Foundation exit criterion
OS-001 is ready to close when all of the following are verified:

- [x] Canonical hierarchy is documented.
- [x] Core entity types are documented.
- [x] Priority and status models are documented.
- [x] Milestone completion rule is documented.
- [x] Seed portfolio is present in the application.
- [x] Six-month program dates are encoded.
- [ ] V0.1 application is run from the repository and the foundation views load without blocking errors.

The final unchecked item prevents architecture documentation alone from being treated as completion.
