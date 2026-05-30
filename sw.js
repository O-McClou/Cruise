// CruiseLog Service Worker v5.0 – Dark Map (Protomaps / OpenFreeMap) + PMTiles-Cache
const CACHE = 'cruiselog-v5.0';   // ← hochgezählt → löscht alten cruiselog-v4.x Cache zwingend
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS).catch(err => console.warn('Cache partial:', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ── Dynamisch generierte Icons ────────────────────────────────────────────
  if (url.pathname.endsWith('icon-192.png') || url.pathname.endsWith('icon-512.png')) {
    const size = url.pathname.includes('512') ? 512 : 192;
    e.respondWith(generateIconResponse(size));
    return;
  }

  // ── Google Fonts: Network-first, Offline-Fallback ────────────────────────
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached || new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } }));
        })
      )
    );
    return;
  }

  // ── App-Shell (index.html / /) → NETWORK-FIRST ───────────────────────────
  // Stellt sicher, dass nach einem Update immer die neue Version geladen wird.
  // Ohne das würde der SW dauerhaft die alte (ggf. kaputte) gecachte Version
  // ausliefern und neue index.html-Versionen ignorieren.
  const isAppShell = url.pathname === '/' ||
                     url.pathname.endsWith('/index.html') ||
                     url.pathname.endsWith('/');
  if (isAppShell && e.request.method === 'GET') {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request)
        .then(cached => cached || new Response('Offline', { status: 503 }))
      )
    );
    return;
  }

  // ── Karten-CDNs: Network-first mit Cache-Fallback ────────────────────────
  // api.protomaps.com  → Style-JSON & Tiles vom Protomaps-CDN
  // tiles.openfreemap.org → kostenloser Dark-Style (aktuell genutzt)
  if (url.hostname === 'api.protomaps.com' ||
      url.hostname === 'tiles.openfreemap.org') {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() =>
        caches.match(e.request).then(cached =>
          cached || new Response('', { status: 503 })
        )
      )
    );
    return;
  }

  // ── PMTiles Style-JSON: Cache-first ──────────────────────────────────────
  // protomaps.github.io liefert den Style-JSON für den Dark-Map-Look.
  // Cache-first, weil sich der Stil selten ändert und offline wertvoll ist.
  if (url.hostname === 'protomaps.github.io') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => new Response('', { status: 503 }));
        })
      )
    );
    return;
  }

  // ── Map-Tiles: Network-Only (nicht cachen – zu groß) ─────────────────────
  // OpenSeaMap entfernt (nicht mehr verwendet).
  if (url.hostname === 'tile.openstreetmap.org' ||
      url.hostname.endsWith('.githubusercontent.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // ── Alle anderen Assets: Cache-First ─────────────────────────────────────
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});

// ── App-Icon dynamisch generieren ──────────────────────────────────────────
async function generateIconResponse(size) {
  try {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#003087'); g.addColorStop(1, '#0052cc');
    ctx.fillStyle = g;
    const rr = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(rr,0); ctx.lineTo(size-rr,0); ctx.arcTo(size,0,size,rr,rr);
    ctx.lineTo(size,size-rr); ctx.arcTo(size,size,size-rr,size,rr);
    ctx.lineTo(rr,size); ctx.arcTo(0,size,0,size-rr,rr);
    ctx.lineTo(0,rr); ctx.arcTo(0,0,rr,0,rr); ctx.closePath(); ctx.fill();
    const cx=size/2, cy=size/2, r=size*0.31, lw=size*0.045;
    ctx.strokeStyle='rgba(255,255,255,0.92)'; ctx.fillStyle='rgba(255,255,255,0.92)';
    ctx.lineWidth=lw; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.arc(cx,cy-r*.65,r*.15,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-r*.5); ctx.lineTo(cx,cy+r*.65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-r*.5,cy-r*.15); ctx.lineTo(cx+r*.5,cy-r*.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+r*.65); ctx.bezierCurveTo(cx-r*.3,cy+r*.65,cx-r*.78,cy+r*.38,cx-r*.78,cy+r*.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy+r*.65); ctx.bezierCurveTo(cx+r*.3,cy+r*.65,cx+r*.78,cy+r*.38,cx+r*.78,cy+r*.12); ctx.stroke();
    [[-1],[1]].forEach(([d])=>{ctx.beginPath();ctx.arc(cx+d*r*.78,cy+r*.12,lw*.85,0,Math.PI*2);ctx.fill();});
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Response(blob, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'max-age=86400' } });
  } catch {
    return new Response('', { status: 404 });
  }
}
