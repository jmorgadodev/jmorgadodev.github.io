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
(()=>{const root=document.documentElement,button=document.querySelector('[data-theme-toggle]'),system=matchMedia('(prefers-color-scheme:dark)');function sync(){const night=root.dataset.jmTheme==='night';if(button){button.textContent=night?'Día':'Noche';button.setAttribute('aria-pressed',String(night));button.setAttribute('aria-label',night?'Cambiar a modo día':'Cambiar a modo noche')}}sync();button?.addEventListener('click',()=>{root.dataset.jmTheme=root.dataset.jmTheme==='night'?'day':'night';try{localStorage.setItem('jm-theme',root.dataset.jmTheme)}catch(_){}sync()});system.addEventListener('change',event=>{let chosen;try{chosen=localStorage.getItem('jm-theme')}catch(_){}if(!chosen){root.dataset.jmTheme=event.matches?'night':'day';sync()}});addEventListener('storage',event=>{if(event.key==='jm-theme'){root.dataset.jmTheme=event.newValue==='day'||event.newValue==='night'?event.newValue:system.matches?'night':'day';sync()}})})();
document.documentElement.classList.add('theme-ready');
