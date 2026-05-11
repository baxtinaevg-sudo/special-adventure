<template>
  <div ref="containerRef" class="hero-3d">
    <div ref="canvasRef" class="w-full h-full absolute inset-0"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const containerRef = ref(null)
const canvasRef = ref(null)

let renderer, scene, camera, composer, animId
let centralBlob, orbSpheres = [], particles

// Custom shader for the living blob — organic deformation + color cycling
const blobVertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
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
    vNormal = normal;
    vPosition = position;

    float noise1 = snoise(position * 1.5 + uTime * 0.3) * 0.15;
    float noise2 = snoise(position * 3.0 - uTime * 0.5) * 0.08;
    float noise3 = snoise(position * 0.8 + uTime * 0.15) * 0.2;
    float displacement = noise1 + noise2 + noise3;

    // Breathing effect
    displacement += sin(uTime * 1.5) * 0.03;

    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const blobFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // HSL to RGB conversion
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }

  void main() {
    // Fresnel for iridescence-like rim
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

    // Color cycling — warm champagne to rose gold to pearl
    float hue = 0.08 + sin(uTime * 0.2) * 0.06; // Shift between champagne and rose
    hue += vDisplacement * 0.3;
    hue += fresnel * 0.05;

    vec3 baseColor = hsl2rgb(vec3(hue, 0.35, 0.65));
    vec3 rimColor = hsl2rgb(vec3(hue + 0.05, 0.5, 0.8));
    vec3 deepColor = hsl2rgb(vec3(hue - 0.03, 0.25, 0.45));

    // Mix based on fresnel and displacement
    vec3 color = mix(deepColor, baseColor, smoothstep(0.0, 0.15, fresnel));
    color = mix(color, rimColor, fresnel * 0.7);

    // Subtle iridescence on edges
    float iriColor = sin(fresnel * 6.28 + uTime) * 0.5 + 0.5;
    vec3 iri = hsl2rgb(vec3(iriColor * 0.15 + hue, 0.4, 0.75));
    color = mix(color, iri, fresnel * 0.3);

    // Specular highlight
    vec3 lightDir = normalize(vec3(3.0, 5.0, 4.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
    color += vec3(1.0, 0.95, 0.9) * spec * 0.6;

    gl_FragColor = vec4(color, 0.92);
  }
`

onMounted(() => {
  const container = canvasRef.value
  if (!container) return

  // Scene setup
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.z = 4.5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  // Post-processing — bloom
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.6,  // strength
    0.4,  // radius
    0.85  // threshold
  )
  composer.addPass(bloomPass)

  // Central blob — organic deforming sphere
  const blobMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: blobVertexShader,
    fragmentShader: blobFragmentShader,
    transparent: true,
  })
  centralBlob = new THREE.Mesh(new THREE.SphereGeometry(1.5, 128, 128), blobMat)
  scene.add(centralBlob)

  // Orbiting liquid orbs — smaller, with similar effect
  const orbData = [
    { radius: 2.8, size: 0.35, speed: 0.4, tiltX: 0, tiltZ: 0 },
    { radius: 3.2, size: 0.25, speed: -0.25, tiltX: Math.PI / 3, tiltZ: 0 },
    { radius: 2.5, size: 0.4, speed: 0.55, tiltX: -Math.PI / 4, tiltZ: Math.PI / 6 },
    { radius: 3.5, size: 0.2, speed: -0.35, tiltX: Math.PI / 5, tiltZ: -Math.PI / 8 },
  ]

  const orbMat = new THREE.MeshPhysicalMaterial({
    color: 0xB8A080,
    roughness: 0.1,
    metalness: 0.3,
    transmission: 0.3,
    thickness: 1.5,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
  })

  orbData.forEach(d => {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(d.size, 64, 64), orbMat.clone())
    scene.add(orb)
    orbSpheres.push({ mesh: orb, ...d })
  })

  // Rings (orbits)
  orbData.forEach(d => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(d.radius, 0.012, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xD4C4A8, transparent: true, opacity: 0.12 })
    )
    ring.rotation.x = d.tiltX + Math.PI / 2
    ring.rotation.z = d.tiltZ
    scene.add(ring)
  })

  // Connecting lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xB8A080, transparent: true, opacity: 0.1 })
  orbData.forEach(d => {
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(d.radius, 0, 0)]
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(lineGeo, lineMat)
    line.rotation.x = d.tiltX
    line.rotation.z = d.tiltZ
    scene.add(line)
  })

  // Particles — floating droplets
  const particleCount = 600
  const positions = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16
    sizes[i] = Math.random() * 0.04 + 0.01
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // Custom particle shader for soft round dots
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xB8A080) },
    },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.5 + position.x) * 0.1;
        pos.x += cos(uTime * 0.3 + position.z) * 0.05;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = smoothstep(8.0, 2.0, length(position));
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d) * vAlpha * 0.4;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const dirLight = new THREE.DirectionalLight(0xB8A080, 1)
  dirLight.position.set(3, 5, 4)
  scene.add(dirLight)
  const rimLight = new THREE.DirectionalLight(0xD4C4A8, 0.5)
  rimLight.position.set(-3, -2, 3)
  scene.add(rimLight)
  const pointLight = new THREE.PointLight(0xE8D4B8, 0.8, 10)
  pointLight.position.set(0, 0, 3)
  scene.add(pointLight)

  // Mouse interaction
  let targetRotX = 0, targetRotY = 0
  function onMouseMove(e) {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 1.0
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.5
  }
  document.addEventListener('mousemove', onMouseMove)

  // Animate
  let time = 0
  function animate() {
    animId = requestAnimationFrame(animate)
    time += 0.01

    // Update blob shader
    if (centralBlob.material.uniforms) {
      centralBlob.material.uniforms.uTime.value = time
    }

    // Gentle rotation following mouse
    centralBlob.rotation.y += (targetRotY - centralBlob.rotation.y) * 0.05
    centralBlob.rotation.x += (targetRotX - centralBlob.rotation.x) * 0.05

    // Update particle shader
    if (particles.material.uniforms) {
      particles.material.uniforms.uTime.value = time
    }

    // Hue cycling on particle color
    const hue = (time * 0.02) % 1
    particles.material.uniforms.uColor.value.setHSL(hue * 0.15 + 0.08, 0.4, 0.65)

    // Animate orbs
    orbSpheres.forEach(a => {
      const angle = time * a.speed
      const pos = new THREE.Vector3(
        Math.cos(angle) * a.radius,
        0,
        Math.sin(angle) * a.radius
      )
      pos.applyEuler(new THREE.Euler(a.tiltX, 0, a.tiltZ))
      a.mesh.position.copy(pos)

      // Subtle scale pulse on orbs
      const pulse = 1 + Math.sin(time * 2 + a.radius) * 0.08
      a.mesh.scale.setScalar(pulse)

      // Color cycling on orbs (iridescence)
      if (a.mesh.material.iridescence !== undefined) {
        a.mesh.material.iridescenceThicknessRange = [
          100 + Math.sin(time + a.radius) * 50,
          400 + Math.cos(time * 0.7 + a.radius) * 100,
        ]
      }
    })

    // Parallax on scroll
    const scrollProgress = window.scrollY / window.innerHeight
    camera.position.y = -scrollProgress * 0.3
    renderer.domElement.style.opacity = Math.max(0, 1 - scrollProgress * 0.8)

    composer.render()
  }
  animate()

  // Resize handler
  function onResize() {
    if (!container) return
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    composer.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', onResize)

  // Cleanup reference
  containerRef._cleanup = () => {
    window.removeEventListener('resize', onResize)
    document.removeEventListener('mousemove', onMouseMove)
  }
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  if (containerRef.value && containerRef.value._cleanup) {
    containerRef.value._cleanup()
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>