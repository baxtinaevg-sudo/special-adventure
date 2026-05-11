<template>
  <canvas ref="canvasRef" class="molecule-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)
let renderer, scene, camera, mesh, animationId
let clock

onMounted(() => {
  const canvas = canvasRef.value
  const parent = canvas.parentElement
  const width = parent.clientWidth
  const height = parent.clientHeight

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.z = 4.5

  // Clock
  clock = new THREE.Clock()

  // Create sphere with custom shader for iridescence
  const geometry = new THREE.IcosahedronGeometry(1.5, 64)

  const vertexShader = `
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    // Simplex 3D noise
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      float noise1 = snoise(position * uFrequency + uTime * 0.3) * uAmplitude;
      float noise2 = snoise(position * uFrequency * 2.0 + uTime * 0.2) * uAmplitude * 0.5;
      float displacement = noise1 + noise2;

      vDisplacement = displacement;

      vec3 newPosition = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      // Fresnel for iridescence
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // Iridescent color mixing
      float t = uTime * 0.15;
      vec3 iriColor = mix(
        mix(uColor1, uColor2, sin(t) * 0.5 + 0.5),
        uColor3,
        sin(t * 1.3 + 1.5) * 0.5 + 0.5
      );

      // Add displacement-based color variation
      iriColor = mix(iriColor, uColor2, vDisplacement * 0.8);

      // Fresnel rim glow
      vec3 rimColor = vec3(0.95, 0.85, 0.7);
      vec3 finalColor = mix(iriColor, rimColor, fresnel * 0.6);

      // Subtle specular
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float spec = pow(max(dot(reflect(-lightDir, vNormal), viewDir), 0.0), 32.0);
      finalColor += spec * 0.3 * rimColor;

      // Glow based on displacement
      float glow = abs(vDisplacement) * 0.5;
      finalColor += glow * uColor3 * 0.3;

      gl_FragColor = vec4(finalColor, 0.88);
    }
  `

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uFrequency: { value: 1.5 },
      uAmplitude: { value: 0.15 },
      uColor1: { value: new THREE.Color('#B8A080') },  // champagne
      uColor2: { value: new THREE.Color('#8C7A60') },  // champagne-dark
      uColor3: { value: new THREE.Color('#D4C4A8') },  // champagne-light
    },
    transparent: true,
    side: THREE.FrontSide,
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Ambient light for bloom-like glow
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight(0xB8A080, 2, 10)
  pointLight1.position.set(2, 2, 3)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xD4C4A8, 1.5, 10)
  pointLight2.position.set(-2, -1, 2)
  scene.add(pointLight2)

  // Mouse tracking
  let mouseX = 0, mouseY = 0
  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouseMove)

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsed

    // Smooth rotation
    mesh.rotation.y = elapsed * 0.1 + mouseX * 0.2
    mesh.rotation.x = Math.sin(elapsed * 0.08) * 0.2 + mouseY * 0.1
    mesh.rotation.z = Math.sin(elapsed * 0.05) * 0.05

    // Breathing scale
    const scale = 1 + Math.sin(elapsed * 0.5) * 0.03
    mesh.scale.setScalar(scale)

    renderer.render(scene, camera)
  }
  animate()

  // Resize
  function onResize() {
    const w = parent.clientWidth
    const h = parent.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // Store cleanup
  canvas._cleanup = () => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
    if (animationId) cancelAnimationFrame(animationId)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
})

onUnmounted(() => {
  if (canvasRef.value && canvasRef.value._cleanup) {
    canvasRef.value._cleanup()
  }
})
</script>