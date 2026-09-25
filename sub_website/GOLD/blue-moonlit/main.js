
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initPassword();
  initFade();
});

function initStars(){
  for(const hostId of ["passwordStars","stars"]){
    const host=document.getElementById(hostId);
    if(!host) continue;
    for(let i=0;i<28;i++){
      const s=document.createElement("i");
      s.className="star";
      s.style.left=Math.random()*100+"%";
      s.style.top=Math.random()*100+"%";
      s.style.opacity=(.25+Math.random()*.55).toFixed(2);
      host.appendChild(s);
    }
  }
}
 
function initPassword(){
  const screen=$("#passwordScreen");
  const inputs=$$("#pinInputs input");
  const error=$("#passwordError");
  if(!screen || !inputs.length) return;

  const unlockCode="0708"; // DAY/MONTH: 01/12

  inputs.forEach((input,i)=>{
    input.addEventListener("input",()=>{
      input.value=input.value.replace(/\D/g,"").slice(0,1);
      if(input.value && inputs[i+1]) inputs[i+1].focus();
      if(inputs.every(x=>x.value)) check();
    });
    input.addEventListener("keydown",e=>{
      if(e.key==="Backspace" && !input.value && inputs[i-1]) inputs[i-1].focus();
      if(e.key==="Enter") check();
    });
  });

  function check(){
    const code=inputs.map(x=>x.value).join("");
    if(code===unlockCode){
      screen.style.opacity="0";
      screen.style.pointerEvents="none";
      setTimeout(()=>screen.remove(),650);
    }else{
      error.classList.add("show");
      inputs.forEach(x=>x.value="");
      inputs[0].focus();
      setTimeout(()=>error.classList.remove("show"),1800);
    }
  }
}

function openGift(){
  const screen=document.getElementById("giftOpening");
  if(!screen) return;
  const container=screen.querySelector(".gift-container");
  if(!container || container.classList.contains("opened")) return;

  container.classList.add("opened");

  for(let i=0;i<55;i++) setTimeout(createFlyingHeart,180+i*45);
  for(let i=0;i<55;i++) setTimeout(createFlyingFlower,220+i*55);
  for(let i=0;i<10;i++) setTimeout(createBalloon,500+i*450);

  setTimeout(()=>screen.classList.add("opened"),2200);
  setTimeout(()=>screen.remove(),3600);
}

function particle(text, className, color) {

    const el = document.createElement("span");

    el.textContent = text;

    el.style.position = "fixed";
    el.style.left = (35 + Math.random() * 30) + "vw";
    el.style.top = (48 + Math.random() * 12) + "vh";

    el.style.zIndex = "15000";

    el.style.fontSize =
        (16 + Math.random() * 18) + "px";

    el.style.pointerEvents = "none";

    /* PIXEL TANGERINE COLOR */
    el.style.color = color;

    el.style.fontFamily =
        '"Courier New", monospace';

    el.style.transition =
        "transform 1.2s steps(8), opacity 1.2s steps(8)";

    document.body.appendChild(el);

    requestAnimationFrame(() => {

        el.style.transform =
            `translate(
                ${(Math.random() - .5) * 380}px,
                ${-180 - Math.random() * 300}px
            )`;

        el.style.opacity = "0";
    });

    setTimeout(() => {
        el.remove();
    }, 1300);
}
function createFlyingHeart() {

    const colors = [
        "#38bdf8",
        "#0ea5e9",
        "#0284c7",
        "#7dd3fc",
        "#bae6fd"
    ];

    particle(
        "♥",
        "heart",
        colors[
            Math.floor(Math.random() * colors.length)
        ]
    );
}


function createFlyingFlower() {

    const colors = [
        "#38bdf8",
        "#7dd3fc",
        "#00f5d4",
        "#bae6fd",
        "#e0f2fe"
    ];

    particle(
        ["✿", "✦", "❀"][
            Math.floor(Math.random() * 3)
        ],
        "flower",
        colors[
            Math.floor(Math.random() * colors.length)
        ]
    );
}


function createBalloon() {

    const colors = [
        "#0284c7",
        "#0ea5e9",
        "#38bdf8",
        "#7dd3fc",
        "#00f5d4"
    ];

    particle(
        ["●", "○"][
            Math.floor(Math.random() * 2)
        ],
        "balloon",
        colors[
            Math.floor(Math.random() * colors.length)
        ]
    );
}


function go(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
}

function initFade(){
  const items=$$(".fade");
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
  },{threshold:.12});
  items.forEach(x=>io.observe(x));
}

const gameBoard = document.getElementById("gameBoard");
const playerEl = document.getElementById("player");
const heartEl = document.getElementById("heartBox");
const gameGoal = document.getElementById("gameGoal");
const gameStatus = document.getElementById("gameStatus");
const resetGameBtn = document.getElementById("resetGame");
const gameNext = document.getElementById("gameNext");

const tile = 36;
const cols = 8;
const rows = 7;

const initialGame = {
  player:{x:1,y:5},
  heart:{x:2,y:4},
  goal:{x:6,y:1},
  rocks:[
  {x:3,y:1},
  {x:5,y:1},
  {x:2,y:2},
  {x:4,y:3},
  {x:6,y:3},
  {x:3,y:5},
  {x:5,y:5}
]
};

let game = JSON.parse(JSON.stringify(initialGame));
let gameWon = false;

function positionGameElement(el, x, y) {
    el.style.left = (x * tile) + "px";
    el.style.top = (y * tile) + "px";
}

function renderGame() {

    positionGameElement(
        playerEl,
        game.player.x,
        game.player.y
    );

    positionGameElement(
        heartEl,
        game.heart.x,
        game.heart.y
    );

    positionGameElement(
        gameGoal,
        game.goal.x,
        game.goal.y
    );

    // lanjut rocks...

    const rocks = [
        ...gameBoard.querySelectorAll(".rock")
    ];

    rocks.forEach((rock, index) => {

        const r = game.rocks[index];

        positionGameElement(
            rock,
            r.x,
            r.y
        );

        rock.classList.toggle(
            "pushed",
            rock.dataset.pushed === "true"
        );

    });

    if (
    game.heart.x === game.goal.x &&
    game.heart.y === game.goal.y
) {
    winGame();
}

}

function rockAt(x, y) {
    return game.rocks.findIndex(
        rock => rock.x === x && rock.y === y
    );
}

function isInside(x, y) {
    return (
        x >= 0 &&
        x < cols &&
        y >= 0 &&
        y < rows
    );
}

function movePlayer(dx, dy) {

    if (gameWon) return;

    const nx = game.player.x + dx;
    const ny = game.player.y + dy;

    if (!isInside(nx, ny)) return;

     // DORONG HEART
    if (game.heart.x === nx && game.heart.y === ny) {

        const px = nx + dx;
        const py = ny + dy;

        if (
            !isInside(px, py) ||
            rockAt(px, py) !== -1
        ) return;

        game.heart.x = px;
        game.heart.y = py;

        game.player.x = nx;
        game.player.y = ny;

        renderGame();
        return;
    }
    const rockIndex = rockAt(nx, ny);

    if (rockIndex === -1) {

        game.player.x = nx;
        game.player.y = ny;

    } else {

        const pushX = nx + dx;
        const pushY = ny + dy;

        if (
            !isInside(pushX, pushY) ||
            rockAt(pushX, pushY) !== -1
        ) {
            return;
        }

        game.rocks[rockIndex].x = pushX;
        game.rocks[rockIndex].y = pushY;
        game.rocks[rockIndex].dataset = {
            pushed: "true"
        };

        game.player.x = nx;
        game.player.y = ny;

        const rockEls =
            gameBoard.querySelectorAll(".rock");

        rockEls[rockIndex].dataset.pushed = "true";
    }

    renderGame();

}

function winGame() {

    if (gameWon) return;

    gameWon = true;

    gameStatus.textContent =
        "LEVEL CLEAR! ♥ YOU CAUGHT THE PINE!";

    gameStatus.classList.add("win");

    gameNext.classList.add("show");
    gameNext.style.display = "inline-block";

    for (let i = 0; i < 20; i++) {
        setTimeout(createFlyingHeart, i * 50);
    }
}

function resetGame() {

    game =
        JSON.parse(
            JSON.stringify(initialGame)
        );

    gameWon = false;

    gameStatus.textContent =
        "LEVEL 01  ♥  FIND YOUR SOULMATE";

    gameNext.classList.remove("show");
    gameNext.style.display = "none";

    gameBoard
        .querySelectorAll(".rock")
        .forEach(rock => {
            rock.dataset.pushed = "false";
        });

    renderGame();

}

document.addEventListener("keydown", event => {
    const keys = {
        ArrowUp: [0, -1],
        w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1],
        s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0],
        a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0], D: [1, 0]
    };

    // Jalankan hanya jika tombol yang ditekan terdaftar DAN game belum menang
    if (keys[event.key] && !gameWon) {
        // Cek apakah elemen minigame sedang berada di layar (opsional)
        event.preventDefault(); // Matikan scroll hanya saat fokus bermain game
        const [dx, dy] = keys[event.key];
        movePlayer(dx, dy);
    }
});

document
    .querySelectorAll("[data-move]")
    .forEach(button => {

        const moves = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0]
        };

        button.addEventListener("click", () => {

            const [dx, dy] =
                moves[button.dataset.move];

            movePlayer(dx, dy);

            button.classList.add("pressed");

            setTimeout(() => {
                button.classList.remove("pressed");
            }, 100);
        });
    });

resetGameBtn.addEventListener(
    "click",
    resetGame
);

gameNext.addEventListener(
    "click",
    () => go("letter")
);

renderGame();


function confetti(){
  for(let i=0;i<35;i++) setTimeout(()=>{
    const el=document.createElement("span");
    el.textContent=["♥","✦","✿","★"][Math.floor(Math.random()*4)];
    el.style.position="fixed";el.style.left=Math.random()*100+"vw";el.style.top="-20px";
    el.style.zIndex="15000";el.style.color=["#38bdf8","#7dd3fc","#00f5d4","#e0f2fe"][Math.floor(Math.random()*4)];
    el.style.fontSize="20px";
    el.style.transition="transform 1.4s steps(8),opacity 1.4s steps(8)";
    document.body.appendChild(el);
    requestAnimationFrame(()=>{el.style.transform=`translate(${(Math.random()-.5)*180}px,${100+Math.random()*700}px) rotate(${Math.random()*360}deg)`;el.style.opacity="0"});
    setTimeout(()=>el.remove(),3500);
  },i*20);
}

const musicBtn = document.getElementById("musicBtn");

const audio = new Audio("music.mp3");

audio.loop = true;

let playing = false;

musicBtn.addEventListener("click", () => {

    if (playing) {

        audio.pause();

        playing = false;

        musicBtn.textContent = "♪";

    } else {

        audio.play()
            .then(() => {

                playing = true;

                musicBtn.textContent = "♫";

            })
            .catch(() => {

                console.log("Music gagal diputar.");
            });
    }
});

// INVITATION
const invitationScreen = document.getElementById("invitationScreen");
const passwordScreen = document.getElementById("passwordScreen");
const yesInvite = document.getElementById("yesInvite");
const noInvite = document.getElementById("noInvite");

yesInvite.addEventListener("click", () => {
    invitationScreen.style.display = "none";
    passwordScreen.style.display = "flex";
});

function escapeNo(){
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 180;

    noInvite.style.transform =
        `translate(${x}px, ${y}px)`;
}

noInvite.addEventListener("mouseenter", escapeNo);

noInvite.addEventListener("touchstart", function(e){
    e.preventDefault();
    escapeNo();
});

document.querySelectorAll(".stars").forEach(container => {

    for(let i = 0; i < 50; i++){

        const star = document.createElement("span");

        star.className = "star";

        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";

        container.appendChild(star);
    }

});


// Memaksa browser untuk selalu reset scroll ke paling atas (0,0) saat refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0); // Reset posisi layar ke paling atas
  initStars();
  initPassword();
  initFade();
});

// INTERAKSI FOTO LIGHTBOX
document.addEventListener("DOMContentLoaded", () => {
    const photos = document.querySelectorAll(".polaroids .photo");
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");

    if (photos.length && modal) {
        photos.forEach(photo => {
            photo.addEventListener("click", () => {
                const img = photo.querySelector("img");
                const caption = photo.querySelector("span");

                if (img) {
                    modalImg.src = img.src;
                    modalCaption.textContent = caption ? caption.textContent : "";
                    modal.classList.add("active");
                }
            });
        });

        // Tutup modal saat mengklik area gelap di luar foto
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("photo-modal-content")) {
                modal.classList.remove("active");
            }
        });
    }
});

