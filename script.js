// ----------------- Light/Dark Mode -----------------
document.querySelectorAll('#themeToggle').forEach(btn=>{
    btn.addEventListener('click',()=>{document.body.classList.toggle('light');});
});

// ----------------- 3D Interactive Particles -----------------
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let w=canvas.width=window.innerWidth;
let h=canvas.height=window.innerHeight;
window.addEventListener('resize',()=>{w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;});

const particlesArray=[];
const colors=['#ff6ec7','#1ee7ff','#fffa3c','#f5f5f5'];

class Particle{
    constructor(){this.x=Math.random()*w;this.y=Math.random()*h;this.radius=Math.random()*3+1;this.color=colors[Math.floor(Math.random()*colors.length)];this.vx=(Math.random()-0.5)*0.7;this.vy=(Math.random()-0.5)*0.7;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fillStyle=this.color;ctx.fill();}
    update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>w)this.vx*=-1;if(this.y<0||this.y>h)this.vy*=-1;}
}

for(let i=0;i<300;i++)particlesArray.push(new Particle());
canvas.addEventListener('mousemove',e=>{
    particlesArray.forEach(p=>{
        let dx=e.x-p.x;let dy=e.y-p.y;let dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<100){p.vx+=dx*0.0005;p.vy+=dy*0.0005;}
    });
});

function animate(){
    ctx.clearRect(0,0,w,h);
    particlesArray.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(animate);
}
animate();

// ----------------- Parallax Scroll -----------------
const parallaxItems=document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll',()=>{parallaxItems.forEach(item=>{const offset=window.scrollY*0.2;item.style.transform=`translateY(${offset}px)`;});});

// ----------------- Animate Features On Scroll -----------------
const featureCards=document.querySelectorAll('.feature-cards .glass-card');
const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('visible');
    });
},{threshold:0.5});
featureCards.forEach(card=>observer.observe(card));
