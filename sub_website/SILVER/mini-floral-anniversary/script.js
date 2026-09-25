// ==================== 0. SELALU MULAI DARI ATAS (ANTI NYANGKUT DI HASH) ====================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  // Bersihin hash (#section-2/#section-3) dari URL biar refresh berikutnya nggak nyangkut lagi
  history.replaceState(null, '', window.location.pathname + window.location.search);
});

// ==================== 1. REALTIME COUNTDOWN ====================
const startDate = new Date("2023-10-20T00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = String(days).padStart(2, '0');
  document.getElementById("hours").innerText = String(hours).padStart(2, '0');
  document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
  document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ==================== 2. ANTIGRAVITY PARTICLE CANVAS ====================
const canvas = document.getElementById('antigravity-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 65;

/* Posisi kursor untuk efek antigravity (partikel nyebar pas didekati) */
const mouse = { x: null, y: null };
const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 7;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});
window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}, { passive: true });
window.addEventListener('touchend', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * 0.8 + 0.2);
    this.opacity = Math.random() * 0.7 + 0.3;
    this.color = `hsla(${Math.random() * 40 + 320}, 100%, 75%, ${this.opacity})`;
  }

  update() {
    this.y += this.speedY;

    // Efek antigravity: kesebar menjauh kalau kursor mendekat
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0.01) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * REPEL_STRENGTH;
        this.y += Math.sin(angle) * force * REPEL_STRENGTH;
      }
    }

    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
    // Jaga partikel tetap di dalam layar secara horizontal
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// ==================== 3. HERO CAROUSEL GALLERY ====================
const highlights = [
  {
    title: 'Awal Cerita\nKita Berdua', 
    img: 'foto1.jpg', 
    credit: 'MOMENT 01', 
    meta: ['FIRST MEET', 'SWEET START'], 
    accent: '#4a0033', 
    cap: 'Langkah awal tempat semua cerita manis ini dimulai.'
  },
  {
    title: 'Date Pertama\nYang Canggung', 
    img: 'foto2.jpg', 
    credit: 'MOMENT 02', 
    meta: ['FIRST DATE', 'MEMORABLE'], 
    accent: '#2b0036', 
    cap: 'Masih agak malu-malu tapi senyumnya nggak bisa bohong.'
  },
  {
    title: 'Petualangan\nBareng Kamu', 
    img: 'foto3.jpg', 
    credit: 'MOMENT 03', 
    meta: ['ROAD TRIP', 'HAPPY DAYS'], 
    accent: '#19002e', 
    cap: 'Mau kemana aja asal bareng kamu rasanya selalu seru.'
  },
  {
    title: 'Tawa Paling\nLepas & Lucu', 
    img: 'foto4.jpg', 
    credit: 'MOMENT 04', 
    meta: ['RANDOM MOMENT', 'LAUGHTER'], 
    accent: '#51004a', 
    cap: 'Momen paling random yang selalu bikin kangen kamu kalau diingat.'
  },
  {
    title: 'Sampai Selamanya,\nTetap Bersama', 
    img: 'foto5.jpg', 
    credit: 'MOMENT 05', 
    meta: ['FOREVER', 'MY FAVORITE'], 
    accent: '#0f021a', 
    cap: 'Terima kasih udah jadi bagian terbaik di setiap hariku.'
  }
];

const hcStrip = document.getElementById('hc-strip');
const hcBg = document.getElementById('hc-bg');
const hcTitle = document.getElementById('hc-title');
const hcMeta = document.getElementById('hc-meta');
const hcCap = document.getElementById('hc-cap');
const hcFill = document.getElementById('hc-fill');
const hcIdx = document.getElementById('hc-idx');
document.getElementById('hc-total').textContent = String(highlights.length).padStart(2,'0');

let hcIndex = 0;
highlights.forEach((h, i) => {
  const f = document.createElement('div');
  f.className = 'hc-frame' + (i === 0 ? ' active' : '');
  f.innerHTML = `<img src="${h.img}" alt=""><div class="dim"></div>`;
  f.addEventListener('click', () => hcGo(i));
  hcStrip.appendChild(f);
});

function hcRender() {
  const h = highlights[hcIndex];
  hcBg.innerHTML = `
    <img src="${h.img}" alt="">
    <div class="grade" style="background-color:${h.accent}"></div>
    <div class="mult" style="background-color:${h.accent}"></div>
  `;
  hcTitle.innerHTML = h.title.split('\n').map(l => `<div>${l}</div>`).join('');
  hcMeta.textContent = [h.credit, ...h.meta].join('  ·  ');
  hcCap.textContent = h.cap;
  hcIdx.textContent = String(hcIndex + 1).padStart(2, '0');
  hcFill.style.left = `${(hcIndex / highlights.length) * 100}%`;
  hcFill.style.width = `${100 / highlights.length}%`;
  
  [...hcStrip.children].forEach((f, j) => f.classList.toggle('active', j === hcIndex));

  // Ikut geser strip-nya biar frame yang lagi aktif selalu masuk ke tampilan
  const activeFrame = hcStrip.children[hcIndex];
  if (activeFrame && typeof activeFrame.scrollIntoView === 'function') {
    activeFrame.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function hcGo(i) { 
  hcIndex = Math.max(0, Math.min(highlights.length - 1, i)); 
  hcRender(); 
}

hcRender();

/* Interaksi Wheel & Drag Carousel */
let hcAcc = 0, hcLock = 0, hcDown = false, hcStartX = 0;
document.getElementById('hc-stage').addEventListener('wheel', e => {
  const now = Date.now(); 
  if (now < hcLock) return;
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  const stuck = (delta > 0 && hcIndex === highlights.length - 1) || (delta < 0 && hcIndex === 0);
  if (stuck) return;
  e.preventDefault();
  hcAcc += delta;
  if (Math.abs(hcAcc) < 55) return;
  hcGo(hcIndex + Math.sign(hcAcc)); 
  hcAcc = 0; 
  hcLock = now + 400;
}, { passive: false });

hcStrip.addEventListener('pointerdown', e => { hcDown = true; hcStartX = e.clientX; hcStrip.classList.add('dragging'); });
window.addEventListener('pointerup', () => { hcDown = false; hcStrip.classList.remove('dragging'); });
window.addEventListener('pointermove', e => {
  if (!hcDown) return;
  const dx = e.clientX - hcStartX;
  if (Math.abs(dx) > 60) { hcGo(hcIndex - Math.sign(dx)); hcStartX = e.clientX; }
});

document.getElementById('hc-stage').addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') hcGo(hcIndex + 1);
  if (e.key === 'ArrowLeft') hcGo(hcIndex - 1);
});

// ==================== 4. REPLAY FUNCTION ====================
function replayAll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  hcGo(0);
}

// ==================== 5. TRIGGER MEKAR BUNGA ====================
window.addEventListener('load', () => {
  document.body.classList.remove('bq-paused');
});

// ==================== 6. HEMAT PERFORMA: PAUSE BUNGA SAAT NGGAK KELIATAN ====================
(() => {
  const flowerSections = ['section-1', 'section-2']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!flowerSections.length || !('IntersectionObserver' in window)) return;

  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visible.add(entry.target.id);
      } else {
        visible.delete(entry.target.id);
      }
    });
    document.body.classList.toggle('flowers-paused', visible.size === 0);
  }, { threshold: 0.01 });

  flowerSections.forEach(el => io.observe(el));
})();


// ==================== 4. TYPEWRITER EFFECT LETTER CONTENT ====================
const letterTexts = [
  "Happy anniversary, sayang! ♥︎",
  "Kalau diinget-inget lagi, perjalanan kita nggak selalu mulus ya. Pasti ada aja hari di mana aku bikin kamu ngelus dada, salah ngomong, atau telat ngabarin yang bikin kamu kepikiran. Maaf banget ya kalau aku masih sering bikin kamu kesel karena hal-hal kecil itu. Makasih banyak udah selalu milih buat ngertiin aku, sabar ngadepin sifatku yang kadang bikin pusing, dan tetap bertahan sejauh ini.",
  "I’m truly grateful to have you in my life. Thank you for every moment, every laugh, every little thing you do, and for always choosing to stay. My wish is simple: semoga kita selalu diberi banyak alasan untuk tetap bersama, terus grow together, saling understand, and support each other through everything. I hope we can create many more beautiful memories and keep choosing each other, every single day.",
  "So grateful for you, and for us. I love you so much ♥︎"
];

let hasTyped = false;

function startTypewriter() {
  if (hasTyped) return;
  hasTyped = true;

  const paragraphs = document.querySelectorAll('.letter-content p');
  let pIndex = 0;
  let charIndex = 0;
  const speed = 30; // Kecepatan mengetik per karakter (ms)

  function type() {
    if (pIndex < letterTexts.length) {
      const currentP = paragraphs[pIndex];
      const fullText = letterTexts[pIndex];

      // Tambahkan kursor pada paragraf yang sedang diketik
      currentP.classList.add('typing-cursor');

      if (charIndex < fullText.length) {
        currentP.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(type, speed);
      } else {
        // Hilangkan kursor dari paragraf yang sudah selesai
        currentP.classList.remove('typing-cursor');
        pIndex++;
        charIndex = 0;
        setTimeout(type, 300); // Jeda sebelum mengetik paragraf berikutnya
      }
    }
  }

  type();
}

function resetTypewriter() {
  hasTyped = false;
  const paragraphs = document.querySelectorAll('.letter-content p');
  paragraphs.forEach(p => {
    p.textContent = '';
    p.classList.remove('typing-cursor');
  });
}

// Trigger Typewriter saat Section 2 muncul di layar
const letterSection = document.getElementById('section-2');
if ('IntersectionObserver' in window) {
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypewriter();
      }
    });
  }, { threshold: 0.3 });

  letterObserver.observe(letterSection);
} else {
  startTypewriter();
}