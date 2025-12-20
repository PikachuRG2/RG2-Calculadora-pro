const CACHE_NAME='rg2tv-pwa-v2'
const PRECACHE=['./index.html','./app.html','./auth.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png']
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME)
  try{await cache.addAll(PRECACHE)}catch(_){
    for(const url of PRECACHE){try{await cache.add(url)}catch(__){}}
  }
  await self.skipWaiting()
})())})
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const keys=await caches.keys()
  await Promise.all(keys.map(k=>{if(k!==CACHE_NAME)return caches.delete(k)}))
  const list=await self.clients.matchAll({type:'window',includeUncontrolled:true})
  list.forEach(c=>c.postMessage({type:'NEW_VERSION'}))
  await self.clients.claim()
})())})
self.addEventListener('fetch',e=>{
  const req=e.request
  if(req.method!=='GET')return
  if(req.mode==='navigate'){e.respondWith(fetch(req).catch(()=>caches.match('./index.html')));return}
  const url=new URL(req.url)
  if(url.origin===location.origin){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,clone));return res})))
  }else{
    e.respondWith(fetch(req).then(res=>{const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,clone));return res}).catch(()=>caches.match(req)))
  }
})
