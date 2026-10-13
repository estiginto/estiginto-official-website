// A shaded 3D shuttle mesh, projected and depth-sorted on a transparent canvas.
const vertices = [
 [0,-30,0],[-7,-8,5],[7,-8,5],[-8,20,3],[8,20,3],
 [0,-7,-7],[0,22,-5],[-27,24,0],[27,24,0],[-9,11,0],[9,11,0],
 [-4,-13,-5],[4,-13,-5],[-4,-3,-8],[4,-3,-8],[0,12,-16],
];
const surfaces = [
 [[0,1,3,6,5],'#8798ad'],[[0,5,6,4,2],'#becbd8'],
 [[0,2,1],'#eef3f7'],[[1,2,4,3],'#e2e9ee'],
 [[9,7,3],'#a88d67'],[[10,4,8],'#d9c5a2'],
 [[5,15,6],'#526984'],[[11,12,14,13],'#15374f'],
 [[3,4,6],'#263e56'],
];
export function createOrbitalShip(canvas) {
 const ctx=canvas.getContext('2d');
 return { draw(bank=0) {
  if(!ctx)return;
  const dpr=Math.min(window.devicePixelRatio||1,2),size=100;
  if(canvas.width!==size*dpr){canvas.width=size*dpr;canvas.height=size*dpr;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size);
  const yaw=.55+bank*.35,pitch=-.42;
  const points=vertices.map(([x,y,z])=>{
   const px=x*Math.cos(yaw)+z*Math.sin(yaw),pz=-x*Math.sin(yaw)+z*Math.cos(yaw);
   return {x:50+px*1.25,y:48+(y*Math.cos(pitch)-pz*Math.sin(pitch))*1.25,z:y*Math.sin(pitch)+pz*Math.cos(pitch)};
  });
  const flame=ctx.createLinearGradient(0,72,0,98);
  flame.addColorStop(0,'#96cbdc');flame.addColorStop(1,'#96cbdc00');
  ctx.fillStyle=flame;ctx.beginPath();ctx.moveTo(45,73);ctx.quadraticCurveTo(50,110,55,73);ctx.fill();
  surfaces.map(([indices,color])=>({indices,color,depth:indices.reduce((s,i)=>s+points[i].z,0)/indices.length}))
   .sort((a,b)=>b.depth-a.depth).forEach(({indices,color})=>{
    ctx.beginPath();indices.forEach((i,n)=>n?ctx.lineTo(points[i].x,points[i].y):ctx.moveTo(points[i].x,points[i].y));
    ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#18334b35';ctx.lineWidth=.6;ctx.stroke();
   });
 }};
}
