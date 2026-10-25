import test from 'node:test';
import assert from 'node:assert/strict';
import {createOS,memoryStore,cents,money} from '../core.mjs';
import {omniditeProfile} from '../profiles/omnidite.mjs';
import {tttExampleProfile} from '../profiles/ttt-example.mjs';
test('money is held as exact integer cents',()=>{
  assert.equal(cents('19.99'),1999);assert.equal(money(1999),'19.99');
  assert.throws(()=>cents('3.999'),/Amount/);
});
test('brands isolate stored records',()=>{
  const store=memoryStore(),omni=createOS(omniditeProfile,store),ttt=createOS(tttExampleProfile,store);
  omni.upsert('contacts',{name:'Sample'});assert.equal(ttt.list('contacts').length,0);
  assert.equal(createOS(omniditeProfile,store).list('contacts').length,1);
});
test('workspaces scope reads and relations',()=>{
  const os=createOS(omniditeProfile,memoryStore());
  const contact=os.upsert('contacts',{name:'A'});
  os.selectWorkspace('aedificatus');
  assert.equal(os.list('contacts').length,0);
  assert.throws(()=>os.upsert('deals',{title:'Deal',contactId:contact.id,amount:'10'}),/workspace/);
  os.selectWorkspace('omnidite-advisory');assert.equal(os.list('contacts').length,1);
});
test('won opportunity creates project once',()=>{
  const os=createOS(omniditeProfile,memoryStore());
  const deal=os.upsert('deals',{title:'Pilot',status:'Won',amount:'1250.50'});
  const p=os.projectFromWonDeal(deal.id);
  assert.equal(p.id,os.projectFromWonDeal(deal.id).id);
  assert.equal(os.summary().pipelineCents,125050);
});
test('deletion refuses dangling task',()=>{
  const os=createOS(omniditeProfile,memoryStore());
  const p=os.upsert('projects',{name:'Pilot'}),t=os.upsert('tasks',{title:'Prepare',projectId:p.id});
  assert.throws(()=>os.remove('projects',p.id),/linked/);
  os.remove('tasks',t.id);os.remove('projects',p.id);
});
test('brand-restricted backup restore',()=>{
  const os=createOS(omniditeProfile,memoryStore()),ttt=createOS(tttExampleProfile,memoryStore());
  os.upsert('expenses',{title:'Tools',amount:'2.50'});
  const data=os.exportBackup();assert.throws(()=>ttt.importBackup(data),/different OS profile/);
  os.upsert('expenses',{title:'Other',amount:'10'});
  os.importBackup(data);assert.equal(os.list('expenses').length,1);
});
test('portfolio copy never double-imports same ID',()=>{
  const os=createOS(omniditeProfile,memoryStore()),rows=[{id:'P-1',name:'Existing',priority:'P0',status:'Active'}];
  assert.equal(os.importLegacyProjects(rows),1);assert.equal(os.importLegacyProjects(rows),0);
});
test('bad backup leaves existing data intact',()=>{
  const os=createOS(omniditeProfile,memoryStore());os.upsert('contacts',{name:'Retained'});
  assert.throws(()=>os.importBackup('{bad json'));assert.equal(os.list('contacts').length,1);
});

test('custom profile schema works without rewriting core',()=>{
  const omni=createOS(omniditeProfile,memoryStore());
  assert.ok(omni.types().includes('assets'));
  const asset=omni.upsert('assets',{name:'Sample printer',category:'Equipment',status:'Active'});
  assert.equal(omni.list('assets')[0].id,asset.id);
  assert.equal(omni.summary().counts.assets,1);
  const ttt=createOS(tttExampleProfile,memoryStore());
  assert.ok(ttt.types().includes('vehicles'));
  assert.equal(ttt.types().includes('assets'),false);
  ttt.upsert('vehicles',{name:'Sample van',plate:'TEST-001',status:'Available'});
  assert.equal(ttt.list('vehicles').length,1);
});
test('invalid extension definition is refused',()=>{
  const bad={...omniditeProfile,extensions:[{id:'contacts',module:'crm',label:'Bad',fields:[{key:'name',kind:'text'}]}]};
  assert.throws(()=>createOS(bad,memoryStore()),/duplicate extension/);
});
