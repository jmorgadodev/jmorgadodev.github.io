/* JMorgado · Reel interactivo. Motion graphics originales dibujados en Canvas 2D.
   La coreografía principal es determinista y reversible; la entrada inicial es breve.
   Las palabras visibles para lectores de pantalla siguen siendo HTML.
*/
(()=>{
'use strict';
const root=document.querySelector('[data-study]');
if(!root||!window.gsap||!window.ScrollTrigger)return;
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(!location.hash&&window.scrollY>0)window.scrollTo(0,0);
gsap.registerPlugin(ScrollTrigger);
const canvas=root.querySelector('.study-canvas'),ctx=canvas.getContext('2d',{alpha:false});
const header=document.querySelector('.home-header'),destination=document.getElementById('explorar');
const themeButton=root.querySelector('.study-theme'),siteTheme=document.querySelector('[data-theme-toggle]');
const skip=root.querySelector('.intro-skip'),copies=[...root.querySelectorAll('[data-copy]')];
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
const mqMobile=matchMedia('(max-width:900px)');
let W=0,H=0,DPR=1,wordPoints=[],play={t:0},master,trigger,resizeId;
let hoveredModule=-1,hoverTween=null;
const hoverState={value:0},seedPulse={value:0},introReveal={value:1};
let seedPulseTween=null,introTween=null;
const pointer={x:0,y:0,energy:0,active:false,down:false,vx:0,vy:0};
const ripples=[];
let pointerTween=null,pointerFade=null,scrollIdle=true,scrollIdleTimer=0,lastRippleAt=0;
const N=3600,particles=[],PHI=(1+Math.sqrt(5))/2;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{let t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
const hash=n=>{const v=Math.sin(n*127.1+83.17)*43758.5453;return v-Math.floor(v)};
const rad=Math.PI/180;
for(let i=0;i<N;i++)particles.push({r:hash(i*2),s:hash(i*2+1),k:hash(i*3+7)});
const PAL={
 day:{bg:['#F0EDE6','#F0EDE6','#F45A3A','#FCFAF5','#102E38','#10252F','#FCFAF5','#102E38'],
 ink:'#222327',cream:'#FCFAF5',petrol:'#23494E',coral:'#F45A3A',amber:'#E8B769',olive:'#737B69',stone:'#C9C8B7',ash:'#A5A18D',clay:'#D99B89'},
 night:{bg:['#111B20','#111B20','#F45A3A','#19282E','#0B141C','#0B1822','#1A282C','#0B141C'],
 ink:'#F3F0E8',cream:'#F3F0E8',petrol:'#477982',coral:'#FF785C',amber:'#EEC47D',olive:'#ADB29C',stone:'#818578',ash:'#B5B19F',clay:'#DDA294'}
};
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,u)=>{const A=rgb(a),B=rgb(b);return 'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],u))).join(',')+')'};
const night=()=>document.documentElement.dataset.jmTheme==='night';
function line(x1,y1,x2,y2,color,width=1,opacity=1){
 ctx.save();ctx.globalAlpha*=opacity;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
 ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();ctx.restore();
}
function rounded(x,y,w,h,r,color,alpha=1){
 ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=color;ctx.beginPath();
 ctx.roundRect(x,y,w,h,Math.min(Math.max(0,r),w/2,h/2));ctx.fill();ctx.restore();
}
function circle(x,y,r,color,opacity=1){
 if(r<=0)return;
 ctx.save();ctx.globalAlpha*=opacity;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();
}
function strokeCircle(x,y,r,color,width=1,opacity=1){
 if(r<=0)return;
 ctx.save();ctx.globalAlpha*=opacity;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
 ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function typography(text,size,x,y,color,weight='800',stroke=false,alpha=1){
 ctx.save();ctx.globalAlpha*=alpha;ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font=weight+' '+size+'px "Instrument Sans",sans-serif';
 if(stroke){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeText(text,x,y)}
 else{ctx.fillStyle=color;ctx.fillText(text,x,y)}
 ctx.restore();
}
function drawHairlines(c,brightness=.15){
 const s=Math.min(W,H),cy=H*.64;
 line(W*.055,cy,W*.945,cy,c,1,brightness);
 line(W*.5,cy-s*.19,W*.5,cy+s*.19,c,1,brightness*.54);
 for(let i=0;i<15;i++){
  let x=W*(.055+i*.89/14);
  line(x,cy-3,x,cy+3,c,1,brightness*.7);
 }
}
/* Todas las escenas comparten la misma familia modular: proporciones variadas,
   sin fichas rígidas ni logos explicativos. El índice mantiene identidad y color. */
const modulePalette=p=>[night()?'#5A9D72':'#347953',p.amber,p.petrol,p.coral,p.clay,p.olive,p.stone,p.ash];
function barAspect(){return W<700?2.1:3.55}
function drawModule(i,x,y,size,p,opacity=1,rotation=0,aspect=1){
 const color=modulePalette(p)[moduleMeta(i).column];
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.globalAlpha*=clamp(opacity);
 // En las escenas de apilado, las formas se convierten gradualmente en barras
 // limpias. La mezcla evita que círculos o contornos salten al entrar al gráfico.
 const blockMix=smooth(1.02,barAspect(),aspect);
 if(blockMix>.001){
  const bw=size*aspect*(.98+.04*hash(i*4+16));
  const bh=size*(.94+.08*hash(i*4+18));
  rounded(-bw/2,-bh/2,bw,bh,Math.min(3.5,size*.13),color,blockMix);
 }
 if(blockMix<.999){
  ctx.save();ctx.globalAlpha*=1-blockMix;
  const width=size*(.76+.72*hash(i*4+16)),height=size*(.68+.54*hash(i*4+18));
  const form=i%13;
  if(form===0||form===9){
   ctx.lineWidth=1.35;ctx.strokeStyle=color;ctx.strokeRect(-width/2,-height/2,width,height);
  }else if(form===4||form===11){
   ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,width*.39,0,Math.PI*2);ctx.fill();
  }else if(form===7){
   ctx.fillStyle=color;ctx.beginPath();
   ctx.moveTo(-width/2,-height/2);ctx.lineTo(width/2,-height/2);
   ctx.lineTo(width/2,height*.16);ctx.lineTo(width*.15,height*.16);
   ctx.lineTo(width*.15,height/2);ctx.lineTo(-width/2,height/2);ctx.closePath();ctx.fill();
  }else{
   ctx.fillStyle=color;ctx.beginPath();
   ctx.roundRect(-width/2,-height/2,width,height,Math.min(3,size*.11));ctx.fill();
  }
  ctx.restore();
 }
 ctx.restore();
}
function loosePoint(i){
 return {x:W*(.17+.66*hash(i*3+47)),y:H*(.49+.35*hash(i*3+71))};
}
function groupedPoint(i){
 const group=i%3,col=Math.floor(i/3)%4,row=Math.floor(i/12);
 const gap=Math.min(W*.047,32);
 return {x:W*(.19+group*.155)+(col-1.5)*gap,
         y:H*(.57+group*.035)+(row-1.2)*gap};
}
function cloudPoint(i,count){
 const radius=Math.sqrt(hash(i*9+6)),angle=hash(i*9+7)*Math.PI*2;
 return {x:W*.50+Math.cos(angle)*radius*W*(W<700?.38:.34),
         y:H*.64+Math.sin(angle)*radius*H*(W<700?.185:.205),
         size:W<700?8:15,rotation:(hash(i+72)-.5)*.12};
}
const MODULE_COUNT=56;
const CHART_COUNTS=[9,8,4,5,9,9,6,6];
function moduleMeta(i){
 let offset=i;
 for(let column=0;column<CHART_COUNTS.length;column++){
  if(offset<CHART_COUNTS[column])return {column,row:offset};
  offset-=CHART_COUNTS[column];
 }
 return {column:7,row:5};
}
function stackPoint(i,chart=false){
 const mobile=W<700,m=moduleMeta(i),aspect=barAspect();
 // La primera escena ocupa el ancho completo. En la escena de crecimiento
 // reservamos aire a la izquierda para el indicador circular de progreso.
 const cellW=W*(chart?(mobile?.055:.058):(mobile?.075:.071));
 const gapX=W*(chart?(mobile?.009:.012):(mobile?.010:.014));
 const total=8*cellW+7*gapX;
 const left=chart?W*(mobile?.31:.29):(W-total)/2;
 const x=left+m.column*(cellW+gapX)+cellW/2;
 const cellH=mobile?Math.min(H*.021,W*.043):Math.min(H*.032,W*.055);
 const size=Math.min(cellH*.92,cellW/(aspect*1.04));
 const gapY=cellH*.16,base=H*(chart?.84:.83);
 return {x,y:base-(m.row+.5)*(cellH+gapY),size,rotation:0};
}
function scatteredPoint(i){
 const angle=i*2.399963,radial=.24+.72*Math.sqrt(hash(i+91));
 return {x:W*.5+Math.cos(angle)*W*.37*radial,
  y:H*.60+Math.sin(angle)*H*.20*radial,
  size:W<700?10:21,rotation:(hash(i+33)-.5)*.32};
}
function groupedModulePoint(i){
 // Tres conjuntos visibles, con una retícula modular clara y espacio entre ellos.
 // La composición se lee como piezas relacionadas, no como una nube de partículas.
 const group=i%3,local=Math.floor(i/3),col=local%3,row=Math.floor(local/3);
 const gapX=W*(W<700?.026:.032),gapY=H*(W<700?.027:.030);
 return {x:W*(.25+group*.25)+(col-1)*gapX,
  y:H*(.625+(group===1?-.018:.018))+(row-3)*gapY,
  size:W<700?9:18,rotation:(hash(i+15)-.5)*.035};
}
function wordModulePoint(i){
 const q=wordPoint(i),size=Math.min(W*.76,1050);
 return {x:W*.5+q.x*size,y:H*.65+q.y*H*.52,
  size:W<700?6:11,rotation:0};
}
function sphereModulePoint(i){
 const a=spherePoint(i,.42,MODULE_COUNT),r=Math.min(W*(W<700?.37:.255),H*.34);
 return {x:W*.5+a.x*r*(1+.1*a.z),y:H*(W<700?.64:.62)-a.y*r,
  size:W<700?7:13,rotation:(hash(i+23)-.5)*.12};
}
function chartPoint(i){return stackPoint(i,true)}
function ribbonPoint(i){
 const q=i/(MODULE_COUNT-1);
 return {x:W*(.16+.68*q),
  y:H*(.63+.075*Math.sin(q*9.4+1.3)+.045*Math.cos(q*4.1)),
  size:W<700?5:10,rotation:(hash(i+4)-.5)*.2};
}
function centerPoint(i){
 return {x:W*.5+(hash(i+10)-.5)*2,y:H*.66+(hash(i+20)-.5)*2,
  size:W<700?2:3,rotation:0};
}
const MODULE_LAYOUTS=[stackPoint,scatteredPoint,groupedModulePoint,cloudPoint,
 wordModulePoint,sphereModulePoint,chartPoint,ribbonPoint,centerPoint];
function drawModuleTransition(scene,u,p){
 for(let i=0;i<MODULE_COUNT;i++){
  let x,y,size,rotation,aspect,opacity=1;
  if(scene===0){
   const a=scatteredPoint(i),b=stackPoint(i,false),meta=moduleMeta(i);
   const delay=hash(i*7+9)*.09+meta.column*.003;
   const amount=smooth(delay,.96,u);
   const reveal=smooth(hash(i*13+71)*.16,.74+hash(i*17+23)*.18,introReveal.value);
   const targetX=lerp(a.x,b.x,amount),targetY=lerp(a.y,b.y,amount);
   const originX=W*.5+(a.x-W*.5)*.12,originY=H*.60+(a.y-H*.60)*.12;
   x=lerp(originX,targetX,reveal);y=lerp(originY,targetY,reveal);
   size=lerp(a.size||b.size,b.size,amount);
   rotation=lerp(a.rotation||0,0,amount);
   aspect=lerp(1,barAspect(),amount);
   opacity=reveal;
  }else if(scene===1){
   const start=stackPoint(i,false),loose=scatteredPoint(i),target=groupedModulePoint(i);
   if(i%3===1){
    // Un conjunto central encuentra su forma primero y permanece legible
    // mientras las demás piezas se separan y vuelven a organizarse.
    const amount=smooth(.02,.48,u);
    x=lerp(start.x,target.x,amount);y=lerp(start.y,target.y,amount);
    size=lerp(start.size,target.size,amount);
    rotation=lerp(0,target.rotation||0,amount);
    aspect=lerp(barAspect(),1,amount);
   }else{
    const scatter=smooth(.02,.28,u),regroup=smooth(.36,.82,u);
    const looseX=lerp(start.x,loose.x,scatter),looseY=lerp(start.y,loose.y,scatter);
    x=lerp(looseX,target.x,regroup);y=lerp(looseY,target.y,regroup);
    size=lerp(start.size,target.size,scatter);
    rotation=lerp(0,loose.rotation||0,scatter)*(1-regroup);
    aspect=lerp(barAspect(),1,scatter);
   }
  }else if(scene===2){
   const a=groupedModulePoint(i),b=cloudPoint(i),amount=smooth(.12,.88,u);
   if(i===26){
    // Una pieza coral permanece como núcleo: el primer sistema que funciona.
    x=W*.5;y=H*(H<620?.75:(W<700?.66:.64));size=W<700?28:42;rotation=0;aspect=1;
   }else{
    const delay=hash(i*5+29)*.16;
    x=lerp(a.x,b.x,smooth(delay,.94,amount));
    y=lerp(a.y,b.y,smooth(delay,.94,amount));
    size=lerp(a.size||12,b.size||12,amount);
    rotation=lerp(a.rotation||0,b.rotation||0,amount);
    aspect=1;
   }
  }else{
   const a=MODULE_LAYOUTS[scene](i),b=MODULE_LAYOUTS[scene+1](i),meta=moduleMeta(i);
   let delay=hash(i+scene*31)*.055;
   if(scene===5)delay=meta.column*.018+meta.row*.024;
   const phase=scene===6?smooth(.34,.99,u):u;
   const amount=smooth(delay,.985,phase);
   x=lerp(a.x,b.x,amount);y=lerp(a.y,b.y,amount);
   size=lerp(a.size||12,b.size||12,amount);
   rotation=lerp(a.rotation||0,b.rotation||0,amount);
   const aspectFrom=scene===6?barAspect():1;
   const aspectTo=scene+1===6?barAspect():1;
   aspect=lerp(aspectFrom,aspectTo,amount);
   opacity=scene===7?1-smooth(.22,.94,amount):1;
  }
  if(pointer.energy>.01&&(scene===0||scene===2)){
   const dx=pointer.x-x,dy=pointer.y-y,d=Math.hypot(dx,dy),radius=Math.min(W*.34,190);
   const influence=Math.pow(1-clamp(d/radius),2)*pointer.energy;
   x+=dx*influence*.17;y+=dy*influence*.17;
   size*=1+influence*.24;
  }
  if(scene===0&&i===hoveredModule){
   size*=1+.13*hoverState.value;
   drawModule(i,x,y-5*hoverState.value,size*1.08,p,opacity,rotation,aspect);
  }else drawModule(i,x,y,size*1.08,p,opacity,rotation,aspect);
 }
}
function setHoveredModule(next){
 if(next===hoveredModule)return;
 hoveredModule=next;hoverTween?.kill();
 hoverTween=gsap.to(hoverState,{value:next>=0?1:0,duration:.24,ease:'power2.out',onUpdate:render});
}
function setHoveredModuleAt(x,y){
 if(play.t>=1||play.t<0||prefersReduced.matches){setHoveredModule(-1);return;}
 let candidate=-1,best=Infinity;
 const progress=smooth(.015,.72,clamp(play.t));
 for(let i=0;i<MODULE_COUNT;i++){
  const start=scatteredPoint(i),target=stackPoint(i,false),meta=moduleMeta(i);
  const delay=hash(i*7+9)*.09+meta.column*.003;
  const amount=smooth(delay,.96,progress);
  const reveal=smooth(hash(i*13+71)*.16,.74+hash(i*17+23)*.18,introReveal.value);
  const targetX=lerp(start.x,target.x,amount),targetY=lerp(start.y,target.y,amount);
  const originX=W*.5+(start.x-W*.5)*.12,originY=H*.60+(start.y-H*.60)*.12;
  const point={x:lerp(originX,targetX,reveal),y:lerp(originY,targetY,reveal),
   size:lerp(start.size||target.size,target.size,amount)};
  const halfW=Math.max(point.size*barAspect()*.58,9),halfH=Math.max(point.size*.78,10);
  const dx=Math.abs(x-point.x),dy=Math.abs(y-point.y);
  if(dx<=halfW&&dy<=halfH){const score=dx*dx+dy*dy;if(score<best){best=score;candidate=i}}
 }
 setHoveredModule(candidate);
}
function localPointer(event){
 const rect=canvas.getBoundingClientRect();
 pointer.vx=event.clientX-rect.left-pointer.x;pointer.vy=event.clientY-rect.top-pointer.y;
 pointer.x=clamp(event.clientX-rect.left,0,W);pointer.y=clamp(event.clientY-rect.top,0,H);
 pointer.active=true;
 pointerTween?.kill();pointerFade?.kill();
 pointerTween=gsap.to(pointer,{energy:1,duration:.22,ease:'power2.out',onUpdate:render});
 setHoveredModuleAt(pointer.x,pointer.y);
}
function fadePointer(){
 pointerTween?.kill();pointerTween=gsap.to(pointer,{energy:0,duration:.82,ease:'power2.out',
  onUpdate:render,onComplete:()=>{pointer.active=false;setHoveredModule(-1);render()}});
}
function emitRipple(x,y,strength=1){
 const wave={x,y,r:3,alpha:.54*strength};ripples.push(wave);
 while(ripples.length>6){const old=ripples.shift();gsap.killTweensOf(old)}
 gsap.to(wave,{r:Math.min(Math.max(W,H)*.42,360),alpha:0,duration:1.18,ease:'power2.out',
  onUpdate:render,onComplete:()=>{const index=ripples.indexOf(wave);if(index>=0)ripples.splice(index,1);render()}});
}
canvas.addEventListener('pointermove',event=>{
 if(!scrollIdle||prefersReduced.matches||!root.classList.contains('is-linked'))return;
 if(event.pointerType==='touch'&&!pointer.down)return;
 localPointer(event);
 const now=performance.now();
 if(event.pointerType!=='touch'&&Math.hypot(pointer.vx,pointer.vy)>14&&now-lastRippleAt>220){
  emitRipple(pointer.x,pointer.y,.18);lastRippleAt=now;
 }
},{passive:true});
canvas.addEventListener('pointerdown',event=>{
 if(!scrollIdle||prefersReduced.matches||!root.classList.contains('is-linked'))return;
 pointer.down=true;localPointer(event);emitRipple(pointer.x,pointer.y,event.pointerType==='touch'?1:.72);
},{passive:true});
window.addEventListener('pointerup',event=>{
 pointer.down=false;
 if(event.pointerType==='touch')pointerFade=gsap.delayedCall(1.15,fadePointer);
},{passive:true});
canvas.addEventListener('pointercancel',()=>{pointer.down=false;fadePointer()},{passive:true});
canvas.addEventListener('pointerleave',()=>{if(!pointer.down)fadePointer()},{passive:true});
window.addEventListener('scroll',()=>{
 scrollIdle=false;fadePointer();setHoveredModule(-1);clearTimeout(scrollIdleTimer);
 scrollIdleTimer=setTimeout(()=>{scrollIdle=true},170);
},{passive:true});
window.addEventListener('blur',()=>{pointer.down=false;fadePointer();setHoveredModule(-1)});

function draw0(u,p){
 const ink=night()?p.cream:p.ink;
 // La escena de entrada presenta una estructura completa y fácil de leer.
 line(W*.12,H*.84,W*.88,H*.84,ink,1,.34);
 line(W*.12,H*.40,W*.12,H*.84,ink,1,.15);
 for(let i=0;i<8;i++){
  const x=W*(.15+i*.10);
  line(x,H*.84-3,x,H*.84+3,ink,1,.20);
 }
}
function draw1(u,p){
 const ink=night()?p.cream:p.ink,show=smooth(.04,.52,u),compact=H<620;
 const nodes=[{x:W*.25,y:H*(compact?.60:.49)},{x:W*.50,y:H*(compact?.57:.43)},{x:W*.75,y:H*(compact?.60:.49)}];
 // Las relaciones dejan de ser tres grupos aislados: las conexiones se leen
 // como un mapa de dependencias que se descubre antes de intervenir.
 const trace=(a,c,b,progress,color,alpha=.72)=>{
  const steps=48,limit=Math.max(1,Math.floor(steps*progress));
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=W<700?1.35:1.8;
  ctx.globalAlpha*=alpha*show;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  for(let k=0;k<=limit;k++){
   const t=k/steps,v=1-t,x=v*v*a.x+2*v*t*c.x+t*t*b.x;
   const y=v*v*a.y+2*v*t*c.y+t*t*b.y;
   if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.stroke();ctx.restore();
 };
 const crown=H*(compact?.45:.34);
 trace(nodes[0],{x:W*.375,y:crown},nodes[1],smooth(.03,.58,u),p.petrol);
 trace(nodes[1],{x:W*.625,y:crown},nodes[2],smooth(.25,.82,u),p.petrol);
 trace(nodes[0],{x:W*.50,y:H*(compact?.70:.70)},nodes[2],smooth(.42,.96,u),p.olive,.28);
 nodes.forEach((node,i)=>{
  const stem=H*(compact?.66:.52);
  line(node.x,node.y+7,node.x,stem,p.olive,1.2,.46*show);
  circle(node.x,node.y,W<700?3.8:5.2,i===1?p.coral:p.amber,show);
  strokeCircle(node.x,node.y,W<700?8:10,p.petrol,1,.30*show);
  const branchX=node.x+(i===0?W*.055:i===2?-W*.055:0);
  line(node.x,node.y+14,branchX,node.y+H*.065,p.olive,1,.22*show);
  circle(branchX,node.y+H*.065,2,p.coral,.55*show);
  if(pointer.energy>.02){
   const d=Math.hypot(pointer.x-node.x,pointer.y-node.y);
   const near=(1-clamp(d/180))*pointer.energy;
   line(node.x,node.y,pointer.x,pointer.y,p.amber,1,.42*near);
   strokeCircle(node.x,node.y,12+near*11,p.coral,1,.38*near);
  }
 });
 line(nodes[0].x,H*(compact?.79:.78),nodes[2].x,H*(compact?.79:.78),ink,1,.13*show);
 // Los nombres se anclan a los conjuntos existentes, nunca se introducen tarjetas.
 const names=['PERSONAS','TAREAS','HERRAMIENTAS'];
 nodes.forEach((node,i)=>{
  const reveal=smooth(.28+i*.12,.72+i*.08,u);
  typography(names[i],W<700?8:11,node.x,H*(compact?.84:.825),ink,'600',false,.76*reveal);
 });
}
function draw2(u,p){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.75:(mobile?.66:.64));
 const grow=smooth(.08,.72,u),settle=smooth(.18,.78,u);
 const core=mobile?28:42,radius=lerp(compact?24:(mobile?30:42),Math.min(W*.28,H*(compact?.17:.22)),grow);
 // Una primera pieza funcional queda estable en el centro; de ella nacen
 // módulos conectados que amplían el sistema sin perder el núcleo.
 for(let ring=2;ring>=0;ring--){
  const r=radius*(.48+ring*.26);
  strokeCircle(cx,cy,r,p.coral,ring===0?1.5:1,.22*settle*(1-ring*.17));
 }
 const satellites=6;
 for(let i=0;i<satellites;i++){
  const angle=-Math.PI/2+i*Math.PI*2/satellites;
  const r=radius*(.60+.10*Math.sin(u*4+i));
  const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
  line(cx,cy,x,y,p.cream,.9,.18*settle);
  const s=(mobile?7:11)*settle;
  rounded(x-s/2,y-s/2,s,s,2,i%2?p.amber:p.olive,.92*settle);
 }
 rounded(cx-core/2,cy-core/2,core,core,4,p.coral,.98);
 rounded(cx-core*.22,cy-core*.22,core*.44,core*.44,2,p.cream,.94);
 strokeCircle(cx,cy,core*.88,p.cream,1.2,.75);
 line(W*.12,H*.86,W*.88,H*.86,p.ink,1,.18);
 for(let i=0;i<8;i++){
  const x=W*(.17+.66*i/7);line(x,H*.86-3,x,H*.86+3,p.ink,1,.16);
 }
 if(pointer.energy>.02){
  const d=Math.hypot(pointer.x-cx,pointer.y-cy),near=(1-clamp(d/Math.max(radius,1)))*pointer.energy;
  strokeCircle(cx,cy,core*(1.1+near*.9),p.cream,1,.7*near);
 }
}
function buildWord(){
 const temp=document.createElement('canvas');temp.width=1000;temp.height=260;
 const c=temp.getContext('2d',{willReadFrequently:true});
 c.clearRect(0,0,1000,260);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
 c.font='800 194px "Instrument Sans",sans-serif';c.fillText('CRECER',500,132,945);
 const data=c.getImageData(0,0,1000,260).data,pts=[];
 for(let y=8;y<252;y+=4)for(let x=15;x<985;x+=4)
  if(data[(y*1000+x)*4+3]>135)pts.push({x:(x-500)/1000,y:(y-130)/260});
 wordPoints=pts;
}
function wordPoint(i){
 if(!wordPoints.length)return{x:0,y:0};
 return wordPoints[(i*59+Math.floor(hash(i)*157))%wordPoints.length];
}
function draw3(u,p){
 const v=smooth(.04,.58,u),mobile=W<700,compact=H<620;
 const size=Math.min(W*(mobile?.92:.77),1020),height=mobile?H*.16:H*.25;
 const cx=W*.51,cy=H*(compact?(mobile?.65:.58):(mobile?.70:.64)),hold=1+.012*Math.sin(u*5.4);
 const count=mobile?2600:N,baseAlpha=ctx.globalAlpha;
 // CRECER se construye sólo con partículas; el titular HTML conserva la frase accesible.
 for(let i=0;i<count;i++){
  const q=particles[i],word=wordPoint(i),angle=i*2.39996;
  const r=Math.sqrt((i+.5)/count),px=cx+Math.cos(angle)*r*W*.53,
        py=cy+Math.sin(angle)*r*H*.30;
  let x=lerp(px,cx+word.x*size*hold,v),y=lerp(py,cy+word.y*height*2*hold,v);
  if(pointer.energy>.01){
   const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),reach=mobile?68:112;
   const force=Math.pow(1-clamp(d/reach),2)*pointer.energy*(mobile?11:18);
   if(d>0){x+=dx/d*force;y+=dy/d*force}
  }
  const hue=i%19===0?'#5A9D72':i%13===0?p.coral:i%11===0?p.amber:p.olive;
  const r0=(mobile?1.15:1.45)+q.r*(mobile?1.2:1.65);
  ctx.globalAlpha=baseAlpha*(.34+(.66*v)*(q.r*.48+.5));ctx.fillStyle=hue;
  if(i%17===0){const s=r0*(i%51===0?3.2:2.25);ctx.fillRect(x-s/2,y-s/2,s,s*.82)}
  else{ctx.beginPath();ctx.arc(x,y,r0,0,Math.PI*2);ctx.fill()}
 }
 ctx.globalAlpha=baseAlpha;
 // Sin línea inferior: evita cruzar la descripción original en pantallas compactas.
 if(v>.82){
  const pulse=1+.025*Math.sin(u*8);
  strokeCircle(cx,cy,Math.min(W*.34,H*.18)*pulse,p.coral,1,.16);
 }
}
function drawPerspective(p,opacity){
 const horizon=H*.75,ink=p.petrol;
 for(let i=-12;i<=12;i++){
  const xx=W*.5+i*W*.075;
  line(W*.5,horizon-30,xx,H,ink,1,opacity*.35);
 }
 for(let j=1;j<=8;j++){
  let q=j/8,yy=horizon+Math.pow(q,1.7)*(H-horizon);
  line(W*.04,yy,W*.96,yy,ink,1,opacity*(.07+.14*q));
 }
}
function spherePoint(i,u,count){
 const y=1-2*(i+.5)/count,a=2*Math.PI*i/PHI;
 const r=Math.sqrt(1-y*y),theta=a+u*2.7;
 let x=Math.cos(theta)*r,z=Math.sin(theta)*r;
 const bend=.15*Math.sin(u*7+y*4);
 return {x:x+ bend,y:y+.08*Math.sin(theta*2+u*3),z};
}
function draw4(u,p){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.70:.64);
 const R=Math.min(W*(compact?.30:mobile?.34:.255),H*(compact?.22:.33));
 const v=smooth(0,.67,u),baseAlpha=ctx.globalAlpha;
 drawPerspective(p,v);
 const orbital=1+.045*Math.sin(u*6);
 strokeCircle(cx,cy,R*orbital*1.2,p.petrol,1,.24);
 const count=mobile?2100:N;let links=0;
 for(let i=0;i<count;i++){
  const q=particles[i],a=spherePoint(i,u,count),wp=wordPoint(i);
  const near=1+.11*a.z;
  const x3=cx+a.x*R*near,y3=cy-a.y*R*near;
  const x0=cx+wp.x*Math.min(W*.72,1050),y0=cy+wp.y*H*.42;
  let x=lerp(x0,x3,v),y=lerp(y0,y3,v);
  if(pointer.energy>.01){
   const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),reach=mobile?94:148;
   const force=Math.pow(1-clamp(d/reach),2)*pointer.energy;
   if(d>0){x+=dx*force*.17-dy*force*.10;y+=dy*force*.17+dx*force*.10}
   if(i%7===0&&d<reach&&links<24){
    line(pointer.x,pointer.y,x,y,p.cream,.65,.12*force);links++;
   }
  }
  const hue=i%17===0?'#5A9D72':i%13===0?p.coral:i%9===0?p.amber:p.olive;
  ctx.globalAlpha=baseAlpha*clamp(.30+.43*a.z+.3*v,.06,.98);
  const r=(.65+q.s*1.12)*(1+.5*a.z)*(pointer.energy>.01?1+pointer.energy*.08:1);
  ctx.fillStyle=hue;
  if(i%29===0){const s=r*(a.z>.1?3.8:2.4);ctx.fillRect(x-s/2,y-s/2,s,s*.85)}
  else{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
 }
 ctx.globalAlpha=baseAlpha;
 ctx.save();ctx.translate(cx,cy);ctx.scale(1,.39);
 strokeCircle(0,0,R*1.22,p.coral,1.3,.2*v);ctx.restore();
 if(pointer.energy>.01){
  const field=mobile?58:88;
  strokeCircle(pointer.x,pointer.y,field*(.8+pointer.energy*.28),p.amber,1.1,.38*pointer.energy);
  strokeCircle(pointer.x,pointer.y,field*1.35,p.cream,1,.15*pointer.energy);
 }
}
function drawChart(p,progress,opacity=1){
 const mobile=W<700,ink=night()?p.cream:p.ink;
 const x=W*(mobile?.29:.29),width=W*(mobile?.65:.65),base=H*.84,top=H*.49;
 line(x,base,x+width,base,ink,1,.36*opacity);
 line(x,top,x,base,ink,1,.24*opacity);
 for(let i=0;i<5;i++){
  const xx=x+width*(.12+i*.19);line(xx,base+13,xx,base+31,ink,1,.24*opacity);
 }
 const samples=100,limit=Math.floor(samples*progress);
 ctx.save();ctx.strokeStyle=p.petrol;ctx.lineWidth=mobile?2.1:3;
 ctx.globalAlpha*=opacity;ctx.beginPath();
 for(let i=0;i<=limit;i++){
  const q=i/samples,xx=x+width*q;
  const yy=H*((mobile?.72:.72)-(mobile?.18:.23)*q+(mobile?.04:.055)*Math.sin(q*12));
  if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
 }
 ctx.stroke();ctx.restore();
 // No hay indicador esférico: la curva y las piezas comunican el recorrido.
 // Conservamos su construcción sincronizada con el scroll.
}
function draw5(u,p){
 const mobile=W<700,fade=smooth(.12,.78,u);
 const routes=[
  {a:{x:W*.32,y:H*(mobile?.72:.67)},c:{x:W*.20,y:H*(mobile?.59:.55)},b:{x:W*.16,y:H*(mobile?.47:.43)},color:p.amber,delay:.02},
  {a:{x:W*.50,y:H*(mobile?.68:.57)},c:{x:W*.61,y:H*(mobile?.49:.39)},b:{x:W*.53,y:H*(mobile?.38:.25)},color:p.coral,delay:.18},
  {a:{x:W*.70,y:H*(mobile?.72:.66)},c:{x:W*.82,y:H*(mobile?.60:.57)},b:{x:W*.88,y:H*(mobile?.46:.40)},color:p.olive,delay:.34}
 ];
 // La base no se convierte en un gráfico: desde sus piezas nacen rutas distintas.
 line(W*.14,H*.84,W*.86,H*.84,p.cream,1,.24*fade);
 routes.forEach((route,index)=>{
  const progress=smooth(route.delay,Math.min(.98,route.delay+.55),u);
  const steps=64,limit=Math.max(1,Math.floor(steps*progress));
  ctx.save();ctx.strokeStyle=route.color;ctx.lineWidth=mobile?2.1:2.8;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha*=.88*fade;
  ctx.beginPath();
  for(let k=0;k<=limit;k++){
   const t=k/steps,v=1-t;
   const x=v*v*route.a.x+2*v*t*route.c.x+t*t*route.b.x;
   const y=v*v*route.a.y+2*v*t*route.c.y+t*t*route.b.y;
   if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.stroke();ctx.restore();
  // El puntero ilumina la trayectoria real, sin agregar etiquetas ni paneles.
  let nearest=Infinity;
  for(let k=0;k<=limit;k++){
   const t=k/steps,v=1-t;
   const x=v*v*route.a.x+2*v*t*route.c.x+t*t*route.b.x;
   const y=v*v*route.a.y+2*v*t*route.c.y+t*t*route.b.y;
   nearest=Math.min(nearest,Math.hypot(pointer.x-x,pointer.y-y));
  }
  const highlight=pointer.energy*Math.pow(1-clamp(nearest/(mobile?60:105)),2);
  if(highlight>.01){
   ctx.save();ctx.globalAlpha*=highlight*.75*fade;ctx.strokeStyle=p.cream;
   ctx.lineWidth=mobile?2.2:3.2;ctx.lineCap='round';ctx.beginPath();
   for(let k=0;k<=limit;k++){
    const t=k/steps,v=1-t;
    const x=v*v*route.a.x+2*v*t*route.c.x+t*t*route.b.x;
    const y=v*v*route.a.y+2*v*t*route.c.y+t*t*route.b.y;
    if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.stroke();ctx.restore();
   strokeCircle(route.b.x,route.b.y,(mobile?12:17)+6*highlight,route.color,1.4,.48*highlight*fade);
  }
  if(progress>.02){
   const t=clamp(progress),v=1-t;
   const mx=v*v*route.a.x+2*v*t*route.c.x+t*t*route.b.x;
   const my=v*v*route.a.y+2*v*t*route.c.y+t*t*route.b.y;
   const distance=Math.hypot(pointer.x-mx,pointer.y-my);
   const proximity=pointer.energy*(1-clamp(distance/(mobile?76:126)));
   const marker=(mobile?7:10)*(1+proximity*.8);
   ctx.save();ctx.translate(mx,my);ctx.rotate((index-1)*.12);
   rounded(-marker/2,-marker/2,marker,marker,2,route.color,.98*fade);ctx.restore();
   if(proximity>.02)strokeCircle(mx,my,marker*1.65,p.cream,1,.48*proximity*fade);
  }
  const reveal=smooth(.68,.96,progress);
  if(reveal>.01){
   const s=mobile?8:12;
   rounded(route.b.x-s*1.35,route.b.y-s*.45,s*1.7,s*.9,2,route.color,.92*reveal);
   rounded(route.b.x+s*.55,route.b.y-s*.45,s*.9,s*.9,2,p.olive,.82*reveal);
   circle(route.b.x,route.b.y,s*.25,p.cream,.9*reveal);
  }
 });
 // Las bifurcaciones quedan visibles mientras se lee: tres posibilidades que
 // nacen de una misma base, con las fichas viajando por cada recorrido.
}
function drawRibbon(p,u,index,total){
 const base=H*(.55+.15*index/total),a=smooth(.05,.42,u),fade=1-smooth(.55,.96,u);
 if(a*fade<=.001)return;
 const xSpan=W*1.15,phase=index*.19;
 const colors=[p.coral,p.clay,p.amber,p.petrol,p.olive];
 ctx.save();ctx.globalAlpha*=a*fade*(.16+.25*(index/total));
 ctx.lineWidth=1.1+(index%4)*.46;ctx.strokeStyle=colors[index%colors.length];
 ctx.beginPath();
 for(let j=0;j<=130;j++){
  const q=j/130,x=-W*.075+xSpan*q;
  const amp=H*(.035+.022*Math.sin(index*.45));
  const y=base+amp*Math.sin(q*9.4+u*7.4+phase)+H*.06*Math.cos(q*4+phase);
  if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }
 ctx.stroke();ctx.restore();
}
function draw6(u,p){
 // La curva y la esfera alcanzan su máximo juntas y permanecen visibles
 // mientras el usuario lee «Cada pieza encuentra su lugar».
 drawChart(p,smooth(.02,.72,u),1);
}
function draw7(u,p){
 for(let i=0;i<34;i++)drawRibbon(p,u,i,34);
 const settle=smooth(.10,.42,u),travel=smooth(.34,.90,u)*.45,cx=W*.5;
 const cy=lerp(H*.57,H*1.08,travel);
 const pulse=seedPulse.value;
 const size=Math.min(W,H)*(W<700?.077:.062)*settle*(1+.045*pulse);
 if(size>1){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.045+travel*.085+pulse*.025);
  rounded(-size*.5,-size*.5,size,size,Math.min(4,size*.12),p.coral,settle);
  strokeCircle(0,0,size*.76,p.coral,1.1,.16*settle*(1-pulse));
  ctx.restore();
  // La semilla desciende con el scroll y cruza el borde inferior para entregar
  // el movimiento al contenido real, en lugar de quedarse como un adorno fijo.
  line(cx,Math.max(0,cy-size*1.7),cx,Math.max(0,cy-size*.7),p.coral,1,.32*settle*(1-travel*.55));
 }
}
function syncSeedPulse(){
 const active=play.t>=7&&play.t<8&&!prefersReduced.matches;
 if(active&&!seedPulseTween){
  seedPulseTween=gsap.to(seedPulse,{value:1,duration:1.55,repeat:-1,yoyo:true,
   ease:'sine.inOut',onUpdate:render});
 }else if(!active&&seedPulseTween){
  seedPulseTween.kill();seedPulseTween=null;seedPulse.value=0;
 }
}
function drawScene(i,u,p){
 if(i===0)draw0(u,p);
 if(i===1)draw1(u,p);
 if(i===2)draw2(u,p);
 if(i===3)draw3(u,p);
 if(i===4)draw4(u,p);
 if(i===5)draw5(u,p);
 if(i===6)draw6(u,p);
 if(i===7)draw7(u,p);
}
function drawPointerEffects(p,scene){
 const color=scene===4?p.amber:p.coral;
 ripples.forEach(wave=>strokeCircle(wave.x,wave.y,wave.r,color,scene===4?1.35:1.1,wave.alpha));
 if(pointer.energy>.015){
  const halo=scene===4?18:12;
  circle(pointer.x,pointer.y,2.2,color,.42*pointer.energy);
  strokeCircle(pointer.x,pointer.y,halo+pointer.energy*8,color,1,.30*pointer.energy);
 }
}
function resize(){
 const box=canvas.getBoundingClientRect();
 W=Math.max(1,box.width);H=Math.max(1,box.height);
 DPR=Math.min(1.65,window.devicePixelRatio||1);
 canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
 ctx.setTransform(DPR,0,0,DPR,0,0);
 render();
}
function render(){
 if(!W||!H)return;
 const p=PAL[night()?'night':'day'];
 const t=clamp(play.t,0,7.9999),i=Math.min(7,Math.floor(t)),raw=t-i;
 // Cada tramo termina exactamente donde comienza el siguiente: las mismas piezas
 // viajan entre posiciones compartidas, en lugar de aparecer como dibujos distintos.
 // Cada capítulo alcanza su composición máxima antes del final del tramo
 // y conserva una pausa visual para leer e interactuar sin que se desarme.
 const u=smooth(.015,.72,raw);
 const dissolve=i<7?smooth(.88,.995,raw):0;
 ctx.setTransform(DPR,0,0,DPR,0,0);
 ctx.fillStyle=i<7?mix(p.bg[i],p.bg[i+1],dissolve):p.bg[7];
 ctx.fillRect(0,0,W,H);
 // La primera escena comienza mezclada y el propio scroll lleva las piezas
 // hasta su composición ordenada; no hay una animación automática que la adelante.
 drawModuleTransition(i,u,p);
 drawScene(i,u,p);
 drawPointerEffects(p,i);
}
function syncTheme(){themeButton.textContent=night()?'Modo día':'Modo noche';render()}
themeButton.addEventListener('click',()=>{siteTheme?.click();syncTheme()});
document.addEventListener('click',e=>{if(e.target.closest('[data-theme-toggle]'))requestAnimationFrame(syncTheme)});
window.addEventListener('storage',syncTheme);
const themes=new MutationObserver(syncTheme);
themes.observe(document.documentElement,{attributes:true,attributeFilter:['data-jm-theme']});
syncTheme();
function navStatus(){
 const active=destination.getBoundingClientRect().top<=innerHeight*.92;
 document.body.classList.toggle('intro-in-content',active);
 header.inert=!active;header.setAttribute('aria-hidden',String(!active));
}
function skipJourney(e){
 e.preventDefault();destination.scrollIntoView({block:'start',behavior:'instant'});
 destination.focus({preventScroll:true});ScrollTrigger.update();navStatus();
}
skip.addEventListener('click',skipJourney);
function activeCopyForScene(scene){
 if(scene<=0)return 0;
 if(scene===1)return 1;
 if(scene===2)return 2;
 if(scene===3)return 3;
 if(scene<=5)return 4;
 if(scene===6)return 5;
 return 6;
}
let activeCopyIndex=-1;
function syncSceneState(){
 const scene=Math.min(7,Math.floor(play.t)),active=activeCopyForScene(scene);
 root.dataset.scene=String(scene);
 if(active!==activeCopyIndex){
  copies.forEach((c,i)=>{c.inert=i!==active;c.setAttribute('aria-hidden',String(i!==active))});
  activeCopyIndex=active;
 }
}
function setup(){
 master?.kill();trigger?.kill();seedPulseTween?.kill();seedPulseTween=null;seedPulse.value=0;
 introTween?.kill();introTween=null;introReveal.value=prefersReduced.matches?1:0;
 hoverTween?.kill();hoverTween=null;hoveredModule=-1;hoverState.value=0;
 pointerTween?.kill();pointerFade?.kill();pointer.energy=0;pointer.active=false;pointer.down=false;
 ripples.forEach(wave=>gsap.killTweensOf(wave));ripples.length=0;activeCopyIndex=-1;
 const compact=matchMedia('(max-height:620px)').matches,reduce=prefersReduced.matches,simple=reduce;
 root.classList.toggle('is-compact',compact);root.classList.toggle('is-mobile',mqMobile.matches);
 root.classList.toggle('is-static',simple);root.classList.toggle('is-linked',!simple);
 document.body.classList.add('intro-ready');
 buildWord();
 if(simple){
  root.dataset.scene='0';
  root.classList.add('all-copies');
  introReveal.value=1;
  play.t=0;
  copies.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden');gsap.set(c,{clearProps:'all'})});
  document.body.classList.add('intro-in-content');
  header.inert=false;header.removeAttribute('aria-hidden');
  resize();return;
 }
 root.classList.remove('all-copies');
 master=gsap.timeline({paused:true,onUpdate:()=>{
  if(play.t>=1&&hoveredModule>=0)setHoveredModule(-1);
  render();syncSeedPulse();syncSceneState();
 }});
 play.t=0;
 // El ritmo reserva tiempo para que cada transformación se complete y pueda leerse.
 const sceneLengths=[1.48,1.46,1.36,1.42,1.54,1.52,1.24,1.38];
 const sceneStarts=[0];
 sceneLengths.forEach((length,i)=>{
  master.to(play,{t:i+1,duration:length,ease:'none'},sceneStarts[i]);
  master.addLabel('chapter-'+i,sceneStarts[i]+length*.5);
  sceneStarts.push(sceneStarts[i]+length);
 });
 master.addLabel('finish',sceneStarts[8]+.02);
 const copyStarts=[0,1,2,3,4,6,7];
 copies.forEach((copy,i)=>{
  const fragments=copy.querySelectorAll('.study-mask>span'),desc=copy.querySelector('.study-description');
  const rule=copy.querySelector('.study-rule'),begin=sceneStarts[copyStarts[i]]-(i>0?.12:0);
  const endScene=i===4?6:copyStarts[i+1],fromX=i===1?24:i===3?-20:0;
  gsap.set(copy,{autoAlpha:i===0?1:0});
  gsap.set(fragments,{yPercent:105,xPercent:i===0?0:fromX});
  gsap.set(rule,{scaleX:0,transformOrigin:'left center'});
  if(desc)gsap.set(desc,{opacity:0,y:18});
  if(i===0){
   master.to(fragments,{yPercent:0,duration:.48,stagger:.15,ease:'power3.out'},.04);
   master.to(rule,{scaleX:1,duration:.36,ease:'sine.out'},.55);
   if(desc)master.to(desc,{opacity:1,y:0,duration:.42,ease:'power2.out'},.68);
  }else{
   master.to(copy,{autoAlpha:1,duration:.16},begin+.01);
   master.to(fragments,{yPercent:0,xPercent:0,duration:.48,stagger:.15,ease:'power3.out'},begin+.04);
   master.to(rule,{scaleX:1,duration:.36,ease:'sine.out'},begin+.57);
   if(desc)master.to(desc,{opacity:1,y:0,duration:.42,ease:'power2.out'},begin+.70);
  }
  if(i<6)master.to(copy,{autoAlpha:0,duration:.18},sceneStarts[endScene]-.18);
 });
 master.to({},{duration:.02},sceneStarts[8]+.02);
 trigger=ScrollTrigger.create({id:'jmorgado-journey',trigger:root,start:'top top',end:'bottom bottom',
  animation:master,scrub:.72,anticipatePin:1,invalidateOnRefresh:true,
  onUpdate:()=>{syncSceneState();navStatus()}});
 master.progress(trigger.progress);
 syncSceneState();
 resize();navStatus();
 introTween=gsap.to(introReveal,{value:1,duration:1.18,ease:'power2.out',onUpdate:render});
}
let resizeTick=0;
window.addEventListener('resize',()=>{
 cancelAnimationFrame(resizeTick);resizeTick=requestAnimationFrame(()=>{resize();ScrollTrigger.refresh()});
});
prefersReduced.addEventListener('change',setup);
mqMobile.addEventListener('change',setup);
document.fonts.ready.then(()=>{buildWord();resize();ScrollTrigger.refresh()});
setup();
window.addEventListener('scroll',navStatus,{passive:true});
})();
