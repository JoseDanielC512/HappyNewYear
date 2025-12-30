// YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'NTmWcpfYpOE',
        playerVars: { 'autoplay': 1, 'controls': 0, 'loop': 1, 'playlist': 'NTmWcpfYpOE' },
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    // Intentar reproducir a los 2 segundos
    setTimeout(() => {
        event.target.playVideo();
        event.target.setVolume(100);
    }, 2000);
}

// Interaction Handler
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction);

function handleInteraction(e) {
    if (player && player.getPlayerState() !== 1) player.playVideo();

    // Launch fireworks at click position
    const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
    launchMoredetails(x, y);
}

// --- Luxury Particle System ---
const canvas = document.getElementById('luxuryCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
const goldPalette = ['#d4af37', '#f7e7ce', '#b8860b', '#ffffff'];
// Food emojis kept as requested, but maybe slightly smaller/classier falling
const foodEmojis = ['🥂', '🍾', '🍇', '🍓', '🍰', '🍫'];

class Particle {
    constructor(x, y, kind) {
        this.x = x;
        this.y = y;
        this.kind = kind; // 'ambient', 'firework', 'food'

        if (kind === 'ambient') {
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
            this.alpha = Math.random() * 0.5;
            this.life = Infinity;
        } else if (kind === 'firework') {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 3;
            // Mixed vibrant colors for fireworks to keep it 'contentoso'
            const vibrantColors = ['#ff0055', '#00ffaa', '#ffcc00', '#00ffff', '#d4af37'];
            this.color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
            this.alpha = 1;
            this.life = 100;
            this.gravity = 0.05;
            this.friction = 0.96;
        } else if (kind === 'food') {
            this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = Math.random() * -5 - 2;
            this.gravity = 0.15;
            this.friction = 0.99;
            this.life = 200;
            this.alpha = 1;
            this.size = 24; // slightly smaller
        }
    }

    update() {
        if (this.kind !== 'ambient') {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.life--;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.kind === 'firework') this.alpha = this.life / 100;
        if (this.kind === 'food' && this.life < 50) this.alpha = this.life / 50;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.kind === 'food') {
            ctx.font = `${this.size}px Arial`;
            ctx.fillText(this.emoji, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Add sparkle glow
            if (this.kind === 'firework') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
        }
        ctx.restore();
    }
}

// Background ambient gold dust
for (let i = 0; i < 50; i++) particles.push(new Particle(Math.random() * w, Math.random() * h, 'ambient'));

function launchMoredetails(x, y) {
    // Fireworks
    for (let i = 0; i < 40; i++) particles.push(new Particle(x, y, 'firework'));
    // Champagne/Food
    for (let i = 0; i < 2; i++) particles.push(new Particle(x, y, 'food'));
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    // Draw Ambient (wrap around)
    particles.forEach(p => {
        if (p.kind === 'ambient') {
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
        }
        p.update();
        p.draw(ctx);
    });

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].kind !== 'ambient' && particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Random auto-fireworks
    if (Math.random() < 0.02) {
        launchMoredetails(Math.random() * w, Math.random() * h * 0.7);
    }

    requestAnimationFrame(animate);
}
animate();
