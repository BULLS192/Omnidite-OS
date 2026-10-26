/* Offline static shell only. Records are stored by the OS Core separately. */
const CACHE='omnidite-os-shell-v0.2';
const FILES=[
  '/', '/index.html', '/styles.css', '/seed.js', '/app.js',
  '/oskit/ui.css','/oskit/access.css','/oskit/boot.mjs',
  '/oskit/core.mjs','/oskit/ui.mjs','/oskit/profiles/omnidite.mjs',
  '/manifest.webmanifest','/assets/os-icon.svg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  const path=new URL(event.request.url).pathname;
  if(!FILES.includes(path))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok&&response.type==='basic') {
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    }
    return response;
  }).catch(()=>caches.match(event.request)));
});
