/* ---------- Dracula monocular intro ----------
   Idle: Dracula holds a monocular; a dot-matrix Earth spins inside the lens.
   On tap: the globe turns to Tasmania and zooms in, the lens swallows the screen, we drop through
   cloud onto a stylised Launceston street grid and lock onto 18 Innes Street. Then enter() (main
   script) fades the splash away and the rest of the page takes over.
   Everything is drawn from time t, so skipping or reduced motion just jumps t forward. */
(()=>{
const splash=document.getElementById('splash');if(!splash)return;
const el=id=>document.getElementById(id);
const sky=el('ic-sky'),sx=sky.getContext('2d'),lens=el('ic-lens'),lx=lens.getContext('2d'),scene=el('ic-scene'),hud=el('ic-hud'),tag=el('ic-tag');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const D2R=Math.PI/180,TAU=Math.PI*2;
const TARGET={lon:147.144,lat:-41.438};   // 18 Innes Street, Launceston TAS 7250
const clamp01=x=>x<0?0:x>1?1:x;
const prog=(t,a,b)=>clamp01((t-a)/(b-a));
const ease=x=>(x=clamp01(x))<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const smooth=(a,b,x)=>{x=clamp01((x-a)/(b-a));return x*x*(3-2*x)};
const hash=(a,b,c)=>{const s=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return s-Math.floor(s)};

/* ---------- Scene (SVG) ---------- */
const LC={x:265,y:500},RIM=172,GLASS=150,EYE={x:410,y:335,r:38};
const rings=[0,.25,.5,.75].map((k,i)=>`<circle cx="${EYE.x+(LC.x-EYE.x)*k}" cy="${EYE.y+(LC.y-EYE.y)*k}" r="${EYE.r+(RIM-EYE.r)*k}" fill="${i%2?'#1a120c':'url(#ic-brass)'}" stroke="rgba(0,0,0,.55)" stroke-width="3"/>`).join('');
const ticks=Array.from({length:36},(_,i)=>{const a=i/36*TAU,r1=GLASS+8,r2=GLASS+(i%3?13:18);return`M${LC.x+Math.cos(a)*r1} ${LC.y+Math.sin(a)*r1}L${LC.x+Math.cos(a)*r2} ${LC.y+Math.sin(a)*r2}`}).join('');
const finger=(a,bx,by)=>{const p=(r,d)=>[LC.x+Math.cos((a+d)*D2R)*r,LC.y+Math.sin((a+d)*D2R)*r],[qx,qy]=p(204,3),[tx,ty]=p(160,0),[nx,ny]=p(157,-6);
  return`<path d="M${bx} ${by}Q${qx} ${qy} ${tx} ${ty}" stroke="#3b403d" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M${bx} ${by}Q${qx} ${qy} ${tx} ${ty}" stroke="url(#ic-skin)" stroke-width="18" stroke-linecap="round" fill="none"/><path d="M${tx} ${ty}L${nx} ${ny}" stroke="#1b1014" stroke-width="5" stroke-linecap="round"/>`};
scene.setAttribute('viewBox','40 0 720 900');
scene.innerHTML=`<defs>
<radialGradient id="ic-skin" cx=".45" cy=".38" r=".75"><stop offset="0" stop-color="#ece7dc"/><stop offset=".55" stop-color="#c3c8bd"/><stop offset="1" stop-color="#7f8a83"/></radialGradient>
<linearGradient id="ic-lining" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a3121f"/><stop offset="1" stop-color="#3a040a"/></linearGradient>
<linearGradient id="ic-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d991"/><stop offset=".45" stop-color="#b98a33"/><stop offset="1" stop-color="#4f330c"/></linearGradient>
<radialGradient id="ic-glow"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ff2a3d"/><stop offset="1" stop-color="#ff2a3d" stop-opacity="0"/></radialGradient>
<linearGradient id="ic-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1824"/><stop offset="1" stop-color="#030205"/></linearGradient>
</defs>
<g id="ic-fig">
 <path d="M290 540C268 430 252 300 262 168C320 252 380 292 455 302C530 292 590 252 648 168C658 300 642 430 620 540Z" fill="#0a0508"/>
 <path d="M306 520C290 425 282 320 286 208C336 278 390 312 455 320C520 312 574 278 624 208C628 320 620 425 604 520Z" fill="url(#ic-lining)"/>
 <path d="M40 900L40 790C110 660 220 575 330 540L455 575L580 540C690 575 760 660 760 790L760 900Z" fill="#08050a"/>
 <path d="M60 820C140 690 240 600 330 560M740 820C670 690 600 610 580 560" stroke="rgba(160,20,35,.35)" stroke-width="3" fill="none"/>
 <path d="M420 448L490 448L492 570L455 690L418 570Z" fill="#e6e0d4"/>
 <path d="M330 540L420 568L455 690L405 900L300 900Z" fill="#120a10"/><path d="M580 540L490 568L455 690L505 900L610 900Z" fill="#120a10"/>
 <path d="M430 492L455 506L480 492L480 520L455 508L430 520Z" fill="#6e0a14"/>
 <path d="M436 508L455 560L474 508" stroke="#8f0f1c" stroke-width="4" fill="none"/>
 <circle cx="455" cy="566" r="15" fill="url(#ic-brass)"/><circle cx="455" cy="566" r="7" fill="#d1122a"/>
 <rect x="422" y="410" width="66" height="60" fill="#9aa39b"/>
 <path d="M362 345C340 330 322 300 315 258C338 284 355 300 366 312Z" fill="url(#ic-skin)"/><path d="M548 345C570 330 588 300 595 258C572 284 555 300 544 312Z" fill="url(#ic-skin)"/>
 <path d="M455 205C520 205 552 255 552 320C552 380 530 425 500 452C482 468 468 478 455 482C442 478 428 468 410 452C380 425 358 380 358 320C358 255 390 205 455 205Z" fill="url(#ic-skin)"/>
 <path d="M382 372Q398 412 424 428Q402 402 394 362ZM528 372Q512 412 486 428Q508 402 516 362Z" fill="rgba(60,72,66,.35)"/>
 <path d="M352 330C340 240 380 178 455 178C530 178 570 240 558 330C552 290 540 262 520 248C500 238 474 246 455 270C436 246 410 238 390 248C370 262 358 290 352 330Z" fill="url(#ic-hair)"/>
 <path d="M398 204Q455 186 512 204" stroke="rgba(255,255,255,.12)" stroke-width="4" fill="none"/>
 <path d="M376 288L446 308L442 318L378 299ZM534 286L466 308L470 318L532 297Z" fill="#0b0a0e"/>
 <g id="ic-eye"><circle cx="501" cy="335" r="30" fill="url(#ic-glow)" opacity=".75"/><path d="M478 336Q501 324 525 333Q503 344 478 336Z" fill="#ff2a3d"/><path d="M501 328L501 341" stroke="#2a0005" stroke-width="2.5"/></g>
 <path d="M455 322L445 376Q455 386 465 376Z" fill="rgba(80,92,86,.35)"/>
 <path d="M420 410Q455 426 494 402" stroke="#3a0d12" stroke-width="4" fill="none" stroke-linecap="round"/>
 <path d="M431 414L437 434L443 417ZM468 416L474 436L480 411Z" fill="#fbf8f0"/><circle cx="474" cy="444" r="2.6" fill="#c1121f"/>
 <path d="M448 466Q455 472 462 466" stroke="rgba(60,72,66,.5)" stroke-width="2" fill="none"/>
 <circle cx="${EYE.x}" cy="${EYE.y}" r="${EYE.r+5}" fill="#120c08" stroke="rgba(0,0,0,.6)" stroke-width="3"/>
 ${rings}
 <circle cx="${LC.x}" cy="${LC.y}" r="${RIM}" fill="url(#ic-brass)" stroke="#2b1b06" stroke-width="3"/>
 <circle cx="${LC.x}" cy="${LC.y}" r="${GLASS+22}" fill="none" stroke="rgba(255,240,200,.5)" stroke-width="3" stroke-dasharray="150 900" transform="rotate(195 ${LC.x} ${LC.y})"/>
 <circle cx="${LC.x}" cy="${LC.y}" r="${GLASS+6}" fill="#140d06"/>
 <path d="${ticks}" stroke="rgba(40,24,4,.85)" stroke-width="2"/>
 <circle id="ic-glass" cx="${LC.x}" cy="${LC.y}" r="${GLASS}" fill="#020611"/>
 <path d="M470 720C520 740 590 800 630 900L520 900C500 830 470 780 430 750Z" fill="#0c070c"/>
 <path d="M440 712C462 722 488 738 500 760L470 772C458 752 440 738 422 730Z" fill="#e6e0d4"/>
 <ellipse cx="430" cy="690" rx="58" ry="44" transform="rotate(-32 430 690)" fill="url(#ic-skin)" stroke="#3b403d" stroke-width="3"/>
 ${[[20,470,640],[35,446,668],[50,416,690],[65,386,708]].map(f=>finger(...f)).join('')}
 <path d="M478 648Q492 598 447 552" stroke="#3b403d" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M478 648Q492 598 447 552" stroke="url(#ic-skin)" stroke-width="18" stroke-linecap="round" fill="none"/>
</g>`;
const glass=el('ic-glass');

/* ---------- Land (coarse lon/lat outlines -> dot matrix) ---------- */
const LAND=[
[[-168,66],[-162,70],[-156,71.3],[-140,69.6],[-128,70],[-115,68.6],[-95,71],[-85,69.5],[-80,63],[-94,59],[-92,57],[-82,55],[-79,51.5],[-76,56],[-78,62],[-72,61],[-64,60],[-61,56],[-56,52],[-60,47],[-66,45],[-70,43],[-70,41.5],[-74,40.5],[-76,38],[-76,35],[-81,31],[-80,25.5],[-82,27],[-83,29.5],[-85,30],[-89,30],[-94,29.5],[-97,27.5],[-97.5,22],[-96,19],[-91,18.5],[-90.5,21],[-87,21.5],[-88,16],[-84,15],[-83,10],[-79.5,9],[-77,8],[-80,7.5],[-82,8.5],[-86,12],[-88,13.5],[-92,14.5],[-95,16],[-100,17],[-105,20],[-105.5,23],[-109,25.5],[-112,29],[-114.5,31],[-113,26],[-110,23],[-112,24.5],[-115,28],[-117,32.5],[-120.5,34.5],[-122.5,37.5],[-124,40.5],[-124,46],[-124.5,48.5],[-127,50],[-131,54],[-134,58],[-140,59.8],[-146,60.5],[-152,59],[-157,57.5],[-162,55],[-164,54.6],[-158,58.5],[-162,59.8],[-165,62],[-166,64.5]],
[[-73,78],[-60,82],[-35,83.5],[-20,82],[-18,76],[-22,70],[-32,68],[-40,65],[-43,60],[-48,61],[-52,65],[-54,69],[-58,75],[-66,76.5]],
[[-80,73.5],[-72,71.5],[-62,66.5],[-65.5,63],[-71,63],[-74,64.5],[-78,64.5],[-73,68],[-80,70],[-88,70]],
[[-90,76.5],[-78,76.2],[-75,79],[-62,82],[-75,83],[-90,81.5]],[[-118,72],[-102,73],[-101,69],[-106,68.5],[-117,69]],
[[-85,22],[-82,23.2],[-77,22],[-74.2,20.2],[-77.5,19.8],[-81,21.6]],[[-74.4,18.5],[-72.8,19.9],[-69,19.6],[-68.4,18.6],[-71.3,17.7]],
[[-77,8],[-72,12],[-62,10.7],[-57,6],[-51,4],[-50,0],[-44,-2.5],[-35,-5.5],[-35,-9],[-39,-14],[-39,-18],[-41,-22],[-45,-23.5],[-48.5,-26],[-48.5,-28.5],[-53,-34],[-57,-35],[-57.5,-38],[-62,-39],[-65,-41],[-64,-43],[-67.5,-46],[-66,-48],[-69,-51],[-68.5,-53],[-71,-55],[-74,-52],[-75,-48],[-73.5,-43],[-73.5,-37],[-71.5,-30],[-70.5,-20],[-71.5,-17],[-76,-14],[-79,-8],[-81,-5],[-80,-1],[-80,1.5],[-78,3],[-77.5,7]],
[[-9.5,37],[-9,43],[-1.5,43.5],[-1.5,46.5],[-4.5,48.5],[1.5,50.5],[4,51.5],[8,54],[8.5,57],[10.5,57.5],[12,55.5],[14,54],[21,55],[21.5,57.5],[24,57.5],[23.5,59.5],[29.5,60],[23,60.3],[21.5,61.5],[21,64.5],[25.5,65.5],[21.5,64],[17.5,61],[18.5,59.5],[16.5,56.5],[13,55.5],[11,59],[6,58.2],[5,61.5],[8,63.5],[14,67.5],[19,70],[26,71],[31,70],[40,67.5],[41,64.5],[44,66.5],[53,68.5],[60,69.5],[68,69],[73,72.5],[80,73.5],[87,74.5],[100,77],[105,77.5],[113,73.5],[127,73],[140,72.5],[150,71.5],[160,70],[170,70],[180,69],[180,65],[178,64.5],[172,61],[163,60],[162,56],[156,51],[155.5,57],[160,61],[152,59],[142,59],[137,54],[141,52.5],[140.5,48],[135,43.5],[130,42.5],[129.5,36],[126.5,34.5],[126,37.5],[125,40],[121.5,40],[118,39],[121,37],[119,35],[121.5,31.5],[121.5,28],[119.5,25.5],[116,22.8],[111,21.5],[108,21.5],[106.5,19],[109,15],[109,11.5],[105,8.6],[104.5,10.5],[100.5,13.5],[100,9],[103.5,1.5],[101,2.8],[98.5,8],[98,16],[94.5,16],[94.5,19],[92,21.5],[90,22],[86.5,21],[86,19.5],[80.5,15.5],[80,10],[77.5,8],[76.5,9],[73.5,16],[72.8,21],[70,22],[68,23.8],[66.5,25.4],[61.5,25.2],[57,25.8],[56.4,27],[51.5,27.8],[49,30],[48,29.8],[50,26.5],[51.5,24.5],[56,26.3],[59.5,22.5],[57.8,19],[52,16],[45,12.8],[43.3,12.7],[42.8,15.5],[39,21.5],[35,28],[34.3,27.8],[32.5,30],[34.2,31.3],[35.5,33.8],[36,36.6],[32,36.2],[28,36.6],[26.3,39.2],[24,40.5],[22.5,40.2],[24,38],[22,36.5],[21,38.5],[19.5,41.8],[15.5,44],[13.5,45.6],[12.3,45.2],[14,42],[18.5,40.2],[16,38],[15.6,40],[12,42],[10,44],[7.5,43.8],[3,43.2],[3.2,42],[0.5,40.5],[-0.5,38.5],[-2,36.7],[-5.5,36],[-6.5,36.8],[-8.8,37]],
[[-5.5,50],[1.5,51],[1.7,52.8],[0,53.5],[-1.5,55.5],[-2,57.5],[-3.5,58.6],[-5,58.6],[-6,56.5],[-5,55],[-3,54.5],[-3,53.4],[-4.5,52.8],[-5,51.6],[-3,51.4]],
[[-6,52],[-6,54.3],[-7.5,55.2],[-10,54.2],[-10,51.6]],[[-24,65.5],[-22,66.4],[-16,66.5],[-13.5,65],[-18,63.4],[-22.5,63.8]],
[[-17,21],[-16,24],[-13,28],[-9.5,30.5],[-6,35.8],[-1,35.2],[3,36.8],[10,37.3],[11,35],[10,33.8],[11.5,33],[15.5,32.3],[20,31],[20,32.6],[23,32.6],[29.5,31],[32.3,31.3],[32.5,29.8],[34,26.5],[37.2,21],[38.5,18],[41,15],[43.2,11.5],[48,11.2],[51.2,11.8],[51,10],[49,6],[46,2],[42,-1.5],[40,-3.5],[39,-7],[40,-10.5],[40.5,-15],[37,-17.5],[35,-20],[35.5,-24],[32.8,-26],[32.5,-28.8],[30,-31.5],[27,-33.8],[22,-34.2],[20,-34.8],[18.3,-34],[17.8,-32],[15,-27],[14.5,-23],[11.8,-17],[12.3,-13],[13.6,-10.8],[12,-5.5],[9,-1],[9.5,3.5],[8.5,4.5],[5.5,4.3],[2,6.3],[-2,4.8],[-7.5,4.4],[-12,7.2],[-15,11],[-17.2,14.7],[-16.5,19]],
[[44,-25],[47,-25],[50.5,-15.5],[49.3,-12],[47,-15.5],[44,-17.5]],
[[130,31.5],[131.5,31.4],[132,33.8],[135,33.5],[137,34.6],[140,35],[141,38.5],[141.5,41],[140.5,41.5],[140,40],[139.5,38],[137,37],[136,36],[133,35.5],[130.8,34]],
[[140,41.5],[141.6,42.5],[143.3,42],[145.5,43.3],[143,44.5],[141.6,45.4],[141.4,43.5],[140.3,43]],[[142,46],[143.5,49],[143,54],[142,53.5],[142.2,49]],
[[120.2,22.6],[121,25.2],[122,25],[120.9,22]],[[79.8,6.2],[80,9.6],[81.9,7.5],[81.2,6.2]],
[[120,16],[120.6,18.5],[122.2,18.5],[122,16],[124,13],[121.5,13.8],[120.6,14.5]],[[122,7],[124,6],[126.2,6.5],[126.5,8.2],[125.5,9.5],[123.5,8.5]],
[[95.3,5.6],[97.5,5.2],[100.5,2],[104,-1],[106,-3.5],[105.8,-5.8],[104,-5.5],[101,-3],[98.5,.5]],[[105.2,-6.8],[106.5,-6],[110,-6.5],[112.5,-6.8],[114.5,-7.8],[111,-8.2],[108,-7.8]],
[[109,1.5],[109.6,-1.5],[110.5,-3],[114.5,-3.5],[116.5,-2.5],[116,.5],[117.8,1],[119,5],[117,7],[115.5,5],[113,3.2],[111,1.7]],
[[131,-1.2],[134,-.8],[138,-1.6],[141,-2.6],[145,-4.5],[147.5,-6],[147.7,-8],[150,-10.5],[146,-8.5],[143.5,-9],[141,-9.2],[138,-8.2],[137.5,-5.5],[134,-4],[132,-2.8]],
[[172.7,-34.4],[174.5,-35.8],[175.9,-37.5],[178.5,-37.7],[177.9,-39.2],[176.9,-39.7],[175.2,-41.6],[174.6,-41.2],[175.2,-40],[173.8,-39.2],[174.6,-38],[174.3,-36.7]],
[[172.7,-40.5],[174.3,-41.7],[173.2,-43.5],[171.2,-44.5],[170.5,-46],[168.4,-46.6],[166.5,-46],[166.9,-45],[168.4,-44],[170.8,-42.7]],
[[-180,-90],[-180,-78],[-160,-77],[-150,-76],[-130,-74],[-110,-74],[-100,-73],[-80,-73],[-68,-70],[-58,-63],[-62,-66],[-60,-75],[-40,-78],[-25,-75],[-10,-71],[10,-70],[30,-69.5],[50,-67],[70,-68],[90,-66.5],[110,-66],[130,-66.5],[150,-68.5],[165,-71],[170,-75],[160,-78],[180,-78],[180,-90]]
];
const AUS=[[113.5,-22],[114,-26],[115,-30],[115,-34],[117.5,-35],[121,-34],[124,-33],[126,-32.2],[131,-31.5],[134,-32.8],[135.6,-34.8],[137.5,-33],[138,-35.5],[139.6,-36.5],[140.8,-38],[143.5,-38.8],[145,-38.4],[146.3,-39.1],[148,-37.8],[150,-37.4],[150.2,-35.6],[151.3,-33.6],[153,-31],[153.6,-28],[153,-25],[150.8,-22.6],[149,-20.5],[146.2,-18.8],[145.4,-15],[143.6,-14],[142.5,-10.7],[141.6,-12.8],[141.5,-15.5],[140.8,-17.4],[139,-17],[136.5,-15.5],[135.8,-13.2],[136.8,-12],[133,-11.3],[130.3,-12.3],[129.5,-15],[127,-14],[125.2,-14.7],[123.5,-16.8],[122.2,-18],[119.5,-20],[116.5,-20.8]];
const TAS=[[144.65,-40.7],[145.3,-40.85],[146,-41.15],[146.6,-41.1],[146.82,-41.07],[147,-40.95],[147.6,-40.85],[148,-40.8],[148.3,-40.95],[148.3,-41.6],[148.3,-42.1],[148,-42.4],[148,-43],[147.6,-43.1],[147.3,-43.25],[146.9,-43.6],[146.5,-43.55],[146,-43.45],[145.6,-42.9],[145.2,-42.3],[144.9,-41.6],[144.6,-41]];
const TAMAR=[[146.82,-41.07],[146.9,-41.17],[147.0,-41.27],[147.08,-41.36],[147.144,-41.438]];
const HOLES=[[[28,41.3],[28.5,43.5],[30.5,46.5],[33.5,44.5],[36.5,45.2],[38,47],[39.5,47],[37.5,44.5],[41.5,41.6],[36,41.6],[33,42],[29,41.2]],[[47,44.5],[49,46.5],[53,47],[53,42],[54,39.5],[53.5,37],[49,37.5],[48.5,40.5],[47.5,42.8]]];
LAND.push(AUS,TAS);
const box=p=>{let a=1e9,b=-1e9,c=1e9,d=-1e9;for(const[x,y]of p){a=Math.min(a,x);b=Math.max(b,x);c=Math.min(c,y);d=Math.max(d,y)}return{p,a,b,c,d}};
const inPoly=(x,y,{p,a,b,c,d})=>{if(x<a||x>b||y<c||y>d)return false;let o=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)o=!o}return o};
const vec=(lon,lat)=>{const f=lat*D2R,l=lon*D2R;return[Math.cos(f)*Math.cos(l),Math.cos(f)*Math.sin(l),Math.sin(f)]};
const LB=LAND.map(box),HB=HOLES.map(box),DOTS=[];
for(let lat=-87;lat<=87;lat+=2){const n=Math.max(1,Math.round(180*Math.cos(lat*D2R)));
  for(let k=0;k<n;k++){const lon=-180+(k+.5)*360/n;if(LB.some(b=>inPoly(lon,lat,b))&&!HB.some(b=>inPoly(lon,lat,b)))DOTS.push(vec(lon,lat))}}
const AUSV=AUS.map(p=>vec(...p)),TASV=TAS.map(p=>vec(...p)),TAMV=TAMAR.map(p=>vec(...p)),TGT=vec(TARGET.lon,TARGET.lat);

/* orthographic projection: returns [x,y,depth] relative to globe centre */
let pc,ps,qc,qs;
const orient=(lon,lat)=>{pc=Math.cos(lon*D2R);ps=Math.sin(lon*D2R);qc=Math.cos(lat*D2R);qs=Math.sin(lat*D2R)};
const proj=([x,y,z],R)=>{const a=x*pc+y*ps,b=-x*ps+y*pc;return[R*b,-R*(qc*z-qs*a),qs*z+qc*a]};

function drawGlobe(c,cx,cy,R,lon,lat,f,t){
  orient(lon,lat);
  const big=R>Math.hypot(W,H)*3;
  const g=c.createRadialGradient(cx-R*.3,cy-R*.35,R*.05,cx,cy,R);
  g.addColorStop(0,'#123a5c');g.addColorStop(.55,'#08182e');g.addColorStop(1,'#020611');
  c.fillStyle=big?'#0b2340':g;c.beginPath();if(big)c.rect(0,0,W,H);else c.arc(cx,cy,R,0,TAU);c.fill();
  const da=1-smooth(2.5,7,f);
  if(da>0){
    const s=Math.max(1.2,R*.0105),h=s/2;c.fillStyle='#39ff14';
    for(const v of DOTS){const[x,y,z]=proj(v,R);if(z<=0)continue;const X=cx+x,Y=cy+y;if(X<-s||Y<-s||X>W+s||Y>H+s)continue;
      c.globalAlpha=da*(.25+.75*z);c.fillRect(X-h,Y-h,s,s)}
    c.globalAlpha=1;
  }
  const pa=smooth(1.4,4,f);
  if(pa>0){
    c.globalAlpha=pa;c.lineJoin='round';
    for(const P of[AUSV,TASV]){c.beginPath();P.forEach((v,i)=>{const[x,y]=proj(v,R);i?c.lineTo(cx+x,cy+y):c.moveTo(cx+x,cy+y)});c.closePath();
      c.fillStyle='rgba(30,90,40,.55)';c.fill();c.strokeStyle='rgba(57,255,20,.85)';c.lineWidth=1.6;c.stroke()}
    c.beginPath();TAMV.forEach((v,i)=>{const[x,y]=proj(v,R);i?c.lineTo(cx+x,cy+y):c.moveTo(cx+x,cy+y)});
    c.strokeStyle='rgba(90,170,255,.8)';c.lineWidth=Math.min(6,Math.max(1,R*.0004));c.stroke();c.globalAlpha=1;
  }
  const[x,y,z]=proj(TGT,R);
  if(z>0&&t>=0){
    const X=cx+x,Y=cy+y,p=(performance.now()/1200)%1;
    c.fillStyle='#ff2a3d';c.shadowColor='#ff2a3d';c.shadowBlur=12;c.beginPath();c.arc(X,Y,3.5,0,TAU);c.fill();c.shadowBlur=0;
    c.strokeStyle=`rgba(255,42,61,${1-p})`;c.lineWidth=2;c.beginPath();c.arc(X,Y,4+p*26,0,TAU);c.stroke();
    if(f>5){c.globalAlpha=smooth(5,9,f);c.font='600 13px ui-monospace,Menlo,monospace';c.fillStyle='#e6dfd6';c.textAlign='left';c.fillText('LAUNCESTON',X+12,Y-8);c.globalAlpha=1}
  }
  if(!big&&R<Math.max(W,H)){const a=c.createRadialGradient(cx,cy,R*.92,cx,cy,R*1.12);a.addColorStop(0,'rgba(57,255,20,0)');a.addColorStop(.4,'rgba(57,255,20,.22)');a.addColorStop(1,'rgba(57,255,20,0)');c.fillStyle=a;c.beginPath();c.arc(cx,cy,R*1.12,0,TAU);c.fill()}
}

/* ---------- Street map (world units = metres, house at HOUSE) ---------- */
const BX=130,BY=95,SW=14,ROT=-.21,LOTW=(BX-SW)/5;
const HOUSE={x:SW/2+2.5*LOTW,y:-SW/2-4-6,w:16,h:12};   // block (0,-1), front row, lot 2: faces Innes St (y=0)
const PARKS=new Set(['2,1','3,1','2,2','3,2','-5,-3','-4,-3']);
const riverX=y=>-1500+380*Math.sin(y/1100)+.1*y;
function drawMap(c,cx,cy,s,a,tt){
  c.save();c.globalAlpha=a;c.fillStyle='#0b0d18';c.fillRect(0,0,W,H);
  const cr=Math.cos(-ROT),sr=Math.sin(-ROT);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(const[px,py]of[[0,0],[W,0],[0,H],[W,H]]){const dx=px-cx,dy=py-cy,wx=(dx*cr-dy*sr)/s+HOUSE.x,wy=(dx*sr+dy*cr)/s+HOUSE.y;x0=Math.min(x0,wx);x1=Math.max(x1,wx);y0=Math.min(y0,wy);y1=Math.max(y1,wy)}
  c.translate(cx,cy);c.rotate(ROT);c.scale(s,s);c.translate(-HOUSE.x,-HOUSE.y);
  const i0=Math.floor(x0/BX),i1=Math.ceil(x1/BX),j0=Math.floor(y0/BY),j1=Math.ceil(y1/BY);
  const lines=(major,w,col)=>{c.beginPath();for(let i=i0;i<=i1;i++)if(!(i%6)===major){c.moveTo(i*BX,y0);c.lineTo(i*BX,y1)}for(let j=j0;j<=j1;j++)if(!(j%6)===major){c.moveTo(x0,j*BY);c.lineTo(x1,j*BY)}c.lineWidth=Math.max(w,1.3/s);c.strokeStyle=col;c.stroke()};
  lines(false,SW,'#232840');lines(true,24,'#363d5e');
  // Innes St glows a little near the house
  const ig=c.createLinearGradient(HOUSE.x-600,0,HOUSE.x+600,0);ig.addColorStop(0,'rgba(255,140,40,0)');ig.addColorStop(.5,'rgba(255,140,40,.4)');ig.addColorStop(1,'rgba(255,140,40,0)');
  c.strokeStyle=ig;c.lineWidth=Math.max(SW,2/s);c.beginPath();c.moveTo(HOUSE.x-600,0);c.lineTo(HOUSE.x+600,0);c.stroke();
  const ha=smooth(.4,.8,s),blocks=(i1-i0)*(j1-j0);
  if(blocks<3000){
    c.beginPath();for(let i=i0;i<i1;i++)for(let j=j0;j<j1;j++)if(PARKS.has(i+','+j))c.rect(i*BX+SW/2,j*BY+SW/2,BX-SW,BY-SW);c.fillStyle='#0d2116';c.fill();
  }
  if(ha>0&&blocks<1200){
    const roofs=new Path2D(),wins=new Path2D(),trees=new Path2D();
    for(let i=i0;i<i1;i++)for(let j=j0;j<j1;j++){
      const bx=i*BX+SW/2,by=j*BY+SW/2;
      if(PARKS.has(i+','+j)){for(let k=0;k<9;k++){const tx=bx+8+hash(i,j,k)*(BX-SW-16),ty=by+8+hash(j,i,k)*(BY-SW-16),r=3+hash(k,i,j)*3;trees.moveTo(tx+r,ty);trees.arc(tx,ty,r,0,TAU)}continue}
      for(let row=0;row<2;row++)for(let k=0;k<5;k++){
        if(i===0&&j===-1&&row===1&&k===2)continue;
        const r=hash(i,j,row*5+k);if(r<.08)continue;
        const w=11+r*6,h=10+hash(j,i,k+row)*5,x=bx+(k+.5)*LOTW-w/2,y=row?by+BY-SW-4-h:by+4;
        if(Math.abs(x-riverX(y))<200)continue;
        roofs.rect(x,y,w,h);if(hash(k,j,i+row)>.62)wins.rect(x+w/2-1.5,y+h/2-1.5,3,3);
      }
    }
    c.globalAlpha=a*ha;c.fillStyle='#181b2b';c.fill(roofs);c.strokeStyle='rgba(120,130,170,.25)';c.lineWidth=.4;if(s>1)c.stroke(roofs);
    c.fillStyle='#123826';c.fill(trees);
    if(s>.9){c.fillStyle='rgba(255,196,110,.85)';c.fill(wins)}
    c.globalAlpha=a;
  }
  // river
  c.beginPath();for(let y=y0-500;y<=y1+500;y+=80){const x=riverX(y);y===y0-500?c.moveTo(x,y):c.lineTo(x,y)}
  c.lineCap='round';c.strokeStyle='rgba(110,160,230,.16)';c.lineWidth=300;c.stroke();c.strokeStyle='#08162c';c.lineWidth=270;c.stroke();
  if(s<1.2&&x0<riverX(HOUSE.y)+300){c.save();c.globalAlpha=a*(1-smooth(.6,1.2,s));c.translate(riverX(HOUSE.y-300),HOUSE.y-300);c.rotate(Math.PI/2+.1);
    c.font=`600 ${Math.max(40,11/s)}px "Cormorant Garamond",Georgia,serif`;c.fillStyle='rgba(140,180,240,.6)';c.textAlign='center';c.fillText('TAMAR RIVER',0,12);c.restore()}
  // street labels
  if(s>.5){c.globalAlpha=a*smooth(.5,1,s);c.font='700 8px "Cinzel Decorative",Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f0d9b5';
    c.fillText('INNES ST',HOUSE.x-130,0);c.fillText('INNES ST',HOUSE.x+130,0);c.globalAlpha=a}
  // the Halloween house
  const pulse=.5+.5*Math.sin(tt*4),gr=Math.max(70,18/s),hx=HOUSE.x,hy=HOUSE.y;
  const g=c.createRadialGradient(hx,hy,1,hx,hy,gr);g.addColorStop(0,`rgba(255,150,40,${.6+.3*pulse})`);g.addColorStop(.35,'rgba(255,90,20,.25)');g.addColorStop(1,'rgba(255,60,20,0)');
  c.fillStyle=g;c.fillRect(hx-gr,hy-gr,gr*2,gr*2);
  if(s>.25){
    const L=hx-HOUSE.w/2,T=hy-HOUSE.h/2;
    c.fillStyle='#2a160d';c.fillRect(L,T,HOUSE.w,HOUSE.h);
    c.strokeStyle='#ff9a2e';c.lineWidth=Math.max(.7,1/s);c.strokeRect(L,T,HOUSE.w,HOUSE.h);
    if(s>.8){
      c.beginPath();c.moveTo(L,hy);c.lineTo(L+HOUSE.w,hy);c.strokeStyle='rgba(255,160,60,.6)';c.lineWidth=.5;c.stroke();
      c.fillStyle='#ffb347';[[L+2.5,T+2.5],[L+HOUSE.w-5.5,T+2.5],[L+2.5,T+HOUSE.h-5.5],[L+HOUSE.w-5.5,T+HOUSE.h-5.5]].forEach(([x,y])=>c.fillRect(x,y,3,3));
      for(let k=0;k<20;k++){const u=k/20*2*(HOUSE.w+HOUSE.h);let x,y;if(u<HOUSE.w){x=L+u;y=T}else if(u<HOUSE.w+HOUSE.h){x=L+HOUSE.w;y=T+u-HOUSE.w}else if(u<2*HOUSE.w+HOUSE.h){x=L+2*HOUSE.w+HOUSE.h-u;y=T+HOUSE.h}else{x=L;y=T+2*(HOUSE.w+HOUSE.h)-u}
        c.globalAlpha=a*(.5+.5*Math.sin(tt*6+k*1.7));c.fillStyle=k%2?'#a855f7':'#ff8a1f';c.beginPath();c.arc(x,y,.6,0,TAU);c.fill()}
      c.globalAlpha=a;
    }
    if(s>1.2){
      c.globalAlpha=a*smooth(1.2,2,s);c.textAlign='center';c.textBaseline='middle';
      c.font='bold 5px "Cinzel Decorative",Georgia,serif';c.fillStyle='#ffe0b0';c.fillText('18',hx,hy+.3);
      c.font='4.4px serif';c.fillText('\u{1F383}',hx-5,T+HOUSE.h+2.4);c.fillText('\u{1F383}',hx+5.5,T+HOUSE.h+2.6);c.fillText('\u{1F578}️',L-2.5,T+1);
      c.font='6px serif';c.fillText('\u{1F47B}',hx+11,T-4+Math.sin(tt*2)*1.5);c.font='3.6px serif';c.fillText('\u{1F987}',hx-10+Math.sin(tt*3)*3,T-6+Math.cos(tt*3)*1.5);
    }
  }
  c.restore();
}

/* ---------- Sky behind Dracula ---------- */
const stars=Array.from({length:170},()=>[Math.random(),Math.random()*.8,Math.random()*1.3+.3,Math.random()*6]);
const bats=Array.from({length:3},(_,i)=>({y:.12+i*.11,v:.025+i*.012,o:Math.random(),s:7+i*3}));
function drawSky(tt){
  const c=sx,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05040b');g.addColorStop(.6,'#120a1f');g.addColorStop(1,'#2a0c16');
  c.fillStyle=g;c.fillRect(0,0,W,H);
  for(const[x,y,r,p]of stars){c.globalAlpha=.35+.45*Math.sin(tt*1.5+p);c.fillStyle='#e6dfd6';c.fillRect(x*W,y*H,r,r)}c.globalAlpha=1;
  const mr=Math.min(W,H)*.1,mx=W*.8,my=H*.19,mg=c.createRadialGradient(mx,my,mr*.8,mx,my,mr*3.2);
  mg.addColorStop(0,'rgba(255,90,90,.22)');mg.addColorStop(1,'rgba(255,90,90,0)');c.fillStyle=mg;c.fillRect(mx-mr*3.2,my-mr*3.2,mr*6.4,mr*6.4);
  c.fillStyle='#f1e6d2';c.beginPath();c.arc(mx,my,mr,0,TAU);c.fill();
  c.fillStyle='rgba(180,160,140,.28)';[[-.3,-.2,.22],[.25,.15,.16],[-.05,.38,.12]].forEach(([a,b,r])=>{c.beginPath();c.arc(mx+a*mr,my+b*mr,r*mr,0,TAU);c.fill()});
  // hills and a castle on the horizon
  c.fillStyle='#07040a';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=W/40)c.lineTo(x,H*.8-Math.sin(x/W*7)*H*.03-Math.sin(x/W*17)*H*.012);c.lineTo(W,H);c.fill();
  const cb=H*.8-Math.sin(.9*7)*H*.03,u=Math.min(W,H)*.012,cx0=W*.1;
  [[0,8,9],[7,5,14],[11,6,10],[16,4,17],[19,7,8]].forEach(([x,w,h])=>{c.fillRect(cx0+x*u,cb-h*u,w*u,h*u+2*u);c.beginPath();c.moveTo(cx0+x*u-u*.4,cb-h*u);c.lineTo(cx0+(x+w/2)*u,cb-(h+4)*u);c.lineTo(cx0+(x+w)*u+u*.4,cb-h*u);c.fill()});
  c.fillStyle=`rgba(255,180,60,${.6+.4*Math.sin(tt*3)})`;c.fillRect(cx0+17.4*u,cb-13*u,u,1.4*u);
  c.strokeStyle='#07040a';c.lineWidth=2;c.lineCap='round';
  for(const b of bats){const x=((b.o+tt*b.v)%1.2-.1)*W,y=H*b.y+Math.sin(tt*2+b.o*9)*10,f=Math.sin(tt*18+b.o*7)*b.s*.6;
    c.beginPath();c.moveTo(x-b.s,y-f);c.quadraticCurveTo(x-b.s*.4,y-b.s*.2,x,y);c.quadraticCurveTo(x+b.s*.4,y-b.s*.2,x+b.s,y-f);c.stroke()}
}

/* ---------- Clouds we fall through between globe and city ---------- */
const clouds=Array.from({length:18},(_,i)=>({a:i/18*TAU+Math.random()*.4,d:.15+Math.random()*.5,r:.25+Math.random()*.35}));
function drawClouds(c,cx,cy,p){
  if(p<=0||p>=1)return;const D=Math.hypot(W,H),k=.25+p*p*3.5;
  for(const o of clouds){const x=cx+Math.cos(o.a)*o.d*D*k,y=cy+Math.sin(o.a)*o.d*D*k,r=o.r*D*k*.6,g=c.createRadialGradient(x,y,0,x,y,r);
    const al=Math.sin(p*Math.PI)*.75;g.addColorStop(0,`rgba(205,210,225,${al})`);g.addColorStop(1,'rgba(205,210,225,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
}

/* ---------- Lens glass overlay (vignette, crosshair, glare) ---------- */
function drawGlassFx(c,cx,cy,r,a){
  if(a<=0)return;c.save();c.globalAlpha=a;
  const v=c.createRadialGradient(cx,cy,r*.55,cx,cy,r);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.8)');c.fillStyle=v;c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();
  c.strokeStyle='rgba(57,255,20,.35)';c.lineWidth=1;c.beginPath();
  c.moveTo(cx-r,cy);c.lineTo(cx-r*.12,cy);c.moveTo(cx+r*.12,cy);c.lineTo(cx+r,cy);c.moveTo(cx,cy-r);c.lineTo(cx,cy-r*.12);c.moveTo(cx,cy+r*.12);c.lineTo(cx,cy+r);
  for(let i=1;i<8;i++){const d=r*i/8,l=i%2?3:6;c.moveTo(cx+d,cy-l);c.lineTo(cx+d,cy+l);c.moveTo(cx-d,cy-l);c.lineTo(cx-d,cy+l);c.moveTo(cx-l,cy+d);c.lineTo(cx+l,cy+d);c.moveTo(cx-l,cy-d);c.lineTo(cx+l,cy-d)}
  c.stroke();
  c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=r*.06;c.lineCap='round';c.beginPath();c.arc(cx,cy,r*.82,Math.PI*1.08,Math.PI*1.42);c.stroke();
  c.lineWidth=r*.025;c.beginPath();c.arc(cx,cy,r*.82,Math.PI*1.48,Math.PI*1.54);c.stroke();
  c.restore();
}
function drawReticle(c,x,y,p,tt){
  if(p<=0)return;const r=160-90*ease(p),lock=p>=1;c.save();c.globalAlpha=Math.min(1,p*2);
  c.strokeStyle=lock?'#ff2a3d':'#39ff14';c.shadowColor=c.strokeStyle;c.shadowBlur=10;c.lineWidth=2;
  c.setLineDash([14,10]);c.lineDashOffset=-tt*40;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.setLineDash([]);
  const b=r*.75;c.beginPath();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([i,j])=>{c.moveTo(x+i*b,y+j*b*.55);c.lineTo(x+i*b,y+j*b);c.lineTo(x+i*b*.55,y+j*b)});c.stroke();
  c.restore();
}

/* ---------- Timeline ---------- */
let W=0,H=0,dpr=1,state='idle',t0=0,lonS=0,latS=0,dLon=0,cx0=0,cy0=0,r0=0,sMax=1,cues={},done=false,lonIdle=100,last=performance.now();
const T={rot:1.6,zoom0:1.4,zoom1:4,lens0:3.1,lens1:4.7,cloud0:3.3,cloud1:5,map0:3.9,map1:4.5,city1:7.3,pan0:4.4,pan1:6.6,lock0:6.6,lock1:7.2,tag:7.3,end:9.8};
function size(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;for(const c of[sky,lens]){c.width=W*dpr;c.height=H*dpr}sx.setTransform(dpr,0,0,dpr,0,0);lx.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
const lensRect=()=>{const b=glass.getBoundingClientRect();return[b.left+b.width/2,b.top+b.height/2,b.width/2]};
const fmtAlt=km=>km>=10?Math.round(km).toLocaleString('en-AU')+' km':Math.max(1,Math.round(km*1000))+' m';
const cue=(k,fn)=>{if(!cues[k]){cues[k]=1;try{fn()}catch(_){}}};

function frame(now){
  if(!splash.isConnected)return;
  const tt=now/1000,dt=Math.min(.05,(now-last)/1000);last=now;
  let t=state==='idle'?-1:(now-t0)/1000;
  if(state==='idle')lonIdle=(lonIdle-dt*14+360)%360;
  if(t<T.lens1){drawSky(tt)}
  // lens geometry: scene scales up around the lens until the glass swallows the screen
  let cx,cy,r,cover=0;
  if(t<0){[cx,cy,r]=lensRect()}
  else{
    const e=Math.pow(prog(t,T.lens0,T.lens1),3),k=1+(sMax-1)*e;cover=e;
    if(t<T.lens1+.2){scene.style.transform=`scale(${k})`}else if(scene.style.visibility!=='hidden'){scene.style.visibility='hidden';sky.style.visibility='hidden'}
    cx=cx0;cy=cy0;r=r0*k;
  }
  const full=t>=T.lens1;
  lx.clearRect(0,0,W,H);lx.save();
  if(!full){lx.beginPath();lx.arc(cx,cy,r,0,TAU);lx.clip()}
  // globe
  const re=ease(prog(t,0,T.rot)),lon=t<0?lonIdle:lonS+dLon*re,lat=t<0?-18:latS+(TARGET.lat-latS)*re;
  const f=t<0?1:Math.exp(Math.log(40)*ease(prog(t,T.zoom0,T.zoom1)));
  const mapA=t<0?0:prog(t,T.map0,T.map1);
  if(mapA<1)drawGlobe(lx,cx,cy,(t<0?r:r0)*.9*f,lon,lat,f,t);
  if(mapA>0){
    const s=.08*Math.pow(50,ease(prog(t,T.map0,T.city1))),pe=ease(prog(t,T.pan0,T.pan1));
    const mx=cx0+(W/2-cx0)*pe,my=cy0+(H*.45-cy0)*pe;
    drawMap(lx,mx,my,s,mapA,tt);
    drawReticle(lx,mx,my,prog(t,T.lock0,T.lock1),tt);
  }
  drawClouds(lx,cx,cy,prog(t,T.cloud0,T.cloud1));
  lx.restore();
  drawGlassFx(lx,cx,cy,r,1-cover);

  if(t>=0){
    const lo=((lon%360)+540)%360-180,la=Math.abs(lat).toFixed(4);
    const alt=fmtAlt(20000*Math.pow(.12/20000,ease(prog(t,.6,T.city1))));
    const line=t<T.rot?'ACQUIRING TARGET…':t<T.map0?'DESCENDING · TASMANIA':t<T.lock1?'LAUNCESTON · INNES STREET':'LOCKED · 18 INNES ST, LAUNCESTON';
    const txt=`${line}\n${la}°${lat<0?'S':'N'}  ${Math.abs(lo).toFixed(4)}°${lo<0?'W':'E'}  ·  ALT ${alt}`;
    if(hud.textContent!==txt)hud.textContent=txt;
    if(t>T.cloud0)cue('cloud',()=>whoosh());
    if(t>T.lock1)cue('lock',()=>thump());
    if(t>T.tag)cue('tag',()=>{tag.classList.add('on');chime()});
    if(t>T.end)finish();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function audio(){if(audio.on)return;audio.on=1;try{initAudio()}catch(_){}}
function start(){
  if(state!=='idle')return;state='zoom';audio();
  splash.classList.add('zooming');   // stops the breathing animation before we measure the lens
  [cx0,cy0,r0]=lensRect();
  scene.style.transformOrigin=`${cx0}px ${cy0}px`;
  sMax=Math.max(...[[0,0],[W,0],[0,H],[W,H]].map(([x,y])=>Math.hypot(x-cx0,y-cy0)))/r0*1.05;
  lonS=lonIdle;latS=-18;dLon=((TARGET.lon-lonS)%360+540)%360-180;
  t0=performance.now()-(reduce?T.tag*1000:0);
  splash.setAttribute('aria-label','Zooming in to 18 Innes Street, Launceston');
  try{whoosh()}catch(_){}
}
function finish(){
  if(done)return;done=true;audio();
  try{enter()}catch(_){splash.remove();document.body.classList.remove('lock')}
}
splash.addEventListener('pointerdown',e=>{if(e.target.id!=='ic-skip')start()});
splash.addEventListener('keydown',e=>{if(e.target===splash&&(e.key==='Enter'||e.key===' ')){e.preventDefault();start()}});
el('ic-skip').addEventListener('click',e=>{e.stopPropagation();finish()});
splash.focus({preventScroll:true});
})();
