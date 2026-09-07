const STORAGE_KEY = 'omnidite-os-v01';
const seed = window.OMNIDITE_SEED;
let state = loadState();
let focusMode = true;

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(seed);
    const parsed = JSON.parse(raw);
    return parsed?.projects && parsed?.milestones ? parsed : clone(seed);
  } catch { return clone(seed); }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function fmtDate(value){ return new Date(value + 'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
function today(){ const d = new Date(); d.setHours(12,0,0,0); return d; }
function byFinish(a,b){ return a.finish.localeCompare(b.finish); }
function projectByName(name){ return state.projects.find(p=>p.name===name); }
function focusAllowed(priority){ return !focusMode || ['P0','P1'].includes(priority); }
function visibleProjects(){ return state.projects.filter(p=>focusAllowed(p.priority)); }
function visibleMilestones(){ return state.milestones.filter(m=>focusAllowed(m.priority)); }

function navigate(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
  document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  const titles={overview:'Overview',portfolio:'Portfolio Registry',roadmap:'Roadmap',weekly:'Weekly Focus',infrastructure:'Infrastructure'};
  document.getElementById('title').textContent=titles[view]||'Omnidite OS';
}
document.querySelector('nav').addEventListener('click',e=>{ const b=e.target.closest('[data-view]'); if(b) navigate(b.dataset.view); });

document.getElementById('focus').addEventListener('click',()=>{
  focusMode=!focusMode;
  document.getElementById('focus').textContent=focusMode?'Focus: P0/P1':'Focus: All';
  renderAll();
});

document.getElementById('export').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`omnidite-os-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change',async e=>{
  const file=e.target.files?.[0];
  if(!file) return;
  try{
    const incoming=JSON.parse(await file.text());
    if(!incoming.projects || !incoming.milestones) throw new Error('missing portfolio data');
    state=incoming; save(); renderAll();
  }catch(err){ alert('That file is not a valid Omnidite OS export.'); }
  e.target.value='';
});

const dialog=document.getElementById('project-dialog');
document.getElementById('add-project').addEventListener('click',()=>dialog.showModal());
document.getElementById('save-project').addEventListener('click',e=>{
  const form=document.getElementById('project-form');
  if(!form.reportValidity()){ e.preventDefault(); return; }
  const fd=new FormData(form);
  const next=Math.max(0,...state.projects.map(p=>Number(String(p.id).replace(/\D/g,''))||0))+1;
  state.projects.push({
    id:`P-${String(next).padStart(3,'0')}`,
    name:String(fd.get('name')).trim(), parent:String(fd.get('parent')).trim(),
    lane:String(fd.get('lane')), priority:String(fd.get('priority')), status:'Scheduled', progress:0,
    outcome:String(fd.get('outcome')).trim()
  });
  save();
  setTimeout(()=>{ form.reset(); renderAll(); },0);
});

function renderOverview(){
  const projects=visibleProjects();
  const milestones=visibleMilestones();
  const complete=milestones.length?Math.round(milestones.reduce((sum,m)=>sum+(Number(m.progress)||0),0)/milestones.length):0;
  const overdue=milestones.filter(m=>m.status!=='Done' && new Date(m.finish+'T23:59:59')<today()).length;
  const cards=[
    ['Projects',projects.length],['P0',projects.filter(p=>p.priority==='P0').length],['Milestones',milestones.length],
    ['Completion',complete+'%'],['Active',projects.filter(p=>p.status==='Active').length],['Overdue',overdue]
  ];
  document.getElementById('kpis').innerHTML=cards.map(([label,value])=>`<div class="kpi"><div class="label">${label}</div><div class="value">${value}</div></div>`).join('');

  const upcoming=milestones.filter(m=>new Date(m.finish+'T23:59:59')>=today() && m.status!=='Done').sort(byFinish);
  const next=upcoming[0];
  document.getElementById('next-gate').innerHTML=next
    ? `<strong>Next hard gate · ${fmtDate(next.finish)}</strong>${next.id} · ${next.project} — ${next.name}`
    : '<strong>No open future gates.</strong>';
  document.getElementById('upcoming').innerHTML=upcoming.slice(0,8).map(m=>`<div class="list-item"><div class="date">${fmtDate(m.finish)}</div><div><div class="list-title">${m.id} · ${m.name}</div><div class="list-sub">${m.project} · ${m.exit}</div></div><span class="priority ${m.priority}">${m.priority}</span></div>`).join('');

  const lanes={}; projects.forEach(p=>lanes[p.lane]=(lanes[p.lane]||0)+1);
  const max=Math.max(1,...Object.values(lanes));
  document.getElementById('lanes').innerHTML=Object.entries(lanes).sort((a,b)=>b[1]-a[1]).map(([lane,count])=>`<div class="lane-row"><span>${lane}</span><div class="lane-track"><div class="lane-fill" style="width:${count/max*100}%"></div></div><strong>${count}</strong></div>`).join('');
}

function initFilters(){
  const lane=document.getElementById('lane');
  const value=lane.value;
  lane.innerHTML='<option value="">All lanes</option>'+[...new Set(state.projects.map(p=>p.lane))].sort().map(x=>`<option>${x}</option>`).join('');
  lane.value=value;
}
function renderPortfolio(){
  initFilters();
  const q=document.getElementById('search').value.toLowerCase().trim();
  const lane=document.getElementById('lane').value;
  const status=document.getElementById('status').value;
  const rows=visibleProjects().filter(p=>(!q || `${p.name} ${p.parent} ${p.outcome}`.toLowerCase().includes(q)) && (!lane||p.lane===lane) && (!status||p.status===status));
  document.getElementById('projects').innerHTML=rows.map(p=>`<tr>
    <td><div class="project-name">${p.name}</div><div class="muted">${p.id}</div></td><td>${p.parent}</td><td>${p.lane}</td>
    <td><span class="priority ${p.priority}">${p.priority}</span></td>
    <td><select class="select-cell" data-status="${p.id}">${['Active','Scheduled','Incubation','On Hold','Completed','Archived'].map(x=>`<option ${x===p.status?'selected':''}>${x}</option>`).join('')}</select></td>
    <td>${p.outcome}</td>
    <td><input type="range" min="0" max="100" value="${p.progress||0}" data-progress="${p.id}" /><div class="progress"><span style="width:${p.progress||0}%"></span></div><small>${p.progress||0}%</small></td>
  </tr>`).join('');
}
['search','lane','status'].forEach(id=>document.getElementById(id).addEventListener('input',renderPortfolio));
document.getElementById('projects').addEventListener('change',e=>{
  const p=e.target.dataset.status && state.projects.find(x=>x.id===e.target.dataset.status);
  if(p){ p.status=e.target.value; save(); renderAll(); }
});
document.getElementById('projects').addEventListener('input',e=>{
  const p=e.target.dataset.progress && state.projects.find(x=>x.id===e.target.dataset.progress);
  if(p){ p.progress=Number(e.target.value); save(); renderPortfolio(); renderOverview(); }
});

function renderGantt(){
  const start=new Date(seed.program.start+'T12:00:00');
  const end=new Date(seed.program.end+'T12:00:00');
  const weeks=[];
  for(let d=new Date(start);d<=end;d.setDate(d.getDate()+7)) weeks.push(new Date(d));
  const head=`<div class="gantt-head"><div class="g-project">Milestone</div>${weeks.map(w=>`<div>${w.toLocaleDateString(undefined,{month:'short',day:'numeric'})}</div>`).join('')}</div>`;
  const now=today();
  const rows=visibleMilestones().sort((a,b)=>a.start.localeCompare(b.start)).map(m=>{
    const s=new Date(m.start+'T12:00:00'), f=new Date(m.finish+'T12:00:00');
    const cells=weeks.map(w=>{
      const we=new Date(w); we.setDate(we.getDate()+6);
      const bar=w<=f && we>=s;
      const current=w<=now && we>=now;
      return `<div class="g-week ${bar?'bar':''} ${current?'current':''}" title="${m.exit.replace(/"/g,'&quot;')}"></div>`;
    }).join('');
    return `<div class="gantt-row"><div class="g-project"><strong>${m.id} · ${m.project} · ${m.name}</strong><span>${fmtDate(m.start)}–${fmtDate(m.finish)} · ${m.priority} · ${m.progress}%</span></div>${cells}</div>`;
  }).join('');
  document.getElementById('gantt').innerHTML=`<div class="gantt-grid">${head}${rows}</div>`;
}

function renderWeekly(){
  document.getElementById('week-list').innerHTML=state.weekly.map(w=>`<div class="weekly-item"><div class="week-no">Week ${w.week}</div><div><strong>${fmtDate(w.date)}</strong></div><div><strong>${w.primary}</strong></div><div class="muted">${w.secondary}</div><select class="select-cell" data-week="${w.week}"><option value="">Pending</option><option ${w.result==='Yes'?'selected':''}>Yes</option><option ${w.result==='Partial'?'selected':''}>Partial</option><option ${w.result==='No'?'selected':''}>No</option></select></div>`).join('');
}
document.getElementById('week-list').addEventListener('change',e=>{
  const w=e.target.dataset.week && state.weekly.find(x=>String(x.week)===String(e.target.dataset.week));
  if(w){ w.result=e.target.value; save(); }
});

function renderInfrastructure(){
  document.getElementById('infra').innerHTML=state.infrastructure.map(i=>`<tr><td class="project-name">${i.project}</td><td>${i.repo}</td><td>${i.hosting}</td><td>${i.database}</td><td>${i.domain}</td><td><span class="status-chip ${i.state}">${i.state}</span></td></tr>`).join('');
}

function renderAll(){ renderOverview(); renderPortfolio(); renderGantt(); renderWeekly(); renderInfrastructure(); }
renderAll();
