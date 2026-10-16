(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function sync(){try{const r=await fetch('/api/public-content');if(!r.ok)return;const d=await r.json();
if(d.site?.heroTitle){const h=document.querySelector('.hero h1');if(h)h.textContent=d.site.heroTitle;}
if(d.site?.heroLead){const p=document.querySelector('.hero-lead');if(p)p.textContent=d.site.heroLead;}
if(d.site?.phone){document.querySelectorAll('a[href^="tel:"]').forEach(a=>{a.href='tel:'+d.site.phone.replace(/\D/g,''); const t=a.querySelector('svg'); if(t){a.append(document.createTextNode(' '+d.site.phone));} });}
if(Array.isArray(d.news)&&d.news.length){const grid=document.querySelector('.news-grid');if(grid){grid.innerHTML=d.news.filter(n=>n.status==='published').slice(0,3).map(n=>`<article class="news-card"><img src="${esc(n.image||'assets/noticia-buque.jpg')}" alt="${esc(n.title)}" loading="lazy"><div class="news-card-body"><p class="news-date">${esc(n.date||'')}</p><h3>${esc(n.title)}</h3><p>${esc(n.summary||'')}</p></div></article>`).join('');}}
}catch(e){/* la web pública sigue funcionando sin conexión al CMS */}}
if(location.protocol!=='file:')sync();})();