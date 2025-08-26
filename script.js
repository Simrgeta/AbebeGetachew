// ----------------- Light/Dark Mode -----------------
const themeToggle = document.querySelectorAll('#themeToggle');
themeToggle.forEach(btn => {
    btn.addEventListener('click', () => {
        document.body.classList.toggle('light');
    });
});

// ----------------- Particles -----------------
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

const particlesArray = [];
const colors = ['#ff6ec7','#1ee7ff','#f5f5f5','#fffa3c'];

class Particle {
    constructor() {
        this.x = Math.random()*w;
        this.y = Math.random()*h;
        this.radius = Math.random()*3 + 1;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.vx = (Math.random()-0.5)*0.5;
        this.vy = (Math.random()-0.5)*0.5;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if(this.x<0||this.x>w) this.vx*=-1;
        if(this.y<0||this.y>h) this.vy*=-1;
    }
}

for(let i=0;i<200;i++) particlesArray.push(new Particle());

function animate() {
    ctx.clearRect(0,0,w,h);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();
