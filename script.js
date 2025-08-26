// theme toggle (persists)
const themeToggle = document.getElementById('themeToggle');
const current = localStorage.getItem('abms_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
if (current === 'light') document.body.classList.add('light');
themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
themeToggle.setAttribute('aria-pressed', document.body.classList.contains('light'));
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('abms_theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', isLight);
});

/* ---------- Particles (lightweight, throttled) ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let DPR = Math.max(1, window.devicePixelRatio || 1);
let w = canvas.width = innerWidth * DPR;
let h = canvas.height = innerHeight * DPR;
canvas.style.width = innerWidth + 'px';
canvas.style.height = innerHeight + 'px';
ctx.scale(DPR, DPR);

window.addEventListener('resize', () => {
  DPR = Math.max(1, window.devicePixelRatio || 1);
  w = canvas.width = innerWidth * DPR;
  h = canvas.height = innerHeight * DPR;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.scale(DPR, DPR);
});

const colors = ['#ff6ec7', '#1ee7ff', '#fffa3c', '#8a8fff'];
const particles = [];
const PARTICLE_COUNT = Math.min(220, Math.floor((innerWidth * innerHeight) / 9000));

class P {
  constructor(){
    this.x = Math.random() * innerWidth;
    this.y = Math.random() * innerHeight;
    this.r = Math.random() * 2 + 0.6;
    this.c = colors[Math.floor(Math.random()*colors.length)];
    this.vx = (Math.random()-0.5) * 0.4;
    this.vy = (Math.random()-0.5) * 0.4;
  }
  update(){ 
    this.x += this.vx; this.y += this.vy;
    if(this.x < -10) this.x = innerWidth + 10;
    if(this.x > innerWidth + 10) this.x = -10;
    if(this.y < -10) this.y = innerHeight + 10;
    if(this.y > innerHeight + 10) this.y = -10;
  }
  draw(){
    ctx.beginPath();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = this.c;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }
}

for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new P());

let mouse = {x:-9999,y:-9999};
let lastMove = 0;
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  lastMove = Date.now();
});
window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });

function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    // subtle attraction to mouse when moving
    if(Date.now() - lastMove < 1200){
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        p.vx += (dx/dist) * 0.02;
        p.vy += (dy/dist) * 0.02;
      }
    }
    p.vx *= 0.995; p.vy *= 0.995;
    p.update(); p.draw();
  });
  requestAnimationFrame(draw);
}
draw();

/* ---------- Parallax simple: translate slower on scroll ---------- */
const parallax = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallax.forEach((el, i) => {
    el.style.transform = `translateY(${y * (0.03 + (i * 0.003))}px)`;
  });
});

/* ---------- Intersection observer for entrance animation ---------- */
const animated = document.querySelectorAll('[data-anim]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
},{threshold:0.18});
animated.forEach(n => io.observe(n));

/* small accessibility improvement: keyboard focus outline */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
});

/* end of file */
