<template>
  <!-- Preloader -->
  <div class="preloader" :class="{ hidden: !loading }">
    <img src="/logo.png" alt="Загрузка" class="preloader-logo" />
  </div>

  <!-- Custom Cursor -->
  <div
    class="cursor-dot"
    :class="{ hovering: cursorHovering }"
    :style="{ left: dotX + 'px', top: dotY + 'px' }"
  />
  <div
    class="cursor-ring"
    :class="{ hovering: cursorHovering }"
    :style="{ left: ringX + 'px', top: ringY + 'px' }"
  />

  <!-- Grain Overlay -->
  <div class="grain-overlay"></div>

  <!-- Main Content -->
  <AppNav />
  <main>
    <HeroSection />
    <MarqueeSection />
    <ProductsSection />
    <StatsSection />
    <AboutSection />
    <CtaSection />
  </main>
  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLenis } from './composables/useLenis'
import { useCursor } from './composables/useCursor'
import AppNav from './components/AppNav.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeSection from './components/MarqueeSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import StatsSection from './components/StatsSection.vue'
import AboutSection from './components/AboutSection.vue'
import CtaSection from './components/CtaSection.vue'
import AppFooter from './components/AppFooter.vue'

// Loading state
const loading = ref(true)

// Smooth scroll
useLenis()

// Custom cursor
const { dotX, dotY, ringX, ringY, hovering: cursorHovering } = useCursor()

// Initialize scroll animations & magnetic buttons
onMounted(() => {
  // Preloader
  window.addEventListener('load', () => {
    setTimeout(() => {
      loading.value = false
    }, 800)
  })

  // Fallback: hide preloader after 3s
  setTimeout(() => {
    loading.value = false
  }, 3000)

  // Scroll-based fade-up animations
  const fadeElements = document.querySelectorAll('.fade-up')
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  fadeElements.forEach((el) => fadeObserver.observe(el))

  // Magnetic buttons
  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      const text = btn.querySelector('.btn-text')

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
      if (text) {
        text.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
      }
    })

    btn.addEventListener('mouseleave', () => {
      const text = btn.querySelector('.btn-text')
      btn.style.transform = 'translate(0, 0)'
      if (text) {
        text.style.transform = 'translate(0, 0)'
      }
    })
  })
})
</script>