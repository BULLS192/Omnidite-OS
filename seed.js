window.OMNIDITE_SEED = {
  version: '0.1.0',
  program: { start: '2026-09-07', end: '2027-03-07' },
  projects: [
    ['P-001','Omnidite OS','Omnidite','Core','P0','Active',20,'Beta operating system used as the daily control tower for the entire portfolio'],
    ['P-002','Kevinbullsyap','Personal Brand','Core','P0','Active',0,'Live portfolio/resume with projects, career, and venture links'],
    ['P-003','Omnidite Advisory','Omnidite','Core','P0','Active',0,'Operational consultancy with website, offers, CRM, templates, and 2027 pipeline plan'],
    ['P-004','Aedificatus Atlas','Aedificatus','Industrial','P0','Active',0,'Stable online AM intelligence beta with commercial pilot'],
    ['P-005','NEXUS','Camarillo Darts','Darts','P0','Active',0,'Tournament/league platform beta tested in live darts operations'],
    ['P-006','Thompson Transportation Technologies','Omnidite Advisory','Commercial','P0','Active',0,'Brand, website, CRM/intake, marketing launch, and TTT OS Phase 1'],
    ['P-007','PROVIDENCE','Omnidite Labs','R&D','P1','Active',0,'Performance-stable private intelligence beta with robust feeds and workflows'],
    ['P-008','Texas Double Top','Omnidite Advisory','Commercial','P1','Active',0,'Push/SMS, league analytics, website improvements, and product R&D definitions'],
    ['P-009','Space City Darts','Camarillo Darts','Darts','P1','Scheduled',0,'Upgraded website and NEXUS-powered webapp pilot'],
    ['P-010','Culinary Canvas Texas','Omnidite Advisory','Commercial','P1','Scheduled',0,'Prioritized growth backlog, operating dashboard/process package, and Q1 plan'],
    ['P-011',"JJ's Bar Consultancy",'Omnidite Advisory','Commercial','P2','Scheduled',0,'Tournament/league operating pilot plus measurable traffic/sales experiment'],
    ['P-012','AIXIA','Omnidite Ventures','Commerce','P2','Scheduled',0,'One functioning automated commerce pilot with defined fulfillment path'],
    ['P-013','Car Toon','AIXIA','Commerce','P2','Scheduled',0,'Automated generation-to-order prototype and first sales test'],
    ['P-014','T33mpire','AIXIA','Commerce','P3','Incubation',0,'Pass/fail concept gate and prototype only if validated'],
    ['P-015','bull.s.tudio','Personal Brand','Personal','P2','Scheduled',0,'Live photography/creative portfolio and social launch'],
    ['P-016','OMNIA','Omnidite Labs','R&D','P2','Incubation',0,'Preserved baseline plus resumed catalog/metadata experience after PROVIDENCE gate'],
    ['P-017','Investment Buddy','Omnidite Labs','R&D','P3','Incubation',0,'Requirements and lightweight prototype only'],
    ['P-018','Dart League','Camarillo Darts','Darts','P2','Scheduled',0,'League requirements and pilot configuration inside NEXUS'],
    ['P-019','Darts Buddy','Camarillo Darts','Darts','P3','Incubation',0,'Scope and clickable prototype; build decision after NEXUS beta']
  ].map(x => ({id:x[0],name:x[1],parent:x[2],lane:x[3],priority:x[4],status:x[5],progress:x[6],outcome:x[7]})),

  milestones: [
    ['OS-001','Omnidite OS','Foundation architecture + portfolio data model','2026-09-08','2026-09-13','P0','In Progress',20,'Canonical hierarchy, entity types, status model, milestone rules, and seed portfolio are documented and working.'],
    ['OS-002','Omnidite OS','V0.1 Portfolio Registry + dashboard','2026-09-14','2026-09-27','P0','Not Started',0,'Create/view/edit projects, business units, priorities, status, progress, and six-month outcomes in one coherent dashboard.'],
    ['OS-003','Omnidite OS','Roadmap, milestone, task + Gantt engine','2026-09-28','2026-10-11','P0','Not Started',0,'Milestones/tasks have dates, owners, dependencies, progress, and a usable Gantt.'],
    ['OS-004','Omnidite OS','Infrastructure + document registry','2026-10-12','2026-10-25','P0','Not Started',0,'Domains, repositories, deployments, databases, and documents link to projects without secrets.'],
    ['OS-005','Omnidite OS','CRM core','2026-10-26','2026-11-15','P0','Not Started',0,'Companies, contacts, opportunities, client engagements, and follow-up states work inside the OS.'],
    ['OS-006','Omnidite OS','Cloud persistence, auth + backup','2026-11-16','2026-12-13','P0','Not Started',0,'Portfolio data persists across devices with authenticated access and backup/export.'],
    ['OS-007','Omnidite OS','Finance + portfolio reporting','2026-12-14','2027-01-17','P1','Not Started',0,'Basic revenue/expense/project economics and portfolio health reporting work.'],
    ['OS-008','Omnidite OS','Integrations + automation layer','2027-01-18','2027-02-07','P1','Not Started',0,'GitHub plus one operating data source can update portfolio state automatically.'],
    ['OS-009','Omnidite OS','Beta hardening + daily-use conversion','2027-02-08','2027-02-28','P0','Not Started',0,'Used as the default portfolio tracker for 14 consecutive days and major blockers are resolved.'],
    ['OS-010','Omnidite OS','Six-month portfolio review','2027-03-01','2027-03-07','P0','Not Started',0,'Every project is assigned Scale / Maintain / Incubate / Archive and the next roadmap is approved.'],

    ['OA-001','Omnidite Advisory','Corporate housekeeping audit','2026-09-08','2026-09-20','P0','Not Started',0,'LLC/admin/domain/email/file gaps are inventoried with owner and resolution path.'],
    ['OA-002','Omnidite Advisory','Service architecture + offers','2026-09-21','2026-10-04','P0','Not Started',0,'Core services, target clients, engagement models, and starter pricing logic are documented.'],
    ['OA-003','Omnidite Advisory','Website MVP','2026-10-05','2026-10-25','P0','Not Started',0,'Credible consulting website with services, portfolio, about, and contact is live-ready.'],
    ['OA-004','Omnidite Advisory','CRM operating baseline','2026-10-26','2026-11-15','P0','Not Started',0,'Active clients, prospects, contacts, opportunities, and follow-ups are represented in Omnidite OS.'],

    ['KBY-001','Kevinbullsyap','Information architecture + identity system','2026-09-14','2026-09-27','P0','Not Started',0,'Approved sitemap, visual direction, content inventory, and project taxonomy.'],
    ['KBY-002','Kevinbullsyap','Portfolio website MVP','2026-09-28','2026-10-18','P0','Not Started',0,'Responsive About/Experience/Projects/Contact experience works end to end.'],
    ['KBY-003','Kevinbullsyap','Public launch','2026-10-19','2026-11-15','P0','Not Started',0,'Production domain works, at least six project case studies are published, and portfolio is share-ready.'],

    ['ATL-001','Aedificatus Atlas','OEM + materials baseline expansion','2026-09-08','2026-09-30','P0','Not Started',0,'Planned metal/non-metal OEM and material batches are normalized with sources/spec references.'],
    ['ATL-002','Aedificatus Atlas','Stable online access','2026-10-01','2026-10-25','P0','Not Started',0,'Atlas can be accessed remotely with stable deployment and documented rollback/recovery.'],
    ['ATL-003','Aedificatus Atlas','Contact + CRM intelligence','2026-10-26','2026-11-22','P0','Not Started',0,'Company/facility/contact intelligence flows into a usable prospecting view with provenance.'],
    ['ATL-004','Aedificatus Atlas','Commercial pilot','2027-01-04','2027-01-31','P0','Not Started',0,'At least one real sales/research workflow runs end to end and measurable value is documented.'],
    ['ATL-005','Aedificatus Atlas','V8 beta gate','2027-02-01','2027-02-28','P0','Not Started',0,'Regression passes, core datasets are navigable, and beta limitations are documented.'],

    ['NEX-001','NEXUS','Tournament engine audit','2026-09-08','2026-09-20','P0','Not Started',0,'Existing tournament/bracket code is inventoried and canonical rules/data model are approved.'],
    ['NEX-002','NEXUS','Multi-format tournament engine','2026-09-21','2026-10-18','P0','Not Started',0,'Single/double/triple elimination, round robin, Swiss, and selected multi-player formats pass test scenarios.'],
    ['NEX-003','NEXUS','Player, rating + league core','2026-10-19','2026-11-15','P0','Not Started',0,'Player identity, teams, ratings, seasons, standings, and league records work coherently.'],
    ['NEX-004','NEXUS','Live pilot','2027-01-04','2027-01-31','P0','Not Started',0,'NEXUS runs at least one real event or league workflow.'],
    ['NEX-005','NEXUS','Beta gate','2027-02-01','2027-02-28','P0','Not Started',0,'Critical pilot issues are resolved and operator runbook/backup are complete.'],

    ['TTT-001','Thompson Transportation Technologies','Business + brand foundation','2026-09-08','2026-09-20','P0','Not Started',0,'Service scope, target customer segments, brand board, offer architecture, and launch backlog are approved.'],
    ['TTT-002','Thompson Transportation Technologies','Website architecture','2026-09-21','2026-10-04','P0','Not Started',0,'Sitemap, conversion paths, service pages, intake requirements, and content inventory are approved.'],
    ['TTT-003','Thompson Transportation Technologies','Website MVP','2026-10-05','2026-10-25','P0','Not Started',0,'Responsive site is deployable with core services and quote/intake path.'],
    ['TTT-004','Thompson Transportation Technologies','CRM + client intake','2026-10-26','2026-11-15','P0','Not Started',0,'Lead intake, customer/vehicle record, job status, and follow-up workflow function end to end.'],
    ['TTT-005','Thompson Transportation Technologies','TTT OS Phase 1','2027-01-04','2027-01-31','P1','Not Started',0,'CRM, intake, work order, and basic customer/job dashboard are usable in one flow.'],

    ['PRO-001','PROVIDENCE','Performance baseline + dual-unit completion','2026-09-08','2026-09-20','P1','Not Started',0,'Observed lag is eliminated at agreed layer load and imperial/metric dual display is verified.'],
    ['PRO-002','PROVIDENCE','Live-feed resilience','2026-09-21','2026-10-11','P1','Not Started',0,'Core public feeds degrade gracefully, recover cleanly, and expose source/last-update state.'],
    ['PRO-003','PROVIDENCE','V1 beta gate','2027-01-04','2027-01-24','P1','Not Started',0,'Performance, core feeds, workflows, and known limitations pass a written release checklist.'],

    ['TDT-001','Texas Double Top','Requirements + current-state architecture','2026-09-14','2026-09-27','P1','Not Started',0,'Website/app/data sources, notification needs, and league workflows are documented as one target architecture.'],
    ['TDT-002','Texas Double Top','Push/SMS real-time updates','2026-09-28','2026-10-18','P1','Not Started',0,'League activity can trigger reliable opt-in push/SMS events with operator controls.'],
    ['TDT-003','Texas Double Top','League analytics + website release','2026-10-19','2026-11-29','P1','Not Started',0,'Core league analytics are visible and priority website improvements are launched.'],

    ['SCD-001','Space City Darts','Website upgrade','2026-10-12','2026-11-01','P1','Not Started',0,'Priority website improvements are live and mobile-ready.'],
    ['SCD-002','Space City Darts','NEXUS-powered webapp pilot','2026-11-02','2027-01-17','P1','Not Started',0,'Core public/member views run on NEXUS data and are tested during normal activity.'],

    ['CCT-001','Culinary Canvas Texas','Scope + backlog reset','2026-09-21','2026-10-04','P1','Not Started',0,'Current state is reviewed and the next 90-day commercial priorities are approved.'],
    ['CCT-002','Culinary Canvas Texas','Operating package + Q1 plan','2026-10-05','2027-01-17','P2','Not Started',0,'Highest-value improvements, simple operating dashboard/process, and Q1 plan are delivered.'],

    ['JJS-001',"JJ's Bar Consultancy",'Baseline + event operating pilot','2026-10-05','2026-11-08','P2','Not Started',0,'Tournament cadence, league opportunities, and repeatable bracket/event process are documented and usable.'],
    ['JJS-002',"JJ's Bar Consultancy",'Traffic + sales experiment','2027-01-04','2027-01-31','P2','Not Started',0,'One measured promotion/event experiment runs with baseline, result, and recommendation.'],

    ['AIX-001','AIXIA','Venture thesis + product rules','2026-12-01','2026-12-13','P2','Not Started',0,'Target buyer, product rules, automation boundaries, margin threshold, and one pilot product are approved.'],
    ['AIX-002','AIXIA','MVP storefront + pilot','2026-12-14','2027-02-28','P2','Not Started',0,'One product can be purchased and fulfilled end to end with conversion/margin/fulfillment tracked.'],
    ['CAR-001','Car Toon','Generation-to-order sales validation','2027-01-04','2027-02-28','P2','Not Started',0,'A test customer can move from image upload to approved art/order output and a sales test produces a decision.'],
    ['BST-001','bull.s.tudio','Portfolio + social launch','2027-01-04','2027-02-28','P2','Not Started',0,'Curated creative portfolio is live-ready and initial social content is published.'],
    ['OMN-001','OMNIA','Baseline checkpoint + resume gate','2026-09-08','2027-02-28','P2','Not Started',0,'Current baseline is safely documented now; next release resumes only after PROVIDENCE beta gate.'],
    ['INC-001','Incubation portfolio','T33mpire / Investment Buddy / Darts Buddy gates','2027-02-01','2027-02-28','P3','Not Started',0,'Each concept receives a written build, merge, defer, or archive decision before substantive work.']
  ].map(x => ({id:x[0],project:x[1],name:x[2],start:x[3],finish:x[4],priority:x[5],status:x[6],progress:x[7],exit:x[8]})),

  weekly: [
    ['2026-09-13','Freeze Omnidite OS hierarchy/data model','Advisory admin audit; TTT/PROVIDENCE/NEXUS baseline work'],
    ['2026-09-20','Close OS foundation + four baseline gates','TTT foundation; PROVIDENCE performance; NEXUS audit; Advisory housekeeping'],
    ['2026-09-27','Ship Omnidite OS V0.1 registry/dashboard','Kevin site architecture; TDT architecture; Atlas OEM/material push'],
    ['2026-10-04','Lock OS roadmap/task engine scope','Omnidite offers; TTT website architecture; CCT scope reset'],
    ['2026-10-11','Ship OS roadmap/Gantt engine','PROVIDENCE feed resilience; NEXUS tournament formats'],
    ['2026-10-18','Kevin website MVP + NEXUS format gate','TDT push/SMS'],
    ['2026-10-25','Ship OS infrastructure registry','TTT + Omnidite websites; Atlas online access'],
    ['2026-11-01','Start OS CRM + finish Space City website','Atlas contact intelligence'],
    ['2026-11-08','Portfolio case studies + TDT analytics','PROVIDENCE operator UX; JJ event workflow'],
    ['2026-11-15','Ship OS CRM core + Kevin public launch','NEXUS league core; TTT CRM/intake'],
    ['2026-11-22','Atlas contact/CRM intelligence gate','OS cloud/auth build'],
    ['2026-11-29','TDT website/analytics release','NEXUS streaming/analytics; Space City webapp'],
    ['2026-12-06','TTT marketing + PROVIDENCE deployment path','Advisory templates; AIXIA thesis'],
    ['2026-12-13','Ship OS cloud/auth','AIXIA architecture begins'],
    ['2026-12-20','Atlas intelligence library + year-end gates','Space City webapp MVP'],
    ['2026-12-27','Holiday consolidation / bug debt only','No new projects; stabilize OS, Atlas, NEXUS'],
    ['2027-01-03','Lock Q1 execution plan','AIXIA architecture complete'],
    ['2027-01-10','Run first Atlas/NEXUS pilots','TTT OS; Car Toon; bull.s.tudio'],
    ['2027-01-17','Ship OS finance/reporting','Space City pilot; CCT Q1 plan'],
    ['2027-01-24','PROVIDENCE V1 beta','AIXIA storefront gate; Dart League requirements'],
    ['2027-01-31','Atlas/NEXUS pilots + TTT OS Phase 1','Advisory pipeline; client R&D gates'],
    ['2027-02-07','Ship OS integrations layer','Car Toon prototype; bull.s.tudio website; OMNIA resume scope'],
    ['2027-02-14','Begin 14-day Omnidite OS daily-use streak','Incubation scope gates only'],
    ['2027-02-21','Resolve beta blockers across OS/Atlas/NEXUS','AIXIA sales pilot; validated incubation only'],
    ['2027-02-28','OS/Atlas/NEXUS beta gates','AIXIA/Car Toon/bull.s.tudio decisions'],
    ['2027-03-07','Six-month portfolio review','Scale / Maintain / Incubate / Archive + next roadmap']
  ].map((x,i)=>({week:i+1,date:x[0],primary:x[1],secondary:x[2],result:''})),

  infrastructure: [
    ['Omnidite OS','BULLS192/Omnidite-OS','Local V0.1','localStorage','omnidite.com / future subdomain','Build'],
    ['Aedificatus Atlas','BULLS192/Aedificatus-Atlas','Current remote path','Supabase','aedificatus.com','Active'],
    ['NEXUS','BULLS192/CamarilloDartsNexus','Render / current','Supabase','TBD','Active'],
    ['Texas Double Top','BULLS192/TexasDoubleTopApp','TBD','Shared / TBD','texasdoubletop.com','Active'],
    ['PROVIDENCE','BULLS192/PROVIDENCE','Local / private path planned','Local / public feeds','TBD','Active'],
    ['OMNIA','BULLS192/OMNIA','Local','Local catalogue','TBD','Incubation']
  ].map(x=>({project:x[0],repo:x[1],hosting:x[2],database:x[3],domain:x[4],state:x[5]}))
};
