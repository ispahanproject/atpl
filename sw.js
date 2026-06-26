const CACHE='atpl-unified-v1';
const CORE=['./','index.html','manifest.webmanifest','data/qa.enc','icon-192.png','icon-512.png','icon.png',
  'fonts/noto-sans-jp-japanese-400-normal.woff2','fonts/noto-sans-jp-japanese-500-normal.woff2','fonts/noto-sans-jp-japanese-700-normal.woff2',
  'fonts/noto-sans-jp-latin-400-normal.woff2','fonts/noto-sans-jp-latin-500-normal.woff2','fonts/noto-sans-jp-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // cache-first for everything same-origin (images cached on first view)
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
    return res;
  }).catch(()=>hit)));
});
