/* ================= EDIT HERE ================= */
const CONFIG = {
  eventStart: "2026-11-30T17:00:00+03:00",
  eventTitle: "Mohamed & Gehan Wedding Reception",
  eventPlace: "Tiba Rose Hotel, Lana Hall",
 gallery: [
    "img1.jfif",
    "img2.jfif",
    "img3.jfif",
    "img4.jfif"
  ]
};
const $=s=>document.querySelector(s);

/* petals */
for(let i=0;i<14;i++){const p=document.createElement('div');p.className='petal';p.textContent='\u2740';
  p.style.cssText=`left:${Math.random()*100}%;font-size:${12+Math.random()*22}px;animation-duration:${14+Math.random()*16}s;animation-delay:${-Math.random()*20}s`;$('#petals').appendChild(p)}

/* cover -> page 1 (arch stays; scroll down for Ceremony) */
$('#openBtn').onclick=()=>{
  $('#cover').classList.add('hide');
  $('#main').classList.add('show');
  window.scrollTo(0,0);
  /* sharp background while the arch page is visible, blurred for the other pages */
  new IntersectionObserver(([e])=>{$('#bg').className='bg '+(e.intersectionRatio>.5?'sharp':'blur')},{threshold:[0,.25,.5,.75,1]}).observe($('#arch'));
};

/* gallery coverflow */
const flow=$('#flow');let cur=0;const slides=CONFIG.gallery.map((src,i)=>{
  const d=document.createElement('div');d.className='slide ph';d.textContent='Photo '+(i+1);
  const im=new Image();im.onload=()=>{d.style.backgroundImage=`url(${src})`;d.classList.remove('ph');d.textContent=''};im.src=src;
  flow.appendChild(d);return d});
function render(){
  const w=Math.min(innerWidth*.44,360),step=w*.62;
  slides.forEach((s,i)=>{const o=i-cur,a=Math.abs(o);
    s.style.transform=`translateX(${o*step}px) translateZ(${-a*120}px) rotateY(${-Math.sign(o)*Math.min(a,2)*32}deg) scale(${a?.72:1})`;
    s.style.zIndex=10-a;s.style.opacity=a>2?0:1;s.style.filter=a?'brightness(.55) saturate(.7)':'none';s.style.pointerEvents=a>2?'none':'auto'});
  $('#count').textContent=`${cur+1} / ${slides.length}`}
const go=d=>{cur=(cur+d+slides.length)%slides.length;render()};
$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);

/* Auto-play Gallery (Tqlib lwa7do kol 3.5 swany) */
setInterval(()=>{
  go(1);
}, 3500);

slides.forEach((s,i)=>s.onclick=()=>{cur=i;render()});
let tx=0;flow.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
flow.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>40)go(d<0?1:-1)});
addEventListener('resize',render);render();

/* countdown */
const start=new Date(CONFIG.eventStart);
function tick(){let s=Math.max(0,Math.floor((start-Date.now())/1e3));
  const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);
  $('#cd').textContent=`${d} days ${h} hours ${m} min ${s%60} sec`}
tick();setInterval(tick,1000);

/* calendar (Mon first) for November 2026 w el qalb 3la 30 */
(function(){
  const first = new Date(2026, 10, 1); // November (shahr 10 fel index)
  const off = (first.getDay() + 6) % 7; 
  const days = 30;
  
  let h = '<thead><tr>' + ['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => `<th>${d}</th>`).join('') + '</tr></thead><tbody>';
  let n = 1;
  
  for(let r = 0; r < 6; r++) {
    h += '<tr>';
    for(let c = 0; c < 7; c++) {
      const idx = r * 7 + c;
      if(idx < off || n > days) {
        h += '<td></td>';
      } else {
        h += (n === 30) ? `<td class="on"><span>30</span></td>` : `<td>${n}</td>`;
        n++;
      }
    }
    h += '</tr>';
  }
  $('#calTable').innerHTML = h + '</tbody>';
})();

/* add to calendar (.ics) */
$('#addcal').onclick=()=>{
  const f=d=>d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z',end=new Date(+start+4*36e5);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitation//EN','BEGIN:VEVENT','UID:wedding-2026@invite',`DTSTAMP:${f(new Date())}`,`DTSTART:${f(start)}`,`DTEND:${f(end)}`,`SUMMARY:${CONFIG.eventTitle}`,`LOCATION:${CONFIG.eventPlace}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='wedding.ics';a.click()};

/* RSVP */
let choice=null;
function check(){$('#confirm').disabled=!($('#rname').value.trim()&&choice)}
document.querySelectorAll('.opt').forEach(o=>o.onclick=()=>{document.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));o.classList.add('sel');choice=o.dataset.v;check()});
$('#rname').oninput=check;
function submitRSVP(data){try{const l=JSON.parse(localStorage.getItem('rsvp')||'[]');l.push(data);localStorage.setItem('rsvp',JSON.stringify(l))}catch(e){}}
$('#confirm').onclick=()=>{submitRSVP({name:$('#rname').value.trim(),attend:choice,at:new Date().toISOString()});
  $('#thanks').textContent=choice==='yes'?'Thank you! We look forward to seeing you.':'Thank you for letting us know.';$('#confirm').disabled=true};

/* guestbook */
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let msgs=[];try{msgs=JSON.parse(localStorage.getItem('gb')||'[]')}catch(e){}
function drawMsgs(){$('#msgs').innerHTML=msgs.map(m=>`<div class="msg"><div class="hd"><b>${esc(m.n)}</b><time>${esc(m.t)}</time></div><p>${esc(m.m)}</p></div>`).join('')}
['\u{1F44F}','\u2764\uFE0F','\u{1F60D}','\u{1F970}','\u{1F389}','\u{1F64F}','\u{1F339}','\u{1F495}','\u2728','\u{1F38A}'].forEach(e=>{const s=document.createElement('span');s.textContent=e;s.onclick=()=>{$('#gtext').value+=e};$('#emojis').appendChild(s)});
$('#emojiBtn').onclick=()=>$('#emojis').classList.toggle('open');
$('#send').onclick=()=>{const n=$('#gname').value.trim(),m=$('#gtext').value.trim();if(!n||!m)return;
  msgs.unshift({n,m,t:new Date().toLocaleString('en-US')});try{localStorage.setItem('gb',JSON.stringify(msgs))}catch(e){}
  $('#gname').value=$('#gtext').value='';drawMsgs()};
drawMsgs();