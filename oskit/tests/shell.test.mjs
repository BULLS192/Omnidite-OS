import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const server=readFileSync('server.mjs','utf8');
const boot=readFileSync('oskit/boot.mjs','utf8');
const css=readFileSync('oskit/ui.css','utf8');
test('old Omnidite portfolio is retained',()=>{
  for(const id of ['overview','portfolio','roadmap','weekly','infrastructure'])
    assert.match(html,new RegExp('id="'+id+'"'));
});
test('standalone OS Core is loaded without Gauzy',()=>{
  assert.match(html,/type="module" src="oskit\/boot.mjs"/);
  assert.match(html,/href="oskit\/ui.css"/);
  assert.match(boot,/createOS\(omniditeProfile/);
  assert.doesNotMatch(boot,/gauzy/i);
});
test('local Node server serves ES modules with the correct MIME',()=>{
  assert.match(server,/\.mjs/);
  assert.match(server,/text\/javascript/);
});
test('third party telemetry removed from local OS pilot',()=>{
  assert.doesNotMatch(html,/cdn\.jsdelivr\.net\/gh\/BULLS192\/Omnidite-OS/);
});
test('new UI supplies a mobile navigation alternative',()=>{
  assert.match(css,/\.os-mobile-tabs/);
});
