// An orthographic low-poly globe. Simplified land outlines are decorative, not a map.
const RAD = Math.PI / 180;
const land = [
 [[-168,65],[-140,71],[-112,75],[-55,52],[-62,29],[-83,8],[-100,20],[-125,48]],
 [[-81,12],[-50,3],[-35,-9],[-52,-35],[-70,-56],[-76,-21]],
 [[-17,36],[10,38],[35,30],[51,10],[39,-17],[20,-35],[8,-28],[-3,4],[-17,15]],
 [[-10,36],[-4,56],[25,71],[48,61],[72,73],[130,69],[178,61],[150,45],[140,30],[120,20],[106,-5],[93,8],[78,7],[65,24],[42,30],[30,40]],
 [[112,-12],[138,-10],[153,-25],[145,-39],[116,-33]],
 [[-53,60],[-23,70],[-40,83],[-62,77]],
];
function inside(x,y,polygon) {
 let hit=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
  const [xi,yi]=polygon[i], [xj,yj]=polygon[j];
  if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit;
 }
 return hit;
}
export function projectGlobe(lon, lat, rotation = 0, tilt = 0, roll = 0) {
 const a=(lon-105+rotation)*RAD,b=lat*RAD;
 const x=Math.cos(b)*Math.sin(a),y=-Math.sin(b),z=Math.cos(b)*Math.cos(a);
 const t=tilt*RAD,s=roll*RAD;
 const ty=y*Math.cos(t)-z*Math.sin(t),tz=y*Math.sin(t)+z*Math.cos(t);
 return {x:x*Math.cos(s)-ty*Math.sin(s),y:x*Math.sin(s)+ty*Math.cos(s),z:tz};
}
const faces=[];
for(let lat=-90;lat<90;lat+=15)for(let lon=-180;lon<180;lon+=15) {
 const a=[lon,lat],b=[lon+15,lat],c=[lon+15,lat+15],d=[lon,lat+15];
 for(const vertices of [[a,b,c],[a,c,d]]) {
  const x=vertices.reduce((s,p)=>s+p[0],0)/3,y=vertices.reduce((s,p)=>s+p[1],0)/3;
  faces.push({vertices,land:land.some(p=>inside(x,y,p)),shade:(faces.length%7)/7});
 }
}
export function createOrbitalGlobe(canvas) {
 const ctx=canvas.getContext('2d');
 return { draw(rotation=0, pose={}) {
  if(!ctx)return;
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const r=Math.min(w*.34,h*.37)*(pose.scale??1),cx=w*(pose.x??50)/100,cy=h*(pose.y??50)/100;
  const glow=ctx.createRadialGradient(cx-r*.3,cy-r*.4,r*.1,cx,cy,r);
  glow.addColorStop(0,'#ffffff');glow.addColorStop(1,'#e5eaf0');
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=glow;ctx.fill();
  for(const face of faces){
   const pts=face.vertices.map(([lon,lat])=>projectGlobe(lon,lat,rotation,pose.tilt,pose.roll));
   const z=pts.reduce((s,p)=>s+p.z,0)/3;if(z<.03)continue;
   ctx.beginPath();pts.forEach((p,i)=>{const x=cx+p.x*r,y=cy+p.y*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
   ctx.fillStyle=face.land?`rgba(24,52,83,${.14+z*.15+face.shade*.09})`:`rgba(255,255,255,${.09+face.shade*.24})`;
   ctx.fill();ctx.strokeStyle=`rgba(35,62,89,${.045+z*.045})`;ctx.lineWidth=.65;ctx.stroke();
  }
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(35,62,89,.12)';ctx.lineWidth=.8;ctx.stroke();
 }};
}
