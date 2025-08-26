// ----------------- Theme toggle (persist & aria) -----------------
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('abms_theme');
if (savedTheme === 'light') document.body.classList.add('light');
updateThemeButton();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('abms_theme', isLight ? 'light' : 'dark');
  updateThemeButton();
});

function updateThemeButton() {
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
}

// ----------------- Particle System (performant) -----------------
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d', { alpha: true });

// Resize & DPR handling
let DPR = Math.max(1, window.devicePixelRatio || 1);
function resizeCanvas() {
  DPR = Math.max(1, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.round(w * DPR);
  canvas.height = Math.round(h * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

// Particle settings (scale down on small devices)
const area = window.innerWidth * window.innerHeight;
const BASE_COUNT = Math.min(300, Math.round(area / 1800)); // adapt to screen
const colors = ['#ff6ec7', '#1ee7ff', '#fffa3c', '#f5f5f5'];

class Particle {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.r = Math.random() * 2.2 + 0.6;
    this.color = colors[(Math.random() * colors.length) | 0];
    const speed = (Math.random() * 0.5 + 0.05) * (initial ? 0.6 : 1);
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20) this.x = window.innerWidth + 20;
    if (this.x > window.innerWidth + 20) this.x = -20;
    if (this.y < -20) this.y = window.innerHeight + 20;
    if (this.y > window.innerHeight + 20) this.y = -20;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.95;
    ctx.fill();
  }
}

// Create particles
let particles = [];
function populateParticles() {
  particles = new Array(Math.max(30, BASE_COUNT)).fill(null).map(() => new Particle());
}
populateParticles();

// Mouse interaction (throttled)
let mouse = { x: -9999, y: -9999, lastMove: 0 };
let mouseThrottle = 16; // ms
canvas.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - mouse.lastMove < mouseThrottle) return;
  mouse.lastMove = now;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}, { passive: true });
canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

// Pause when tab not visible
let isHidden = false;
document.addEventListener('visibilitychange', () => { isHidden = document.hidden; });

// Animation loop
let lastFrame = 0;
const FPS_LIMIT = 60;
function loop(ts) {
  if (isHidden) { requestAnimationFrame(loop); lastFrame = ts; return; }
  const dt = ts - lastFrame;
  if (dt < (1000 / FPS_LIMIT)) { requestAnimationFrame(loop); return; }
  lastFrame = ts;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (mouse.x > -9000) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 120 * 120) {
        const dist = Math.sqrt(dist2) || 1;
        const push = (120 - dist) * 0.0009;
        p.vx += (dx / dist) * push;
        p.vy += (dy / dist) * push;
      }
    }
    p.vx *= 0.995;
    p.vy *= 0.995;
    p.update();
    p.draw();
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Recreate particles on big viewport changes
let lastW = window.innerWidth, lastH = window.innerHeight;
setInterval(() => {
  if (Math.abs(window.innerWidth - lastW) > 200 || Math.abs(window.innerHeight - lastH) > 200) {
    lastW = window.innerWidth; lastH = window.innerHeight;
    populateParticles();
    resizeCanvas();
  }
}, 1200);

// ----------------- Parallax & features reveal -----------------
const parallaxItems = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallaxItems.forEach((item, i) => {
    item.style.transform = `translateY(${y * (0.02 + (i * 0.003))}px)`;
  });
}, { passive: true });

// Fixed selector & animation class
const featureCards = document.querySelectorAll('.feature, .hero-card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.35 });
featureCards.forEach(card => observer.observe(card));
