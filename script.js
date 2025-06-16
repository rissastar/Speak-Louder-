// Quotes list
const quotes = [
  { text:"Healing takes time, and asking for help is a courageous step.", author:"Mariska Hargitay" },
  { text:"Your present circumstances don’t determine where you can go; they merely determine where you start.", author:"Nido Qubein" },
  { text:"Stars can’t shine without darkness.", author:"D.H. Sidebottom" },
  { text:"The wound is the place where the light enters you.", author:"Rumi" },
  { text:"You have been assigned this mountain to show others it can be moved.", author:"Unknown" },
  { text:"Self-care is how you take your power back.", author:"Lalah Delia" },
  { text:"You, yourself, as much as anybody in the entire universe, deserve your love and affection.", author:"Buddha" },
  { text:"In the middle of difficulty lies opportunity.", author:"Albert Einstein" },
  { text:"Small steps every day.", author:"Unknown" },
  { text:"Healing is not linear.", author:"Unknown" },
  { text:"Sometimes the bravest thing you can do is to keep going.", author:"Unknown" },
  { text:"You are stronger than you think.", author:"A.A. Milne" },
  { text:"Peace comes from within. Do not seek it without.", author:"Buddha" },
  { text:"You’re allowed to be both a masterpiece and a work in progress.", author:"Sophia Bush" },
  { text:"Growth begins when we start to accept our own weakness.", author:"Jean Vanier" },
  { text:"The only way out is through.", author:"Robert Frost" },
  { text:"You don’t have to control your thoughts. You just have to stop letting them control you.", author:"Dan Millman" },
  { text:"Recovery is something that you have to work on every single day.", author:"Demi Lovato" },
  { text:"Let your hope, not your hurt, shape your future.", author:"Robert H. Schuller" },
  { text:"One day at a time.", author:"Unknown" }
];

let idx = 0, quoteInterval;
const qt = document.getElementById("quote-text");
const qa = document.getElementById("quote-author");
const qd = document.getElementById("quote-dots");

function showQuote(i) {
  idx = i;
  qt.textContent = `"${quotes[i].text}"`;
  qa.textContent = `— ${quotes[i].author}`;
  [...qd.children].forEach((d,c)=> d.classList.toggle("active",c===i));
}

function setupQuotes() {
  quotes.forEach((_,i)=>{
    const d=document.createElement("span");
    d.className="dot";
    d.addEventListener("click", ()=> { showQuote(i); resetInterval(); });
    qd.appendChild(d);
  });
  showQuote(0);
  quoteInterval = setInterval(()=> showQuote((idx+1)%quotes.length),10000);
}

function resetInterval() {
  clearInterval(quoteInterval);
  quoteInterval = setInterval(()=> showQuote((idx+1)%quotes.length),10000);
}

// Modal Helpers
const authModal = document.getElementById("auth-modal");
const panicModal = document.getElementById("panic-modal");
const cta = document.getElementById("cta-btn");
const panicBtn = document.getElementById("panic-btn");
const closes = document.querySelectorAll(".close-btn");

cta.addEventListener("click", ()=> { authModal.style.display="flex"; authModal.setAttribute("aria-hidden","false"); });
panicBtn.addEventListener("click", ()=> { panicModal.style.display="flex"; panicModal.setAttribute("aria-hidden","false"); });
closes.forEach(btn=> btn.addEventListener("click", e=>{
  const m = e.target.closest(".modal");
  m.style.display="none"; m.setAttribute("aria-hidden","true");
}));

document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){
    [authModal,panicModal].forEach(m=>{
      if(m.style.display==="flex"){
        m.style.display="none"; m.setAttribute("aria-hidden","true");
      }
    });
  }
});

// Initialize quotes
setupQuotes();

// Galaxy Background Effect
const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");
let stars=[];
const setupCanvas=()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  stars = Array.from({length:300},()=>{
    return { x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.5+0.3, a:Math.random(), da:(Math.random()*0.01+0.001) }
  });
};
const draw =()=>{
  const g = ctx.createRadialGradient(canvas.width/2,canvas.height/2,50,canvas.width/2,canvas.height/2,canvas.width);
  g.addColorStop(0,"#0b0f1a"); g.addColorStop(0.5,"#1e2a47"); g.addColorStop(1,"#0b0f1a");
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);

  stars.forEach(s => {
    s.a += s.da;
    if(s.a>=1||s.a<=0) s.da=-s.da;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
    ctx.fillStyle=`rgba(255,255,255,${s.a})`;
    ctx.shadowColor="#fff"; ctx.shadowBlur=s.r*2;
    ctx.fill();
  });
  requestAnimationFrame(draw);
};
window.addEventListener("resize",()=> setupCanvas());
setupCanvas(); draw();