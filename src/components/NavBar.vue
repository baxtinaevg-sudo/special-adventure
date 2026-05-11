<template>
  <nav ref="navEl" class="fixed top-0 left-0 right-0 z-[1000] py-6 transition-[background,padding] duration-500">
    <div class="max-w-container mx-auto px-[clamp(20px,4vw,60px)] flex items-center justify-between">
      <a href="#" class="flex items-center gap-3 group">
        <img src="/logo.png" alt="Аддитив Плюс" class="h-9 w-9 object-contain transition-[opacity] duration-300 group-hover:opacity-70" />
        <span class="font-display text-[22px] font-medium text-graphite tracking-[0.05em] transition-[color] duration-300 group-hover:text-champagne">Аддитив Плюс</span>
      </a>
      <ul class="hidden md:flex gap-9 list-none">
        <li><a href="#products" class="no-underline text-graphite-soft text-[13px] font-normal tracking-[0.08em] uppercase transition-[color] duration-300 hover:text-champagne relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne after:transition-[width] after:duration-400 after:ease-smooth hover:after:w-full">Каталог</a></li>
        <li><a href="#about" class="no-underline text-graphite-soft text-[13px] font-normal tracking-[0.08em] uppercase transition-[color] duration-300 hover:text-champagne relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne after:transition-[width] after:duration-400 after:ease-smooth hover:after:w-full">Компания</a></li>
        <li><a href="#stats" class="no-underline text-graphite-soft text-[13px] font-normal tracking-[0.08em] uppercase transition-[color] duration-300 hover:text-champagne relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne after:transition-[width] after:duration-400 after:ease-smooth hover:after:w-full">Цифры</a></li>
        <li><a href="#contact" class="no-underline text-graphite-soft text-[13px] font-normal tracking-[0.08em] uppercase transition-[color] duration-300 hover:text-champagne relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne after:transition-[width] after:duration-400 after:ease-smooth hover:after:w-full">Контакт</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLenis } from '../composables/useLenis'

const navEl = ref(null)
const { getLenis } = useLenis()

onMounted(() => {
  const lenis = getLenis()
  if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
      if (navEl.value) {
        if (scroll > 80) {
          navEl.value.classList.add('bg-beige/95', 'backdrop-blur-[20px]', 'py-[14px]')
          navEl.value.classList.remove('py-6')
        } else {
          navEl.value.classList.remove('bg-beige/95', 'backdrop-blur-[20px]', 'py-[14px]')
          navEl.value.classList.add('py-6')
        }
      }
    })
  }
})
</script>