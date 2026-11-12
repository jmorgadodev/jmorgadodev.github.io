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
// Una superficie transparente independiente: los detalles en reposo nunca
// mueven ni reemplazan las piezas de la coreografía principal.
const idleCanvas=document.createElement('canvas');
idleCanvas.className='study-idle-canvas';
idleCanvas.setAttribute('aria-hidden','true');
Object.assign(idleCanvas.style,{
 position:'absolute',inset:'0',width:'100%',height:'100%',
 pointerEvents:'none',zIndex:'1'
});
canvas.insertAdjacentElement('afterend',idleCanvas);
const idleCtx=idleCanvas.getContext('2d',{alpha:true});
const header=document.querySelector('.home-header'),destination=document.getElementById('explorar');
const themeButton=root.querySelector('.study-theme'),siteTheme=document.querySelector('[data-theme-toggle]');
const skip=root.querySelector('.intro-skip'),copies=[...root.querySelectorAll('[data-copy]')];
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
const mqMobile=matchMedia('(max-width:900px)');
let W=0,H=0,DPR=1,idleDPR=1,play={t:0},master,trigger,resizeId;
// C · Cadencia propia de la capa ambiental: 29,4 fps en escritorio y 23,8 fps
// en pantallas estrechas. No se cambia el valor: ya está dentro del rango
// pedido y forma parte de la sensación de profundidad del reposo.
const ambientInterval=()=>W<700?42:34;
// C · Cache de las capas del fondo, una por escena. El fondo completo ya no se
// cachea como imagen fija: el color base se mezcla en cada fotograma y las
// capas se componen con el mismo crossfade que ya hacia el motor.
const capaCanvasA=document.createElement('canvas');
const capaCanvasB=document.createElement('canvas');
const capaCtxA=capaCanvasA.getContext('2d',{alpha:true});
const capaCtxB=capaCanvasB.getContext('2d',{alpha:true});
let capaTramoA=-1,capaTramoB=-1,capaTema='',capaAncho=0,capaAlto=0,capaDPR=0,capaListoA=false,capaListoB=false;
function capaClaveValida(){
 return capaTema===(night()?'night':'day')&&capaAncho===W&&capaAlto===H&&capaDPR===DPR;
}
function capaInvalidar(){
 capaListoA=false;capaListoB=false;capaTramoA=-1;capaTramoB=-1;
}
function capaGenerar(scene,destino,destinoCtx){
 if(scene<0||scene>7)return false;
 const pw=Math.max(1,Math.round(W*DPR)),ph=Math.max(1,Math.round(H*DPR));
 destino.width=pw;destino.height=ph;
 destinoCtx.setTransform(1,0,0,1,0,0);
 destinoCtx.clearRect(0,0,pw,ph);
 destinoCtx.setTransform(DPR,0,0,DPR,0,0);
 const anterior=fondoCtx;
 fondoCtx=destinoCtx;
 try{ drawBackdropLayer(scene,PAL[night()?'night':'day'],1); }
 finally{ fondoCtx=anterior; }
 return true;
}
// D · Control del área de renderizado.
//
// El coste de rasterización es proporcional al área del lienzo, así que la
// palanca más directa sobre el intervalo entre fotogramas es la resolución
// interna. El tamaño en CSS no cambia nunca: sólo cambia cuántos píxeles
// reales se pintan por cada píxel de la pantalla.
//
//   1. Un tope por defecto según el tipo de dispositivo y su potencia.
//   2. Un ajuste en vivo: el motor mide el intervalo real entre fotogramas y
//      baja la resolución interna en escalones cuando el equipo no sostiene
//      el ritmo, con histeresis y enfriamiento para que la calidad no oscile.
// Niveles de resolucion interna. El suelo es 0,85: por debajo el grafico
// pierde nitidez y el equipo tampoco gana fluidez suficiente.
const DPR_NIVELES=[0.85,1,1.25,1.5];
let dprNivel=-1,dprTope=-1,frameSonda=0,frameAnterior=0;
let frameMuestras=[],frameEnfriamiento=0,frameEstable=0;

// Tope por defecto: nunca se supera el límite anterior de 1,65, de modo que la
// calidad visual no puede empeorar respecto del estado previo en ningún equipo.
function dprCapBase(){
 // El lado corto de la pantalla es el que delata un equipo estrecho: en un
 // movil en vertical, el alto es mayor que el ancho.
 const corto=Math.min(innerWidth||0,innerHeight||0);
 const largo=Math.max(innerWidth||0,innerHeight||0);
 const nucleos=navigator.hardwareConcurrency||4;
 const memoria=navigator.deviceMemory||4;
 const tactil=matchMedia('(pointer:coarse)').matches;
 if(tactil||corto<900)return(nucleos>=8&&memoria>=6)?1.25:1;
 return(nucleos>=8&&memoria>=8&&largo>=1600)?1.5:1.25;
}
function dprInicializar(){
 if(dprNivel>=0)return;
 const base=dprCapBase();
 // El mayor nivel que no supera el tope: nunca se baja de la resolucion
 // basandose en el orden del array, sino en el limite real del equipo.
 let indice=0;
 for(let n=0;n<DPR_NIVELES.length;n++){
  if(DPR_NIVELES[n]<=base+0.1)indice=n;
 }
 dprNivel=indice;dprTope=indice;
}
function dprCap(){dprInicializar();return DPR_NIVELES[dprNivel]}
function dprAjustable(){
 // El ajuste en vivo se reserva a los equipos donde el area es el factor
 // dominante. En escritorio, la medicion demuestra que reducir el area no
 // mejora el intervalo: ahi el cuello es el numero de operaciones de dibujo.
 // El nivel ya se inicializa antes de esta comprobacion.
 const corto=Math.min(innerWidth||0,innerHeight||0);
 return matchMedia('(pointer:coarse)').matches||corto<900;
}

// El sondeo usa un unico callback propio: sus ejecuciones son una por
// fotograma, de modo que la diferencia entre dos Sellos es el intervalo real.
function frameSondaTick(sello){
 if(frameAnterior){
  const delta=sello-frameAnterior;
  if(delta>0&&delta<2000)frameMuestras.push(delta);
  if(frameMuestras.length>40)frameMuestras.shift();
 }
 frameAnterior=sello;
 frameSonda=requestAnimationFrame(frameSondaTick);
}
function ajustarResolucion(){
 if(!dprAjustable()||prefersReduced.matches||dprNivel<0)return;
 const ahora=performance.now();
 if(ahora<frameEnfriamiento)return;
 if(frameMuestras.length<12)return;
 const orden=frameMuestras.slice().sort((a,b)=>a-b);
 const mediana=orden[orden.length>>1];
 let nivel=dprNivel;
 if(mediana>55&&nivel>0)nivel--;
 else if(mediana<20&&nivel<dprTope){
  frameEstable++;
  if(frameEstable>=8)nivel++;
 }else frameEstable=0;
 if(nivel===dprNivel)return;
 dprNivel=nivel;
 frameMuestras.length=0;
 frameEstable=0;
 frameEnfriamiento=ahora+(nivel<dprTope?1500:6000);
 resize();
}
// C · El reloj del mundo. Es la única fuente del movimiento autónomo:
// avanza siempre que la introducción esté a la vista, sin depender del
// puntero, del foco de la ventana ni del reposo. Nunca se reinicia.
const sceneAmbient={value:0},idleMotion={value:0,time:0};
let introTextTween=null;
let idleLastRender=0,idleLastFrame=0,idleClock=0,ambientRunning=false;
let narrativeLastPaint=0;
// La cadencia del relato cuando sólo late el mundo: 30 fps en escritorio,
// 24 fps en pantallas estrechas.
const narrativeInterval=()=>W<700?42:33;
const pointer={x:0,y:0,tx:0,ty:0,energy:0,active:false,down:false,dirX:0,dirY:0,speed:0,lastMoveAt:0,lastSpeedUpdateAt:0,hasPosition:false};
let pointerTween=null,pointerFade=null,scrollIdle=true,scrollIdleTimer=0,pointerFrameAt=0;

// ═══════════════════════════════════════════════════════════════════════════
// Arquitectura del motor
//
//   A · Motor narrativo     → capa 'narrative'. Las siete escenas, sus estados,
//                              geometrías y transiciones. No sabe nada del pintado.
//   B · Motor de interacción → el puntero. Anota la posición; no dibuja.
//   C · Capas visuales      → capa 'ambient'. Atmósferas y profundidad del
//                              reposo. Tiene su propio ritmo y su propio lienzo.
//   D · Control de rendimiento → invalidez, visibilidad y cadencia.
//
// Un único ciclo de fotogramas (el ticker de GSAP) recorre las capas. Cada capa
// declara si necesita repintado: así una capa nunca obliga a redibujar a otra.
// El ambiente respira sin forzar el relato, y el relato sólo se repinta cuando
// su estado ha cambiado de verdad.
//
// Para añadir una capa nueva no hay que tocar las escenas: se registra aquí con
// su propio ritmo, su propia visibilidad y su propia invalidez.
// ═══════════════════════════════════════════════════════════════════════════
// C · Contexto de destino del bloque de fondo. Apunta al lienzo principal
// salvo mientras se rasteriza un bitmap de capas, de modo que el mismo
// codigo sirve para pintar en el lienzo y en la cache.
let fondoCtx=ctx;

const layers={};
function registerLayer(layer){layers[layer.id]=layer;return layer}
function invalidate(id){const l=layers[id];if(l)l.dirty=true}
function invalidateAll(){for(const id in layers)layers[id].dirty=true}

// A · La capa narrativa se repinta si algo del relato ha cambiado:
// cambio de tramo, puntero, pulso de semilla, tema, tamaño o entrada inicial.
// Con el mundo en marcha también se repinta a su propio ritmo: las piezas
// siguen moviéndose sin puntero y sin scroll.
const narrativeLayer=registerLayer({
 id:'narrative',dirty:true,
 due(now){return this.dirty||(ambientRunning&&now-narrativeLastPaint>=narrativeInterval())},
 paint(now){this.dirty=false;narrativeLastPaint=now;paintNarrative()}
});
// C · La capa ambiental tiene su propio ritmo (24-30 fps) y su propia
// visibilidad. Nunca provoca un repintado completo del motor principal.
const ambientLayer=registerLayer({
 id:'ambient',dirty:false,
 due(now){return this.dirty||(ambientRunning&&now-idleLastRender>=ambientInterval())},
 paint(now){this.dirty=false;drawIdleAmbient(now);idleLastRender=now}
});

// B · El puntero anota la posición y la aplica una sola vez por ciclo de
// fotogramas, con el último valor recibido. Un ratón rápido genera un
// repintado por fotograma, no uno por evento.
const pendingPointer={clientX:0,clientY:0,pointerType:'mouse',has:false};
let pointerDirty=false;
function queuePointer(event){
 pendingPointer.clientX=event.clientX;
 pendingPointer.clientY=event.clientY;
 pendingPointer.pointerType=event.pointerType;
 pendingPointer.has=true;
 pointerDirty=true;
}
function invalidateNarrative(){narrativeLayer.dirty=true}
const PHI=(1+Math.sqrt(5))/2;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{let t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
function pointerInfluenceAt(x,y,reach){
 if(!pointer.active||pointer.energy<=.001)return {strength:0,proximity:0,dx:0,dy:0,distance:Infinity,speed:0,direction:0};
 const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);
 const proximity=1-smooth(reach*.10,reach,distance);
 const speed=clamp(pointer.speed);
 const direction=clamp((dx*pointer.dirX+dy*pointer.dirY)/Math.max(reach,1),-1,1);
 const directional=clamp(.88+.18*speed*direction,.68,1.08);
 return {strength:proximity*proximity*pointer.energy*directional,
  proximity,dx,dy,distance,speed,direction};
}
const hashCache=new Map();
const hash=n=>{
 let valor=hashCache.get(n);
 if(valor!==undefined)return valor;
 const v=Math.sin(n*127.1+83.17)*43758.5453;
 valor=v-Math.floor(v);
 hashCache.set(n,valor);
 return valor;
};
const rad=Math.PI/180;
const PAL={
 // Cada capítulo conserva la misma familia cromática, pero tiene una superficie propia.
 // Las diferencias son tonales y materiales: papel, salvia, coral, mineral, petróleo,
 // piedra fría, arena y cierre profundo. La pareja día/noche mantiene el mismo mapa.
 // El dia trabaja sobre piedra calida: un papel un punto mas oscuro y neutro
 // que el beige, donde las piezas siguen teniendo presencia.
 day:{bg:['#C6D2CF','#BDCAC7','#B2C0BD','#A7B5B2','#08272C','#10333A','#BFCBC9','#F0EDE6'],
  ink:'#222327',cream:'#FCFAF5',petrol:'#23494E',coral:'#F45A3A',amber:'#E8B769',olive:'#737B69',stone:'#C9C8B7',ash:'#A5A18D',clay:'#D99B89'},
 night:{bg:['#131E23','#18262C','#1F2D33','#25353C','#08272C','#10333A','#16242A','#111B20'],
 ink:'#F3F0E8',cream:'#F3F0E8',petrol:'#477982',coral:'#FF785C',amber:'#EEC47D',olive:'#ADB29C',stone:'#818578',ash:'#B5B19F',clay:'#DDA294'}
};
// D · Cache de operaciones puras. El motor repite estas cuatro llamadas
// decenas de miles de veces por fotograma y todas son deterministas.
const rgbCache=new Map();
const rgb=h=>{
 const clave=h;
 let valor=rgbCache.get(clave);
 if(valor)return valor;
 valor=h.startsWith('rgb')?h.match(/[\d.]+/g).slice(0,3).map(Number):[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 rgbCache.set(clave,valor);
 return valor;
};
const mixCache=new Map();
const mix=(a,b,u)=>{
 const clave=a+'|'+b+'|'+Math.round(u*100);
 let valor=mixCache.get(clave);
 if(valor)return valor;
 const A=rgb(a),B=rgb(b);
 valor='rgb('+A.map((v,k)=>Math.round(lerp(v,B[k],u))).join(',')+')';
 mixCache.set(clave,valor);
 return valor;
};
const rgba=(color,alpha)=>'rgba('+rgb(color).map(Math.round).join(',')+','+alpha+')';
// Grano físico determinista: una sola textura repetible, no ruido nuevo por fotograma.
const grainTile=document.createElement('canvas');
grainTile.width=grainTile.height=192;
const grainContext=grainTile.getContext('2d');
const grainImage=grainContext.createImageData(grainTile.width,grainTile.height);
let grainSeed=0x6D2B79F5;
for(let i=0;i<grainImage.data.length;i+=4){
 grainSeed=(grainSeed*1664525+1013904223)>>>0;
 const value=104+((grainSeed>>>24)%49);
 grainImage.data[i]=grainImage.data[i+1]=grainImage.data[i+2]=value;
 grainImage.data[i+3]=255;
}
grainContext.putImageData(grainImage,0,0);
const grainPattern=ctx.createPattern(grainTile,'repeat');
// El grano es una textura estatica: se rasteriza una sola vez en un bitmap
// del tamano del lienzo y se compone con un unico drawImage. Antes se
// muestreaba el patron repetido sobre toda la superficie en cada fotograma,
// en modo soft-light, y era el mayor coste individual del fondo.
const grainCanvas=document.createElement('canvas');
const grainCtx=grainCanvas.getContext('2d',{alpha:true});
let grainReady=false;
function rebuildGrain(){
 if(!W||!H)return;
 const pw=Math.max(1,Math.round(W*DPR)),ph=Math.max(1,Math.round(H*DPR));
 grainCanvas.width=pw;grainCanvas.height=ph;
 grainCtx.setTransform(1,0,0,1,0,0);
 grainCtx.clearRect(0,0,pw,ph);
 const patron=grainCtx.createPattern(grainTile,'repeat');
 if(patron){
  grainCtx.fillStyle=patron;
  grainCtx.fillRect(0,0,pw,ph);
 }
 grainReady=true;
}
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
function drawBackdropWash(x,y,r,color,opacity){
 if(opacity<=.001)return;
 const gradient=fondoCtx.createRadialGradient(x,y,0,x,y,r);
 gradient.addColorStop(0,rgba(color,opacity));
 gradient.addColorStop(.36,rgba(color,opacity*.48));
 gradient.addColorStop(.74,rgba(color,opacity*.12));
 gradient.addColorStop(1,rgba(color,0));
 fondoCtx.fillStyle=gradient;fondoCtx.fillRect(0,0,W,H);
}
function drawSurfaceMaterial(scene,p){
 const isNight=night(),extent=Math.max(W,H),acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 if(!isNight){
  // Luz de superficie: un plano claro arriba y una caída tonal real hacia el borde.
  const plane=fondoCtx.createLinearGradient(0,0,W,H);
  // Un degradado muy suave: la luz entra por arriba a la izquierda y el
  // papel se apila hacia el borde inferior. Da profundidad sin ruido.
  plane.addColorStop(0,rgba(p.cream,.20));
  plane.addColorStop(.34,rgba(p.cream,.06));
  plane.addColorStop(.68,rgba(p.ink,.05));
  plane.addColorStop(1,rgba(p.ink,.17));
  fondoCtx.fillStyle=plane;fondoCtx.fillRect(0,0,W,H);
 }else if(acto===0){
  const sombra=fondoCtx.createLinearGradient(0,0,0,H);
  sombra.addColorStop(0,rgba('#050D12',.22));
  sombra.addColorStop(.55,'rgba(5,13,18,0)');
  sombra.addColorStop(1,rgba('#050D12',.30));
  fondoCtx.fillStyle=sombra;fondoCtx.fillRect(0,0,W,H);
 }
 // La textura se compone en soft-light, una sola vez por fotograma.
 if(grainPattern){
  fondoCtx.save();fondoCtx.globalCompositeOperation='soft-light';
  fondoCtx.globalAlpha*=isNight?.06:.135;
  if(grainReady)fondoCtx.drawImage(grainCanvas,0,0,W,H);
  else{fondoCtx.fillStyle=grainPattern;fondoCtx.fillRect(0,0,W,H);}
  fondoCtx.restore();
 }
}
function drawBackdropLayer(scene,p,alpha=1){
 if(alpha<=.002)return;
 const isNight=night(),extent=Math.max(W,H),acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 fondoCtx.save();fondoCtx.globalAlpha*=alpha;
 // Una luz diagonal común mantiene la identidad del recorrido sin uniformar sus actos.
 const directional=fondoCtx.createLinearGradient(0,0,W,H);
 directional.addColorStop(0,rgba(p.cream,isNight?.028:.15));
 directional.addColorStop(.48,rgba(p.cream,0));
 directional.addColorStop(1,rgba(isNight?'#050B10':p.ink,isNight?.075:.07));
 fondoCtx.fillStyle=directional;fondoCtx.fillRect(0,0,W,H);
 if(acto===0){
  // Marfil: apertura caliente con una masa a la derecha, donde vive la materia.
  const phase=idleMotion.time,idle=idleMotion.value;
  const lightX=W*(.66+Math.sin(phase*.10)*.02*idle);
  drawBackdropWash(lightX,H*.60,extent*.55,isNight?p.amber:p.petrol,isNight?.16:.10);
  drawBackdropWash(W*.16,H*.24,extent*.46,p.cream,isNight?.06:.12);
  if(!isNight)drawBackdropWash(W*.78,H*.86,extent*.48,p.olive,.055);
 }else if(acto===1){
  // Neutro en transición: la materia gana profundidad antes de encenderse.
  const lightX=W*(.50+Math.sin(idleMotion.time*.13+1.1)*.015*idleMotion.value);
  drawBackdropWash(lightX,H*.50,extent*.62,p.olive,isNight?.13:.15);
  drawBackdropWash(W*.50,H*.78,extent*.40,p.cream,isNight?.04:.08);
  drawBackdropWash(W*.16,H*.14,extent*.34,isNight?p.petrol:p.stone,isNight?.10:.42);
 }else if(acto===2){
  // Petróleo: el interior se enciende y el frente recorre la red.
  const ember=fondoCtx.createRadialGradient(W*.50,H*.58,0,W*.50,H*.58,extent*.66);
  ember.addColorStop(0,rgba(p.coral,isNight?.30:.34));
  ember.addColorStop(.34,rgba(p.amber,isNight?.12:.16));
  ember.addColorStop(.72,rgba(isNight?'#04303A':'#043038',isNight?.30:.42));
  ember.addColorStop(1,rgba('#000000',isNight?.28:.22));
  fondoCtx.fillStyle=ember;fondoCtx.fillRect(0,0,W,H);
  drawBackdropWash(W*.50,H*.44,extent*.40,p.petrol,isNight?.18:.22);
 }else{
  // Integración: la luz se disuelve y deja paso al papel del portafolio.
  const lift=fondoCtx.createLinearGradient(0,H*.40,0,H);
  lift.addColorStop(0,rgba(p.cream,isNight?.04:.28));
  lift.addColorStop(.55,rgba(p.cream,isNight?.02:.10));
  lift.addColorStop(1,'rgba(0,0,0,0)');
  fondoCtx.fillStyle=lift;fondoCtx.fillRect(0,0,W,H);
  drawBackdropWash(W*.50,H*.70,extent*.66,isNight?p.petrol:p.stone,isNight?.16:.22);
 }
 const edgeColor=isNight?'#050B10':p.ink;
 drawSurfaceMaterial(scene,p);
 const vignette=fondoCtx.createRadialGradient(W*.50,H*.48,Math.min(W,H)*.28,
  W*.50,H*.48,extent*.78);
 vignette.addColorStop(0,rgba(edgeColor,0));
 vignette.addColorStop(.68,rgba(edgeColor,isNight?.025:.025));
 vignette.addColorStop(1,rgba(edgeColor,isNight?.115:.07));
 fondoCtx.fillStyle=vignette;fondoCtx.fillRect(0,0,W,H);
 fondoCtx.restore();
}
function drawSceneAtmosphere(scene,p){
 const value=sceneAmbient.value;
 if(value<=.002||scene===4)return;
 const centers=[.46,.50,.50,.50,.50,.50,.50,.52],ys=[.66,.54,.64,.60,.62,.67,.62,.60];
 const centerX=W*(centers[scene]||.5),centerY=H*(ys[scene]||.62);
 const field=pointerInfluenceAt(centerX,centerY,Math.max(W,H)*.62);
 const x=centerX+pointer.dirX*field.strength*W*.012;
 const y=centerY+pointer.dirY*field.strength*H*.014,radius=Math.max(W,H)*.62;
 const tint=scene===0||scene===1?p.amber:scene===2?p.cream:scene===5?p.coral:scene===6?p.amber:p.petrol;
 const glow=ctx.createRadialGradient(x,y,0,x,y,radius);
 glow.addColorStop(0,rgba(tint,night()?.12:.085));
 glow.addColorStop(.42,rgba(tint,night()?.045:.026));
 glow.addColorStop(1,rgba(tint,0));
 ctx.save();ctx.globalAlpha*=value*.72+field.strength*.075;ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.restore();
}
/* Señales ambientales: viven en un lienzo independiente y nunca modifican
   la coreografía, la orientación ni el destino de una sola pieza. */
function idleGlow(x,y,color,opacity=1,r=18){
 if(opacity<=.005||!Number.isFinite(x)||!Number.isFinite(y))return;
 const halo=idleCtx.createRadialGradient(x,y,.4,x,y,r);
 halo.addColorStop(0,rgba(color,.45*opacity));
 halo.addColorStop(.32,rgba(color,.19*opacity));
 halo.addColorStop(1,rgba(color,0));
 idleCtx.fillStyle=halo;idleCtx.beginPath();idleCtx.arc(x,y,r,0,Math.PI*2);idleCtx.fill();
 idleCtx.fillStyle=rgba(color,.80*opacity);
 idleCtx.beginPath();idleCtx.arc(x,y,W<700?1.5:2.1,0,Math.PI*2);idleCtx.fill();
}
function idleBeacon(x,y,color,t,index=0,opacity=1){
 const wave=.5+.5*Math.sin(t*1.15+index*2.1),strength=(.48+.48*wave)*opacity;
 idleGlow(x,y,color,strength,W<700?13:21);
 idleCtx.beginPath();idleCtx.arc(x,y,(W<700?3.3:4.3)+wave*3,0,Math.PI*2);
 idleCtx.strokeStyle=rgba(color,.22*(1-wave*.52)*opacity);
 idleCtx.lineWidth=.85;idleCtx.stroke();
}
// Respiración ambiental: balizas lentas sobre la retícula y una luz que
// la barre de lado a lado. No toca el estado del relato; vive al ritmo
// del propio lienzo y nunca ensombrece la lectura.
function drawIdleSceneAmbient(scene,u,p,t){
 const acto=scene<=1?0:scene<=3?1:scene<=5?2:3;
 const acentos=[p.amber,p.coral,p.cream,p.amber];
 for(let j=0;j<4;j++){
  const i=(j*29+13)%PIONEER_N;
  if(!Number.isFinite(pioneerX[i]))continue;
  const v=.5+.5*Math.sin(t*.9+j*1.9);
  const x=pioneerX[i],y=pioneerY[i];
  idleBeacon(x,y,acentos[(j+acto)%4],t,j,.10+.24*v*v);
 }
 // Una luz fría recorre el conjunto con un ciclo muy largo.
 const barrido=(t*.055)%1;
 const sx=W*(.14+.72*barrido),sy=H*.56;
 idleGlow(sx,sy,p.petrol,.10+.07*Math.sin(t*.8),W<700?12:20);
}

function drawIdleAmbient(now){
 idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);
 idleCtx.clearRect(0,0,W,H);
 if(!ambientRunning||prefersReduced.matches||!root.classList.contains('is-linked'))return;
 const t=idleMotion.time;
 const scene=Math.min(7,Math.floor(clamp(play.t,0,7.9999)));
 const raw=clamp(play.t-scene);
 const u=scene===1?smooth(.015,.91,raw):scene===5?smooth(.015,.97,raw):smooth(.015,.72,raw);
 const p=PAL[night()?'night':'day'];
 const fade=clamp(idleMotion.value*1.2);
 const dissolve=scene<7?smooth(.62,.995,raw):0;
 if(fade<=.002)return;
 // El mismo fundido de la escena principal gobierna las señales ambientales.
 idleCtx.save();idleCtx.globalAlpha*=fade*(1-dissolve);
 drawIdleSceneAmbient(scene,u,p,t);
 idleCtx.restore();
 if(scene<7&&dissolve>.001){
  idleCtx.save();idleCtx.globalAlpha*=fade*dissolve;
  drawIdleSceneAmbient(scene+1,0,p,t);
  idleCtx.restore();
 }
}
function applyPointer(event){
 const rect=canvas.getBoundingClientRect();
 const x=clamp(event.clientX-rect.left,0,W),y=clamp(event.clientY-rect.top,0,H);
 const now=performance.now();
 if(pointer.hasPosition){
  const dx=x-pointer.tx,dy=y-pointer.ty,distance=Math.hypot(dx,dy);
  if(distance>.75){
   const elapsed=Math.max(8,now-pointer.lastMoveAt);
   pointer.dirX=lerp(pointer.dirX,dx/distance,.38);
   pointer.dirY=lerp(pointer.dirY,dy/distance,.38);
   pointer.speed=Math.max(pointer.speed,clamp(distance/elapsed/1.15));
  }
 }else{
  pointer.dirX=0;pointer.dirY=0;pointer.speed=0;pointer.hasPosition=true;
  pointer.x=x;pointer.y=y;
 }
 // El puntero marca el objetivo; la escena persigue esa posicion con
 // inercia. La respuesta es continua: nunca hay un salto.
 pointer.tx=x;pointer.ty=y;pointer.lastMoveAt=now;pointer.lastSpeedUpdateAt=now;
 pointer.active=true;
 pointerTween?.kill();pointerFade?.kill();pointerFade=null;
 if(pointer.energy<.98){
  pointerTween=gsap.to(pointer,{energy:1,duration:.22,ease:'power2.out',onUpdate:invalidateNarrative});
 }else invalidateNarrative();
}
function fadePointer(){
 pointerTween?.kill();pointerFade?.kill();pointerFade=null;
 pointerTween=gsap.to(pointer,{energy:0,duration:.62,ease:'power2.out',
  onUpdate:invalidateNarrative,onComplete:()=>{
   pointer.active=false;pointer.down=false;pointer.speed=0;pointer.hasPosition=false;
   pointer.dirX=0;pointer.dirY=0;invalidateNarrative();
  }});
}
canvas.addEventListener('pointermove',event=>{
 if(prefersReduced.matches||!root.classList.contains('is-linked'))return;
 if(event.pointerType==='touch'&&!pointer.down)return;
 queuePointer(event);
},{passive:true});
canvas.addEventListener('pointerdown',event=>{
 if(prefersReduced.matches||!root.classList.contains('is-linked'))return;
 pointer.down=true;pointerFade?.kill();pointerFade=null;
 queuePointer(event);
},{passive:true});
window.addEventListener('pointerup',event=>{
 if(!pointer.down)return;
 pointer.down=false;
 if(event.pointerType==='touch')pointerFade=gsap.delayedCall(.68,fadePointer);
},{passive:true});
canvas.addEventListener('pointercancel',()=>{pointer.down=false;fadePointer()},{passive:true});
canvas.addEventListener('pointerleave',()=>{if(!pointer.down)fadePointer()},{passive:true});
function stopSceneAmbient(){
  ambientRunning=false;idleLastFrame=0;idleLastRender=0;
  if(W&&H){idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);idleCtx.clearRect(0,0,W,H)}
}
// C · El mundo se mide de vez en cuando: leer el marco de la introducción en
// cada fotograma obligaría al navegador a recalcular la composición sin falta.
let introBounds=null,introBoundsAt=0;
function introVisible(now){
 if(!introBounds||now-introBoundsAt>220){
  introBounds=root.getBoundingClientRect();introBoundsAt=now;
 }
 return introBounds.bottom>0&&introBounds.top<innerHeight;
}
// C · El reloj del mundo. Es la única fuente del movimiento autónomo: avanza
// siempre que la introducción esté a la vista. No depende del puntero, ni del
// foco de la ventana, ni de que el visitante se mueva: si el puntero sale de
// la página, las piezas siguen respirando.
function ambientTick(now){
 if(prefersReduced.matches||!root.classList.contains('is-linked')){stopSceneAmbient();return}
 if(document.hidden||!introVisible(now)){stopSceneAmbient();return}
 ambientRunning=true;
 // El reloj sólo avanza mientras la escena está visible. Al volver a ella,
 // la fase continúa donde quedó, sin saltar ni comenzar otro ciclo.
 const delta=idleLastFrame?Math.min(.08,Math.max(0,(now-idleLastFrame)/1000)):0;
 idleLastFrame=now;
 idleClock+=delta;
 idleMotion.time=idleClock;
 // Durante el scroll el movimiento permanece casi imperceptible; al detenerse
 // gana presencia con una interpolación temporal, nunca con un reinicio.
 const target=scrollIdle?.84:.18;
 const response=1-Math.exp(-delta/(scrollIdle?.72:.30));
 idleMotion.value=lerp(idleMotion.value,target,response);
 if(now-idleLastRender>=ambientInterval()){
  const breathing=.50+.50*Math.sin(idleClock*.90);
  sceneAmbient.value=idleMotion.value*(.35+.58*breathing);
  invalidate('ambient');
 }
}
window.addEventListener('scroll',()=>{
 // Si se desplaza antes de completar la presentación, dejar el titular
 // totalmente legible; el resto de la coreografía sigue unido al scroll.
 if(introTextTween&&window.scrollY>16)introTextTween.progress(1);
 introBounds=null;
 scrollIdle=false;clearTimeout(scrollIdleTimer);
 // La posición del puntero conserva su referencia mientras las escenas cambian.
 // Sólo cambia la intensidad del reposo; la interacción no se desconecta.
 scrollIdleTimer=setTimeout(()=>{scrollIdle=true},170);
},{passive:true});
// La ventana puede perder el foco: la escena sigue viva, sólo se apaga el
// puntero. El movimiento no depende de que el visitante esté mirando.
window.addEventListener('blur',()=>{pointer.down=false;fadePointer()});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){stopSceneAmbient();fadePointer()}
});


function drawScene(i,u,p){
 // Una sola estructura paramétrica para las cuatro escenas: el estado lo da
 // el avance global del recorrido.
 pioneerDibujar(p);
}
// A · El texto de apoyo de la tercera escena se situa a partir de los limites
// reales de la palabra: la banda que ocupa CRECER, el margen de la pieza mas
// grande y el hueco que se quiere dejar libre.
function colocarApoyo(){
 const bloque=copies[2];
 if(!bloque)return;
 const campo=pioneerCampo('CRECER');
 const ancho=Math.min(W*(W<700?.88:.70),860);
 const alto=ancho*campo.aspecto;
 const centro=H*(W<700?.44:.50);
 // La pieza mayor sobresale unas decenas de pixeles del trazo.
 const margenPieza=Math.max(14,Math.round(Math.min(W,H)*.022));
 // El hueco libre se mide sobre el lado corto de la pantalla.
 const hueco=Math.round(Math.min(W,H)*(W<700?.115:.085));
 const bajo=centro+alto*.5+margenPieza+hueco;
 bloque.style.setProperty('--apoyo-top',Math.round(bajo-bloque.offsetTop)+'px');
}
function resize(){
 const box=canvas.getBoundingClientRect();
 W=Math.max(1,box.width);H=Math.max(1,box.height);
 DPR=Math.min(dprCap(),window.devicePixelRatio||1);
 canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
 // La capa ambiental es decorativa: su resolución interna puede ser menor
 // sin que se note, y así deja de competir con el relato por el ancho de banda.
 idleDPR=Math.min(1,DPR);
 rebuildGrain();
 capaInvalidar();
 idleCanvas.width=Math.round(W*idleDPR);idleCanvas.height=Math.round(H*idleDPR);
 idleCtx.setTransform(idleDPR,0,0,idleDPR,0,0);
 ctx.setTransform(DPR,0,0,DPR,0,0);
 // El lienzo principal se repinta aquí porque ha cambiado su tamaño de respaldo;
 // el resto de capas recalculan su geometría por su propia cuenta.
 colocarApoyo();
 paintNarrative();
 invalidate('ambient');
}
// C · El grano, por separado: se aplica una sola vez por fotograma sobre el
// fondo ya compuesto, con el mismo modo y la misma opacidad que antes.
function pintarGrano(c){
 c.save();c.globalCompositeOperation='soft-light';
 c.globalAlpha*=night()?.055:.145;
 if(grainReady)c.drawImage(grainCanvas,0,0,W,H);
 else{c.fillStyle=grainPattern;c.fillRect(0,0,W,H);}
 c.restore();
}

// ============================================================================
// ============================================================================
// INTRODUCCIÓN JMORGADO — la estructura que aprende
//
// Un único protagonista: 96 fragmentos de la misma materia que se ordenan,
// se encienden, crecen y se retiran para dejar paso al portafolio.
// El recorrido es continuo e inverso con el scroll; la cámara y el estado
// del mundo derivan del avance global `play.t / 8`.
//
//   Acto 1 · Idea        la retícula deshecha se ordena; el polvo roza el texto
//   Acto 2 · Forma       la red se enciende y la materia se coloca a la izquierda
//   Acto 3 · Crecimiento CRECER se escribe con la propia materia
//   Acto 4 · Comienzo   la estructura se abre, se desprende y cae
//
// Inspiración de dirección: Pioneer (Corn Revolutionized). Sin copiar recursos
// ni identidad. Sin WebGL, sin vídeo, sin dependencias nuevas.
// Coste por fotograma: 96 rellenos + 64 partículas + ~127 trazos (actos 2 y 3)
// + 1 resplandor cacheado. Sin shadowBlur por pieza ni gradientes por pieza.
// ============================================================================
const PIONEER_N=96;
const PIONEER_ORDEN=.78;
const pioneerCaos=new Float32Array(PIONEER_N*3);
const pioneerOrden=new Float32Array(PIONEER_N*3);
const pioneerRetraso=new Float32Array(PIONEER_N);
const pioneerGrupo=new Uint8Array(PIONEER_N);   // 0 cuerpo · 1 banda · 2 envolvente
const pioneerRadio=new Float32Array(PIONEER_N);
const pioneerTinte=new Float32Array(PIONEER_N);
const pioneerPorRango=new Uint8Array(PIONEER_N);
const pioneerAristas=new Int32Array(2*128);
let pioneerAristasN=0;
const pioneerX=new Float32Array(PIONEER_N);
const pioneerY=new Float32Array(PIONEER_N);
const pioneerZ=new Float32Array(PIONEER_N);
const pioneerS=new Float32Array(PIONEER_N);
const pioneerFase=new Float32Array(PIONEER_N);
const pioneerIdx=new Uint8Array(PIONEER_N);
const pioneerWx=new Float32Array(PIONEER_N);
const pioneerWy=new Float32Array(PIONEER_N);
const pioneerChispa=new Float32Array(PIONEER_N);
const PIONEER_CUERPO=56,PIONEER_BANDA=24,PIONEER_ENVOLVENTE=16;

// El resplandor interior es un sprite cacheado: un único gradiente radial.
let pioneerSprite=null;
let pioneerSpriteKey='';
function pioneerResplandor(color){
 const clave=color+'|'+Math.round(DPR*100);
 if(pioneerSprite&&pioneerSpriteKey===clave)return pioneerSprite;
 const s=192;
 const c=document.createElement('canvas');
 c.width=c.height=s;
 const g=c.getContext('2d');
 const grad=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
 grad.addColorStop(0,rgba(color,.95));
 grad.addColorStop(.42,rgba(color,.34));
 grad.addColorStop(1,rgba(color,0));
 g.fillStyle=grad;
 g.fillRect(0,0,s,s);
 pioneerSprite=c;
 pioneerSpriteKey=clave;
 return c;
}

function pioneerPreparar(){
 const golden=Math.PI*(3-Math.sqrt(5));
 const idx=[];
 for(let i=0;i<PIONEER_N;i++)idx.push(i);
 idx.sort((a,b)=>hash(a*13+3)-hash(b*13+3));
 for(let r=0;r<PIONEER_N;r++)pioneerPorRango[r]=idx[r];
 for(let r=0;r<PIONEER_N;r++){
  const i=pioneerPorRango[r];
  const g=r<PIONEER_CUERPO?0:(r<PIONEER_CUERPO+PIONEER_BANDA?1:2);
  pioneerGrupo[i]=g;
  // 2 · orden: retícula de Vogel en cúpula, con aro de banda y envolvente.
  const sr=Math.sqrt((r+.5)/PIONEER_N),sa=(r+.5)*golden;
  let rr=sr,yy=.30*(1-sr*sr);
  if(g===1){rr=.88+.08*hash(i*5+9);yy=.015;}
  if(g===2){rr=1.16+.07*Math.sin(r*1.7);yy=.34*Math.sin(r*.9);}
  const ox=rr*Math.cos(sa)*PIONEER_ORDEN;
  const oy=yy*PIONEER_ORDEN;
  const oz=rr*Math.sin(sa)*PIONEER_ORDEN;
  pioneerOrden[i*3]=ox;
  pioneerOrden[i*3+1]=oy;
  pioneerOrden[i*3+2]=oz;
  pioneerRadio[i]=rr*PIONEER_ORDEN;
  // 1 · dispersión: la materia deshecha nace de la propia retícula.
  const giro=(hash(i*29+3)-.5)*.90;
  const esc=.70+.58*hash(i*11+3);
  const cg=Math.cos(giro),sg=Math.sin(giro);
  const px=ox*esc,pz=oz*esc;
  pioneerCaos[i*3]=px*cg-pz*sg+(hash(i*37+11)-.5)*.20;
  pioneerCaos[i*3+1]=oy*esc*.85+(hash(i*41+17)-.5)*.46;
  pioneerCaos[i*3+2]=px*sg+pz*cg+(hash(i*43+19)-.5)*.20;
  pioneerRetraso[i]=hash(i*13+31)*.30;
  pioneerTinte[i]=hash(i*23+19);
 }
 // La red: la espiral y sus radios. Son las «uniones» del acto 2.
 let e=0;
 for(let r=0;r<PIONEER_N-1&&e<128;r++){
  pioneerAristas[e*2]=pioneerPorRango[r];
  pioneerAristas[e*2+1]=pioneerPorRango[r+1];
  e++;
 }
 for(let r=0;r<32&&e<128;r++){
  pioneerAristas[e*2]=pioneerPorRango[r];
  pioneerAristas[e*2+1]=pioneerPorRango[r+24];
  e++;
 }
 pioneerAristasN=e;
}
pioneerPreparar();

// ── Tipografía cinética: puntos de las letras ───────────────────────────────
// Un solo lienzo temporal para medir los puntos; el campo se cachea por palabra.
const pioneerCampos={};
function pioneerCampo(palabra){
 let v=pioneerCampos[palabra];
 if(v)return v;
 const temp=document.createElement('canvas');
 temp.width=1400;temp.height=340;
 const c=temp.getContext('2d',{willReadFrequently:true});
 c.clearRect(0,0,1400,340);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
 c.font='800 268px "Instrument Sans",sans-serif';c.fillText(palabra,700,172,1380);
 const data=c.getImageData(0,0,1400,340).data;
 const bruto=[],contorno=[];
 let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
 // Muestreo fino: la silueta necesita puntos suficientes para leerse.
 for(let y=5;y<335;y+=2)for(let x=3;x<1397;x+=2){
  if(data[(y*1400+x)*4+3]>120){
   bruto.push({x,y});
   // El borde de la letra: por fuera no hay tinta. Sirve para reforzar el
   // contorno sin volver la palabra un recorte rigido.
   const lado=data[(y*1400+Math.min(x+3,1399))*4+3]<=120
    ||data[(Math.min(y+3,339)*1400+x)*4+3]<=120;
   if(lado)contorno.push({x,y});
   if(x<minX)minX=x; if(x>maxX)maxX=x;
   if(y<minY)minY=y; if(y>maxY)maxY=y;
  }
 }
 const ancho=Math.max(1,maxX-minX),alto=Math.max(1,maxY-minY);
 const cx0=(minX+maxX)/2,cy0=(minY+maxY)/2;
 const normalizar=(lista)=>{
  const out=new Array(lista.length);
  for(let i=0;i<lista.length;i++)out[i]={x:(lista[i].x-cx0)/ancho,y:(lista[i].y-cy0)/alto};
  return out;
 };
 const pts=normalizar(bruto);
 v={pts,borde:contorno.length?normalizar(contorno):pts,aspecto:alto/ancho};
 pioneerCampos[palabra]=v;
 return v;
}

// Las partículas de polvo: la misma materia que los fragmentos, a otra escala.
const DUST_N=900;
const dustX=new Float32Array(DUST_N);
const dustY=new Float32Array(DUST_N);
const dustS=new Float32Array(DUST_N);
const dustTinte=new Uint8Array(DUST_N);
const dustAlpha=new Float32Array(DUST_N);
const dustCorte=new Uint8Array(DUST_N);
const DUST_LEVELS=6;
const dustBucket=new Uint8Array(DUST_N);
function pioneerPolvo(e,p,fondo){
 const tiempo=prefersReduced.matches?0:idleMotion.time;
 // El fondo decide el tratamiento: en modo dia la materia necesita mas peso.
 const oscuro=pioneerOscuro(fondo);
 const cx=W*.5,cy=H*(W<700?.44:.485);   // la palabra CRECER vive junto al titular
 const palabra='CRECER';
 const campo=pioneerCampo(palabra);
 const destinoW=Math.min(W*(W<700?.88:.70),860),destinoH=destinoW*campo.aspecto;
 // Compuertas por acto: el polvo existe en los momentos narrativos.
 const aIdea=1-smooth(.24,.30,e.g);
 const aCrecer=smooth(.48,.58,e.g)*(1-smooth(.74,.84,e.g));
 const aCaida=smooth(.74,.96,e.g);
 for(let i=0;i<DUST_N;i++){
  const h1=hash(i*3+11),h2=hash(i*5+17),h3=hash(i*7+29),h4=hash(i*11+43);
  const ph=h1*6.28318;
  let x,y,tam,tinta,surge;
  // Trayectoria base en deriva, distinta por partícula.
  const paso=tiempo*.16;
  const derivaX=Math.sin(paso*(.7+h2*.6)+ph);
  const derivaY=Math.cos(paso*(.62+h3*.5)+ph*1.7);
  const baseX=W*(.5+(h2-.5)*.62)+derivaX*W*.045;
  const baseY=H*(.40+h3*.34)+derivaY*H*.04;
  if(aCrecer>.001||aCaida>.001){
   // Acto 3/4 · el polvo converge y escribe CRECER en el centro.
   // El reparto combina el cuerpo de la letra con su contorno: las letras
   // quedan cubiertas y el borde se reinforceza.
  // El cuerpo de la letra y su contorno: el contorno recibe mas materia y
   // particulas mayores, asi la palabra se recorta contra el fondo.
   const nBorde=Math.floor(DUST_N*.30);
   let punto;
   if(i<nBorde&&campo.borde.length){
    const tb=campo.borde.length;
    punto=campo.borde[Math.floor(i*(tb-1)/Math.max(1,nBorde-1))];
    dustCorte[i]=1;
   }else{
    const total=campo.pts.length;
    punto=campo.pts[Math.floor((i-nBorde)*(total-1)/Math.max(1,DUST_N-nBorde-1))];
   }
  const dx=cx+punto.x*destinoW;
  const dy=cy+punto.y*destinoH;
  const cp=clamp((e.crecer-h2*.30)/.70,0,1);
  const ease=cp*cp*(3-2*cp);
  x=baseX+(dx-baseX)*ease;
  y=baseY+(dy-baseY)*ease;
  if(aCaida>0){y+=aCaida*(.22+.62*h3)*H;x+=(h2-.5)*W*.10*aCaida;}
  tam=(2.4+2.6*h4)*(1+aCrecer*.42)*(dustCorte[i]?1.45:1.18)*(Math.min(W,H)<520?.62:1);
  tinta=h4<.40?2:h4<.70?1:0;
  surge=aCrecer*(.34+.58*h4)+aCaida*(.62+.34*h4)*(1-aCaida*.55);
 }else{
  // Acto 1 · el polvo roza la palabra IDEA: deriva y se deja atraer.
  const rect=pioneerMedirTexto();
  x=baseX;y=baseY;
  if(rect){
   const dx=rect.cx-x,dy=rect.cy-y,d=Math.hypot(dx,dy)||1;
   const pull=clamp(1-d/(Math.min(W,H)*.44),0,1)*.62;
   x+=dx/d*pull*Math.min(W,H)*.16;
   y+=dy/d*pull*Math.min(W,H)*.16;
  }
  tam=(2.6+2.6*h4)*(Math.min(W,H)<520?.62:1);
  tinta=h4<.30?2:h4<.62?0:1;
  surge=(i<DUST_N*.24?aIdea*(oscuro?.26+.60*h4:.34+.62*h4):0);
 }
  dustCorte[i]=dustCorte[i]&&aCrecer>.001?1:0;
  dustX[i]=x;dustY[i]=y;dustS[i]=tam;dustTinte[i]=tinta;
 dustAlpha[i]=surge;
}
}
function pioneerMedirTexto(){
 const ahora=performance.now();
 if(pioneerMedirTexto.cache&&ahora-pioneerMedirTexto.t<700)return pioneerMedirTexto.cache;
 const el=root.querySelector('[data-copy="0"] .study-key');
 if(!el){pioneerMedirTexto.cache=null;pioneerMedirTexto.t=ahora;return null;}
 const r=el.getBoundingClientRect();
 const rect={cx:r.left+r.width*.5,cy:r.top+r.height*.5};
 pioneerMedirTexto.cache=rect;
 pioneerMedirTexto.t=ahora;
 return rect;
}

// El recorrido global: 0 al principio, 1 al final.
function pioneerClave(valores,g){
 const n=valores.length-1;
 const f=clamp(g)*n;
 const i=Math.min(n-1,Math.floor(f));
 return lerp(valores[i],valores[i+1],f-i);
}
function pioneerEstado(){
 const g=clamp(play.t/8,0,1);
 // Acto 1 · carga y ensamblaje. La materia entra condensada y tensa, el
 // montaje la libera pieza a pieza y un latido la separa antes de encajar.
 const carga=1-smooth(.00,.085,g);
 const orden=smooth(.04,.28,g);
 const montaje=smooth(.02,.10,g)*(1-smooth(.26,.48,g));
 const activacion=smooth(.28,.44,g);
 const expansion=smooth(.42,.62,g);
 const apertura=smooth(.60,.80,g);
 const huida=smooth(.74,.94,g);
 // La palabra CRECER se escribe dentro del tercer acto, junto a su titular.
 const crecer=smooth(.50,.65,g);
 const tiempo=prefersReduced.matches?0:idleMotion.time;
 return {
  g,orden,activacion,expansion,apertura,huida,crecer,carga,montaje,
  angulo:tiempo*.048+g*1.62,
  elevacion:pioneerClave([.40,.38,.46,.36,.30,.22],g),
  distancia:pioneerClave([3.70,3.60,3.26,3.02,3.22,3.55],g),
  centroX:pioneerClave([.72,.71,.33,.33,.50,.50,.50],g),
  centroY:pioneerClave([.565,.555,.545,.555,.60,.635],g),
  escala:pioneerClave([.63,.62,.53,.50,.47,.42],g),
 };
}
function pioneerFondo(){
 const t=clamp(play.t,0,7.9999),i=Math.min(7,Math.floor(t)),raw=t-i;
 const dissolve=i<7?smooth(.62,.995,raw):0;
 const p=PAL[night()?'night':'day'];
 return i<7?mix(p.bg[i],p.bg[i+1],dissolve):p.bg[7];
}
function pioneerLuz(color){
 const c=color.startsWith('rgb')?color.match(/[\d.]+/g).slice(0,3).map(Number):rgb(color);
 return (c[0]*.2126+c[1]*.7152+c[2]*.0722)/255;
}
function pioneerOscuro(color){
 return pioneerLuz(color)<.42;
}
// El acento de la marca (coral) desaparece sobre un fondo coral: cede cuando pasa.
function pioneerAcento(p,fondo,oscuro){
 if(Math.abs(pioneerLuz(p.coral)-pioneerLuz(fondo))<.15)return oscuro?p.cream:p.ink;
 return p.coral;
}

function pioneerDibujar(p){
 const e=pioneerEstado();
 const fondo=pioneerFondo();
 const oscuro=pioneerOscuro(fondo);
 const centroX=W*e.centroX,centroY=H*e.centroY;
 const escala=Math.min(W,H)*e.escala;
 const ang=e.angulo,elev=e.elevacion,dist=e.distancia;
 const ca=Math.cos(ang),sa=Math.sin(ang),ce=Math.cos(elev),se=Math.sin(elev);
 const focal=2.2;
 const calidez=smooth(.28,.52,e.g);
 const acento=pioneerAcento(p,fondo,oscuro);
 // En modo dia el papel claro se come los tonos medios: las piezas grises,
 // coral y doradas necesitan mas peso para no desaparecer.
 const colorCuerpo=oscuro?mix(p.cream,p.stone,.22):mix(p.ink,p.petrol,.44);
 const colorBanda=mix(acento,oscuro?p.amber:acento,.14+calidez*.26);
 const colorHalo=oscuro?mix(p.cream,p.ash,.46):mix(p.ash,p.petrol,.68);
 const colorLinea=oscuro?mix(p.cream,p.petrol,.58):mix(p.petrol,p.cream,.10);
 const colorRed=mix(colorLinea,p.amber,.72);

 // 1 · posiciones en el mundo.
 const tamBase=escala*(.032+.026*e.orden);
 const fade=(1-e.huida*.66);
 // C · Carga: la materia entra condensada y tensa. El montaje la libera
 // pieza a pieza; un latido la separa y la reagrupa antes de encajar.
 const carga=e.carga;
 const latidoCarga=Math.sin(smooth(.08,.24,e.g)*Math.PI);
 // C · Encendido: el pulso recorre las piezas en el orden del montaje.
 const frente=smooth(.02,.30,e.g);
 for(let i=0;i<PIONEER_N;i++){
  const k=i*3;
  const ret=pioneerRetraso[i];
  const tO=clamp((e.orden-ret*.52)/(1-ret*.52));
  // El montaje no es lineal: la pieza llega con energía y se asienta.
  // El montaje: la pieza se queda un momento dispersa, acelera hacia su
  // sitio, llega con energia y se asienta.
  const paso=tO*tO*(3-2*tO);
  const te=paso>=1?1:paso+(1-paso)*(1-paso)*Math.sin(paso*Math.PI)*.22;
  let x=pioneerCaos[k]*(1-te)+pioneerOrden[k]*te;
  let y=pioneerCaos[k+1]*(1-te)+pioneerOrden[k+1]*te;
  let z=pioneerCaos[k+2]*(1-te)+pioneerOrden[k+2]*te;
  // La trayectoria no es recta: la pieza describe un arco hacia su sitio, como
  // si fuera atraida por el lugar que le toca ocupar.
  const dirX=pioneerOrden[k]-pioneerCaos[k],dirZ=pioneerOrden[k+2]-pioneerCaos[k+2];
  const largo=Math.hypot(dirX,dirZ)||1;
  const arco=Math.sin(te*Math.PI)*(.10+.12*hash(i*17+7));
  const signo=hash(i*23+11)*2-1;
  x+=-dirZ/largo*arco*signo;
  z+=dirX/largo*arco*signo;
  y+=Math.sin(te*Math.PI)*signo*.05;
  // La carga condensa el conjunto hacia el núcleo antes de liberarlo.
  x*=1-carga*.50;z*=1-carga*.50;y*=1-carga*.26;
  // El latido separa y reagrupa la materia.
  const empuje=1+latidoCarga*.12;
  x*=empuje;z*=empuje;
  // El perímetro se abre: el crecimiento nace del borde. En la apertura final
  // la estructura se aplana y cede el sitio al portafolio.
  const apertura=Math.max(e.expansion,e.apertura*1.15);
  if(apertura>0){
   const ext=Math.max(0,pioneerRadio[i]-.46);
   const push=1+apertura*(.12+.62*ext);
   x*=push;z*=push;
   y+=apertura*(.05+.78*ext)-e.apertura*.34;
  }
  // Acto 4 · la materia se desprende: cada pieza cae con su propio peso,
  // se separa del conjunto y gira. El descenso acompaña el traspaso al sitio.
  if(e.huida>0){
    y-=e.huida*(.78+hash(i*3+5)*.72);
    x+=(hash(i*7+13)-.5)*e.huida*.85;
    z+=(hash(i*11+19)-.5)*e.huida*.55;
   }
  // La cámara: órbita continua, se acerca y se eleva.
  const x1=x*ca-z*sa,z1=x*sa+z*ca;
  const y2=y*ce-z1*se,z2=y*se+z1*ce;
  const zz=dist-z2;
  const prof=focal/Math.max(.4,zz);
  pioneerX[i]=centroX+x1*prof*escala;
  pioneerY[i]=centroY-y2*prof*escala;
  pioneerZ[i]=zz;
  pioneerFase[i]=i*2.399963+e.angulo*.30+e.huida*hash(i*11+3)*2.6;
  // C · Cada pieza respira por su cuenta y conserva un zumbido mínimo: el
  // conjunto nunca queda congelado, ni con el puntero quieto ni fuera.
  const resp=idleMotion.value;
   // C - Flujo lento: dos oscilaciones de frecuencia baja (12 y 18 s) y
   // amplitud de pocos pixeles. La estructura respira; no tiembla.
   const latido=Math.sin(idleMotion.time*.62+pioneerFase[i]*1.7);
   const deriva=Math.sin(idleMotion.time*.52+pioneerFase[i]*.9);
   const deriva2=Math.cos(idleMotion.time*.35+pioneerFase[i]*1.4);
   // El pulso de encendido enciende la pieza justo cuando el frente la alcanza.
   const chispa=clamp(1-Math.abs(frente-ret/.30)*4.2,0,1);
   pioneerS[i]=tamBase*prof*(1+latido*.05*resp)*(1+chispa*.12);
   pioneerX[i]+=(deriva*escala*.012+deriva2*escala*.007)*resp;
   pioneerY[i]+=(deriva2*escala*.010+deriva*escala*.005)*resp;
   pioneerChispa[i]=chispa;
 }
 // La palabra CRECER la escriben los propios fragmentos: la geometría responde
 // a las letras. Se calcula en espacio de pantalla para que la órbita de la
 // cámara no distorsione la tipografía.
 const tL=e.crecer;
 let campo=null,destinoW=0,destinoH=0;
 const cyLetra=H*(W<700?.44:.50);
 if(tL>0){
  campo=pioneerCampo('CRECER');
  destinoW=Math.min(W*(W<700?.88:.70),860);destinoH=destinoW*campo.aspecto;
  const total=campo.pts.length;
  for(let i=0;i<PIONEER_N;i++){
   // Dispersión por área: cada fragmento cae en un punto de la silueta
   // con cobertura uniforme, sin bandas diagonales.
   // Los fragmentos recorren la letra entera en un barrido parejo: el
   // interior de cada caracter se construye y no se acumulan sin criterio.
   const punto=campo.pts[Math.floor(i*(total-1)/Math.max(1,PIONEER_N-1))];
   pioneerWx[i]=centroX+punto.x*destinoW;
   pioneerWy[i]=cyLetra+punto.y*destinoH;
  }
 }
 // 2 · orden de profundidad: el pintor, de lejos a cerca.
 for(let i=0;i<PIONEER_N;i++)pioneerIdx[i]=i;
 for(let a=1;a<PIONEER_N;a++){
  const j=pioneerIdx[a],k=pioneerZ[j];
  let b=a-1;
  while(b>=0&&pioneerZ[pioneerIdx[b]]>k){pioneerIdx[b+1]=pioneerIdx[b];b--;}
  pioneerIdx[b+1]=j;
 }
 // 3 · la luz interior: un único resplandor cacheado.
 const radioLuz=escala*(.58+.32*e.activacion+.10*e.apertura);
 let colorLuz=p.amber;
 if(Math.abs(pioneerLuz(colorLuz)-pioneerLuz(fondo))>.13)colorLuz=mix(p.amber,p.coral,.28+calidez*.42);
 ctx.globalAlpha=(oscuro?.06:.04)+(.24*e.activacion*(1-e.apertura*.85))+(.07*e.apertura);
 ctx.drawImage(pioneerResplandor(colorLuz),centroX-radioLuz,centroY-radioLuz,radioLuz*2,radioLuz*2);
 ctx.globalAlpha=1;
 // C · La palabra emerge de la atmósfera: un halo suave la separa del fondo
 // sin recortarla ni volverla un signo rígido.
 if(tL>.02&&campo){
  ctx.save();
  ctx.translate(centroX,cyLetra);
  ctx.scale(1,Math.max(.20,destinoH/destinoW*1.7));
  const halo=ctx.createRadialGradient(0,0,0,0,0,destinoW*.54);
  halo.addColorStop(0,rgba(colorLuz,.15*tL));
  halo.addColorStop(.46,rgba(colorLuz,.065*tL));
  halo.addColorStop(1,rgba(colorLuz,0));
  ctx.fillStyle=halo;ctx.fillRect(-destinoW,-destinoW,destinoW*2,destinoW*2);
  ctx.restore();
 }
 ctx.globalAlpha=1;
 // 4 · la red de uniones: aparece en el acto 2 y se enciende en el 3.
 const web=smooth(.04,.22,e.g)*(1-smooth(.62,.80,e.g));
 if(web>.01){
  const frente=prefersReduced.matches?0:(idleMotion.time*.075)%1;
  const act=e.activacion;
  ctx.lineWidth=1;
  for(let a=0;a<pioneerAristasN;a++){
   const i=pioneerAristas[a*2],j=pioneerAristas[a*2+1];
   const prof=clamp((pioneerZ[i]+pioneerZ[j])*.5-1.1,0,2.6)/2.6;
   const s=a/Math.max(1,pioneerAristasN-1);
   const pulso=smooth(.10,0,Math.abs(s-frente));
   ctx.globalAlpha=web*(oscuro?(.30+.34*act+.55*act*pulso):(.46+.36*act+.42*act*pulso))
        *(1-prof*(oscuro?.70:.46))*fade;
   ctx.strokeStyle=act>.02&&pulso>.04?colorRed:colorLinea;
   ctx.beginPath();
   ctx.moveTo(pioneerX[i],pioneerY[i]);
   ctx.lineTo(pioneerX[j],pioneerY[j]);
   ctx.stroke();
  }
  ctx.globalAlpha=1;
 }
 // 5 · los fragmentos, de lejos a cerca.
 const alcance=Math.min(W,H)*.34;
 for(let a=0;a<PIONEER_N;a++){
  const i=pioneerIdx[a];
  const g=pioneerGrupo[i];
  const ret=pioneerRetraso[i];
  const tO=clamp((e.orden-ret*.52)/(1-ret*.52));
  const niebla=clamp((pioneerZ[i]-1.15)/3.4,0,oscuro?.62:.36);
  const luz=clamp(1-(pioneerZ[i]-1.0)*.55,.18,1);
  const activo=e.activacion;
  let base=g===1?colorBanda:(g===2?colorHalo:colorCuerpo);
  // De dia la luz no lava las piezas: el tono se mantiene y la pieza existe.
  base=mix(base,mix(base,p.cream,oscuro?.60:.26),luz*(.12+.46*activo));
  // El pulso de encendido: la pieza brilla un instante al recibir la carga.
  if(pioneerChispa[i]>.01)base=mix(base,mix(base,p.cream,.92),pioneerChispa[i]*.85);
  base=mix(base,fondo,niebla*(oscuro?.62:.38));
  // La respuesta al puntero se mantiene localizada y sutil.
  const inf=pointerInfluenceAt(pioneerX[i],pioneerY[i],alcance);
  let sx=pioneerX[i],sy=pioneerY[i];
  if(tL>0){
   sx+=(pioneerWx[i]-sx)*tL;
   sy+=(pioneerWy[i]-sy)*tL+e.huida*(.20+.55*hash(i*3+5))*H;
  }
  if(inf.strength>.001){
   const d=Math.max(1,inf.distance);
   const off=inf.strength*escala*.085;
   sx+=inf.dx/d*off;
   sy+=inf.dy/d*off;
  }
  const tL2=e.crecer;
  const s=pioneerS[i]*(1+inf.strength*.35)*(1-tL2*.52);
  const c2=Math.cos(pioneerFase[i]),s2=Math.sin(pioneerFase[i]);
  const ex=s*.60,ey=s*.88;
  const apago=1-smooth(.55,.72,e.g)*.32;
  const alpha=(.72+.28*tO)*(.80+.20*activo)*(1-niebla*.30)*fade*apago*(1+tL2*.30);
  ctx.globalAlpha=alpha;
  ctx.fillStyle=base;
  ctx.beginPath();
  ctx.moveTo(sx+c2*ex,sy+s2*ex);
  ctx.lineTo(sx-s2*ey,sy+c2*ey);
  ctx.lineTo(sx-c2*ex,sy-s2*ex);
  ctx.lineTo(sx+s2*ey,sy-c2*ey);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=alpha*.70;
  ctx.strokeStyle=mix(base,p.cream,oscuro?.42:.40);
  ctx.lineWidth=1;
  ctx.stroke();
 }
 ctx.globalAlpha=1;
 // 6 · el polvo: IDEA en el acto 1, CRECER en el acto 3, desprendimiento en el 4.
 if(e.huida>.96){ctx.globalAlpha=1;return;}
pioneerPolvo(e,p,fondo);
 // En modo día el polvo usa tonos medios: el papel claro no puede esconderlo.
 const tintaPolvo=oscuro?[mix(p.cream,p.stone,.35),p.amber,acento]
                      :[mix(p.ash,p.petrol,.42),mix(p.amber,p.clay,.52),acento];
 // El polvo se dibuja agrupado: un camino por tono y por nivel de opacidad.
 // Rellenar cada partícula por separado era el mayor coste del lienzo.
 for(let i=0;i<DUST_N;i++){
  const alfa=dustAlpha[i]*fade;
  dustBucket[i]=dustTinte[i]*DUST_LEVELS+Math.min(DUST_LEVELS-1,Math.floor(clamp(alfa)*DUST_LEVELS));
 }
 for(let t=0;t<3;t++){
  for(let l=0;l<DUST_LEVELS;l++){
   const bucket=t*DUST_LEVELS+l;
   ctx.globalAlpha=(l+.5)/DUST_LEVELS;
   ctx.fillStyle=tintaPolvo[t];
   ctx.beginPath();
   let any=false;
   for(let i=0;i<DUST_N;i++){
    if(dustBucket[i]!==bucket)continue;
    const s=dustS[i],px=dustX[i],py=dustY[i];
    ctx.moveTo(px,py-s);
    ctx.lineTo(px+s*.72,py);
    ctx.lineTo(px,py+s);
    ctx.lineTo(px-s*.72,py);
    any=true;
   }
   if(any)ctx.fill();
  }
 }
 ctx.globalAlpha=1;
}
function paintNarrative(){
 if(!W||!H)return;
 const now=performance.now();
 if(pointer.speed>.001){
  const elapsed=Math.max(0,now-(pointer.lastSpeedUpdateAt||now));
  pointer.speed*=Math.exp(-elapsed/230);
 }
 pointer.lastSpeedUpdateAt=now;
 const p=PAL[night()?'night':'day'];
 const t=clamp(play.t,0,7.9999),i=Math.min(7,Math.floor(t)),raw=t-i;
 // Cada tramo termina exactamente donde comienza el siguiente: las mismas piezas
 // viajan entre posiciones compartidas, en lugar de aparecer como dibujos distintos.
 // Cada capítulo alcanza su composición máxima antes del final del tramo
 // y conserva una pausa visual para leer e interactuar sin que se desarme.
 const u=i===1?smooth(.015,.91,raw):i===5?smooth(.015,.97,raw):smooth(.015,.72,raw);
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
 // El fondo se reutiliza desde el cache cuando el tramo no esta en
 // transicion; en transicion se repinta en vivo porque el color base se mueve.
 // El color base se mezcla en cada fotograma; las capas del fondo salen de
 // la cache por escena y se componen con el mismo crossfade que hacia el
 // motor, de modo que la transicion tambien pasa a ser un par de blits.
 ctx.clearRect(0,0,W,H);
 ctx.fillStyle=background;
 ctx.fillRect(0,0,W,H);
 if(!capaClaveValida()){
  capaTema=night()?'night':'day';capaAncho=W;capaAlto=H;capaDPR=DPR;
  capaInvalidar();
 }
 if(!capaListoA||capaTramoA!==i){
  capaGenerar(i,capaCanvasA,capaCtxA);capaTramoA=i;capaListoA=true;
 }
 if(i<7){
  if(!capaListoB||capaTramoB!==i+1){
   capaGenerar(i+1,capaCanvasB,capaCtxB);capaTramoB=i+1;capaListoB=true;
  }
 }else{capaListoB=false;capaTramoB=-1;}
 ctx.globalAlpha=1-dissolve;
 ctx.drawImage(capaCanvasA,0,0,W,H);
 if(capaListoB&&dissolve>.001){
  ctx.globalAlpha=dissolve;
  ctx.drawImage(capaCanvasB,0,0,W,H);
 }
 ctx.globalAlpha=1;
 pintarGrano(ctx);
 drawSceneAtmosphere(i,p);
 // La primera escena comienza mezclada y el propio scroll lleva las piezas
 // hasta su composición ordenada; no hay una animación automática que la adelante.
  // La transicion entre escenas la resuelve la propia estructura: no hace
  // falta el bloque de transicion de piezas.
  drawScene(i,u,p);
}
// El tema afecta a todas las capas: cada una lee su paleta en su propio pintado.
function syncTheme(){themeButton.textContent=night()?'Modo día':'Modo noche';invalidateAll()}
themeButton.addEventListener('click',()=>{siteTheme?.click();syncTheme()});
document.addEventListener('click',e=>{if(e.target.closest('[data-theme-toggle]'))requestAnimationFrame(syncTheme)});
window.addEventListener('storage',syncTheme);
const themes=new MutationObserver(syncTheme);
themes.observe(document.documentElement,{attributes:true,attributeFilter:['data-jm-theme']});
syncTheme();
function navStatus(){
 // La cabecera pertenece al sitio: aparece cuando el contenido empieza y se
 // retira en cuanto el visitante vuelve a las escenas.
 const active=destination.getBoundingClientRect().top<=innerHeight*.92;
 document.body.classList.toggle('intro-in-content',active);
 header.inert=!active;header.setAttribute('aria-hidden',String(!active));
}
function skipJourney(e){
 e.preventDefault();destination.scrollIntoView({block:'start',behavior:'instant'});
 destination.focus({preventScroll:true});ScrollTrigger.update();navStatus();
}
skip.addEventListener('click',skipJourney);
function goToHomeStart(event,instant){
 if(event){
  if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
 }
 if(location.hash!=='#home-start'){
  history.replaceState(history.state,'',location.pathname+location.search+'#home-start');
 }
 // Volver al inicio de la experiencia: «Todo comienza con una idea». El
 // documento no se recarga y el motor sigue atado a la posición real del
 // scroll, de modo que el recorrido puede repetirse en ambos sentidos.
 const suave=!instant&&!prefersReduced.matches;
 window.scrollTo({top:0,behavior:suave?'smooth':'instant'});
 clearTimeout(goToHomeStart.timer);
 goToHomeStart.timer=setTimeout(()=>{ScrollTrigger.update();navStatus()},suave?1400:60);
}
document.querySelectorAll('[data-home-return]').forEach(link=>link.addEventListener('click',goToHomeStart));
function activeCopyForScene(scene){
 // Cuatro actos a dos escenas cada uno.
 if(scene<=1)return 0;
 if(scene<=3)return 1;
 if(scene<=5)return 2;
 return 3;
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
 stopSceneAmbient();
 if(prefersReduced.matches){idleMotion.value=0;sceneAmbient.value=0}
 master?.kill();trigger?.kill();introTextTween?.kill();introTextTween=null;
 pointerTween?.kill();pointerFade?.kill();pointerTween=null;pointerFade=null;
 Object.assign(pointer,{x:0,y:0,energy:0,active:false,down:false,dirX:0,dirY:0,
  speed:0,lastMoveAt:0,lastSpeedUpdateAt:0,hasPosition:false});
 activeCopyIndex=-1;
 const compact=matchMedia('(max-height:620px)').matches,reduce=prefersReduced.matches,simple=reduce;
 root.classList.toggle('is-compact',compact);root.classList.toggle('is-mobile',mqMobile.matches);
 root.classList.toggle('is-static',simple);root.classList.toggle('is-linked',!simple);
 document.body.classList.add('intro-ready');
 if(simple){
  root.dataset.scene='0';
  root.classList.add('all-copies');
  play.t=0;
  copies.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden');gsap.set(c,{clearProps:'all'})});
  document.body.classList.add('intro-in-content');
  header.inert=false;header.removeAttribute('aria-hidden');
  resize();return;
 }
 root.classList.remove('all-copies');
 master=gsap.timeline({paused:true,onUpdate:()=>{
  invalidateNarrative();syncSceneState();
 }});
 play.t=0;
 // El ritmo reserva tiempo para que cada transformacion se complete y pueda leerse.
 const sceneLengths=[2.00,1.90,1.70,2.00,1.80,2.00,1.50,1.60];
 const sceneStarts=[0];
 sceneLengths.forEach((length,i)=>{
  master.to(play,{t:i+1,duration:length,ease:'none'},sceneStarts[i]);
  master.addLabel('chapter-'+i,sceneStarts[i]+length*.5);
  sceneStarts.push(sceneStarts[i]+length);
 });
 master.addLabel('finish',sceneStarts[8]+.02);
  // Las cuatro escenas, una por acto. El relevo se resuelve con un cruce:
  // un texto nunca desaparece antes de que el siguiente haya empezado a
  // aparecer, así que en ningún momento queda la pantalla en blanco.
  const copyRange=[[0,2.08],[1.92,4.08],[3.94,6.08],[5.92,8]];
  const total=sceneStarts[8];
  const act=pt=>pt/8*total;
  copies.forEach((copy,i)=>{
   const fragments=copy.querySelectorAll('.study-mask>span'),desc=copy.querySelector('.study-description');
   const rule=copy.querySelector('.study-rule');
   const begin=act(copyRange[i][0]);
   const fromX=i===1?-26:0;
   gsap.set(copy,{autoAlpha:i===0?1:0});
   gsap.set(fragments,{yPercent:105,xPercent:i===0?0:fromX});
   gsap.set(rule,{scaleX:0,transformOrigin:'left center'});
   if(desc)gsap.set(desc,{opacity:0,y:16});
   if(i===0){
    // La primera frase no espera al scroll: la primera linea es visible desde la carga.
    gsap.set(fragments[0],{yPercent:0,y:12,opacity:0});
   }else{
    master.to(copy,{autoAlpha:1,duration:.16},begin);
    master.to(fragments,{yPercent:0,xPercent:0,duration:i===3?.60:.52,stagger:i===3?.12:.18,ease:'power3.out'},begin+.04);
    master.to(rule,{scaleX:1,duration:.40,ease:'sine.out'},begin+.58);
    if(desc)master.to(desc,{opacity:1,y:0,duration:.46,ease:'power2.out'},begin+.64);
   }
   if(i<copies.length-1)master.to(copy,{autoAlpha:0,duration:.26},act(copyRange[i+1][0]));
  });
 master.to({},{duration:.02},sceneStarts[8]+.02);
 trigger=ScrollTrigger.create({id:'jmorgado-journey',trigger:root,start:'top top',end:'bottom bottom',
  animation:master,scrub:.30,anticipatePin:1,invalidateOnRefresh:true,
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
}
let resizeTick=0;
window.addEventListener('resize',()=>{
 cancelAnimationFrame(resizeTick);resizeTick=requestAnimationFrame(()=>{resize();ScrollTrigger.refresh()});
});
prefersReduced.addEventListener('change',setup);
mqMobile.addEventListener('change',setup);
document.fonts.ready.then(()=>{
 // La silueta de CRECER se mide con la tipografía real: al cargar las
 // fuentes hay que volver a medirla y repintar.
 for(const key in pioneerCampos)delete pioneerCampos[key];
 resize();ScrollTrigger.refresh();
});

// D · Ciclo de fotogramas del motor. Un solo ciclo gobierna todas las capas:
// el puntero se aplica una vez, el ambiente respira a su ritmo y el relato se
// repinta sólo cuando ha cambiado. Cuando la escena está detenida el motor no
// mantiene trabajo de pintado: si nada está sucio, no se pinta nada.
function engineTick(){
 // El reloj propio del navegador. El tiempo que entrega el ticker de GSAP es un
 // tiempo de animacion relativo y puede saltar hacia atras al corregir el retardo
 // (lag smoothing), asi que no sirve para medir cadencias.
 const now=performance.now();
 const dt=pointerFrameAt?Math.min(.08,Math.max(0,(now-pointerFrameAt)/1000)):0;
 pointerFrameAt=now;
 if(pointerDirty){pointerDirty=false;applyPointer(pendingPointer)}
 // El campo del puntero sigue al puntero con inercia: las piezas se desplazan
 // con suavidad, sin tirones ni saltos de posicion.
 if(pointer.active&&dt>0){
  const k=1-Math.exp(-dt/.12);
  pointer.x+=(pointer.tx-pointer.x)*k;
  pointer.y+=(pointer.ty-pointer.y)*k;
 }
 // El reloj propio del navegador. El tiempo que entrega el ticker de GSAP es un
 // tiempo de animación relativo y puede saltar hacia atrás al corregir el retardo
 // (lag smoothing), así que no sirve para medir cadencias.
 ambientTick(now);
 ajustarResolucion();
 // C · El ambiente se pinta a su propio ritmo y nunca arrastra al relato.
 if(ambientLayer.due(now))ambientLayer.paint(now);
 // A · El relato se repinta si su estado ha cambiado o si el mundo late.
 if(narrativeLayer.due(now))narrativeLayer.paint(now);
}
gsap.ticker.add(engineTick);
 // El sondeo arranca una sola vez y mide el intervalo real entre fotogramas.
 // El nivel de resolucion se inicializa ANTES de decidir: dprAjustable()
 // depende de el y, al evaluarse antes, el sondeo nunca llegaba a arrancar.
 dprInicializar();
 if(dprAjustable()&&!frameSonda){
  frameSonda=requestAnimationFrame(frameSondaTick);
 }

setup();
window.addEventListener('scroll',navStatus,{passive:true});
if(location.hash==='#home-start'){
 requestAnimationFrame(()=>requestAnimationFrame(()=>goToHomeStart(null,true)));
}
})();
