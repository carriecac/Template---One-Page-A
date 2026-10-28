// ===== EDIT THESE VALUES =====
const HERO_VIDEO_URL = ""; // e.g. a data: URI or hosted .mp4; leave blank to use the animated field
const DATA = {
  asOf: "Sample data",
  bids: [
    {name:"Yellow Corn", delivery:"Nov 2026", fut:4.52, basis:-0.28},
    {name:"Yellow Corn", delivery:"Jan 2027", fut:4.61, basis:-0.22},
    {name:"Soybeans",    delivery:"Nov 2026", fut:10.84, basis:-0.45},
    {name:"Soybeans",    delivery:"Jan 2027", fut:10.97, basis:-0.40},
    {name:"HRW Wheat",   delivery:"Nov 2026", fut:5.38, basis:-0.55},
    {name:"Milo",        delivery:"Nov 2026", fut:4.30, basis:-0.62}
  ],
  futures: [
    {c:"Corn Dec ’26", last:4.52, chg:0.03, hi:4.55, lo:4.47},
    {c:"Corn Mar ’27", last:4.68, chg:0.02, hi:4.70, lo:4.63},
    {c:"Soybeans Jan ’27", last:10.97, chg:-0.06, hi:11.05, lo:10.91},
    {c:"KC Wheat Dec ’26", last:5.38, chg:0.04, hi:5.41, lo:5.31},
    {c:"Chi Wheat Dec ’26", last:5.62, chg:-0.01, hi:5.67, lo:5.58}
  ],
  hours: [["Monday","7:00 am – 6:00 pm"],["Tuesday","7:00 am – 6:00 pm"],["Wednesday","7:00 am – 6:00 pm"],["Thursday","7:00 am – 6:00 pm"],["Friday","7:00 am – 6:00 pm"],["Saturday","8:00 am – 12:00 pm"],["Sunday",""]],
  // open/close in 24h by JS weekday (0=Sun)
  sched: {0:null,1:[7,18],2:[7,18],3:[7,18],4:[7,18],5:[7,18],6:[8,12]},
  wx: {icon:"⛅", temp:58, desc:"Partly cloudy · Wind NW 12 mph · Humidity 44%",
    days:[["Wed","☀️","64°/41°"],["Thu","⛅","61°/40°"],["Fri","🌧️","55°/38°"],["Sat","🌤️","59°/36°"],["Sun","☀️","63°/39°"]]}
};
// =============================
const $=id=>document.getElementById(id), f=n=>"$"+n.toFixed(2), s=n=>(n>=0?"+":"")+n.toFixed(2);
$("bidsub").textContent = DATA.asOf + " · cash bid = futures + basis";
$("bidrows").innerHTML = DATA.bids.map(b=>`<tr><td><b>${b.name}</b></td><td>${b.delivery}</td><td class="r">${f(b.fut)}</td><td class="r ${b.basis<0?'dn':'up'}">${s(b.basis)}</td><td class="r big">${f(b.fut+b.basis)}</td></tr>`).join("");
$("futrows").innerHTML = DATA.futures.map(x=>`<tr><td><b>${x.c}</b></td><td class="r">${f(x.last)}</td><td class="r ${x.chg>=0?'up':'dn'}">${x.chg>=0?'▲':'▼'} ${s(x.chg)}</td><td class="r">${f(x.hi)}</td><td class="r">${f(x.lo)}</td></tr>`).join("");
const dow=(new Date()).getDay(), names=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
$("hrs").innerHTML = DATA.hours.map(h=>`<li class="${h[0]===names[dow]?'today':''}"><span>${h[0]}</span><span>${h[1]||"Closed"}</span></li>`).join("");
(function(){const d=new Date(),sc=DATA.sched[d.getDay()],h=d.getHours()+d.getMinutes()/60,open=sc&&h>=sc[0]&&h<sc[1];
 const el=$("status");el.classList.add(open?"open":"closed");$("stxt").textContent=open?"Open now":"Closed now";})();
$("wi").textContent=DATA.wx.icon;$("wt").textContent=DATA.wx.temp+"°F";$("wd").textContent=DATA.wx.desc;
$("fc").innerHTML=DATA.wx.days.map(d=>`<div><b>${d[0]}</b><span>${d[1]}</span>${d[2]}</div>`).join("");

(function(){const r=document.documentElement,b=$("tg"),mq=matchMedia("(prefers-color-scheme: dark)");let t=null;
 try{t=localStorage.getItem("theme")}catch(e){}
 const eff=()=>t||(mq.matches?"dark":"light");
 function apply(){if(t)r.setAttribute("data-theme",t);else r.removeAttribute("data-theme");b.textContent=eff()==="dark"?"☀️ Light":"🌙 Dark";}
 b.onclick=()=>{t=eff()==="dark"?"light":"dark";try{localStorage.setItem("theme",t)}catch(e){}apply()};
 apply();
})();
// Hero: real video if provided, else animated wheat field
if(HERO_VIDEO_URL){const v=$("hv");v.src=HERO_VIDEO_URL;v.hidden=false;$("cv").style.display="none";}
else{
 const c=$("cv"),x=c.getContext("2d");let W,H,st=[];
 function size(){W=c.width=c.clientWidth||innerWidth||800;H=c.height=c.clientHeight||Math.max(520,(innerHeight||600)*.88);st=[];
  for(let i=0;i<Math.min(260,W/4);i++)st.push({x:Math.random()*W,h:H*(.22+Math.random()*.2),p:Math.random()*6,l:Math.random()});}
 size();addEventListener("resize",size);if(window.ResizeObserver)new ResizeObserver(size).observe(c);setTimeout(size,300);
 const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 function draw(t){
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1c3b5a");g.addColorStop(.45,"#e89b5a");g.addColorStop(.62,"#f6cf7a");g.addColorStop(1,"#c8922a");
  x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="rgba(255,240,190,.9)";x.beginPath();x.arc(W*.72,H*.5,H*.07,0,7);x.fill();
  x.fillStyle="#8a6a2a";x.fillRect(W*.08,H*.38,W*.05,H*.3);x.fillStyle="#a07c34";x.fillRect(W*.075,H*.34,W*.06,H*.05);
  st.sort((a,b)=>a.l-b.l);
  for(const s of st){const by=H*(.68+s.l*.32),sway=Math.sin((reduce?0:t)/900+s.p+s.x/90)*(10+s.l*12),top=by-s.h*(.6+s.l*.8);
   x.strokeStyle=`hsl(${40+s.l*8},${60+s.l*20}%,${32+s.l*22}%)`;x.lineWidth=1.5+s.l*2;
   x.beginPath();x.moveTo(s.x,by);x.quadraticCurveTo(s.x,(by+top)/2,s.x+sway,top);x.stroke();
   x.fillStyle=`hsl(${44+s.l*6},80%,${45+s.l*20}%)`;x.beginPath();x.ellipse(s.x+sway,top-6,2.5+s.l*2,9+s.l*6,sway/60,0,7);x.fill();}
  requestAnimationFrame(draw);}
 requestAnimationFrame(draw);
}
