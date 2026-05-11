<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-graphite">
    <!-- Three.js Molecule -->
    <MoleculeScene />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-graphite/40 via-transparent to-graphite/60 z-[1]"></div>

    <!-- Content -->
    <div class="relative z-[2] text-center px-6 max-w-4xl mx-auto">
      <h1 class="hero-title font-display text-beige font-light tracking-tight">
        <span v-for="(word, i) in words" :key="i" class="word">
          <span
            class="word-inner"
            :ref="el => wordEls[i] = el"
          >{{ word }}</span>
          <span class="inline-block w-[0.3em]"></span>
        </span>
      </h1>
      <p
        ref="subtitleRef"
        class="mt-8 text-lg md:text-xl text-champagne-light/80 font-body font-light max-w-2xl mx-auto opacity-0 translate-y-6"
      >
        Инновационные химические добавки для строительства будущего
      </p>
      <div
        ref="ctaRef"
        class="mt-10 opacity-0 translate-y-6"
      >
        <a
          href="#products"
          class="magnetic-btn inline-flex items-center gap-3 px-8 py-4 border border-champagne/40 text-champagne rounded-full hover:bg-champagne/10 transition-all duration-500 text-sm font-body font-medium tracking-wider uppercase"
          data-cursor="pointer"
        >
          <span class="btn-text">Узнать больше</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 opacity-60">
      <span class="text-xs font-body text-champagne-light tracking-widest uppercase">Scroll</span>
      <div class="w-[1px] h-8 bg-gradient-to-b from-champagne/60 to-transparent animate-pulse"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import MoleculeScene from './MoleculeScene.vue'

const words = ['Мы', 'строим', 'будущее']
const wordEls = ref([])
const subtitleRef = ref(null)
const ctaRef = ref(null)

onMounted(async () => {
  await nextTick()

  const tl = gsap.timeline({ delay: 0.5 })

  // Animate words
  wordEls.value.forEach((el, i) => {
    if (!el) return
    tl.to(el, {
      y: 0,
      duration: 1,
      ease: 'power3.out',
    }, i * 0.15)
  })

  // Subtitle
  tl.to(subtitleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.3')

  // CTA
  tl.to(ctaRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.5')
})
</script>