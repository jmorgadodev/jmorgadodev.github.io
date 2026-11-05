/* Timeline reversible: una instancia por pieza; ningún movimiento autónomo. */
(()=>{
'use strict';
const journey=document.querySelector('[data-journey]');
if(!journey||!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
const scenes=JSON.parse(document.getElementById('journey-states').textContent);
const pieces=[...journey.querySelectorAll('[data-piece-id]')];
const chapters=[...journey.querySelectorAll('[data-chapter]')];
const header=document.querySelector('.home-header');
const counter=header.querySelector('[data-scene-count]');
const bar=header.querySelector('.journey-progress');
const fill=header.querySelector('[data-journey-progress]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const narrow=matchMedia('(max-width:900px)');
let timeline,trigger,lastScene=-1;
function status(t){const scene=Math.min(6,Math.floor(t));if(scene!==lastScene){journey.dataset.scene=String(scene+1);counter.textContent=String(scene+1).padStart(2,'0');chapters.forEach((chapter,i)=>{chapter.inert=i!==scene;chapter.setAttribute('aria-hidden',String(i!==scene))});lastScene=scene}bar.setAttribute('aria-valuenow',String(Math.round(t/7*100)));bar.setAttribute('aria-valuetext',`Escena ${scene+1} de 7`);fill.style.transform=`scaleX(${t/7})`}
function setup(){
 trigger?.kill();timeline?.kill();gsap.set(pieces,{clearProps:'all'});
 document.body.style.setProperty('--journey-header',`${header.offsetHeight}px`);
 journey.querySelector('.modular-art').setAttribute('viewBox',narrow.matches?'140 60 980 720':'0 0 1200 720');
 lastScene=-1;
 timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
 pieces.forEach((piece,i)=>{
  const id=piece.dataset.pieceId;
  const first=scenes[0].pieces.find(p=>p.id===id);
  const final=scenes[5].pieces.find(p=>p.id===id);
  const initial=first||{x:i===7?-250:i===8?1350:final.x,y:i>=9?-220:final.y,rotation:0,scale:1};
  gsap.set(piece,{x:initial.x+(first?(i%2?65:-65):0),y:initial.y+(first?120:0),rotation:initial.rotation,scale:initial.scale,opacity:first?.55:0,svgOrigin:'0 0'});
  if(first){
   timeline.to(piece,{x:first.x+(i%2?18:-14),y:first.y+102,rotation:first.rotation+(i%2?-3:3),opacity:1,duration:.38},.05+i*.025);
   const align=scenes[1].pieces.find(p=>p.id===id);
   timeline.to(piece,{x:align.x-110,y:align.y,rotation:0,scale:1,duration:.75},.8+i*.025);
   // Las mismas piezas bajan al borde y ascienden hasta encajar en la plataforma.
   timeline.to(piece,{x:final.x,y:final.y+100,duration:.3},1.76+i*.065);
   timeline.to(piece,{x:final.x,y:final.y,rotation:0,scale:1,duration:.5,ease:'power3.out'},2.1+i*.065);
  }else{
   const phase=i<9?3.05:i<11?4.05:5.12;
   timeline.to(piece,{x:final.x,y:final.y,rotation:0,opacity:1,duration:.67,ease:'power3.out'},phase+(i%2)*.12);
  }
  timeline.to(piece,{opacity:0,duration:.55},6.05+(11-i)*.025);
 });
 const element=id=>journey.querySelector(`[data-element="${id}"]`);
 const base=element('E07-basamento');gsap.set(base,{x:240,y:790,opacity:0});timeline.to(base,{y:630,opacity:1,duration:.6},2.05).to(base,{opacity:0,duration:.55},6.4);
 const straight=element('E01-conector-recto'),elbow=element('E02-conector-codo');
 gsap.set(straight,{x:350,y:355,opacity:0,scale:.8});gsap.set(elbow,{x:605,y:280,opacity:0,scale:.65});
 timeline.to(straight,{opacity:.55,duration:.25},.4).to(straight,{x:260,y:435,opacity:.8,duration:.7},.85).to(straight,{opacity:0,duration:.3},1.9).to(straight,{x:365,y:440,opacity:.45,duration:.5},4.6).to(straight,{opacity:0,duration:.4},6.03);
 timeline.to(elbow,{opacity:.4,duration:.4},3.5).to(elbow,{opacity:.75,duration:.4},5.5).to(elbow,{opacity:0,duration:.3},6.0);
 const guide=element('E04-guia-alineacion');gsap.set(guide,{x:235,y:485,opacity:0,scale:.8});timeline.to(guide,{opacity:.35,duration:.3},1.1).to(guide,{opacity:0,duration:.3},1.8);
 const close=element('E05-cierre-union');gsap.set(close,{x:620,y:225,scale:.45,opacity:0});timeline.to(close,{opacity:.9,duration:.22},5.75).to(close,{opacity:.25,duration:.25},5.98).to(close,{opacity:0,duration:.3},6.25);
 const seed=element('E06-semilla');gsap.set(seed,{x:560,y:440,scale:.8,opacity:0});timeline.to(seed,{opacity:1,duration:.45},6.6);
 chapters.forEach((chapter,i)=>{gsap.set(chapter,{autoAlpha:i===0?1:0});if(i>0)timeline.to(chapter,{autoAlpha:1,duration:i===6?.35:.18},i===6?6.4:i+.02);if(i<6)timeline.to(chapter,{autoAlpha:0,duration:.15},i+.85)});
 timeline.to({},{duration:.01},6.99);
 const longest=Math.max(...chapters.map(c=>c.querySelector('.chapter-copy').offsetHeight));
 const simple=reduced.matches||innerHeight<620||longest>(innerHeight-header.offsetHeight)*(narrow.matches?.4:.6);
 document.body.classList.toggle('journey-simple',simple);
 journey.classList.toggle('is-enhanced',!simple);
 if(simple){timeline.time(5.95);gsap.set(chapters,{clearProps:'all'});chapters.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});status(5.95);chapters.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});return}
 timeline.time(0.2);status(.2);
 trigger=ScrollTrigger.create({trigger:journey,start:()=>`top top+=${header.offsetHeight}`,end:'bottom bottom',animation:timeline,scrub:true,invalidateOnRefresh:true,onUpdate:self=>status(self.progress*7)});
}
setup();
reduced.addEventListener('change',setup);narrow.addEventListener('change',setup);
let height=innerHeight;addEventListener('resize',()=>{document.body.style.setProperty('--journey-header',`${header.offsetHeight}px`);if((innerHeight<620)!==(height<620)){height=innerHeight;setup()}else ScrollTrigger.refresh()});
document.fonts.ready.then(()=>ScrollTrigger.refresh());
header.querySelector('.journey-skip')?.addEventListener('click',()=>{document.getElementById('explorar').focus({preventScroll:true})});
})();
