(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  // Aplica los ajustes guardados desde el panel en este navegador (prototipo estático).
  try {
    const settings = JSON.parse(localStorage.getItem('portilloAdminSettings') || 'null');
    if (settings) {
      if (settings.heroLead) { const lead=$('.hero-lead'); if(lead) lead.textContent=settings.heroLead; }
      if (settings.phone) { $$('a[href^="tel:"]').forEach(a=>{ if(a.textContent.includes('956') || a.textContent.includes('+34')) a.textContent=settings.phone; }); }
      if (settings.email) { $$('a[href^="mailto:"]').forEach(a=>{ if(a.textContent.includes('info@amportillo.com')) a.textContent=settings.email; }); }
      if (Array.isArray(settings.news)) { const cards=$$('.news-card'); settings.news.slice(0,cards.length).forEach((item,i)=>{ const card=cards[i]; const h=card.querySelector('h3'), p=card.querySelector('.news-content p'); if(h && item.title) h.textContent=item.title; if(p && item.summary) p.textContent=item.summary; }); }
    }
  } catch(e) { console.warn('No se han podido aplicar los ajustes locales del panel.',e); }
  const menuToggle = $('#menuToggle'), nav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false');
  }));
  const searchToggle = $('#searchToggle'), searchPanel = $('#searchPanel'), searchInput = $('#siteSearch'), searchResults = $('#searchResults');
  function toggleSearch(open) {
    searchPanel.hidden = !open; searchToggle.setAttribute('aria-expanded',String(open));
    if(open) searchInput.focus(); else { searchResults.replaceChildren(); searchInput.value=''; }
  }
  searchToggle.addEventListener('click', () => toggleSearch(searchPanel.hidden));
  $('#searchClose').addEventListener('click', () => toggleSearch(false));
  const searchable = [
    ['Quiénes somos','#quienes-somos','tradición empresa familiar trayectoria'],['Historia','#historia','orígenes 1918 buque Christian siglo XX'],
    ['Estibadores','#estibadores','carga descarga operaciones portuarias'],['Almacenistas','#almacenistas','almacenamiento graneles mercancía general stock'],
    ['Consignatarios','#consignatarios','buques escala puerto representación'],['Tránsitos','#transitos','logística transporte internacional'],['Aduanas','#aduanas','importación exportación despachos documentación'],
    ['Noticias','#noticias','actualidad grúa almacenes ALDEPORT'],['Contacto','#contacto','teléfono correo Cádiz Sevilla'],
    ['Control de salidas y stock','https://vportillo.transkal.com/portal/portal/login.xhtml','portal clientes transkal salidas stock']
  ];
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLocaleLowerCase('es'); searchResults.replaceChildren();
    if(!q) return;
    const found = searchable.filter(x => (x[0]+' '+x[2]).toLocaleLowerCase('es').includes(q)).slice(0,7);
    if(!found.length){ const p=document.createElement('span'); p.className='search-empty'; p.textContent='No se han encontrado resultados.'; searchResults.append(p); return; }
    found.forEach(x => {const a=document.createElement('a');a.href=x[1];a.textContent=x[0];if(x[1].startsWith('http')){a.target='_blank';a.rel='noopener noreferrer'}a.addEventListener('click',()=>toggleSearch(false));searchResults.append(a)});
  });
  // Service buttons prefill the email form, without transmitting data to this static page.
  $$('.detail-cta[data-service]').forEach(a => a.addEventListener('click', () => {
    const service = a.dataset.service; const subject = $('#contactSubject');
    if(subject) subject.value = service;
    const message = $('#contactMessage');
    if(message && !message.value.trim()) message.value = `Hola, me gustaría recibir información sobre ${service.toLowerCase()}.`;
  }));
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const service = String(data.get('service') || 'Consulta general').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Consulta web: ${service}`);
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nServicio: ${service}\n\n${message}`);
    $('#formStatus').textContent = 'Abriendo tu aplicación de correo…';
    window.location.href = `mailto:info@amportillo.com?subject=${subject}&body=${body}`;
  });
  const toast = $('#toast'); let toastTimer;
  function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
  const backTop = $('#backTop');
  window.addEventListener('scroll',()=>backTop.classList.toggle('visible',window.scrollY>500),{passive:true});
  backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  $('#year').textContent = new Date().getFullYear();
  // Mark the visible section in the main navigation.
  if('IntersectionObserver' in window){
    const sections = $$('main section[id]');
    const observer = new IntersectionObserver(entries=>{
      const current=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!current)return; const id=current.target.id;
      $$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id || (id==='estibadores'||id==='almacenistas'||id==='consignatarios'||id==='transitos'||id==='aduanas')&&a.getAttribute('href')==='#servicios'));
    },{rootMargin:'-25% 0px -65% 0px',threshold:[0,.1,.25,.5]}); sections.forEach(s=>observer.observe(s));
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleSearch(false);nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}});
})();
