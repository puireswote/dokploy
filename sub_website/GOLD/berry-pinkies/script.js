// Ganti nomor WA kamu di sini (format 628xxx tanpa tanda +)
const myPhoneNumber = "6281226696868"; 

// Navigasi Halaman Smooth + Scroll ke Atas
function showPage(pageId, btnElement) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    if(btnElement) btnElement.classList.add('active');
    
    // Scroll ke atas dengan halus
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// EVENT LISTENER KLIK PANAH NAVIGASI
// EVENT LISTENER KLIK PANAH NAVIGASI (FIX MOBILE SCROLL)
document.addEventListener("DOMContentLoaded", function () {
    const navArrow = document.querySelector(".nav-arrow");
    const navbar = document.getElementById("navbar");

    if (navArrow && navbar) {
        navArrow.addEventListener("click", function (e) {
            e.preventDefault();
            // Menggeser menu ke kanan sejauh 120px setiap kali panah diklik
            navbar.scrollBy({
                left: 120,
                behavior: "smooth"
            });
        });
    }
});
 
// Tiup Lilin + Confetti 🎉
function blowCandle() {
    const flame = document.getElementById('flame');
    flame.classList.add('out');

    document.getElementById('cakeStatus').innerHTML = "🎉 <strong>Yeay lilinnya padam!</strong> Semoga semua harapan kamu di usia baru ini terwujud ya, Aamiin...";
    
    const blowBtn = document.getElementById('blowBtn');
    blowBtn.innerText = "Harapan Terkirim! ✨";
    blowBtn.disabled = true;
    blowBtn.style.opacity = "0.7";
    blowBtn.style.cursor = "default";

    triggerConfetti();
}

function triggerConfetti() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#e63946', '#ffb7b2', '#fff3b0']
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#e63946', '#ffb7b2', '#fff3b0']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Opsi Outfit & Date Idea
function selectOpt(element, category) {
    const parentGrid = element.parentElement;
    parentGrid.querySelectorAll('.builder-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

let selectedOutfit = "";
let selectedDate = "";

function generateOutfitResult() {
    const selectedOps = document.querySelectorAll('.builder-option.selected strong');
    selectedOutfit = selectedOps[0].innerText;
    selectedDate = selectedOps[1].innerText;

    const resultBox = document.getElementById('outfitResult');
    const resultText = document.getElementById('outfitText');

    resultText.innerHTML = `Outfit: <strong>${selectedOutfit}</strong><br>Kencan: <strong>${selectedDate}</strong>`;
    resultBox.style.display = 'block';
    
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

function sendToWA() {
    if (!selectedOutfit || !selectedDate) return;

    // 1. Susun teks pesan secara bersih menggunakan template literal biasa
    const rawMessage = `HAI SAYANG! I'M SO HAPPWIIIEE. Makasih yaa. Aku udah pilih plan date sama kamu ini🎟️✨\n\n` +
                       `👗 *Outfit Choice:* ${selectedOutfit}\n` +
                       `📍 *Date Idea:* ${selectedDate}\n\n` +
                       `Sooo exciteddd!! Kira-kira kapan kita jalan bareng buat klaim voucher ultah aku ini? 🥰`;

    // 2. Encode SELURUH isi pesan sekaligus agar emoji & baris baru aman
    const encodedMessage = encodeURIComponent(rawMessage);

    // 3. Buat URL WhatsApp
    const waUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
}

// Color Mood Picker
function pickColorMood(color) {
    const msgBox = document.getElementById('moodMessage');
    msgBox.style.display = 'block';

    if (color === 'red') {
        msgBox.innerHTML = "<strong>🍓 Strawberry Red:</strong> Energi kamu hari ini full power! Semoga semua rencana dan keinginanmu di usia baru ini langsung tercapai tanpa hambatan!";
    } else if (color === 'yellow') {
        msgBox.innerHTML = "<strong>💛 Butter Yellow:</strong> Kehangatan & keceriaan! Tetap jadi sosok yang selalu bikin orang-orang di sekitarmu tersenyum yaa.";
    } else if (color === 'cream') {
        msgBox.innerHTML = "<strong>🍦 Vanilla Cream:</strong> Ketenangan & kenyamanan! Semoga di usiamu yang baru ini hatimu selalu tenang, damai, dan penuh kebahagiaan.";
    }
}

// Mini Game Logic
let score = 0;
let timeLeft = 10;
let gameInterval;
let moleTimeout;
let isPlaying = false;

function startGame() {
    if (isPlaying) return;
    
    score = 0;
    timeLeft = 10;
    isPlaying = true;
    document.getElementById('gameScore').innerText = score;
    document.getElementById('gameTimer').innerText = timeLeft;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('gameResult').style.display = 'none';

    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTimer').innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    showRandomStrawberry();
}

function showRandomStrawberry() {
    if (!isPlaying) return;
    
    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => hole.classList.remove('active'));

    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.classList.add('active');

    const randomTime = Math.floor(Math.random() * 300) + 700;
    moleTimeout = setTimeout(showRandomStrawberry, randomTime);
}

function catchStrawberry(hole) {
    if (!isPlaying) return;
    if (hole.classList.contains('active')) {
        score++;
        document.getElementById('gameScore').innerText = score;
        hole.classList.remove('active');
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearTimeout(moleTimeout);

    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => hole.classList.remove('active'));

    const startBtn = document.getElementById('startBtn');
    startBtn.style.display = 'inline-block';
    startBtn.innerText = 'Main Lagi 🔄';

    const resultBox = document.getElementById('gameResult');
    const resultText = document.getElementById('resultText');
    resultBox.style.display = 'block';
    
    resultText.innerHTML = `Kamu berhasil menangkap <strong>${score} Strawberry!</strong> 🍓<br>Refleksmu keren banget, yuk ambil tiket hadiah kamu!`;
}

// =========================================================
// AUDIO PLAYER CONTROLS (BARU & SUDAH FIX 1x KLIK)
// =========================================================
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const btnText = document.getElementById('btnText');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

// Paksa preload audio saat halaman dimuat
if (bgMusic) {
    bgMusic.load();
}

async function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        try {
            await bgMusic.play();
            btnText.innerText = 'PAUSE';
        } catch (err) {
            console.log("Autoplay diblokir atau file gagal dimuat:", err);
            btnText.innerText = 'PLAY';
        }
    } else {
        bgMusic.pause();
        btnText.innerText = 'PLAY';
    }
}

if (bgMusic) {
    bgMusic.addEventListener('timeupdate', () => {
        if (bgMusic.duration) {
            const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            currentTimeEl.innerText = formatTime(bgMusic.currentTime);
            durationTimeEl.innerText = formatTime(bgMusic.duration);
        }
    });

    // Reset teks tombol saat lagu selesai
    bgMusic.addEventListener('ended', () => {
        btnText.innerText = 'PLAY';
        progressBar.style.width = '0%';
    });
}

function seekAudio(event) {
    const container = event.currentTarget;
    const clickX = event.offsetX;
    const width = container.clientWidth;
    if (bgMusic.duration) {
        bgMusic.currentTime = (clickX / width) * bgMusic.duration;
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 3D Carousel Logic
let currentSlide = 0;
const cards = document.querySelectorAll('.carousel-card');
const totalCards = cards.length;

function updateCarousel() {
    cards.forEach((card, index) => {
        let offset = index - currentSlide;

        if (offset < -Math.floor(totalCards / 2)) offset += totalCards;
        if (offset > Math.floor(totalCards / 2)) offset -= totalCards;

        if (offset === 0) {
            card.style.transform = `translateX(0px) translateZ(200px) rotateY(0deg)`;
            card.style.opacity = '1';
            card.style.filter = 'blur(0px)';
            card.style.zIndex = '10';
        } else if (offset > 0) {
            const posX = offset * 80;
            const posZ = 200 - (offset * 90);
            card.style.transform = `translateX(${posX}px) translateZ(${posZ}px) rotateY(-20deg)`;
            card.style.opacity = `${1 - offset * 0.25}`;
            card.style.filter = 'blur(0px)';
            card.style.zIndex = `${10 - offset}`;
        } else {
            const posX = offset * 80;
            const posZ = 200 - (Math.abs(offset) * 90);
            card.style.transform = `translateX(${posX}px) translateZ(${posZ}px) rotateY(20deg)`;
            card.style.opacity = `${1 - Math.abs(offset) * 0.25}`;
            card.style.filter = 'blur(0px)';
            card.style.zIndex = `${10 - Math.abs(offset)}`;
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalCards;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalCards) % totalCards;
    updateCarousel();
}

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

setInterval(nextSlide, 3000);
updateCarousel();


function handleColorMood(color, heartLevel) {
    // 1. Update jumlah hati pixel yang terisi
    for (let i = 1; i <= 3; i++) {
        const heart = document.getElementById(`heart${i}`);
        if (i <= heartLevel) {
            heart.classList.remove('empty');
            heart.classList.add('filled');
        } else {
            heart.classList.remove('filled');
            heart.classList.add('empty');
        }
    }

    // 2. Jalankan fungsi pickColorMood kamu yang asli
    if (typeof pickColorMood === 'function') {
        pickColorMood(color);
    }
}