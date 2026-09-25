// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-10';
renderer.domElement.style.pointerEvents = 'none';

// Warna background terang (tema pink/putih)
scene.background = new THREE.Color('#fff8fb');

// Pencahayaan
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xec1e79, 3, 50); // Gwen pink light
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x8a0f57, 2, 50); // Dark magenta light
pointLight2.position.set(-5, -5, 2);
scene.add(pointLight2);

// ================= GEOMETRI HATI (LOPE-LOPE KECIL) =================
const x = 0, y = 0;
const heartShape = new THREE.Shape();

// Membuat kurva bentuk hati
heartShape.moveTo(x + 0.25, y + 0.25);
heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

const extrudeSettings = {
  depth: 0.08,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 1,
  bevelSize: 0.03,
  bevelThickness: 0.03
};

const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
// Geser center geometry ke tengah agar rotasi/spin hati pas di titik pusatnya
heartGeometry.center();

// Palette Warna Spider-Gwen (Pink/Magenta, Light Pink, Dark Magenta, Red Accent)
const heartColors = [
  0xec1e79, // Gwen pink/magenta
  0xff9fd6, // Light pink
  0x8a0f57, // Dark magenta
  0xff3b75  // Bright rose
];

const heartsGroup = new THREE.Group();
const heartCount = 75; // Jumlah lope-lope
const heartsData = [];

for (let i = 0; i < heartCount; i++) {
  const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];

  const heartMaterial = new THREE.MeshStandardMaterial({
    color: randomColor,
    roughness: 0.3,
    metalness: 0.4,
  });

  const mesh = new THREE.Mesh(heartGeometry, heartMaterial);

  mesh.position.x = (Math.random() - 0.5) * 18;
  mesh.position.y = (Math.random() - 0.5) * 16;
  mesh.position.z = (Math.random() - 0.5) * 10;

  // Ukuran hati kecil bervariasi
  const scale = Math.random() * 0.3 + 0.15;
  mesh.scale.set(scale, scale, scale);

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;
  mesh.rotation.z = Math.random() * Math.PI;

  heartsGroup.add(mesh);

  heartsData.push({
    mesh,
    rotSpeedX: (Math.random() - 0.5) * 0.02,
    rotSpeedY: (Math.random() - 0.5) * 0.02,
    rotSpeedZ: (Math.random() - 0.5) * 0.015,
    floatSpeed: Math.random() * 0.008 + 0.003,
    swaySpeed: Math.random() * 2 + 1,
    initialX: mesh.position.x
  });
}

scene.add(heartsGroup);
camera.position.z = 7;

// Interaksi Kursor Mouse
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

// Responsive Canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  heartsData.forEach((data) => {
    data.mesh.rotation.x += data.rotSpeedX;
    data.mesh.rotation.y += data.rotSpeedY;
    data.mesh.rotation.z += data.rotSpeedZ;

    data.mesh.position.y += data.floatSpeed;

    const targetMouseX = mouseX * 1.5;
    const targetMouseY = mouseY * 1.5;

    data.mesh.position.x = data.initialX + Math.sin(elapsedTime * data.swaySpeed) * 0.3 + targetMouseX;

    if (data.mesh.position.y > 9) {
      data.mesh.position.y = -9;
      data.mesh.position.x = (Math.random() - 0.5) * 18;
      data.initialX = data.mesh.position.x;
    }
  });

  camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 1.2 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();