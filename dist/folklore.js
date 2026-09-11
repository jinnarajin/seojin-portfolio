// Korean trail landmarks and a reversible, session-only playground.
export function createFolklore({THREE,scene,physics,box,cylinder,sphere,solid,sign,dynamic,english,ground,pads}) {
 const say=(ko,en)=>english?en:ko;
 const x=-17,z=27;
 // Open hanok pavilion: timber pillars, dancheong beams and curved tiled eaves.
 solid(10,.45,9,0x9f9786,x,.225,z);
 for(const dx of [-3.6,3.6])for(const dz of [-3,3]){
  solid(.48,4,.48,0x713d2c,x+dx,2.4,z+dz);
  cylinder(.48,.55,.4,0xaaa391,x+dx,.55,z+dz,8);
 }
 for(const dz of [-3.2,3.2]){
  box(8.4,.45,.55,0x286c65,x,4.4,z+dz);
  box(8.6,.12,.6,0xa6533b,x,4.63,z+dz);
  for(let i=-3;i<=3;i++)box(.28,.3,.62,i%2?0xd6b15b:0x548798,x+i,4.4,z+dz);
 }
 for(const side of [-1,1])for(let row=0;row<6;row++){
  const dz=side*(row*.7+.3), y=6.1-row*.27+Math.max(0,row-3)*.18;
  const tile=box(11,.18,.83,0x343f47,x,y,z+dz);tile.rotation.x=side*.26;
  for(let j=-7;j<=7;j++){
   const rib=cylinder(.085,.085,.86,0x59616a,x+j*.72,y+.12,z+dz,6);
   rib.rotation.x=Math.PI/2+side*.26;
  }
 }
 box(11.2,.25,.35,0x56636a,x,6.3,z);
 sign('서진정 · SEOJIN',x,4.35,z+3.51,5.1,.7,'#e9d6a7','#284d48');
 // Two carved village guardians face the trail.
 for(const [tx,tz,title] of [[-8,25,'천하대장군'],[-8,31,'지하여장군']]){
  solid(.85,3.8,.85,0x9b643e,tx,1.9,tz);
  box(1.08,.24,1.05,0x423d32,tx,3.86,tz);
  for(const dx of [-.22,.22]){box(.26,.13,.09,0x262c27,tx+dx,3.25,tz+.46);box(.3,.12,.1,0x302d24,tx+dx,3.47,tz+.46).rotation.z=-dx;}
  box(.18,.38,.25,0xb98455,tx,2.98,tz+.5);
  box(.58,.23,.08,0xf1d6a4,tx,2.62,tz+.46);
  for(const dx of [-.2,0,.2])box(.035,.23,.09,0x654530,tx+dx,2.62,tz+.49);
  [...title].forEach((c,i)=>sign(c,tx,2.16-i*.35,tz+.46,.47,.34,'#392a20'));
 }
 const protectedMeshes=new Set([ground,...pads]);
 // Snapshot scenery before adding the horse or effect meshes. Keep paths and pads usable.
 const scenery=scene.children.filter(m=>m.isMesh&&!protectedMeshes.has(m)&&m.position.y>.2);
 const originals=scenery.map(m=>({m,position:m.position.clone(),quaternion:m.quaternion.clone(),visible:m.visible}));
 const bodies=physics.bodies.filter(b=>b.position.y>0).map(b=>({b,position:b.position.clone(),quaternion:b.quaternion.clone()}));
 const broken=new Set(),removed=new Set();
 const loot=new THREE.Group();loot.position.set(x,1.25,z-4.9);scene.add(loot);
 cylinder(.12,.16,1.45,0x644126,0,0,0,8,loot);
 sphere(.44,0x58ccb5,0,.8,0,loot);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;sphere(.13,0xe6cf80,Math.cos(a)*.42,.8,Math.sin(a)*.42,loot);}
 const ring=new THREE.Mesh(new THREE.RingGeometry(.5,.6,32),new THREE.MeshBasicMaterial({color:0x6affda,side:THREE.DoubleSide,transparent:true,opacity:.7}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.13,z-4.9);scene.add(ring);
 const shock=new THREE.Mesh(new THREE.RingGeometry(.94,1,64),new THREE.MeshBasicMaterial({color:0x8fffe0,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));shock.rotation.x=-Math.PI/2;scene.add(shock);
 const bits=[];const geometry=new THREE.IcosahedronGeometry(.25,0);const material=new THREE.MeshStandardMaterial({color:0xc09968,roughness:1});
 for(let i=0;i<90;i++){const m=new THREE.Mesh(geometry,material);m.visible=false;scene.add(m);bits.push({m,life:0,v:new THREE.Vector3()});}
 let unlocked=false,cooldown=0,wave=0,cursor=0,position=()=>({x:0,z:0}),respawn=()=>{},modal;
 const ui=document.createElement('aside');ui.className='folklore';ui.setAttribute('aria-label',say('도깨비의 선물','Dokkaebi’s gift'));
 ui.innerHTML=`<div class="folklore-title">${say('도깨비의 선물','DOKKAEBI’S GIFT')}</div><p class="folklore-note" role="status" aria-live="polite">${say('프로젝트 5곳을 모두 방문하면 도깨비 방망이를 드려요. 방망이를 얻으면 주변 건물과 사물을 전부 부술 수 있어요.','Visit all 5 projects on the world map to earn the magic club. Once you have it, you can smash every building and object around you.')}</p><div><button class="smash" disabled>${say('F · 도깨비 방망이','F · Magic club')}</button><button class="restore">${say('↺ 마을 복구','↺ Restore village')}</button></div>`;
 document.body.appendChild(ui);const note=ui.querySelector('p'),attack=ui.querySelector('.smash');
  function reward(){if(unlocked)return false;unlocked=true;loot.visible=ring.visible=false;attack.disabled=false;ui.dataset.unlocked='true';note.textContent=say('월드맵 완주! 도깨비 방망이를 얻었어요. F 키나 방망이 버튼을 누르면 주변의 건물·사물을 전부 부술 수 있어요. ↺ 마을 복구로 되돌릴 수 있어요.','World map complete! You earned the magic club. Press F or the club button to smash every building and object around you. Restore village puts it all back.');return true;}
 function smash(p){
  if(!unlocked||cooldown>0||modal?.open)return 0;
  cooldown=.65;wave=1;shock.position.set(p.x,.25,p.z);
  let count=0;
  originals.forEach(o=>{const m=o.m;if(broken.has(m)||Math.hypot(m.position.x-p.x,m.position.z-p.z)>15)return;broken.add(m);m.visible=false;count++;
   for(let j=0;j<3;j++){const d=bits[cursor++%bits.length];d.life=1.4;d.m.visible=true;d.m.position.copy(m.position);d.m.position.y=Math.min(d.m.position.y,7);d.v.set((Math.random()-.5)*10,3+Math.random()*6,(Math.random()-.5)*10);}
  });
  bodies.forEach(({b})=>{if(!removed.has(b)&&Math.hypot(b.position.x-p.x,b.position.z-p.z)<=15){physics.removeBody(b);removed.add(b);}});
  ui.dataset.broken=String(broken.size);note.textContent=count?say('와장창! 다른 곳도 탐험하며 부숴보세요.','Crash! Ride onward and smash more of the world.'):say('주변은 깨끗해요. 다른 건물 가까이 가보세요.','All clear here. Ride closer to another building.');return count;
 }
 function restore(){
  originals.forEach(o=>{o.m.visible=o.visible;o.m.position.copy(o.position);o.m.quaternion.copy(o.quaternion);});
  bodies.forEach(o=>{if(removed.has(o.b))physics.addBody(o.b);o.b.position.copy(o.position);o.b.quaternion.copy(o.quaternion);o.b.velocity.setZero();o.b.angularVelocity.setZero();o.b.force.setZero();o.b.torque.setZero();o.b.aabbNeedsUpdate=true;o.b.wakeUp();});
  broken.clear();removed.clear();bits.forEach(d=>{d.life=0;d.m.visible=false});wave=0;shock.material.opacity=0;cooldown=0;ui.dataset.broken='0';note.textContent=say('마을 복구 완료!','Village restored!');respawn();
 }
 function update(dt,now,p,isModal){
  cooldown=Math.max(0,cooldown-dt);ui.hidden=isModal;
  loot.rotation.z=Math.sin(now*.002)*.16;loot.position.y=1.25+Math.sin(now*.003)*.17;ring.material.opacity=.45+Math.sin(now*.004)*.2;
  if(wave>0){wave=Math.max(0,wave-dt*1.6);shock.scale.setScalar(1+(1-wave)*15);shock.material.opacity=wave*.8;}
  bits.forEach(d=>{if(d.life<=0)return;d.life-=dt;d.v.y-=16*dt;d.m.position.addScaledVector(d.v,dt);d.m.rotation.x+=dt*3;d.m.rotation.z+=dt*2;if(d.m.position.y<.2){d.m.position.y=.2;d.v.multiplyScalar(.25);d.v.y=Math.abs(d.v.y)}if(d.life<=0)d.m.visible=false});
 }
 function bind(getPosition,reset,dialog){position=getPosition;respawn=reset;modal=dialog;attack.onclick=()=>smash(position());ui.querySelector('.restore').onclick=restore;}
 return {bind,update,reward,smash,restore};
}
