<template>
  <div ref="preloaderEl" class="preloader">
    <img src="/logo.png" alt="Аддитив Плюс" class="w-16 h-16 object-contain opacity-80" />
    <div class="font-display text-[clamp(24px,4vw,48px)] text-champagne font-light tracking-[0.1em]">Аддитив Плюс</div>
    <div class="w-[200px] h-[1px] bg-border relative overflow-hidden">
      <div ref="barEl" class="absolute left-0 top-0 h-full w-0 bg-champagne"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const preloaderEl = ref(null)
const barEl = ref(null)

onMounted(() => {
  gsap.to(barEl.value, {
    width: '100%',
    duration: 2,
    ease: 'power2.inOut',
  })

  gsap.to(preloaderEl.value, {
    yPercent: -100,
    duration: 1,
    ease: 'power3.inOut',
    delay: 2.2,
    onComplete: () => {
      if (preloaderEl.value) preloaderEl.value.remove()
    },
  })
})
</script>