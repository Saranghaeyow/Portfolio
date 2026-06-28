// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 60);
});
document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'rgba(0,229,255,0.4)';
    ring.style.borderColor = 'rgba(0,229,255,0.8)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    ring.style.borderColor = 'rgba(0,229,255,0.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// Background canvas — animated particle network
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], mouse = {x: -999, y: -999};

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

for (let i = 0; i < 70; i++) {
  particles.push({
    x: Math.random() * 1920, y: Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5
  });
}

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,255,0.5)';
    ctx.fill();
    // mouse interaction
    const dx = mouse.x - p.x, dy = mouse.y - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 120) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(0,229,255,${0.15 * (1 - dist/120)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  });
  particles.forEach((p, i) => {
    for (let j = i+1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist/100)})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .timeline-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Skill bar animation
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-grid').forEach(el => skillObs.observe(el));

// Card glow effect
function cardGlow(card, e) {
  const rect = card.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty('--mx', x + '%');
  card.style.setProperty('--my', y + '%');
}