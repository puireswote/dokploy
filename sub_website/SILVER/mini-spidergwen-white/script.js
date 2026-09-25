/* ================= STEP SYSTEM (NEXT / PREV) ================= */
let currentStep = 0;
const totalSteps = 3;

function updateSteps() {
  document.querySelectorAll('.step-content').forEach((step, index) => {
    if (index === currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  const indicator = document.getElementById('stepIndicator');
  if (indicator) indicator.innerText = `${currentStep + 1} / ${totalSteps}`;

  // Sembunyikan skyline gedung khusus di section 3 (Archives / memories foto)
  // Pudarkan sisi kanan skyline khusus di section 1 (home/wish) biar gak tabrakan sama wish text
 document.querySelectorAll('.city-layer').forEach((layer) => {
  layer.style.display = currentStep === 2 ? 'none' : '';
  // layer.classList.toggle('skyline-fade-right', currentStep === 0); // Matikan baris ini
});

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) prevBtn.disabled = currentStep === 0;

  if (nextBtn) {
    if (currentStep === totalSteps - 1) {
      nextBtn.innerHTML = '<span>Replay</span><span class="ml-1">↺</span>';
    } else {
      nextBtn.innerHTML = '<span>Next</span><span class="ml-1">→</span>';
    }
  }

  [prevBtn, nextBtn].forEach(btn => {
    if (btn) {
      btn.style.flex = '0 0 auto';
      btn.style.width = 'max-content';
      btn.style.minWidth = '0';
    }
  });

  // Panggil efek ketik saat masuk ke Section 2 (Step Index 1)
  if (currentStep === 1) {
    setTimeout(() => {
      startTypewriter();
    }, 150);
  }
}

function changeStep(direction) {
  currentStep += direction;
  if (currentStep >= totalSteps) currentStep = 0;
  if (currentStep < 0) currentStep = 0;
  updateSteps();
}

/* ================= TYPEWRITER EFFECT (MISSION LOG) ================= */
let currentTypingTimeout = null;

// Teks ucapan yang akan diketik otomatis
const missionMessage = [
  "Halo, Babe 🕷",
  "Selamat ulang tahun. Cuma mau ngingetin kalau kamu udah berjuang luar biasa sejauh ini. Makasih udah selalu jadi orang yang diandalkan buat orang-orang di sekitar kamu.",
  "Semoga tahun ini membawa lebih banyak keberhasilan, tantangan baru yang bisa kamu taklukin, dan kebahagiaan yang nggak ada habisnya.",
  "Wishing you the happiest birthday and a wonderful year ahead!",
  "— dari yang selalu mendukungmu ♥︎"
];

function startTypewriter() {
  const container = document.querySelector('#step-1 .letter-card div.space-y-2\\.5, #step-1 .letter-card div.space-y-3\\.5, #step-1 .letter-card div.space-y-4');
  
  if (!container) return;

  if (currentTypingTimeout) clearTimeout(currentTypingTimeout);

  container.innerHTML = '';

  let pIndex = 0;
  let charIndex = 0;

  function typeNextChar() {
    if (pIndex >= missionMessage.length) return;

    if (!container.children[pIndex]) {
      const newP = document.createElement('p');
      if (pIndex === missionMessage.length - 1) {
        newP.className = 'pt-2 sm:pt-3 text-red-500 font-bold';
      }
      container.appendChild(newP);
    }

    const currentP = container.children[pIndex];
    const fullText = missionMessage[pIndex];

    if (charIndex < fullText.length) {
      currentP.textContent += fullText.charAt(charIndex);
      charIndex++;
      currentTypingTimeout = setTimeout(typeNextChar, 30);
    } else {
      pIndex++;
      charIndex = 0;
      currentTypingTimeout = setTimeout(typeNextChar, 250);
    }
  }

  typeNextChar();
}

/* ================= REALISTIC ROPE (VERLET, NO LIBRARY) ================= */
const ROPE_SEGMENTS = 10;
const ROPE_ANCHOR = { x: 500, y: 0 };
const SEGMENT_LENGTH = 300 / ROPE_SEGMENTS;
const GRAVITY = 0.4;

let ropePoints = [];
let ropePointsPrev = [];

function initRopeVerlet() {
  ropePoints = [];
  ropePointsPrev = [];
  for (let i = 0; i <= ROPE_SEGMENTS; i++) {
    const t = i / ROPE_SEGMENTS;
    const p = { x: ROPE_ANCHOR.x, y: ROPE_ANCHOR.y + t * 300 };
    ropePoints.push(p);
    ropePointsPrev.push({ ...p });
  }
}
initRopeVerlet();

function updateRopeVerlet(cardTopX, cardTopY) {
  for (let i = 1; i < ropePoints.length - 1; i++) {
    const p = ropePoints[i];
    const prev = ropePointsPrev[i];
    const vx = (p.x - prev.x) * 0.98;
    const vy = (p.y - prev.y) * 0.98;
    ropePointsPrev[i] = { x: p.x, y: p.y };
    p.x += vx;
    p.y += vy + GRAVITY;
  }

  ropePoints[0].x = ROPE_ANCHOR.x;
  ropePoints[0].y = ROPE_ANCHOR.y;
  ropePoints[ropePoints.length - 1].x = cardTopX;
  ropePoints[ropePoints.length - 1].y = cardTopY;

  for (let iter = 0; iter < 5; iter++) {
    for (let i = 0; i < ropePoints.length - 1; i++) {
      const a = ropePoints[i];
      const b = ropePoints[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const diff = (dist - SEGMENT_LENGTH) / dist;
      const offsetX = dx * 0.5 * diff;
      const offsetY = dy * 0.5 * diff;

      if (i !== 0) { a.x += offsetX; a.y += offsetY; }
      if (i + 1 !== ropePoints.length - 1) { b.x -= offsetX; b.y -= offsetY; }
    }
    ropePoints[0].x = ROPE_ANCHOR.x;
    ropePoints[0].y = ROPE_ANCHOR.y;
    ropePoints[ropePoints.length - 1].x = cardTopX;
    ropePoints[ropePoints.length - 1].y = cardTopY;
  }
}

function ropePointsToPath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/* ================= 2D DRAGGABLE + SWAYING LANYARD PHYSICS ================= */
const card = document.getElementById('lanyardCard');

let isDragging = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;
let vx = 0, vy = 0;

const stiffness = 0.15;
const damping = 0.75;
let idleTime = 0;

function onPointerDown(e) {
  if (e.touches) e.preventDefault();
  isDragging = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX);
  startY = e.clientY || (e.touches && e.touches[0].clientY);
  if (card) card.style.transition = 'none';
}

function onPointerMove(e) {
  if (!isDragging) return;
  if (e.touches) e.preventDefault();

  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);

  targetX = x - startX;
  targetY = y - startY;
}

function onPointerEnd() {
  isDragging = false;
  targetX = 0;
  targetY = 0;
}

if (card) {
  card.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerEnd);

  card.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerEnd);
}

function animatePhysics() {
  idleTime += 0.03;

  if (!isDragging) {
    const idleSwayX = Math.sin(idleTime) * 12;
    const idleSwayY = Math.cos(idleTime * 2) * 4;

    const ax = (targetX + idleSwayX - currentX) * stiffness;
    const ay = (targetY + idleSwayY - currentY) * stiffness;

    vx = (vx + ax) * damping;
    vy = (vy + ay) * damping;
    currentX += vx;
    currentY += vy;
  } else {
    currentX = targetX;
    currentY = targetY;
  }

  const rotation = currentX * 0.12;

  if (card) {
    card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg)`;
  }

  const ropePath = document.getElementById('ropePath');
  const ropePathOuter = document.getElementById('ropePathOuter');
  const ropePathTexture = document.getElementById('ropePathTexture');
  const ropeSvg = document.querySelector('.rope-svg');

  if (ropePath && ropeSvg && card) {
    const svgRect = ropeSvg.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const VB_MIN_X = 350;
    const VB_MIN_Y = 0;

    const cardTopX = (cardRect.left + cardRect.width / 2 - svgRect.left) + VB_MIN_X;
    const cardTopY = (cardRect.top - svgRect.top) + VB_MIN_Y;

    updateRopeVerlet(cardTopX, cardTopY);
    const pathD = ropePointsToPath(ropePoints);

    ropePath.setAttribute('d', pathD);
    if (ropePathOuter) ropePathOuter.setAttribute('d', pathD);
    if (ropePathTexture) ropePathTexture.setAttribute('d', pathD);

    const buckleIdx = Math.floor(ropePoints.length * 0.3);
    const bp = ropePoints[buckleIdx];
    const bpNext = ropePoints[buckleIdx + 1] || bp;
    const buckleAngle = Math.atan2(bpNext.y - bp.y, bpNext.x - bp.x) * (180 / Math.PI) + 90;
    const buckleEl = document.getElementById('ropeBuckle');
    if (buckleEl) buckleEl.setAttribute('transform', `translate(${bp.x}, ${bp.y}) rotate(${buckleAngle})`);

    const last = ropePoints[ropePoints.length - 1];
    const secondLast = ropePoints[ropePoints.length - 2] || last;
    const hookAngle = Math.atan2(last.y - secondLast.y, last.x - secondLast.x) * (180 / Math.PI) + 90;
    const hookEl = document.getElementById('ropeHook');
    if (hookEl) hookEl.setAttribute('transform', `translate(${last.x}, ${last.y}) rotate(${hookAngle})`);
  }

  requestAnimationFrame(animatePhysics);
}

animatePhysics();

/* ================= DRIFT WALL GALLERY ================= */
const myPhotos = [
  'images/foto1.jpg',
  'images/foto2.jpg',
  'images/foto3.jpg',
  'images/foto4.jpg',
  'images/foto5.jpg',
  'images/foto6.jpg'
];

function initDriftWall() {
  const plane = document.getElementById('driftPlane');
  if (!plane) return;

  let numCols = 3;
  if (window.innerWidth >= 768) numCols = 4;
  if (window.innerWidth >= 1024) numCols = 5;

  plane.innerHTML = '';
  const colElements = [];

  for (let c = 0; c < numCols; c++) {
    const col = document.createElement('div');
    col.className = 'drift-wall__col';

    let colHTML = '';
    for (let i = 0; i < 8; i++) {
      const photoSrc = myPhotos[(c * 3 + i) % myPhotos.length];
      colHTML += `
        <div class="drift-wall__tile">
          <img src="${photoSrc}" alt="Gallery photo" loading="lazy" />
        </div>
      `;
    }

    col.innerHTML = colHTML;
    plane.appendChild(col);
    colElements.push({
      el: col,
      posY: 0,
      speed: (c % 2 === 0 ? 1 : -1) * (0.4 + (c * 0.1))
    });
  }

  function animateGallery() {
    colElements.forEach(item => {
      item.posY += item.speed;
      if (item.posY > 200) item.posY = 0;
      if (item.posY < -200) item.posY = 0;
      item.el.style.transform = `translate3d(0, ${item.posY}px, 0)`;
    });
    requestAnimationFrame(animateGallery);
  }

  animateGallery();
}

/* ================= INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
  updateSteps();
  initDriftWall();
});

window.addEventListener('resize', () => {
  initDriftWall();
});