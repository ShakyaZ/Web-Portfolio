// three-bg.js
// Cyberpunk 3D Background — Hex Grid Tunnel + Data Streams + Pulsing Rings

function initThreeJSBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Scene ──────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020106, 0.0028);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 800);
  camera.position.set(0, 0, 120);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── 1. GRID TUNNEL ─────────────────────────────────────────────────────────
  // A large, deep plane grid receding into the distance (floor)
  const gridHelper = new THREE.GridHelper(1200, 60, 0x00f0ff, 0x0d0d2b);
  gridHelper.position.y = -80;
  gridHelper.position.z = -200;
  gridHelper.material.opacity = 0.18;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Side walls — two vertical grids for the tunnel effect
  const leftGrid = new THREE.GridHelper(800, 40, 0x8a2be2, 0x0d0d2b);
  leftGrid.rotation.z = Math.PI / 2;
  leftGrid.position.set(-160, 0, -200);
  leftGrid.material.opacity = 0.10;
  leftGrid.material.transparent = true;
  scene.add(leftGrid);

  const rightGrid = new THREE.GridHelper(800, 40, 0x8a2be2, 0x0d0d2b);
  rightGrid.rotation.z = -Math.PI / 2;
  rightGrid.position.set(160, 0, -200);
  rightGrid.material.opacity = 0.10;
  rightGrid.material.transparent = true;
  scene.add(rightGrid);

  // ── 2. HEX PARTICLE CLOUD ─────────────────────────────────────────────────
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyanColor  = new THREE.Color(0x00f0ff);
  const purpColor  = new THREE.Color(0x8a2be2);
  const whiteColor = new THREE.Color(0x9ab4ff);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600 - 100;

    const mix = Math.random();
    const c = mix < 0.4 ? cyanColor : mix < 0.7 ? purpColor : whiteColor;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── 3. GLOWING TORUS RINGS (pulsing depth) ────────────────────────────────
  const rings = [];
  const ringData = [
    { r: 60,  t: 5,  col: 0x00f0ff, z: -80,  speed: 0.004 },
    { r: 100, t: 3,  col: 0x8a2be2, z: -160, speed: 0.003 },
    { r: 140, t: 2,  col: 0x00f0ff, z: -260, speed: 0.002 },
    { r: 80,  t: 3,  col: 0xa29bfe, z: -50,  speed: 0.005 },
  ];

  ringData.forEach(({ r, t, col, z, speed }) => {
    const geo = new THREE.TorusGeometry(r, t, 8, 80);
    const mat = new THREE.MeshBasicMaterial({
      color: col,
      wireframe: false,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = z;
    mesh.rotation.x = Math.PI / 2;
    mesh.userData = { speed, baseOpacity: mat.opacity };
    scene.add(mesh);
    rings.push(mesh);
  });

  // ── 4. FLOATING DATA STREAMS (vertical lines) ─────────────────────────────
  const streams = [];
  for (let i = 0; i < 18; i++) {
    const len = 30 + Math.random() * 80;
    const geo = new THREE.BufferGeometry();
    const pts = [];
    pts.push(new THREE.Vector3(0, 0, 0));
    pts.push(new THREE.Vector3(0, -len, 0));
    geo.setFromPoints(pts);

    const mat = new THREE.LineBasicMaterial({
      color: Math.random() > 0.5 ? 0x00f0ff : 0x8a2be2,
      transparent: true,
      opacity: 0.4 + Math.random() * 0.4,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geo, mat);
    line.position.set(
      (Math.random() - 0.5) * 500,
      60 + Math.random() * 200,
      (Math.random() - 0.5) * 400 - 100
    );
    line.userData = { speed: 0.3 + Math.random() * 0.8, reset: 60 + Math.random() * 200 };
    scene.add(line);
    streams.push(line);
  }

  // ── 5. BACKGROUND SPHERE WIREFRAME ────────────────────────────────────────
  const sphereGeo = new THREE.IcosahedronGeometry(280, 2);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x0d0d2b,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // ── Mouse interaction ──────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation Loop ─────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth camera drift with mouse
    camera.position.x += (mouseX * 18 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Slowly rotate particle cloud
    particles.rotation.y = t * 0.012;
    particles.rotation.x = t * 0.005;

    // Grid tunnel scroll illusion
    gridHelper.position.z = -200 + ((t * 8) % 20);
    leftGrid.position.z = rightGrid.position.z = gridHelper.position.z;

    // Pulse torus rings
    rings.forEach((ring, i) => {
      ring.rotation.z = t * ring.userData.speed;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 1.4);
      ring.material.opacity = ring.userData.baseOpacity * (0.5 + pulse * 0.8);
    });

    // Drop data streams downward
    streams.forEach((line) => {
      line.position.y -= line.userData.speed;
      if (line.position.y < -200) {
        line.position.y = line.userData.reset;
        line.material.opacity = 0.3 + Math.random() * 0.5;
      }
    });

    // Slow sphere rotation
    sphere.rotation.y = t * 0.008;
    sphere.rotation.x = t * 0.004;

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

document.addEventListener('DOMContentLoaded', initThreeJSBackground);
