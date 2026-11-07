/* El ensamblaje comparte bordes reales. Cada hijo acompaña a su grupo hasta encajar. */
(()=>{
'use strict';
const journey=document.querySelector('[data-journey]');
if(!journey||!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
const layouts=JSON.parse(document.getElementById('journey-states').textContent);
const pieces=[...journey.querySelectorAll('[data-piece-id]')];
const chapters=[...journey.querySelectorAll('[data-chapter]')];
const header=document.querySelector('.home-header');
const counter=header.querySelector('[data-scene-count]');
const bar=header.querySelector('.journey-progress');
const fill=header.querySelector('[data-journey-progress]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const narrow=matchMedia('(max-width:900px)');
let timeline,trigger,lastScene=-1,resizeFrame;
function status(t){
 const scene=Math.min(6,Math.floor(t));
 if(scene!==lastScene){
  journey.dataset.scene=String(scene+1);counter.textContent=String(scene+1).padStart(2,'0');
  chapters.forEach((c,i)=>{c.inert=i!==scene;c.setAttribute('aria-hidden',String(i!==scene))});lastScene=scene;
 }
 bar.setAttribute('aria-valuenow',String(Math.round(t/7*100)));
 bar.setAttribute('aria-valuetext',`Escena ${scene+1} de 7`);fill.style.transform=`scaleX(${t/7})`;
}
function setup(){
 trigger?.kill();timeline?.kill();
 const mobile=narrow.matches,layout=layouts[mobile?'mobile':'desktop'];
 const final=[...layout.foundation,...layout.extensions];
 const seed=journey.querySelector('[data-element="E06-semilla"]');
 const type=[...journey.querySelectorAll('.type-fragment,.type-band,.type-rule,.type-frame,.chapter-text,.j-label')];
 gsap.set([...chapters,...type],{clearProps:'all'});
 const states=pieces.map((_,i)=>({gap:i?layout.gap:0,opacity:i<7?1:0}));
 const seedState={opacity:0};
 document.body.style.setProperty('--journey-header',`${header.offsetHeight}px`);
 journey.querySelector('.modular-art').setAttribute('viewBox',mobile?'100 280 1040 720':'100 180 1100 540');
 lastScene=-1;
 function render(){
  const displacement=[];
  pieces.forEach((node,i)=>{
   const parent=layout.parents[i],inherited=parent<0?[0,0]:displacement[parent];
   const [dx,dy]=layout.directions[i],state=states[i];
   const offset=[inherited[0]+dx*state.gap,inherited[1]+dy*state.gap];displacement.push(offset);
   const [x,y,sx,sy]=final[i];
   node.setAttribute('transform',`translate(${x+offset[0]} ${y+offset[1]}) scale(${sx} ${sy})`);
   node.style.opacity=String(state.opacity);
  });
  seed.style.opacity=String(seedState.opacity);
 }
 timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},onUpdate:render});
 const joins=layout.joins||[0,.62,1.14,1.9,2.1,2.02,2.2,3.02,3.28,4.02,4.25,5.03];
 states.forEach((state,i)=>{
  if(i){
   if(i>=7)timeline.to(state,{opacity:1,duration:.22},joins[i]-.15);
   timeline.to(state,{gap:0,duration:i<3?.76:.62},joins[i]);
  }
  timeline.to(state,{opacity:0,duration:.7},6.12+(11-i)*.012);
 });
 seed.setAttribute('transform',`translate(560 ${mobile?550:440}) scale(.8)`);
 timeline.to(seedState,{opacity:1,duration:.45},6.45);
 chapters.forEach((chapter,i)=>{
  const fragments=chapter.querySelectorAll('.type-fragment'),band=chapter.querySelector('.type-band');
  const frame=chapter.querySelector('.type-frame'),rule=chapter.querySelector('.type-rule');
  const secondary=chapter.querySelectorAll('.j-label,.chapter-text');
  const entry=i===0?0:i===6?6.2:i-.12;
  gsap.set(chapter,{autoAlpha:i===0?1:0});
  gsap.set(fragments,{yPercent:i===0?0:24});
  gsap.set(band,{scaleX:i===0?1:.25,transformOrigin:'left center'});
  gsap.set(frame,{clipPath:'inset(0 100% 0 0)'});
  gsap.set(rule,{scaleX:i===0?1:0,transformOrigin:'left center'});
  gsap.set(secondary,{opacity:i===0?1:0});
  if(i>0)timeline.to(chapter,{autoAlpha:1,duration:.24},entry);
  timeline.to(fragments,{yPercent:0,duration:.32,stagger:.035},entry);
  timeline.to(band,{scaleX:1,duration:.38},entry+.06);
  timeline.to(frame,{clipPath:'inset(0 0% 0 0)',duration:.4},entry+.05);
  timeline.to(rule,{scaleX:1,duration:.35},entry+.05);
  timeline.to(secondary,{opacity:1,duration:.25},entry+.1);
  if(i<6)timeline.to(chapter,{autoAlpha:0,duration:.24},i+.88);
 });
 timeline.to({},{duration:.01},6.99);render();
 const longest=Math.max(...chapters.map(c=>c.querySelector('.chapter-copy').offsetHeight));
 const simple=reduced.matches||innerHeight<620||longest>(innerHeight-header.offsetHeight)*(mobile?.48:.8);
 document.body.classList.toggle('journey-simple',simple);journey.classList.toggle('is-enhanced',!simple);
 if(simple){
  timeline.time(5.95);gsap.set([...chapters,...type],{clearProps:'all'});
  status(5.95);chapters.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});return;
 }
 trigger=ScrollTrigger.create({trigger:journey,start:()=>`top top+=${header.offsetHeight}`,end:'bottom bottom',animation:timeline,scrub:true,invalidateOnRefresh:true,onUpdate:self=>status(self.progress*7)});
 timeline.progress(trigger.progress);status(trigger.progress*7);render();
}
setup();reduced.addEventListener('change',setup);
addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(setup)});
document.fonts.ready.then(setup);
header.querySelector('.journey-skip')?.addEventListener('click',()=>document.getElementById('explorar').focus({preventScroll:true}));
})();
