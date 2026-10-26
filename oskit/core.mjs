// OS Core v0.2 — independent original implementation. No Gauzy source dependency.
// Local-only prototype: browser storage is NOT a production user database.
export const VERSION = 1;
export const TYPES = Object.freeze(['contacts','deals','projects','tasks','invoices','expenses']);
export const STATUSES = Object.freeze({
  contacts:['Lead','Active','Inactive'],
  deals:['Lead','Qualified','Proposal','Won','Lost'],
  projects:['Planned','Active','On Hold','Completed'],
  tasks:['Todo','In Progress','Blocked','Done'],
  invoices:['Draft','Sent','Paid','Overdue'],
  expenses:['Recorded','Approved','Reimbursed']
});
const TITLE = {contacts:'name',deals:'title',projects:'name',tasks:'title',invoices:'number',expenses:'title'};
const RELATIONS = {deals:['contactId','contacts'],tasks:['projectId','projects'],invoices:['contactId','contacts']};
const clone = (v) => JSON.parse(JSON.stringify(v));
const clean = (v,max=240) => String(v??'').trim().slice(0,max);
const identifier = (id) => typeof id==='string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id);
const uid = () => globalThis.crypto?.randomUUID?.() || 'id_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
const now = () => new Date().toISOString();

export function cents(value) {
  const s = String(value??'').trim();
  if (!/^(0|[1-9]\d{0,9})(\.\d{1,2})?$/.test(s)) throw new Error('Amount needs at most two decimal places.');
  const parts=s.split('.');
  const n=Number(parts[0])*100+Number((parts[1]||'').padEnd(2,'0'));
  if (!Number.isSafeInteger(n)) throw new Error('Amount is too large.');
  return n;
}
export function money(value) {
  if (!Number.isSafeInteger(value)||value<0) throw new Error('Invalid stored amount.');
  return (value/100).toFixed(2);
}
export function memoryStore() {
  const items=new Map();
  return {getItem:k=>items.has(k)?items.get(k):null,setItem:(k,v)=>items.set(k,String(v)),removeItem:k=>items.delete(k)};
}
/**
 * A profile can declare custom collections without changing OS Core.
 * Each has a unique ID, a name field and a small declarative field schema.
 */
export function extensionsOf(profile) {
  const extensions=profile.extensions||[];
  if(!Array.isArray(extensions))throw new Error('Extensions must be an array.');
  const used=new Set(TYPES);
  for(const ext of extensions) {
    if(!identifier(ext.id)||used.has(ext.id))throw new Error('Invalid or duplicate extension ID.');
    if(!['crm','delivery','finance'].includes(ext.module)||!clean(ext.label))throw new Error('Invalid extension group or label.');
    if(!Array.isArray(ext.fields)||!ext.fields.some(f=>f.key==='name'&&f.kind==='text'))throw new Error('Extension requires a name text field.');
    const keys=new Set();
    for(const f of ext.fields) {
      if(!identifier(f.key)||keys.has(f.key)||['id','workspaceId','createdAt','updatedAt'].includes(f.key))
        throw new Error('Invalid extension field name.');
      if(!['text','date','number','select'].includes(f.kind))throw new Error('Unsupported extension field type.');
      if(f.kind==='select'&&(!Array.isArray(f.options)||!f.options.length||f.options.some(v=>!clean(v))))throw new Error('Select fields need options.');
      keys.add(f.key);
    }
    used.add(ext.id);
  }
  return extensions;
}
export function validateProfile(profile) {
  if (!profile||!identifier(profile.id)||!clean(profile.name)) throw new Error('Invalid profile ID/name.');
  if (!Array.isArray(profile.modules)||profile.modules.some(m=>!['crm','delivery','finance','settings'].includes(m))) throw new Error('Invalid module selection.');
  extensionsOf(profile);
  return true;
}
function fresh(profile) {
  const workspaces=(profile.initialWorkspaces?.length?profile.initialWorkspaces:[{id:'primary',name:profile.name}]).map(w=>({id:clean(w.id,100),name:clean(w.name,100)}));
  if(workspaces.some(w=>!identifier(w.id)||!w.name)) throw new Error('Invalid workspace configuration.');
  return {version:VERSION,profileId:profile.id,workspaces,activeWorkspaceId:workspaces[0].id,records:Object.fromEntries([...TYPES,...extensionsOf(profile).map(x=>x.id)].map(t=>[t,[]])),audit:[]};
}
function validateSnapshot(s,profileId,allTypes) {
  if (!s||s.version!==VERSION||s.profileId!==profileId) throw new Error('Backup has a different OS profile/version.');
  if (!Array.isArray(s.workspaces)||!s.workspaces.length||s.workspaces.some(w=>!identifier(w.id)||!clean(w.name))) throw new Error('Invalid workspaces.');
  if (!s.workspaces.some(w=>w.id===s.activeWorkspaceId)) throw new Error('Invalid active workspace.');
  if (!s.records||allTypes.some(t=>!Array.isArray(s.records[t]))||!Array.isArray(s.audit)) throw new Error('Invalid records.');
  const ids=new Set(s.workspaces.map(w=>w.id));
  for(const t of allTypes) for(const item of s.records[t]) {
    if (!identifier(item.id)||!ids.has(item.workspaceId)||!clean(item[TITLE[t]||'name'])) throw new Error('Malformed '+t+' record.');
    if ('amountCents' in item && (!Number.isSafeInteger(item.amountCents)||item.amountCents<0)) throw new Error('Malformed money field.');
  }
}
export function createOS(profile,store=globalThis.localStorage) {
  validateProfile(profile);
  const extensions=extensionsOf(profile);
  const allTypes=[...TYPES,...extensions.map(x=>x.id)];
  if (!store?.getItem||!store?.setItem) throw new Error('A storage adapter is required.');
  const key='oscore:'+profile.id+':v1';
  const original=store.getItem(key);
  let state=original?JSON.parse(original):fresh(profile);
  validateSnapshot(state,profile.id,allTypes);
  const persist=()=>store.setItem(key,JSON.stringify(state));
  const audit=(event,type,id)=>{
    state.audit.unshift({id:uid(),event,type,entityId:id,workspaceId:state.activeWorkspaceId,at:now()});
    state.audit=state.audit.slice(0,200);
  };
  const list=(type,opts={})=>{
    if(!allTypes.includes(type))throw new Error('Unknown entity type.');
    return clone(state.records[type].filter(x=>opts.allWorkspaces||x.workspaceId===state.activeWorkspaceId));
  };
  const find=(type,id)=>list(type).find(x=>x.id===id)||null;
  const normalize=(type,raw,prev)=>{
    const extension=extensions.find(x=>x.id===type);
    if(extension) {
      const item={...prev};
      for(const field of extension.fields) {
        const value=raw[field.key]??prev?.[field.key]??'';
        if(field.kind==='number') {
          item[field.key]=Number(value||0);
          if(!Number.isFinite(item[field.key]))throw new Error('Invalid number for '+field.label);
        } else {
          item[field.key]=clean(value,field.kind==='text'?2000:180);
          if(field.kind==='date'&&item[field.key]&&!/^\d{4}-\d{2}-\d{2}$/.test(item[field.key]))
            throw new Error('Invalid date for '+field.label);
          if(field.kind==='select'&&!field.options.includes(item[field.key]))
            item[field.key]=field.options[0];
        }
        if(field.required&&!String(item[field.key]).trim())throw new Error(field.label+' is required.');
      }
      return item;
    }
    const title=clean(raw[TITLE[type]],180);
    if(!title)throw new Error('Name or title is required.');
    const item={...prev,[TITLE[type]]:title,status:clean(raw.status||prev?.status||STATUSES[type][0],30),notes:clean(raw.notes??prev?.notes,4000)};
    if(!STATUSES[type].includes(item.status))throw new Error('Invalid status.');
    if(type==='contacts') {
      item.company=clean(raw.company??prev?.company,180);
      item.email=clean(raw.email??prev?.email,180);
      if(item.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email))throw new Error('Invalid email address.');
    }
    if(type==='deals') {
      item.contactId=clean(raw.contactId??prev?.contactId,100);
      item.amountCents=cents(raw.amount??(prev?money(prev.amountCents):'0'));
    }
    if(type==='projects') {
      item.priority=clean(raw.priority||prev?.priority||'P2',3);
      if(!['P0','P1','P2','P3'].includes(item.priority))throw new Error('Invalid priority.');
      item.progress=Number(raw.progress??prev?.progress??0);
      if(!Number.isInteger(item.progress)||item.progress<0||item.progress>100)throw new Error('Progress must be 0–100.');
      item.outcome=clean(raw.outcome??prev?.outcome,2000);
      item.legacyId=clean(raw.legacyId??prev?.legacyId,100);
      item.dealId=clean(raw.dealId??prev?.dealId,100);
    }
    if(type==='tasks') {
      item.projectId=clean(raw.projectId??prev?.projectId,100);
      item.priority=clean(raw.priority||prev?.priority||'P2',3);
      if(!['P0','P1','P2','P3'].includes(item.priority))throw new Error('Invalid priority.');
      item.dueDate=clean(raw.dueDate??prev?.dueDate,10);
      if(item.dueDate&&!/^\d{4}-\d{2}-\d{2}$/.test(item.dueDate))throw new Error('Invalid date.');
    }
    if(type==='invoices') {
      item.contactId=clean(raw.contactId??prev?.contactId,100);
      item.dueDate=clean(raw.dueDate??prev?.dueDate,10);
      item.amountCents=cents(raw.amount??(prev?money(prev.amountCents):'0'));
    }
    if(type==='expenses') {
      item.category=clean(raw.category??prev?.category,120);
      item.amountCents=cents(raw.amount??(prev?money(prev.amountCents):'0'));
    }
    const relation=RELATIONS[type];
    if(relation&&item[relation[0]]&&!find(relation[1],item[relation[0]]))throw new Error('Linked record must exist in this workspace.');
    return item;
  };
  const upsert=(type,raw,id=null)=>{
    if(!allTypes.includes(type))throw new Error('Unknown entity type.');
    const prev=id?find(type,id):null;
    if(id&&!prev)throw new Error('Record not found in selected workspace.');
    const body=normalize(type,raw,prev);
    const row={...body,id:prev?.id||uid(),workspaceId:state.activeWorkspaceId,createdAt:prev?.createdAt||now(),updatedAt:now()};
    if(prev)state.records[type]=state.records[type].map(x=>x.id===id?row:x);
    else state.records[type].push(row);
    audit(prev?'updated':'created',type,row.id);persist();return clone(row);
  };
  const remove=(type,id)=>{
    if(!find(type,id))throw new Error('Record not found in selected workspace.');
    for(const [child,[field,parent]] of Object.entries(RELATIONS)) {
      if(parent===type&&list(child).some(x=>x[field]===id))throw new Error('Remove linked records first.');
    }
    if(type==='deals'&&list('projects').some(p=>p.dealId===id))throw new Error('Deal is attached to a project.');
    state.records[type]=state.records[type].filter(x=>x.id!==id);
    audit('deleted',type,id);persist();
  };
  const selectWorkspace=id=>{
    if(!state.workspaces.some(w=>w.id===id))throw new Error('Workspace does not exist.');
    state.activeWorkspaceId=id;persist();
  };
  const addWorkspace=name=>{
    const trimmed=clean(name,100);if(!trimmed)throw new Error('Workspace name required.');
    const item={id:uid().replaceAll('-',''),name:trimmed};
    state.workspaces.push(item);state.activeWorkspaceId=item.id;
    audit('created','workspace',item.id);persist();return clone(item);
  };
  const summary=()=>({
    workspace:clone(state.workspaces.find(w=>w.id===state.activeWorkspaceId)),
    counts:Object.fromEntries(allTypes.map(t=>[t,list(t).length])),
    pipelineCents:list('deals').filter(x=>x.status!=='Lost').reduce((n,x)=>n+x.amountCents,0),
    outstandingCents:list('invoices').filter(x=>x.status!=='Paid').reduce((n,x)=>n+x.amountCents,0),
    expensesCents:list('expenses').reduce((n,x)=>n+x.amountCents,0),
    completedTasks:list('tasks').filter(x=>x.status==='Done').length
  });
  const projectFromWonDeal=id=>{
    const deal=find('deals',id);
    if(!deal||deal.status!=='Won')throw new Error('Mark the opportunity Won first.');
    return list('projects').find(x=>x.dealId===id)||upsert('projects',{name:deal.title,dealId:id,status:'Planned',priority:'P1'});
  };
  const importLegacyProjects=projects=>{
    if(!Array.isArray(projects))throw new Error('Provide a legacy project array.');
    let count=0;
    for(const row of projects) {
      const legacyId=clean(row.id,100);
      if(!legacyId||!clean(row.name)||list('projects').some(x=>x.legacyId===legacyId))continue;
      const status=['Active','Completed','On Hold'].includes(row.status)?row.status:'Planned';
      upsert('projects',{name:row.name,legacyId,status,priority:['P0','P1','P2','P3'].includes(row.priority)?row.priority:'P2',progress:Math.max(0,Math.min(100,Math.round(Number(row.progress)||0))),outcome:row.outcome||''});
      count++;
    }
    return count;
  };
  const exportBackup=()=>JSON.stringify({application:'oscore',exportedAt:now(),...clone(state)},null,2);
  const importBackup=value=>{
    const payload=typeof value==='string'?JSON.parse(value):clone(value);
    validateSnapshot(payload,profile.id,allTypes);
    const sanitized={version:VERSION,profileId:profile.id,workspaces:clone(payload.workspaces),activeWorkspaceId:payload.activeWorkspaceId,records:Object.fromEntries(allTypes.map(t=>[t,clone(payload.records[t])])),audit:clone(payload.audit).slice(0,200)};
    const previous=state;state=sanitized;
    try{persist();}catch(err){state=previous;throw err;}
  };
  return Object.freeze({
    profile:clone(profile),types:()=>[...allTypes],list,find,upsert,remove,summary,projectFromWonDeal,importLegacyProjects,
    selectWorkspace,addWorkspace,activeWorkspace:()=>clone(state.workspaces.find(w=>w.id===state.activeWorkspaceId)),
    workspaces:()=>clone(state.workspaces),activity:()=>clone(state.audit),exportBackup,importBackup
  });
}
