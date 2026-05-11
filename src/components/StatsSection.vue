<template>
  <section id="stats" class="py-24 md:py-32 bg-graphite relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-champagne/20"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-champagne/20"></div>
    </div>

    <div class="max-w-container mx-auto px-6 lg:px-10 relative z-10">
      <!-- Section header -->
      <div class="text-center mb-16 md:mb-20">
        <span class="text-sm font-body font-medium text-champagne tracking-widest uppercase">Цифры и факты</span>
        <h2 class="mt-4 font-display text-section font-light text-beige">Результаты говорят сами за себя</h2>
        <div class="section-divider mx-auto mt-6"></div>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        <div
          v-for="(stat, i) in stats"
          :key="i"
          class="stat-item text-center"
          :class="{ revealed: revealed && activeIndex >= i, frozen: frozen }"
        >
          <div class="font-display text-5xl md:text-6xl lg:text-7xl font-light text-champagne">
            <span ref="numberRefs">{{ frozen ? stat.value : '0' }}</span>
            <span class="text-champagne-light">{{ stat.suffix }}</span>
          </div>
          <p class="mt-3 text-sm md:text-base text-champagne-light/60 font-body">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const stats = [
  { value: 15, suffix: '+', label: 'Лет на рынке', target: 15 },
  { value: 500, suffix: '+', label: 'Проектов выполнено', target: 500 },
  { value: 50, suffix: 'M', label: 'Тонн бетона обработано', target: 50 },
  { value: 98, suffix: '%', label: 'Клиентов довольны', target: 98 },
]

const numberRefs = ref([])
const revealed = ref(false)
const frozen = ref(false)
const activeIndex = ref(-1)

let observer = null

function animateNumbers() {
  revealed.value = true

  stats.forEach((stat, i) => {
    // Sequential reveal with 0.3s delay between each
    setTimeout(() => {
      activeIndex.value = i

      // Animate number counting up
      const el = numberRefs.value?.[i]
      if (!el) return

      const obj = { val: 0 }
      gsap.to(obj, {
        val: stat.target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val)
        },
      })
    }, i * 400)
  })

  // Freeze after all revealed (4 items × 400ms + 1.5s animation + buffer)
  setTimeout(() => {
    frozen.value = true
  }, stats.length * 400 + 2000)
}

onMounted(() => {
  const section = document.getElementById('stats')
  if (!section) return

  // Use IntersectionObserver to trigger animation when visible
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !revealed.value) {
          // Delay 4 seconds as per spec
          setTimeout(animateNumbers, 4000)
          observer.unobserve(section)
        }
      })
    },
    { threshold: 0.3 }
  )

  observer.observe(section)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>