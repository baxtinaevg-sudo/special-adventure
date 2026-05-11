<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-500"
    :class="scrolled ? 'bg-beige/80 shadow-sm' : 'bg-transparent'"
  >
    <div class="max-w-container mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
      <!-- Logo -->
      <a href="#" class="flex items-center gap-3 group" data-cursor="pointer">
        <img src="/logo.png" alt="Аддитив Плюс" class="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
        <span class="font-display text-xl font-semibold text-graphite tracking-wide">Аддитив Плюс</span>
      </a>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm font-body font-medium text-graphite/70 hover:text-champagne transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-champagne after:transition-all after:duration-300 hover:after:w-full"
          data-cursor="pointer"
        >
          {{ link.label }}
        </a>
        <a
          href="#contact"
          class="magnetic-btn ml-4 px-6 py-2.5 bg-graphite text-beige text-sm font-medium rounded-full hover:bg-graphite-soft transition-colors duration-300"
          data-cursor="pointer"
        >
          <span class="btn-text">Связаться</span>
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        class="md:hidden flex flex-col gap-1.5 p-2"
        @click="mobileOpen = !mobileOpen"
        data-cursor="pointer"
      >
        <span
          class="w-6 h-[2px] bg-graphite transition-all duration-300"
          :class="mobileOpen ? 'rotate-45 translate-y-[5px]' : ''"
        />
        <span
          class="w-6 h-[2px] bg-graphite transition-all duration-300"
          :class="mobileOpen ? 'opacity-0' : ''"
        />
        <span
          class="w-6 h-[2px] bg-graphite transition-all duration-300"
          :class="mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''"
        />
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden bg-beige/95 nav-blur border-t border-border px-6 py-6"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="block py-3 text-lg font-display text-graphite hover:text-champagne transition-colors"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </a>
        <a
          href="#contact"
          class="mt-4 block text-center px-6 py-3 bg-graphite text-beige rounded-full font-medium"
          @click="mobileOpen = false"
        >
          Связаться
        </a>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileOpen = ref(false)

const links = [
  { href: '#products', label: 'Продукция' },
  { href: '#about', label: 'О компании' },
  { href: '#stats', label: 'Цифры' },
  { href: '#contact', label: 'Контакты' },
]

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>