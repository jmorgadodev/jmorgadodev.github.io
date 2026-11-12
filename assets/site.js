(()=>{
"use strict";
const toggle=document.querySelector("[data-menu-toggle]");
const nav=document.querySelector("[data-nav]");
if(toggle&&nav){
 toggle.addEventListener("click",()=>{const open=nav.dataset.open!=="true";nav.dataset.open=String(open);toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"Cerrar ×":"Menú +";});
 nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.dataset.open="false";toggle.setAttribute("aria-expanded","false");toggle.textContent="Menú +";}});
}
const filters=document.querySelectorAll("[data-filter]");
const projects=document.querySelectorAll("[data-project-category]");
if(filters.length&&projects.length){
 filters.forEach(button=>button.addEventListener("click",()=>{
  const active=button.dataset.filter;
  filters.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
  projects.forEach(p=>{p.hidden=active!=="todos"&&p.dataset.projectCategory!==active;});
 }));
}
})();
/* Iconos del control de tema: cada uno anuncia el modo al que se llega. */
const TEMA_SOL='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.3" fill="currentColor"/><g stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"><path d="M12 2v2.6M12 19.4V22M22 12h-2.6M4.6 12H2M19.4 4.6l-1.9 1.9M6.5 17.5l-1.9 1.9M19.4 19.4l-1.9-1.9M6.5 6.5 4.6 4.6"/></g></svg>';
const TEMA_LUNA='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.4 14.7A8.6 8.6 0 0 1 9.3 3.6a8.6 8.6 0 1 0 11.1 11.1Z" fill="currentColor"/></svg>';
(()=>{const root=document.documentElement,button=document.querySelector('[data-theme-toggle]'),system=matchMedia('(prefers-color-scheme:dark)');function sync(){const night=root.dataset.jmTheme==='night';if(button){if(button.hasAttribute('data-theme-icon')){button.innerHTML=night?TEMA_SOL:TEMA_LUNA}else{button.textContent=night?'Día':'Noche'}button.setAttribute('aria-pressed',String(night));button.setAttribute('aria-label',night?'Cambiar a modo día':'Cambiar a modo noche')}}sync();button?.addEventListener('click',()=>{root.dataset.jmTheme=root.dataset.jmTheme==='night'?'day':'night';try{localStorage.setItem('jm-theme',root.dataset.jmTheme)}catch(_){}sync()});system.addEventListener('change',event=>{let chosen;try{chosen=localStorage.getItem('jm-theme')}catch(_){}if(!chosen){root.dataset.jmTheme=event.matches?'night':'day';sync()}});addEventListener('storage',event=>{if(event.key==='jm-theme'){root.dataset.jmTheme=event.newValue==='day'||event.newValue==='night'?event.newValue:system.matches?'night':'day';sync()}})})();
document.documentElement.classList.add('theme-ready');
(() => {
  const intro = document.querySelector("[data-study]");
  const whatsapp = document.querySelector(".whatsapp-fab[hidden]");
  if (!intro || !whatsapp || !window.IntersectionObserver) return;
  new IntersectionObserver(([entry]) => {
    const passedIntro = entry.boundingClientRect.bottom <= 0;
    if (!passedIntro && whatsapp === document.activeElement) {
      document.querySelector(".intro-skip")?.focus({preventScroll: true});
    }
    whatsapp.hidden = !passedIntro;
  }).observe(intro);
})();
