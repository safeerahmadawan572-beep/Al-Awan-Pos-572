const CACHE='awan-pos-v34';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(res=>{if(res&&res.ok)return c.put(f,res)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request; if(r.method!=='GET')return;
 const u=new URL(r.url); if(u.origin!==location.origin)return;
 const keep=res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
 // Page (index.html): pehle internet se naya version lo (taake update foran dikhe); net na ho ya 3.5 sec se zyada lage to cache se kholo (offline bhi chale)
 if(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html')){
  e.respondWith(Promise.race([fetch(u.href,{cache:'no-cache'}).then(keep),new Promise((_,rej)=>setTimeout(()=>rej(new Error('slow')),3500))]).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('./index.html')||caches.match('./'))));
  return}
 // baqi files (icon, manifest): cache se, saath saath naya le kar update
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{const net=fetch(r).then(keep).catch(()=>hit);return hit||net}));
});
