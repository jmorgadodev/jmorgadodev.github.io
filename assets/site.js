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