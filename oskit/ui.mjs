// Small, dependency-free UI adapter. Legacy portfolio/roadmap is preserved unchanged.
import {STATUSES,money} from './core.mjs';

const MODULES=[
  {id:'crm',view:'os-crm',label:'Clients & Sales',types:['contacts','deals']},
  {id:'delivery',view:'os-delivery',label:'Work & Tasks',types:['projects','tasks']},
  {id:'finance',view:'os-finance',label:'Finance',types:['invoices','expenses']},
  {id:'settings',view:'os-settings',label:'OS Settings',types:[]}
];
const TYPES={
  contacts:{label:'Contacts',fields:[['name','Contact name','text',true],['company','Company','text'],['email','Email','email'],['status','Status','status'],['notes','Notes','textarea']]},
  deals:{label:'Opportunities',fields:[['title','Opportunity','text',true],['contactId','Related contact','ref:contacts'],['amount','Value','money'],['status','Stage','status'],['notes','Notes','textarea']]},
  projects:{label:'Projects',fields:[['name','Project name','text',true],['priority','Priority','priority'],['status','Status','status'],['progress','Progress %','number'],['outcome','Outcome','textarea'],['notes','Notes','textarea']]},
  tasks:{label:'Tasks',fields:[['title','Task','text',true],['projectId','Related project','ref:projects'],['dueDate','Due date','date'],['priority','Priority','priority'],['status','Status','status'],['notes','Notes','textarea']]},
  invoices:{label:'Invoices',fields:[['number','Invoice reference','text',true],['contactId','Client','ref:contacts'],['amount','Amount','money'],['dueDate','Due date','date'],['status','Status','status'],['notes','Notes','textarea']]},
  expenses:{label:'Expenses',fields:[['title','Expense','text',true],['category','Category','text'],['amount','Amount','money'],['status','Status','status'],['notes','Notes','textarea']]}
};
const COLUMN={
  contacts:['name','company','email','status'],
  deals:['title','contactId','amountCents','status'],
  projects:['name','priority','status','progress'],
  tasks:['title','projectId','dueDate','status'],
  invoices:['number','contactId','amountCents','status'],
  expenses:['title','category','amountCents','status']
};
const LABEL={name:'Name',title:'Title',company:'Company',email:'Email',status:'Status',
  contactId:'Client',projectId:'Project',amountCents:'Amount',priority:'Priority',
  progress:'Progress',dueDate:'Due',number:'Reference',category:'Category'};
const escape=(value)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const attr=escape;
const currentFormat=(os,value)=>new Intl.NumberFormat(undefined,{style:'currency',currency:os.profile.currency||'USD'}).format((value||0)/100);
function renderField(os,type,field,record) {
  const [key,label,kind,required]=field;
  const raw=kind==='money'?(record?money(record.amountCents):'0.00'):(record?.[key]??'');
  const options=kind==='status'?STATUSES[type]:
    kind==='priority'?['P0','P1','P2','P3']:null;
  if(options) return '<label>'+escape(label)+'<select name="'+attr(key)+'" class="input">'+options.map(x=>'<option value="'+attr(x)+'"'+(x===(raw||options[0])?' selected':'')+'>'+escape(x)+'</option>').join('')+'</select></label>';
  if(kind.startsWith('ref:')) {
    const target=kind.slice(4);
    return '<label>'+escape(label)+'<select name="'+attr(key)+'" class="input"><option value="">Unlinked</option>'+
      os.list(target).map(row=>'<option value="'+attr(row.id)+'"'+(raw===row.id?' selected':'')+'>'+escape(row.name||row.title||row.number)+'</option>').join('')+'</select></label>';
  }
  if(kind==='textarea')return '<label>'+escape(label)+'<textarea class="input" name="'+attr(key)+'" rows="3">'+escape(raw)+'</textarea></label>';
  const inputType=kind==='money'?'number':kind;
  const min=kind==='money'||key==='progress'?' min="0"':'';
  const max=key==='progress'?' max="100"':'';
  const step=kind==='money'?' step="0.01"':(kind==='number'?' step="1"':'');
  return '<label>'+escape(label)+'<input class="input" name="'+attr(key)+'" type="'+attr(inputType)+'" value="'+attr(raw)+'"'+min+max+step+(required?' required':'')+' /></label>';
}
function createCard(os,type) {
  const config=TYPES[type],rows=os.list(type).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const header=COLUMN[type].map(k=>'<th>'+escape(LABEL[k]||k)+'</th>').join('');
  const cell=(item,k)=>{
    let text=item[k]??'';
    if(k==='amountCents')text=currentFormat(os,text);
    else if(k==='contactId')text=os.find('contacts',text)?.name||'—';
    else if(k==='projectId')text=os.find('projects',text)?.name||'—';
    else if(k==='progress')text=String(text)+'%';
    return '<td>'+escape(text||'—')+'</td>';
  };
  const body=rows.map(item=>
    '<tr>'+COLUMN[type].map(k=>cell(item,k)).join('')+
    '<td class="os-actions"><button data-os-action="edit" data-os-type="'+type+'" data-os-id="'+attr(item.id)+'">Edit</button>'+
    (type==='deals'&&item.status==='Won'?'<button data-os-action="convert" data-os-id="'+attr(item.id)+'">Make project</button>':'')+
    '<button class="os-delete" data-os-action="delete" data-os-type="'+type+'" data-os-id="'+attr(item.id)+'">Delete</button></td></tr>'
  ).join('');
  return '<article class="panel os-entity"><div class="panel-head"><div><div class="eyebrow">OS CORE / '+escape(type.toUpperCase())+
    '</div><h3>'+escape(config.label)+' <span class="os-count">'+rows.length+'</span></h3></div>'+
    '<button class="btn primary" data-os-action="add" data-os-type="'+type+'">+ Add</button></div>'+
    (rows.length?'<div class="table-wrap"><table class="os-table"><thead><tr>'+header+'<th>Actions</th></tr></thead><tbody>'+body+'</tbody></table></div>':
    '<div class="os-empty">No '+escape(config.label.toLowerCase())+' yet. Add your first record to this workspace.</div>')+'</article>';
}
const summaryCards=(os)=>{
  const data=os.summary();
  const items=[
    ['Contacts',data.counts.contacts],
    ['Open opportunities',os.list('deals').filter(x=>!['Won','Lost'].includes(x.status)).length],
    ['Projects',data.counts.projects],
    ['Open tasks',data.counts.tasks-data.completedTasks],
    ['Pipeline',currentFormat(os,data.pipelineCents)],
    ['Unpaid invoices',currentFormat(os,data.outstandingCents)]
  ];
  return '<div class="os-kpis">'+items.map(([title,value])=>'<div class="os-kpi"><small>'+escape(title)+'</small><strong>'+escape(value)+'</strong></div>').join('')+'</div>';
};
const dialog=(os,type,id)=>{
  const data=id?os.find(type,id):null;
  if(id&&!data)throw new Error('Record not found.');
  const element=document.getElementById('oskit-dialog');
  element.innerHTML='<form method="dialog" id="oskit-form" class="modal"><div class="panel-head"><div><div class="eyebrow">OS CORE · '+escape(os.activeWorkspace().name)+'</div><h3>'+escape(id?'Edit ':'Add ')+escape(TYPES[type].label)+'</h3></div>'+
    '<button type="button" class="close" data-os-action="close" aria-label="Close">×</button></div>'+
    '<div class="os-form-grid">'+TYPES[type].fields.map(f=>renderField(os,type,f,data)).join('')+'</div>'+
    '<div class="modal-actions"><button type="button" class="btn" data-os-action="close">Cancel</button>'+
    '<button type="submit" class="btn primary">Save</button></div></form>';
  element.querySelector('form').addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!event.target.reportValidity())return;
    try {
      const payload=Object.fromEntries(new FormData(event.target).entries());
      os.upsert(type,payload,id);
      element.close();render(os);
    } catch(e){window.alert(e.message);}
  });
  element.showModal();
};
let titles={};
function renderSettings(os) {
  const ws=os.workspaces(),active=os.activeWorkspace();
  return '<div class="os-two"><article class="panel os-entity"><div class="eyebrow">WHITE-LABEL CONTROL</div><h3>Workspaces</h3>'+
    '<p class="os-description">Records are separated by workspace in this browser. This is not an access-control system.</p>'+
    '<label class="os-label">Active workspace<select class="input" id="oskit-workspace-select">'+ws.map(w=>'<option value="'+attr(w.id)+'"'+(w.id===active.id?' selected':'')+'>'+escape(w.name)+'</option>').join('')+'</select></label>'+
    '<button class="btn" data-os-action="workspace">+ Workspace</button></article>'+
    '<article class="panel os-entity"><div class="eyebrow">DATA PORTABILITY</div><h3>Backups & imports</h3>'+
    '<p class="os-description">Export the OS Core records as JSON. Legacy portfolio is backed up separately in the existing header.</p>'+
    '<div class="os-button-row"><button class="btn primary" data-os-action="export">Export OS Core JSON</button>'+
    '<button class="btn" data-os-action="import">Import OS Core JSON</button>'+
    '<input id="oskit-import-input" type="file" accept=".json,application/json" hidden></div>'+
    '<hr class="os-rule"><p class="os-description">Optional: copy legacy Omnidite portfolio projects into this new core (does not delete or synchronize the old portfolio).</p>'+
    '<button class="btn" data-os-action="legacy">Copy legacy portfolio projects</button></article></div>'+
    '<article class="panel os-security"><strong>Local prototype only</strong><p>No authentication, secure multi-user backend, or cross-device sync is active. Avoid sensitive business records. A production deployment needs server-side access control and audited backups.</p></article>';
}
function render(os) {
  const place=document.getElementById('oskit-shell');
  if(!place)return;
  const summary=os.summary();
  const select=document.getElementById('oskit-global-workspace');
  if(select)select.innerHTML=os.workspaces().map(w=>'<option value="'+attr(w.id)+'"'+(w.id===summary.workspace.id?' selected':'')+'>'+escape(w.name)+'</option>').join('');
  for(const module of MODULES.filter(m=>os.profile.modules.includes(m.id))) {
    const region=document.getElementById(module.view);
    if(!region)continue;
    region.innerHTML=
      '<div class="os-section-title"><span class="eyebrow">INDEPENDENT OMNIDITE OS CORE · '+escape(summary.workspace.name.toUpperCase())+'</span>'+
      '<h2>'+escape(module.label)+'</h2>'+
      '<p>Standalone records under this brand and workspace. No Gauzy connection.</p></div>'+
      (module.id==='crm'?summaryCards(os):'')+
      (module.types.length?'<div class="os-entity-grid">'+module.types.map(t=>createCard(os,t)).join('')+'</div>':renderSettings(os));
  }
}
function download(text,filename){
  const blob=new Blob([text],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function legacyProjects(){
  let stored;
  try{stored=JSON.parse(localStorage.getItem('omnidite-os-v01')||'null');}catch{stored=null;}
  return Array.isArray(stored?.projects)?stored.projects:(window.OMNIDITE_SEED?.projects||[]);
}
export function mountOS(os) {
  const main=document.querySelector('.shell main');
  const sidebar=document.querySelector('.sidebar nav');
  if(!main||!sidebar)throw new Error('Omnidite legacy shell not found.');
  const wrapper=document.createElement('div');
  wrapper.id='oskit-shell';
  main.append(wrapper);
  for(const module of MODULES.filter(m=>os.profile.modules.includes(m.id))) {
    const nav=document.createElement('button');
    nav.className='nav oskit-nav';nav.dataset.view=module.view;nav.textContent=module.label;
    sidebar.append(nav);
    const section=document.createElement('section');
    section.className='view';section.id=module.view;wrapper.append(section);
    titles[module.view]=module.label;
  }
  const dlg=document.createElement('dialog');dlg.id='oskit-dialog';document.body.append(dlg);
  const globalSelector=document.createElement('label');
  globalSelector.className='os-global-select';
  globalSelector.innerHTML='<span>Workspace</span><select class="input" id="oskit-global-workspace" aria-label="OS Core workspace"></select>';
  document.querySelector('.topbar .actions')?.prepend(globalSelector);
  const mobile=document.createElement('div');mobile.className='os-mobile-tabs';
  mobile.innerHTML='<button type="button" data-mobile-view="overview">Overview</button><button type="button" data-mobile-view="portfolio">Portfolio</button>'+
    MODULES.filter(m=>os.profile.modules.includes(m.id)).map(m=>'<button type="button" data-mobile-view="'+attr(m.view)+'">'+escape(m.label)+'</button>').join('');
  main.insertBefore(mobile,main.querySelector('.topbar')?.nextSibling||main.firstChild);
  const setTitle=(view)=>{ if(titles[view])document.getElementById('title').textContent=titles[view]; };
  sidebar.addEventListener('click',(event)=>{
    const view=event.target.closest('[data-view]')?.dataset.view;
    if(view&&titles[view]) {setTitle(view);render(os);}
  });
  mobile.addEventListener('click',(event)=>{
    const view=event.target.closest('[data-mobile-view]')?.dataset.mobileView;
    if(!view)return;
    if(typeof window.navigate==='function')window.navigate(view);
    else {
      document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===view));
      document.querySelectorAll('.nav').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
    }
    document.getElementById('title').textContent=titles[view]||({overview:'Overview',portfolio:'Portfolio Registry'}[view]||view);
    render(os);
  });
  globalSelector.addEventListener('change',event=>{try{os.selectWorkspace(event.target.value);render(os);}catch(err){alert(err.message);}});
  wrapper.addEventListener('change',event=>{
    if(event.target.id==='oskit-workspace-select'){
      try{os.selectWorkspace(event.target.value);render(os);}catch(e){alert(e.message);}
    }
  });
  wrapper.addEventListener('click',async event=>{
    const button=event.target.closest('[data-os-action]');
    if(!button)return;
    const action=button.dataset.osAction,type=button.dataset.osType,id=button.dataset.osId;
    try{
      if(action==='add'||action==='edit')dialog(os,type,id||null);
      if(action==='close')dlg.close();
      if(action==='delete'&&confirm('Delete this record? This cannot be undone.')){os.remove(type,id);render(os);}
      if(action==='convert'){const p=os.projectFromWonDeal(id);render(os);alert('Project created or already linked: '+p.name);}
      if(action==='workspace') {
        const name=prompt('New workspace name');if(name!==null){os.addWorkspace(name);render(os);}
      }
      if(action==='export')download(os.exportBackup(),os.profile.id+'-oscore-backup-'+new Date().toISOString().slice(0,10)+'.json');
      if(action==='import')document.getElementById('oskit-import-input').click();
      if(action==='legacy') {
        if(confirm('Copy the legacy Omnidite portfolio projects into the selected workspace? Existing portfolio data remains unchanged.')){
          const n=os.importLegacyProjects(legacyProjects());render(os);alert('Copied '+n+' new projects. Legacy portfolio is still independent.');
        }
      }
    }catch(error){alert(error.message);}
  });
  wrapper.addEventListener('change',async event=>{
    if(event.target.id!=='oskit-import-input')return;
    const file=event.target.files?.[0];event.target.value='';
    if(!file)return;
    try{
      const data=await file.text();
      if(confirm('Replace all OS Core records for this profile with this backup?')){
        os.importBackup(data);render(os);alert('OS Core backup restored.');
      }
    }catch(error){alert('Import failed: '+error.message);}
  });
  render(os);
}
