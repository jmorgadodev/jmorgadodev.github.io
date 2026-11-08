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
const hoverState={value:0},seedPulse={value:0},introReveal={value:1},sceneAmbient={value:0};
let seedPulseTween=null,introTween=null,introTextTween=null,sceneAmbientTween=null,sceneAmbientTimer=0;
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
 day:{bg:['#F0EDE6','#F0EDE6','#F45A3A','#FCFAF5','#102E38','#E2E3DF','#FCFAF5','#102E38'],
 ink:'#222327',cream:'#FCFAF5',petrol:'#23494E',coral:'#F45A3A',amber:'#E8B769',olive:'#737B69',stone:'#C9C8B7',ash:'#A5A18D',clay:'#D99B89'},
 night:{bg:['#111B20','#111B20','#F45A3A','#19282E','#0B141C','#0B1822','#1A282C','#0B141C'],
 ink:'#F3F0E8',cream:'#F3F0E8',petrol:'#477982',coral:'#FF785C',amber:'#EEC47D',olive:'#ADB29C',stone:'#818578',ash:'#B5B19F',clay:'#DDA294'}
};
const rgb=h=>h.startsWith('rgb')?h.match(/[\d.]+/g).slice(0,3).map(Number):[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,u)=>{const A=rgb(a),B=rgb(b);return 'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],u))).join(',')+')'};
const rgba=(color,alpha)=>'rgba('+rgb(color).map(Math.round).join(',')+','+alpha+')';
function contrastFor(background){
 const channels=background.startsWith('rgb')?background.match(/\d+/g).slice(0,3).map(Number):rgb(background);
 const linear=channels.map(v=>{const c=v/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)});
 const luminance=.2126*linear[0]+.7152*linear[1]+.0722*linear[2];
 return luminance>.19?'#222327':'#F3F0E8';
}
const night=()=>document.documentElement.dataset.jmTheme==='night';
function line(x1,y1,x2,y2,color,width=1,opacity=1){
 ctx.save();ctx.globalAlpha*=opacity;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
 ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();ctx.restore();
}
function rounded(x,y,w,h,r,color,alpha=1){
 ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=color;ctx.beginPath();
 ctx.roundRect(x,y,w,h,Math.min(Math.max(0,r),w/2,h/2));ctx.fill();ctx.restore();
}
function drawBeveledBlock(x,y,w,h,r,color,p,ambient=0){
 const depth=Math.max(.8,Math.min(Math.min(w,h)*.18,W<700?2.5:4.8));
 const dx=depth*.72,dy=depth*.92,x0=-w/2,x1=w/2,y0=-h/2,y1=h/2;
 const radius=Math.min(Math.max(0,r),w/2,h/2);
 ctx.save();ctx.translate(x,y);
 ctx.shadowColor=night()?'rgba(0,0,0,.34)':'rgba(24,39,38,.22)';
 ctx.shadowBlur=depth*(1.15+ambient*.55);ctx.shadowOffsetX=dx*.38;ctx.shadowOffsetY=dy*.78;
 // La cara inferior y el lateral derecho construyen una extrusión corta, no un cubo.
 ctx.beginPath();ctx.moveTo(x0+radius,y1-radius*.12);ctx.lineTo(x1-radius,y1-radius*.12);
 ctx.lineTo(x1-radius+dx,y1+dy);ctx.lineTo(x0+radius+dx,y1+dy);ctx.closePath();
 ctx.fillStyle=mix(color,p.bg[0],.38);ctx.fill();
 ctx.beginPath();ctx.moveTo(x1-radius*.10,y0+radius);ctx.lineTo(x1-radius*.10,y1-radius);
 ctx.lineTo(x1+dx,y1-radius+dy);ctx.lineTo(x1+dx,y0+radius+dy);ctx.closePath();
 ctx.fillStyle=mix(color,p.bg[0],.48);ctx.fill();
 const face=ctx.createLinearGradient(x0,y0,x1,y1);
 face.addColorStop(0,mix(color,p.cream,.19+ambient*.09));
 face.addColorStop(.56,color);
 face.addColorStop(1,mix(color,p.bg[0],.16));
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
 ctx.beginPath();ctx.roundRect(x0,y0,w,h,radius);ctx.fillStyle=face;ctx.fill();
 ctx.lineWidth=.65;ctx.strokeStyle=mix(color,p.cream,.42);ctx.stroke();
 ctx.globalAlpha*=.28+ambient*.24;ctx.beginPath();
 ctx.moveTo(x0+radius,y0+.7);ctx.lineTo(x1-radius,y0+.7);
 ctx.strokeStyle=p.cream;ctx.lineWidth=.75;ctx.stroke();
 ctx.restore();
}
function drawSceneAtmosphere(scene,p){
 const value=sceneAmbient.value;
 if(value<=.002||scene===4)return;
 const centers=[.46,.50,.50,.50,.50,.50,.50,.52],ys=[.66,.54,.64,.60,.62,.67,.62,.60];
 const x=W*(centers[scene]||.5)+((pointer.active?pointer.x-W*.5:0)*.018*pointer.energy);
 const y=H*(ys[scene]||.62),radius=Math.max(W,H)*.62;
 const tint=scene===0||scene===1?p.amber:scene===2?p.cream:scene===5?p.coral:scene===6?p.amber:p.petrol;
 const glow=ctx.createRadialGradient(x,y,0,x,y,radius);
 glow.addColorStop(0,rgba(tint,night()?.12:.085));
 glow.addColorStop(.42,rgba(tint,night()?.045:.026));
 glow.addColorStop(1,rgba(tint,0));
 ctx.save();ctx.globalAlpha*=value*.72;ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.restore();
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
function sceneDisorderColor(i,p){
 const colors=modulePalette(p),batch=Math.floor(i/colors.length),slot=i%colors.length;
 // Cada bloque de ocho piezas contiene toda la paleta, pero en un orden distinto.
 // Así las columnas dejan de leerse por color sin perder el equilibrio cromático.
 const shift=Math.floor(hash(batch*19+7)*colors.length),stride=batch%2?3:5;
 return colors[(slot*stride+shift)%colors.length];
}
function barAspect(){return W<700?2.1:3.55}
/* Lenguaje de encaje compartido: mismo módulo, mismo destino, giro reversible.
   Cada gesto vale exactamente cero en ambos extremos del recorrido y nunca
   altera la geometría ni las duraciones fijadas en la línea de tiempo. */
function fitGesture(scene,i,progress,scale=.95){
 if(prefersReduced.matches)return {turn:0,tilt:0,compression:1,lift:0};
 const t=clamp(progress),pulse=Math.sin(Math.PI*t);
 const recovery=Math.sin(Math.PI*smooth(.63,1,t))*smooth(.63,.78,t);
 const sign=hash(i*19+43)>.5?1:-1;
 const strength=[.27,.21,.35,.16,.115,.51,.38,.18][scene]||.18;
 const variation=.78+.42*hash(i*23+27);
 const wave=pulse*(.82+.18*Math.sin(t*Math.PI*1.6));
 return {
  turn:sign*strength*variation*(wave-.28*recovery),
  tilt:sign*(.12+.055*hash(i*11+31))*pulse,
  compression:1-.055*pulse+.025*recovery,
  lift:Math.min(W<700?3.2:6.5,scale*.42+2)*pulse*(.75+.35*hash(i+7))
 };
}
function orientGesture(pose){
 if(!pose||prefersReduced.matches)return;
 ctx.rotate(pose.turn);
 const bend=pose.tilt;
 ctx.transform(1-Math.abs(bend)*.42,bend*.27,bend,1-Math.abs(bend)*.21,0,0);
}
function combinedGesture(scene,i,first,second,firstWeight=.6,size=12){
 const a=fitGesture(scene,i,first,size),b=fitGesture(scene,i,second,size);
 return {turn:a.turn*firstWeight+b.turn,tilt:a.tilt*firstWeight+b.tilt,
  compression:1+(a.compression-1)*firstWeight+(b.compression-1),
  lift:a.lift*firstWeight+b.lift};
}
function drawModule(i,x,y,size,p,opacity=1,rotation=0,aspect=1,colorOverride=null,depthEnabled=true,pose=null){
 const color=colorOverride||modulePalette(p)[moduleMeta(i).column];
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);orientGesture(pose);ctx.globalAlpha*=clamp(opacity);
 // En las escenas de apilado, las formas se convierten gradualmente en barras.
 // La extrusión se mantiene corta para dar volumen sin convertir cada pieza en un cubo.
 const blockMix=smooth(1.02,barAspect(),aspect);
 if(blockMix>.001){
  const bw=size*aspect*(.98+.04*hash(i*4+16));
  const bh=size*(.94+.08*hash(i*4+18));
  if(depthEnabled){
   ctx.save();ctx.globalAlpha*=blockMix;
   drawBeveledBlock(0,0,bw,bh,Math.min(3.5,size*.13),color,p,sceneAmbient.value*blockMix);
   ctx.restore();
  }else rounded(-bw/2,-bh/2,bw,bh,Math.min(3.5,size*.13),color,blockMix);
 }
 if(blockMix<.999){
  ctx.save();ctx.globalAlpha*=1-blockMix;
  const width=size*(.76+.72*hash(i*4+16)),height=size*(.68+.54*hash(i*4+18));
  const form=i%13;
  if(depthEnabled){
   ctx.shadowColor=night()?'rgba(0,0,0,.28)':'rgba(24,39,38,.17)';
   ctx.shadowBlur=Math.max(.7,size*.16);ctx.shadowOffsetX=size*.035;ctx.shadowOffsetY=size*.075;
  }
  const face=ctx.createLinearGradient(-width/2,-height/2,width/2,height/2);
  face.addColorStop(0,depthEnabled?mix(color,p.cream,.16):color);
  face.addColorStop(.62,color);
  face.addColorStop(1,depthEnabled?mix(color,p.bg[0],.14):color);
  if(form===0||form===9){
   ctx.lineWidth=1.35;ctx.strokeStyle=depthEnabled?mix(color,p.cream,.20):color;
   ctx.strokeRect(-width/2,-height/2,width,height);
   if(depthEnabled&&size>7){
    ctx.globalAlpha*=.30+sceneAmbient.value*.18;ctx.strokeStyle=p.cream;ctx.lineWidth=.65;
    ctx.beginPath();ctx.moveTo(-width*.38,-height*.34);ctx.lineTo(width*.38,-height*.34);ctx.stroke();
   }
  }else if(form===4||form===11){
   const sphere=ctx.createRadialGradient(-width*.16,-height*.18,0,0,0,width*.48);
   sphere.addColorStop(0,depthEnabled?mix(color,p.cream,.32):color);
   sphere.addColorStop(.58,color);sphere.addColorStop(1,depthEnabled?mix(color,p.bg[0],.20):color);
   ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(0,0,width*.39,0,Math.PI*2);ctx.fill();
  }else if(form===7){
   ctx.fillStyle=face;ctx.beginPath();
   ctx.moveTo(-width/2,-height/2);ctx.lineTo(width/2,-height/2);
   ctx.lineTo(width/2,height*.16);ctx.lineTo(width*.15,height*.16);
   ctx.lineTo(width*.15,height/2);ctx.lineTo(-width/2,height/2);ctx.closePath();ctx.fill();
  }else{
   ctx.fillStyle=face;ctx.beginPath();
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
 // Las ocho columnas comparten el centro geométrico del lienzo en ambas
 // composiciones; así la gráfica final no queda desplazada hacia la derecha.
 const cellW=W*(chart?(mobile?.055:.058):(mobile?.075:.071));
 const gapX=W*(chart?(mobile?.009:.012):(mobile?.010:.014));
 const total=8*cellW+7*gapX;
 const left=(W-total)/2;
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
// Primera impresión: tres concentraciones de piezas reconocibles, aún
// sin conectar. El scroll las reorganiza en el mismo stackPoint con el que
// comienza el siguiente capítulo (no se altera la continuidad entre escenas).
function openingPoint(i){
 const group=i%3,local=Math.floor(i/3),col=local%4,row=Math.floor(local/4);
 const dx=W*(W<700?.026:.027),dy=H*(W<700?.033:.039);
 let x,y;
 if(group===0){
  // Fragmentos que ya comparten cierta estructura.
  x=W*.23+(col-1.5)*dx-(row%2)*dx*.14;
  y=H*.63+(row-2)*dy;
 }else if(group===1){
  // Piezas alrededor de una posibilidad todavía sin forma definida.
  const angle=local*2.399963,spread=Math.sqrt((local+.5)/19);
  x=W*.5+Math.cos(angle)*dx*2.3*spread;
  y=H*.61+Math.sin(angle)*dy*2.25*spread;
 }else{
  // Secuencia desplazada: el tercer conjunto aún no está alineado.
  x=W*.77+(col-1.5)*dx+row*dx*.16;
  y=H*.63+(row-2)*dy+(col-1.5)*dy*.27;
 }
 return {x:x+(hash(i*3+9)-.5)*dx*.12,
  y:y+(hash(i*5+4)-.5)*dy*.11,
  size:W<700?9:17,rotation:(hash(i+33)-.5)*.10};
}
function groupedModulePoint(i){
 // Tres conjuntos visibles, con una retícula modular clara y espacio entre ellos.
 // La composición se lee como piezas relacionadas, no como una nube de partículas.
 const group=i%3,local=Math.floor(i/3),col=local%3,row=Math.floor(local/3);
 const gapX=W*(W<700?.026:.032),gapY=H*(W<700?.027:.035);
 return {x:W*(.25+group*.25)+(col-1)*gapX,
  y:H*(W<700?.625:.667)+(group===1?-.018:.018)*H+(row-3)*gapY,
  size:W<700?9:18,rotation:(hash(i+15)-.5)*.035};
}
function wordModulePoint(i){
 const q=wordPoint(i),size=Math.min(W*(W<700?.92:.84),1120);
 return {x:W*.5+q.x*size,y:H*(H<620?(W<700?.65:.58):(W<700?.70:.565))+q.y*H*(W<700?.32:.55),
  size:W<700?6:11,rotation:0};
}
function sphereModulePoint(i){
 const a=spherePoint(i,.42,MODULE_COUNT),r=Math.min(W*(W<700?.37:.255),H*.34);
 return {x:W*.5+a.x*r*(1+.1*a.z),y:H*(W<700?.64:.62)-a.y*r,
  size:W<700?7:13,rotation:(hash(i+23)-.5)*.12};
}
function platformModulePoint(i){return expansionPoint(i)}
function chartPoint(i){return stackPoint(i,true)}
function scene5Geometry(){
 const mobile=W<700,compact=H<620,compactMobile=mobile&&compact;
 const positions=compactMobile?[
  {cx:.20,cy:.66},{cx:.50,cy:.49},{cx:.80,cy:.66},{cx:.50,cy:.86}
 ]:mobile?[
  {cx:.20,cy:.70},{cx:.50,cy:.49},{cx:.80,cy:.70},{cx:.50,cy:.88}
 ]:compact?[
  {cx:.22,cy:.65},{cx:.50,cy:.52},{cx:.78,cy:.65},{cx:.50,cy:.83}
 ]:[
  {cx:.22,cy:.61},{cx:.50,cy:.43},{cx:.78,cy:.61},{cx:.50,cy:.82}
 ];
 return positions.map((q,i)=>({
  ...q,
  rx:i===3?(mobile?.12:.135):(mobile?.105:.118),
  ry:i===3?(mobile?.058:.076):(mobile?.056:.074)
 }));
}
function scene5GridPoint(group,slot){
 const mobile=W<700,g=scene5Geometry()[clamp(group,0,3)];
 const col=slot%4,row=Math.floor(slot/4);
 const size=mobile?Math.max(7,Math.min(W*.027,H*.036)):Math.max(10,Math.min(W*.020,H*.026));
 const dx=size*(mobile?1.25:1.42),dy=size*.68;
 return {x:W*g.cx+(col-row)*dx,y:H*g.cy+(col+row-3)*dy,
  size,rotation:0,group,slot};
}
function expansionPoint(i){return scene5GridPoint(Math.floor(i/14),i%14)}
function ribbonCurvePoint(q){
 // Una sola curva gobierna el trazo y la posición final de cada módulo.
 // Así la línea no es una decoración paralela: es el eje que las piezas construyen.
 q=clamp(q);
 return {x:W*(.16+.68*q),
  y:H*(.63+.075*Math.sin(q*9.4+1.3)+.045*Math.cos(q*4.1))};
}
function ribbonPoint(i){
 const q=i/(MODULE_COUNT-1);
 return {...ribbonCurvePoint(q),
  size:W<700?5:10,rotation:(hash(i+4)-.5)*.2};
}
function centerPoint(i){
 return {x:W*.5+(hash(i+10)-.5)*2,y:H*.66+(hash(i+20)-.5)*2,
  size:W<700?2:3,rotation:0};
}
const MODULE_LAYOUTS=[stackPoint,scatteredPoint,groupedModulePoint,cloudPoint,
 wordModulePoint,sphereModulePoint,platformModulePoint,chartPoint,ribbonPoint,centerPoint];
function drawModuleTransition(scene,u,p){
 for(let i=0;i<MODULE_COUNT;i++){
  let x,y,size,rotation,aspect,opacity=1,sceneProgress=0,pose=null;
  // La mezcla cromática se mantiene durante el desorden inicial. Al desplegarse
  // la base, cada pieza recupera gradualmente el color de su grupo definitivo.
  const disorderColor=sceneDisorderColor(i,p);
  const organizedColor=modulePalette(p)[moduleMeta(i).column];
  const colorOverride=scene<=4?disorderColor:
   scene===5?mix(disorderColor,organizedColor,smooth(.14,.88,u)):
   scene===6?mix(scene5TileColor(Math.floor(i/14),i%14,p),organizedColor,smooth(.12,.88,u)):null;
  if(scene===0){
   const a=openingPoint(i),b=stackPoint(i,false),meta=moduleMeta(i);
   // Cada columna se resuelve en secuencia; no mover los 56 módulos a la vez.
   const delay=meta.column*.07+meta.row*.006+hash(i*7+9)*.018;
   const amount=smooth(delay,Math.min(.91,delay+.34),u);
   const reveal=smooth(hash(i*13+71)*.16,.74+hash(i*17+23)*.18,introReveal.value);
   const targetX=lerp(a.x,b.x,amount),targetY=lerp(a.y,b.y,amount);
   const originX=W*.5+(a.x-W*.5)*.12,originY=H*.60+(a.y-H*.60)*.12;
   x=lerp(originX,targetX,reveal);y=lerp(originY,targetY,reveal);
   size=lerp(a.size||b.size,b.size,amount);
   rotation=lerp(a.rotation||0,0,amount);
   // Primero se trasladan; al llegar adoptan gradualmente su forma de barra.
   aspect=lerp(1,barAspect(),smooth(.62,1,amount));
   opacity=reveal;
   pose=fitGesture(scene,i,amount,size);
  }else if(scene===1){
   const start=stackPoint(i,false),loose=scatteredPoint(i),target=groupedModulePoint(i);
   if(i%3===1){
    // Un conjunto central encuentra su forma primero y permanece legible
    // mientras las demás piezas se separan y vuelven a organizarse.
    const amount=smooth(.015,.60,u);
    x=lerp(start.x,target.x,amount);y=lerp(start.y,target.y,amount);
    size=lerp(start.size,target.size,amount);
    rotation=lerp(0,target.rotation||0,amount);
    aspect=lerp(barAspect(),1,amount);
     pose=fitGesture(scene,i,amount,size);
   }else{
    const scatter=smooth(.005,.23,u),regroup=smooth(.26,.90,u);
    const looseX=lerp(start.x,loose.x,scatter),looseY=lerp(start.y,loose.y,scatter);
    x=lerp(looseX,target.x,regroup);y=lerp(looseY,target.y,regroup);
    size=lerp(start.size,target.size,scatter);
    rotation=lerp(0,loose.rotation||0,scatter)*(1-regroup);
    aspect=lerp(barAspect(),1,scatter);
     pose=combinedGesture(scene,i,scatter,regroup,.54,size);
   }
  }else if(scene===2){
   const a=groupedModulePoint(i),b=cloudPoint(i);
   const cx=W*.5,cy=H*(H<620?.75:(W<700?.66:.64));
   const group=i%3,angle=hash(i*13+41)*Math.PI*2;
   const cluster=(W<700?11:20)*(.42+hash(i*17+5)*.68);
   const centerX=cx+Math.cos(angle)*cluster;
   const centerY=cy+Math.sin(angle)*cluster*.72;
   // Los tres conjuntos se recogen en una semilla común antes de abrirse.
   // La llegada y la salida escalonadas convierten la nube en consecuencia del núcleo.
   const inwardDelay=(group===1?0:group===0?.025:.05)+hash(i*5+29)*.03;
   const converge=smooth(inwardDelay,.22+inwardDelay,u);
   const launchDelay=(group===1?0:group===0?.025:.05)+hash(i*7+53)*.09;
   const explode=smooth(.34+launchDelay,.80+launchDelay,u);
   const pulledX=lerp(a.x,centerX,converge);
   const pulledY=lerp(a.y,centerY,converge);
   x=lerp(pulledX,b.x,explode);
   y=lerp(pulledY,b.y,explode);
   const compressedSize=lerp(a.size||12,(a.size||12)*.72,converge);
   size=lerp(compressedSize,b.size||12,explode);
   const compressedRotation=lerp(a.rotation||0,angle*.16,converge);
   rotation=lerp(compressedRotation,b.rotation||0,explode);
   opacity=lerp(1,.58,converge);
   opacity=lerp(opacity,1,explode);
    pose=combinedGesture(scene,i,converge,explode,.75,size);
   aspect=1;
  }else if(scene===5){
   const a=sphereModulePoint(i),expanded=expansionPoint(i),target=expanded;
   const group=Math.floor(i/14),routes=[
    {c1:{x:W*.43,y:H*.76},c2:{x:W*.34,y:H*.69}},
    {c1:{x:W*.50,y:H*.74},c2:{x:W*.50,y:H*.56}},
    {c1:{x:W*.57,y:H*.76},c2:{x:W*.66,y:H*.69}},
    {c1:{x:W*.50,y:H*.70},c2:{x:W*.50,y:H*.78}}
   ],route=routes[group];
   // Cada pieza sale de la esfera, pasa por el nodo de la base y sigue
   // una ruta propia hasta encajar en la retícula de su plataforma.
   const delay=group*.025+hash(i*7+61)*.075;
   const travel=smooth(.04+delay,.68+delay,u),v=1-travel;
   const pathX=v*v*v*a.x+3*v*v*travel*route.c1.x+
    3*v*travel*travel*route.c2.x+travel*travel*travel*expanded.x;
   const pathY=v*v*v*a.y+3*v*v*travel*route.c1.y+
    3*v*travel*travel*route.c2.y+travel*travel*travel*expanded.y;
   // Las fichas empiezan a abandonar las plataformas mientras las rutas aun estan visibles.
    // Los grupos se incorporan de forma escalonada, no todos al ultimo instante.
    const settle=smooth(.22+group*.035+hash(i*7+61)*.015,.64+group*.035,u);
   x=lerp(pathX,target.x,settle);y=lerp(pathY,target.y,settle);
   size=lerp(lerp(a.size||12,expanded.size||12,travel),target.size||12,settle);
   rotation=lerp(lerp(a.rotation||0,0,travel),target.rotation||0,settle);
   aspect=lerp(1,barAspect(),settle);
    pose=combinedGesture(scene,i,travel,settle,.32,size);
    size*=pose.compression;y-=pose.lift;
   const tileReveal=smooth(.06,.25,u);
   drawModule(i,x,y,size,p,1-tileReveal,rotation,aspect,colorOverride,true,pose);
   drawScene5Tile(i,x,y,size,p,tileReveal,group,pose);
   continue;
  }else{
   const a=MODULE_LAYOUTS[scene](i),b=MODULE_LAYOUTS[scene+1](i);
   let delay=scene===6?Math.floor(i/14)*.12+hash(i*31+9)*.025:hash(i+scene*31)*.055;
   // La siguiente transformación arranca al entrar en escena; evitamos una pausa con las barras inmóviles.
    // El cambio comienza pronto, pero se extiende para que las piezas se lean acomodándose.
    const amount=smooth(delay,.985,u);
   if(scene===6)sceneProgress=amount;
   x=lerp(a.x,b.x,amount);y=lerp(a.y,b.y,amount);
   size=lerp(a.size||12,b.size||12,amount);
   if(scene===6){
    // Un pequeño asentamiento hace que cada módulo parezca encajar en la curva.
    const dock=Math.sin(Math.PI*smooth(.78,.985,amount))*.035;
    size*=1+dock;
   }
   rotation=lerp(a.rotation||0,b.rotation||0,amount);
   const aspectFrom=scene===7?barAspect():1;
   const aspectTo=scene===6||scene+1===7?barAspect():1;
   aspect=lerp(aspectFrom,aspectTo,amount);
   opacity=scene===7?1-smooth(.22,.94,amount):1;
    pose=fitGesture(scene,i,amount,size);
  }
  if(pose){size*=pose.compression;y-=pose.lift}
   if(scene===6)opacity=sceneProgress;
  if(pointer.energy>.01&&(scene===0||scene===2)){
   const dx=pointer.x-x,dy=pointer.y-y,d=Math.hypot(dx,dy),radius=Math.min(W*.34,190);
   const influence=Math.pow(1-clamp(d/radius),2)*pointer.energy;
   x+=dx*influence*.17;y+=dy*influence*.17;
   size*=1+influence*.24;
  }
  if(scene===6){
   // La ficha isométrica se retira debajo de la barra nueva, no por encima de ella.
   const tileFade=1-sceneProgress;
   drawScene5Tile(i,x,y,size,p,tileFade,Math.floor(i/14),pose);
  }
  if(scene===0&&i===hoveredModule){
   size*=1+.13*hoverState.value;
   drawModule(i,x,y-5*hoverState.value,size*1.08,p,opacity,rotation,aspect,colorOverride,scene!==4,pose);
  }else drawModule(i,x,y,size*1.08,p,opacity,rotation,aspect,colorOverride,scene!==4,pose);
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
  const start=openingPoint(i),target=stackPoint(i,false),meta=moduleMeta(i);
  const delay=meta.column*.07+meta.row*.006+hash(i*7+9)*.018;
  const amount=smooth(delay,Math.min(.91,delay+.34),progress);
  const reveal=smooth(hash(i*13+71)*.16,.74+hash(i*17+23)*.18,introReveal.value);
  const targetX=lerp(start.x,target.x,amount),targetY=lerp(start.y,target.y,amount);
  const originX=W*.5+(start.x-W*.5)*.12,originY=H*.60+(start.y-H*.60)*.12;
  const point={x:lerp(originX,targetX,reveal),y:lerp(originY,targetY,reveal),
   size:lerp(start.size||target.size,target.size,amount)};
  // La zona sensible acompaña la forma actual: piezas compactas al entrar,
  // barras anchas sólo cuando el scroll las ha transformado.
  const aspect=lerp(1,barAspect(),smooth(.62,1,amount));
  const halfW=Math.max(point.size*aspect*.56,6),halfH=Math.max(point.size*.74,6);
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
function stopSceneAmbient(){
 clearTimeout(sceneAmbientTimer);sceneAmbientTween?.kill();sceneAmbientTween=null;
 if(sceneAmbient.value!==0){sceneAmbient.value=0;render()}
}
function scheduleSceneAmbient(delay=850){
 clearTimeout(sceneAmbientTimer);
 sceneAmbientTimer=setTimeout(()=>{
  const bounds=root.getBoundingClientRect();
  if(!scrollIdle||prefersReduced.matches||document.hidden||bounds.bottom<=0||bounds.top>=innerHeight)return;
  sceneAmbientTween?.kill();
  sceneAmbientTween=gsap.to(sceneAmbient,{value:1,duration:5.2,repeat:-1,yoyo:true,
   ease:'sine.inOut',onUpdate:render});
 },delay);
}
window.addEventListener('scroll',()=>{
 // Si se desplaza antes de completar la presentación, dejar el titular
 // totalmente legible; el resto de la coreografía sigue unido al scroll.
 if(introTextTween&&window.scrollY>16)introTextTween.progress(1);
 scrollIdle=false;stopSceneAmbient();fadePointer();setHoveredModule(-1);clearTimeout(scrollIdleTimer);
 scrollIdleTimer=setTimeout(()=>{scrollIdle=true;scheduleSceneAmbient(850)},170);
},{passive:true});
window.addEventListener('blur',()=>{pointer.down=false;stopSceneAmbient();fadePointer();setHoveredModule(-1)});
window.addEventListener('focus',()=>{if(scrollIdle)scheduleSceneAmbient(350)});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)stopSceneAmbient();else if(scrollIdle)scheduleSceneAmbient(350);
});

function draw0(u,p){
 const ink=night()?p.cream:p.ink,progress=smooth(.06,.84,u);
 // Un pequeño plano de trabajo une las tres áreas aún incompletas.
 // No son tarjetas ni documentos ficticios: las piezas mismas cuentan la idea.
 const baseline=H*.84,left=W*.15,right=W*.85;
 line(left,baseline,right,baseline,ink,1,.24);
 [W*.23,W*.50,W*.77].forEach((x,i)=>{
  const end=H*(i===1?.81:.82);
  line(x,end,x,baseline,p.olive,1,.30);
  line(x-W*.024,end,x+W*.024,end,p.stone,1,.30);
  circle(x,baseline,2.2,i===1?p.coral:p.amber,.80);
 });
 // Una señal recorre el basamento a medida que las piezas encuentran orden.
 line(left,baseline,left+(right-left)*progress,baseline,p.coral,1.5,.62);
}
function draw1(u,p){
 const mobile=W<700,compact=H<620;
 const show=smooth(.015,.32,u),pathProgress=smooth(.025,.89,u);
 const nodes=[
  {x:W*.25,y:H*(compact?.475:.505),color:p.amber},
  {x:W*.50,y:H*(compact?.415:.445),color:p.coral},
  {x:W*.75,y:H*(compact?.475:.505),color:p.amber}
 ];
 // Una sola ruta continua enlaza los tres conjuntos. La curva pasa por cada
 // unión con tangentes suaves, sin el segundo arco que duplicaba la lectura.
 const peakY=H*(compact?.365:.395);
 const segments=[
  {a:nodes[0],c1:{x:W*.34,y:peakY},c2:{x:W*.42,y:nodes[1].y},b:nodes[1]},
  {a:nodes[1],c1:{x:W*.58,y:nodes[1].y},c2:{x:W*.66,y:peakY},b:nodes[2]}
 ];
 const bezier=(s,t)=>{
  const v=1-t;
  return {
   x:v*v*v*s.a.x+3*v*v*t*s.c1.x+3*v*t*t*s.c2.x+t*t*t*s.b.x,
   y:v*v*v*s.a.y+3*v*v*t*s.c1.y+3*v*t*t*s.c2.y+t*t*t*s.b.y
  };
 };
 const drawRail=(width,color,alpha)=>{
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha*=alpha*show;
  ctx.beginPath();
  const steps=120,limit=Math.max(1,Math.ceil(steps*pathProgress));
  for(let k=0;k<=limit;k++){
   const q=k/steps*2,segment=q<=1?segments[0]:segments[1];
   const point=bezier(segment,q<=1?q:q-1);
   if(k===0)ctx.moveTo(point.x,point.y);else ctx.lineTo(point.x,point.y);
  }
  ctx.stroke();ctx.restore();
 };
 // La ruta recibe una sombra corta y un reflejo fino; su geometría no cambia.
 drawRail(mobile?6:8,mix(p.ink,p.bg[0],.72),.18);
 drawRail(mobile?4:5,p.petrol,.085);
 drawRail(mobile?1.25:1.65,p.petrol,.84);
 drawRail(mobile?.55:.7,p.cream,.24);
 const socket=(x,y,half,fill,alpha,active=false,scale=1)=>{
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha*=alpha;
  const cut=Math.max(1.4,half*.27);
  ctx.beginPath();
  ctx.moveTo(-half+cut,-half);ctx.lineTo(half-cut,-half);
  ctx.lineTo(half,-half+cut);ctx.lineTo(half,half-cut);
  ctx.lineTo(half-cut,half);ctx.lineTo(-half+cut,half);
  ctx.lineTo(-half,half-cut);ctx.lineTo(-half,-half+cut);ctx.closePath();
  ctx.shadowColor=night()?'rgba(0,0,0,.30)':'rgba(18,34,36,.18)';
  ctx.shadowBlur=half*.22;ctx.shadowOffsetY=half*.09;
  ctx.strokeStyle=active?p.coral:p.petrol;ctx.lineWidth=mobile?1:1.15;ctx.stroke();
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const core=half*.66;
  drawBeveledBlock(0,0,core,core,1.1,fill,p,sceneAmbient.value);
  ctx.restore();
 };
 const gapY=H*(mobile?.027:.035),moduleSize=mobile?9:18;
 nodes.forEach((node,i)=>{
  // El conector baja hasta la primera pieza de cada conjunto, sin cruzarla.
  const groupBase=H*(mobile?.625:.667)+(i===1?-.018:.018)*H;
  const firstRowY=groupBase-3*gapY;
  const moduleTop=firstRowY-moduleSize/2;
  const terminalHalf=mobile?4:5;
  const terminalY=moduleTop-terminalHalf-4;
  const branchReveal=smooth([.10,.50,.90][i],[.30,.68,1][i],pathProgress);
  const branchStart=node.y+(mobile?8:10);
  const branchEnd=terminalY-terminalHalf;
  line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?2.4:3,.11*branchReveal);
  line(node.x,branchStart,node.x,branchEnd,p.olive,mobile?.9:1.1,.62*branchReveal);
  socket(node.x,terminalY,terminalHalf,node.color,branchReveal);
  const nodeReveal=smooth([0,.44,.86][i],[.08,.56,.98][i],pathProgress);
  const distance=Math.hypot(pointer.x-node.x,pointer.y-node.y);
  const proximity=(1-clamp(distance/(mobile?72:112)))*pointer.energy;
  // La interacción destaca la unión más cercana; ya no dibuja líneas al puntero.
  socket(node.x,node.y,mobile?7.5:9,node.color,nodeReveal,proximity>.08,1+proximity*.10);
 });
}
function draw2(u,p){
 const mobile=W<700,compact=H<620,cx=W*.5,cy=H*(compact?.75:(mobile?.66:.64));
 const seedBase=mobile?20:32;
 const charge=smooth(.04,.24,u),launch=smooth(.34,.70,u);
 const seedAlpha=smooth(.015,.10,u)*(1-smooth(.50,.66,u));
 const seedScale=lerp(.72,1,smooth(.04,.16,u))*(1-.20*charge)*(1+.12*smooth(.26,.38,u));
 const seed=seedBase*seedScale;
 // El núcleo se cierra antes de liberar la energía: una onda, no tres aros decorativos.
 const chargeRadius=lerp(seed*1.38,seed*.78,charge);
 const chargeAlpha=.44*(1-smooth(.24,.36,u));
 strokeCircle(cx,cy,chargeRadius,p.cream,mobile?1:1.2,chargeAlpha);
 // La onda expansiva acompaña a las mismas piezas que salen desde el centro.
 const maxRadius=Math.min(W*.30,H*.25);
 const waveProgress=smooth(.34,.72,u);
 const waveRadius=lerp(seed*.82,maxRadius,waveProgress);
 const waveAlpha=.32*(1-smooth(.64,.92,u));
 strokeCircle(cx,cy,waveRadius,p.cream,mobile?1:1.25,waveAlpha);
 const echoProgress=smooth(.44,.82,u);
 const echoRadius=lerp(seed*.80,maxRadius*.78,echoProgress);
 const echoAlpha=.14*(1-smooth(.72,.98,u));
 strokeCircle(cx,cy,echoRadius,p.cream,1,echoAlpha);
 // Trazos breves señalan la dirección de salida de módulos reales, no partículas nuevas.
 const rayProgress=smooth(.34,.78,u),rayFade=1-smooth(.68,.94,u);
 for(let i=0;i<9;i++){
  const target=cloudPoint(i*6);
  const x=lerp(cx,target.x,rayProgress),y=lerp(cy,target.y,rayProgress);
  line(cx,cy,x,y,p.cream,mobile?.55:.75,.12*rayProgress*rayFade);
 }
 // La semilla tiene contraste sobre el coral y desaparece cuando sus piezas ya salieron.
 if(seedAlpha>.01){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.035+.20*launch);
  orientGesture(fitGesture(2,0,launch,seed));
  ctx.globalAlpha*=seedAlpha;
  drawBeveledBlock(0,0,seed,seed,Math.min(3,seed*.12),p.petrol,p,sceneAmbient.value);
  rounded(-seed*.18,-seed*.18,seed*.36,seed*.36,1.2,p.cream,.98);
  line(-seed*.12,-seed*.12,seed*.12,-seed*.12,p.petrol,.7,.28);
  ctx.restore();
 }
 line(W*.12,H*.86,W*.88,H*.86,p.ink,1,.18);
 for(let i=0;i<8;i++){
  const x=W*(.17+.66*i/7);line(x,H*.86-3,x,H*.86+3,p.ink,1,.16);
 }
 if(pointer.energy>.02){
  const d=Math.hypot(pointer.x-cx,pointer.y-cy);
  const near=(1-clamp(d/Math.max(maxRadius,1)))*pointer.energy;
  strokeCircle(pointer.x,pointer.y,(mobile?14:18)*(1+near*.2),p.amber,1,.32*near);
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
 const size=Math.min(W*(mobile?.92:.84),1120),height=mobile?H*.16:H*.275;
 const cx=W*.50,cy=H*(compact?(mobile?.65:.58):(mobile?.70:.565)),hold=1+.012*Math.sin(u*5.4)*(1-smooth(.70,1,u));
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
  if(i%17===0){
   const s=r0*(i%51===0?3.2:2.25);
   ctx.save();ctx.translate(x,y);orientGesture(fitGesture(3,i,v,s));
   ctx.fillRect(-s/2,-s*.41,s,s*.82);ctx.restore();
  }
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
 const horizon=H*.75,isNight=night();
 const ink=isNight?p.petrol:mix(p.petrol,p.cream,.22);
 // El modo día necesita algo más de presencia para que el plano se lea
 // con la misma profundidad que en noche. La perspectiva no cambia.
 const radialAlpha=isNight ? 0.35 : 0.48;
 const horizontalBase=isNight ? 0.07 : 0.10;
 const horizontalRange=isNight ? 0.14 : 0.18;
 for(let i=-12;i<=12;i++){
  const xx=W*.5+i*W*.075;
  line(W*.5,horizon-30,xx,H,ink,1,opacity*radialAlpha);
 }
 for(let j=1;j<=8;j++){
  let q=j/8,yy=horizon+Math.pow(q,1.7)*(H-horizon);
  line(W*.04,yy,W*.96,yy,ink,1,opacity*(horizontalBase+horizontalRange*q));
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
 const v=smooth(.035,.79,u),baseAlpha=ctx.globalAlpha;
 drawPerspective(p,v);
 const orbital=1+.045*Math.sin(u*6);
 strokeCircle(cx,cy,R*orbital*1.2,p.petrol,1,.24);
 const count=mobile?2100:N;let links=0;
 for(let i=0;i<count;i++){
  const q=particles[i],a=spherePoint(i,u,count),wp=wordPoint(i);
  const near=1+.11*a.z;
  const x3=cx+a.x*R*near,y3=cy-a.y*R*near;
  // Mismo origen exacto que CRECER al terminar el capitulo anterior.
   const wordCX=W*.50,wordCY=H*(compact?(mobile?.65:.58):(mobile?.70:.565));
   const wordSize=Math.min(W*(mobile?.92:.84),1120),wordHeight=mobile?H*.16:H*.275;
   const x0=wordCX+wp.x*wordSize,y0=wordCY+wp.y*wordHeight*2;
  let x=lerp(x0,x3,v),y=lerp(y0,y3,v);
  if(pointer.energy>.01){
   const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),reach=mobile?94:148;
   const force=Math.pow(1-clamp(d/reach),2)*pointer.energy;
   if(d>0){x+=dx*force*.17-dy*force*.10;y+=dy*force*.17+dx*force*.10}
   if(i%7===0&&d<reach&&links<24){
    line(pointer.x,pointer.y,x,y,p.cream,.65,.12*force);links++;
   }
  }
  const hue=i%19===0?'#5A9D72':i%13===0?p.coral:i%11===0?p.amber:p.olive;
  const oldAlpha=.34+.66*(q.r*.48+.5);
   const newAlpha=clamp(.30+.43*a.z+.3*v,.06,.98);
   ctx.globalAlpha=baseAlpha*lerp(oldAlpha,newAlpha,v);
  const oldRadius=1.45+q.r*1.65;
   const newRadius=(.65+q.s*1.12)*(1+.5*a.z)*(pointer.energy>.01?1+pointer.energy*.08:1);
   const r=lerp(mobile?1.15+q.r*1.2:oldRadius,newRadius,v);
  ctx.fillStyle=hue;
  if(i%17===0&&v<.999){
   const s=r*(i%51===0?3.2:2.25);
   ctx.save();ctx.translate(x,y);orientGesture(fitGesture(4,i,v,s));
   ctx.fillRect(-s/2,-s*.41,s,s*.82);ctx.restore();
  }
   else if(i%29===0){
    const s=r*(a.z>.1?3.8:2.4);
    ctx.save();ctx.translate(x,y);orientGesture(fitGesture(4,i,v,s));
    ctx.fillRect(-s/2,-s*.425,s,s*.85);ctx.restore();
   }
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
 const x=W*.16,width=W*.68,base=H*.84,top=H*.49;
 const end=clamp(progress),axisFade=smooth(.80,.95,end);
 // Los ejes se retiran a medida que la gráfica deja de ser columnas.
 line(x,base,x+width,base,ink,1,.36*opacity*axisFade);
 line(x,top,x,base,ink,1,.24*opacity*axisFade);
 for(let i=0;i<5;i++){
  const xx=x+width*(.12+i*.19);
  line(xx,base+13,xx,base+31,ink,1,.24*opacity*axisFade);
 }
 if(end<=.001)return;
 const start=ribbonCurvePoint(0),finish=ribbonCurvePoint(1);
 const samples=Math.max(3,Math.ceil(150*end)),points=[];
 for(let i=0;i<=samples;i++)points.push(ribbonCurvePoint(end*i/samples));
 const colors=modulePalette(p);
 const gradient=ctx.createLinearGradient(start.x,start.y,finish.x,finish.y);
 gradient.addColorStop(0,colors[0]);
 let offset=0;
 CHART_COUNTS.forEach((count,i)=>{
  offset+=count;
  gradient.addColorStop(offset/MODULE_COUNT,colors[Math.min(i+1,colors.length-1)]);
 });
 const trace=(color,lineWidth,alpha)=>{
  ctx.save();ctx.beginPath();
  points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
  ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=lineWidth;
  ctx.strokeStyle=color;ctx.globalAlpha*=opacity*alpha;
  ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,night()?.30:.16);ctx.shadowBlur=mobile?2.2:3.8;
  ctx.shadowOffsetY=mobile?1:1.8;ctx.stroke();
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.globalAlpha*=.18+sceneAmbient.value*.12;
  ctx.lineWidth=Math.max(.55,lineWidth*.24);ctx.strokeStyle=p.cream;ctx.stroke();
  ctx.restore();
 };
 const reveal=smooth(.40,.78,end);
 // El halo apenas separa el recorrido del fondo; la línea toma los mismos
 // colores que las columnas y queda debajo de los módulos que van encajando.
 trace(p.amber,mobile?4:6,.11*reveal);
 trace(gradient,mobile?1.45:1.9,.78*reveal);
}
function drawScene5Polygon(points,fill,stroke,alpha,width=1){
 ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.beginPath();
 points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));
 ctx.closePath();
 if(fill){ctx.fillStyle=fill;ctx.fill()}
 if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
 ctx.restore();
}
function drawScene5Platform(g,p,alpha,accent){
 if(alpha<=.002)return;
 const top={x:W*g.cx,y:H*(g.cy-g.ry)};
 const right={x:W*(g.cx+g.rx),y:H*g.cy};
 const bottom={x:W*g.cx,y:H*(g.cy+g.ry)};
 const left={x:W*(g.cx-g.rx),y:H*g.cy};
 const depth=H*(W<700?.006:.009),down=q=>({x:q.x,y:q.y+depth});
 const shadow=H*(W<700?.010:.015),drop=q=>({x:q.x+depth*.16,y:q.y+shadow});
 // Sombra de contacto separada de las caras: la plataforma deja de flotar plana.
 ctx.save();ctx.shadowColor=night()?rgba(p.bg[0],.58):rgba(p.ink,.24);
 ctx.shadowBlur=depth*(1.5+sceneAmbient.value*.55);ctx.shadowOffsetY=depth*.65;
 drawScene5Polygon([drop(top),drop(right),drop(bottom),drop(left)],
  rgba(night()?p.bg[0]:p.ink,night()?.36:.15),null,alpha*.72);
 ctx.restore();
 // Dos caras visibles, con valores distintos para que se entienda la orientación.
 drawScene5Polygon([left,bottom,down(bottom),down(left)],
  mix(p.petrol,p.bg[0],.48),null,alpha);
 drawScene5Polygon([bottom,right,down(right),down(bottom)],
  mix(p.petrol,p.bg[0],.58),null,alpha);
 const surface=ctx.createLinearGradient(top.x,top.y,right.x,bottom.y);
 surface.addColorStop(0,mix(p.petrol,p.cream,.20+sceneAmbient.value*.06));
 surface.addColorStop(.54,mix(p.petrol,p.bg[0],.035));
 surface.addColorStop(1,mix(p.petrol,p.bg[0],.20));
 drawScene5Polygon([top,right,bottom,left],surface,p.cream,alpha*.88,1.05);
 // Retícula grabada en el plano, con luz tenue y sin competir con las piezas.
 for(const t of [.33,.66]){
  const a={x:lerp(left.x,top.x,t),y:lerp(left.y,top.y,t)};
  const b={x:lerp(bottom.x,right.x,t),y:lerp(bottom.y,right.y,t)};
  line(a.x,a.y,b.x,b.y,p.cream,.7,alpha*.13);
  const c={x:lerp(top.x,right.x,t),y:lerp(top.y,right.y,t)};
  const d={x:lerp(left.x,bottom.x,t),y:lerp(left.y,bottom.y,t)};
  line(c.x,c.y,d.x,d.y,p.cream,.7,alpha*.13);
 }
 // Bisel luminoso superior y aristas inferiores con distinta reflectancia.
 line(top.x,top.y,right.x,right.y,accent,W<700?1.5:2.0,alpha*.90);
 line(top.x,top.y,left.x,left.y,p.cream,1.15,alpha*(.38+sceneAmbient.value*.12));
 line(left.x,left.y,bottom.x,bottom.y,p.cream,1,alpha*.32);
 line(bottom.x,bottom.y,right.x,right.y,p.cream,1,alpha*.48);
 line(down(left).x,down(left).y,down(bottom).x,down(bottom).y,accent,1,alpha*.48);
}
function drawScene5Bridge(start,c1,c2,end,progress,p,accent,alpha){
 if(progress<=.001||alpha<=.001)return;
 const steps=Math.max(2,Math.ceil(44*progress)),points=[];
 for(let i=0;i<=steps;i++){
  const t=progress*i/steps,v=1-t;
  points.push({
   x:v*v*v*start.x+3*v*v*t*c1.x+3*v*t*t*c2.x+t*t*t*end.x,
   y:v*v*v*start.y+3*v*v*t*c1.y+3*v*t*t*c2.y+t*t*t*end.y
  });
 }
 const stroke=(width,color,opacity)=>{
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=width;ctx.strokeStyle=color;
  // Cada extremo pierde intensidad gradualmente y se funde con la superficie,
  // en vez de terminar como un tubo cortado contra el borde de la plataforma.
  for(let i=1;i<points.length;i++){
   const t0=progress*(i-1)/(points.length-1),t1=progress*i/(points.length-1);
   const middle=(t0+t1)*.5;
   const startFade=smooth(0,.13,middle);
   const endFade=progress>.88?smooth(0,.13,progress-middle):1;
   const taper=startFade*endFade;
   ctx.globalAlpha=alpha*opacity*(.10+.90*taper);
   ctx.beginPath();ctx.moveTo(points[i-1].x,points[i-1].y);ctx.lineTo(points[i].x,points[i].y);ctx.stroke();
  }
  ctx.restore();
 };
 // Sombra inferior, cuerpo y reflejo superior: el conector se lee como una pieza continua.
 ctx.save();ctx.translate(0,W<700?1.6:3.2);
 stroke(W<700?15:33,night()?p.bg[0]:p.ink,.28);
 ctx.restore();
 stroke(W<700?13:30,accent,.16);
 stroke(W<700?8.5:21,p.petrol,.92);
 stroke(W<700?3.2:7,mix(p.petrol,p.cream,.22),.48);
 stroke(W<700?1.1:1.5,p.cream,.24);
 stroke(W<700?1:1.35,accent,.78);
}
function scene5TileColor(group,slot,p){
 const palettes=[
  [night()?'#4C936D':'#347953',p.olive,p.petrol],
  [p.coral,p.clay,p.coral],
  [p.amber,p.stone,p.ash],
  [p.stone,p.cream,p.olive,p.petrol,p.amber]
 ];
 const colors=palettes[group]||palettes[3];
 return colors[(slot+Math.floor(slot/4))%colors.length];
}
function drawScene5Tile(i,x,y,size,p,opacity,group,pose=null){
 if(opacity<=.002)return;
 // Giro local: el centro y la ret?cula de destino conservan sus coordenadas.
 ctx.save();ctx.translate(x,y);orientGesture(pose);ctx.translate(-x,-y);
 const slot=i%14,color=scene5TileColor(group,slot,p);
 const w=size*(.47+.035*hash(i*5+17)),h=size*.24,depth=size*.20;
 const top=[{x,y:y-h},{x:x+w,y},{x,y:y+h},{x:x-w,y}];
 const down=top.map(q=>({x:q.x,y:q.y+depth}));
 // Sombra de contacto y caras laterales mantienen el volumen mientras la ficha viaja.
 ctx.save();ctx.shadowColor=night()?'rgba(0,0,0,.38)':'rgba(18,34,36,.22)';
 ctx.shadowBlur=Math.max(1,depth*1.45);ctx.shadowOffsetY=depth*.65;
 drawScene5Polygon(top,rgba(night()?p.bg[0]:p.ink,night()?.34:.16),null,opacity*.58);
 ctx.restore();
 drawScene5Polygon([top[3],top[2],down[2],down[3]],
  mix(color,p.bg[0],.52),null,opacity);
 drawScene5Polygon([top[2],top[1],down[1],down[2]],
  mix(color,p.bg[0],.40),null,opacity);
 const face=ctx.createLinearGradient(top[0].x,top[0].y,top[2].x,top[2].y);
 face.addColorStop(0,mix(color,p.cream,.25+sceneAmbient.value*.07));
 face.addColorStop(.60,color);face.addColorStop(1,mix(color,p.bg[0],.16));
 drawScene5Polygon(top,face,p.cream,opacity,.72);
 line(top[0].x,top[0].y,top[1].x,top[1].y,p.cream,.7,opacity*(.34+sceneAmbient.value*.12));
 ctx.restore();
}
function drawScene5Slot(group,slot,p,opacity){
 if(opacity<=.002)return;
 const q=scene5GridPoint(group,slot),w=q.size*.50,h=q.size*.25;
 const points=[{x:q.x,y:q.y-h},{x:q.x+w,y:q.y},{x:q.x,y:q.y+h},{x:q.x-w,y:q.y}];
 drawScene5Polygon(points,null,scene5TileColor(group,slot,p),opacity*.78,W<700?1:1.25);
}
function drawScene5Connections(u,p,fade=1){
 const g=scene5Geometry(),left=g[0],top=g[1],right=g[2],base=g[3];
 const point=(x,y)=>({x:W*x,y:H*y});
 const leftStart={x:W*(base.cx-base.rx*.58),y:H*(base.cy-base.ry*.40)};
 const leftEnd={x:W*(left.cx+left.rx*.72),y:H*(left.cy+left.ry*.56)};
 const topStart={x:W*base.cx,y:H*(base.cy-base.ry*.96)};
 const topEnd={x:W*top.cx,y:H*(top.cy+top.ry*.94)};
 const rightStart={x:W*(base.cx+base.rx*.58),y:H*(base.cy-base.ry*.40)};
 const rightEnd={x:W*(right.cx-right.rx*.72),y:H*(right.cy+right.ry*.56)};
 // Los conectores se comparten entre ambas escenas para que el relevo sea continuo.
 drawScene5Bridge(leftStart,point(.40,.78),point(.34,.71),leftEnd,
  smooth(.12,.58,u),p,night()?'#6FAE86':'#347953',fade);
 drawScene5Bridge(topStart,point(.50,.70),point(.50,.57),topEnd,
  smooth(.20,.64,u),p,p.coral,fade);
 drawScene5Bridge(rightStart,point(.60,.78),point(.66,.71),rightEnd,
  smooth(.28,.70,u),p,p.amber,fade);
}
function draw5(u,p){
 const fade=1,g=scene5Geometry();
 const left=g[0],top=g[1],right=g[2],base=g[3];
 // Primero se dibujan los recorridos; las plataformas los cubren en sus uniones.
 drawScene5Connections(u,p,fade);
 // Las tres extensiones se abren desde la base, cada una con su propio acento.
 drawScene5Platform(left,p,smooth(.18,.48,u)*fade,night()?'#6FAE86':'#347953');
 drawScene5Platform(top,p,smooth(.25,.55,u)*fade,p.coral);
 drawScene5Platform(right,p,smooth(.32,.62,u)*fade,p.amber);
 drawScene5Platform(base,p,smooth(.02,.22,u)*fade,p.cream);
 // Algunos espacios quedan disponibles: no son piezas sueltas, sino lugares previstos.
 const slotReveal=smooth(.36,.60,u)*fade;
 [[0,14],[0,15],[1,15],[3,14]].forEach(([group,slot])=>
  drawScene5Slot(group,slot,p,slotReveal));
}
function drawRibbon(p,u,index,total){
 const base=H*(.55+.15*index/total),a=smooth(.08,.34,u),fade=1-smooth(.55,.96,u);
 if(a*fade<=.001)return;
 const xSpan=W*1.15,phase=index*.19,spread=smooth(.10,.48,u);
 const colors=[p.coral,p.clay,p.amber,p.petrol,p.olive];
 const startAlpha=.006+.012*(index/total),endAlpha=.16+.25*(index/total);
 ctx.save();
 ctx.globalAlpha*=a*fade*lerp(startAlpha,endAlpha,spread);
 ctx.lineWidth=lerp(1,1.1+(index%4)*.46,spread);
 ctx.strokeStyle=colors[index%colors.length];ctx.beginPath();
 for(let j=0;j<=130;j++){
  const q=j/130,curve=ribbonCurvePoint(q);
  const targetX=-W*.075+xSpan*q;
  const targetY=base+H*(.035+.022*Math.sin(index*.45))*Math.sin(q*9.4+u*7.4+phase)+H*.06*Math.cos(q*4+phase);
  const x=lerp(curve.x,targetX,spread),y=lerp(curve.y,targetY,spread);
  if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }
 ctx.shadowColor=rgba(night()?p.bg[0]:p.ink,night()?.28:.14);ctx.shadowBlur=2.4+sceneAmbient.value*1.6;
 ctx.shadowOffsetY=1.1;ctx.stroke();
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.globalAlpha*=.20+sceneAmbient.value*.16;
 ctx.lineWidth=Math.max(.55,ctx.lineWidth*.24);ctx.strokeStyle=p.cream;ctx.stroke();
 ctx.restore();
}
function draw6(u,p){
 const g=scene5Geometry(),bridgeFade=1-smooth(.38,.84,u);
 const platformFade=1-smooth(.44,.90,u);
 // La curva nueva nace después de que los conectores anteriores comienzan a retirarse.
 drawChart(p,u,1);
 drawScene5Connections(1,p,bridgeFade);
 // Las plataformas cubren las uniones y se retiran mientras las fichas abandonan cada base.
 drawScene5Platform(g[0],p,platformFade,night()?'#6FAE86':'#347953');
 drawScene5Platform(g[1],p,platformFade,p.coral);
 drawScene5Platform(g[2],p,platformFade,p.amber);
 drawScene5Platform(g[3],p,platformFade,p.cream);
}
function draw7(u,p){
 // La curva del gráfico se entrega a las ondas: primero se atenúa y luego las líneas toman el relevo.
 drawChart(p,1,1-smooth(.04,.30,u));
 for(let i=0;i<34;i++)drawRibbon(p,u,i,34);
 const settle=smooth(.10,.42,u),travel=smooth(.34,.90,u)*.45,cx=W*.5;
 const cy=lerp(H*.57,H*1.08,travel);
 const pulse=seedPulse.value;
 const size=Math.min(W,H)*(W<700?.077:.062)*settle*(1+.045*pulse);
 if(size>1){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.045+travel*.085+pulse*.025);
  orientGesture(fitGesture(7,0,settle,size));
  ctx.globalAlpha*=settle;
  drawBeveledBlock(0,0,size,size,Math.min(4,size*.12),p.coral,p,sceneAmbient.value);
  strokeCircle(0,0,size*.76,p.coral,1.1,.16*(1-pulse));
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
 const color=scene===4?p.amber:p.coral,weight=scene>=5?.34:1;
 ripples.forEach(wave=>strokeCircle(wave.x,wave.y,wave.r,color,scene===4?1.35:1.1,wave.alpha*weight));
 if(pointer.energy>.015){
  const halo=scene===4?18:12;
  circle(pointer.x,pointer.y,2.2,color,.42*pointer.energy*weight);
  strokeCircle(pointer.x,pointer.y,halo+pointer.energy*8,color,1,.30*pointer.energy*weight);
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
 const u=i===1?smooth(.015,.91,raw):smooth(.015,.72,raw);
 const dissolve=i<7?smooth(.62,.995,raw):0;
 ctx.setTransform(DPR,0,0,DPR,0,0);
 const background=i<7?mix(p.bg[i],p.bg[i+1],dissolve):p.bg[7];
 const contrast=contrastFor(background);
 // El texto y la navegación siguen el mismo fundido que el fondo, incluso
 // durante los fotogramas intermedios entre dos escenas.
 if(root.dataset.contrastInk!==contrast){
  root.dataset.contrastInk=contrast;
  root.style.setProperty('--ui-color',contrast);
  root.style.setProperty('--copy-contrast',contrast);
 }
 ctx.fillStyle=background;
 ctx.fillRect(0,0,W,H);
 drawSceneAtmosphere(i,p);
 // La primera escena comienza mezclada y el propio scroll lleva las piezas
 // hasta su composición ordenada; no hay una animación automática que la adelante.
 if(i>=5){
  // Plataformas, conectores y ondas forman el fondo; las piezas siempre quedan delante.
  drawScene(i,u,p);
  drawModuleTransition(i,u,p);
 }else{
  drawModuleTransition(i,u,p);
  drawScene(i,u,p);
 }
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
 stopSceneAmbient();master?.kill();trigger?.kill();seedPulseTween?.kill();seedPulseTween=null;seedPulse.value=0;
 introTween?.kill();introTween=null;introTextTween?.kill();introTextTween=null;
 introReveal.value=prefersReduced.matches?1:0;
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
 // La escena de encaje recibe más recorrido para que el movimiento tenga tiempo de leerse y reposar.
  const sceneLengths=[1.48,2.20,1.88,1.72,1.54,1.88,1.62,1.38];
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
  const rule=copy.querySelector('.study-rule'),begin=sceneStarts[copyStarts[i]]+(i===1?.38:i===2?.08:i===3?.02:i===4?.28:i===5?.36:i===6?.32:i>0?-.12:0);
  const endScene=i===4?6:copyStarts[i+1],fromX=i===1?24:i===3?-20:0;
  gsap.set(copy,{autoAlpha:i===0?1:0});
  gsap.set(fragments,{yPercent:105,xPercent:i===0?0:fromX});
  gsap.set(rule,{scaleX:0,transformOrigin:'left center'});
  if(desc)gsap.set(desc,{opacity:0,y:18});
  if(i===0){
   // La primera frase no debe esperar a que el visitante haga scroll.
   // La primera línea es visible desde la carga; la segunda se revela.
   gsap.set(fragments[0],{yPercent:0,y:12,opacity:0});
  }else{
   master.to(copy,{autoAlpha:1,duration:.16},begin+.01);
   master.to(fragments,{yPercent:0,xPercent:0,duration:i===2?.66:i===1?.62:i===3?.62:i===4?.58:.48,stagger:i===2?.25:i===1?.19:i===4?.22:.15,ease:'power3.out'},begin+.04);
   master.to(rule,{scaleX:1,duration:i===2?.46:.36,ease:'sine.out'},begin+(i===2?.77:i===1?.76:i===4?.72:.57));
   if(desc)master.to(desc,{opacity:1,y:0,duration:i===2?.56:i===3?.48:i===4?.50:.42,ease:'power2.out'},begin+(i===2?.98:i===1?.85:i===3?.82:i===4?.88:.70));
  }
  if(i<6)master.to(copy,{autoAlpha:0,duration:.18},sceneStarts[endScene]-.18);
 });
 master.to({},{duration:.02},sceneStarts[8]+.02);
 trigger=ScrollTrigger.create({id:'jmorgado-journey',trigger:root,start:'top top',end:'bottom bottom',
  animation:master,scrub:.42,anticipatePin:1,invalidateOnRefresh:true,
  onUpdate:()=>{syncSceneState();navStatus()}});
 master.progress(trigger.progress);
 syncSceneState();
 resize();navStatus();
 const first=copies[0],fragments=first.querySelectorAll('.study-mask>span');
 const rule=first.querySelector('.study-rule'),desc=first.querySelector('.study-description');
 introTextTween=gsap.timeline({onComplete:()=>{introTextTween=null}});
 introTextTween.to(fragments[0],{opacity:1,y:0,duration:.58,ease:'power2.out'},0);
 if(fragments[1])introTextTween.to(fragments[1],{yPercent:0,duration:.68,ease:'power3.out'},.16);
 introTextTween.to(rule,{scaleX:1,duration:.38,ease:'sine.out'},.52);
 if(desc)introTextTween.to(desc,{opacity:1,y:0,duration:.46,ease:'power2.out'},.70);
 if(window.scrollY>16)introTextTween.progress(1);
 introTween=gsap.to(introReveal,{value:1,duration:.96,ease:'power2.out',onUpdate:render});
 scheduleSceneAmbient(1100);
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
