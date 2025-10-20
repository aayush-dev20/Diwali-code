const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 3;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.distanceToTarget = distance(x, y, targetX, targetY);
    this.traveled = 0;
    this.exploded = false;
  }
  update() {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.traveled += Math.sqrt(vx * vx + vy * vy);

    if(this.traveled >= this.distanceToTarget && !this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }
  explode() {
    for(let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FF6347";
    ctx.fill();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 5 + 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.restore();
  }
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

function animate() {
  ctx.fillStyle = "rgba(11, 11, 11, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if(fw.exploded) fireworks.splice(i, 1);
  });

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if(p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

// Launch fireworks randomly
setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const targetX = Math.random() * canvas.width;
  const targetY = Math.random() * canvas.height / 2;
  fireworks.push(new Firework(x, y, targetX, targetY));
}, 800);

animate();