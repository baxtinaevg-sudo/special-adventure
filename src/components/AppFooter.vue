<template>
  <footer class="py-12 bg-graphite border-t border-champagne/10">
    <div class="max-w-container mx-auto px-6 lg:px-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        <!-- Logo & copyright -->
        <div class="flex flex-col items-center md:items-start gap-3">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Аддитив Плюс" class="h-8 w-auto opacity-80" />
            <span class="font-display text-lg text-beige/80 font-medium">Аддитив Плюс</span>
          </div>
          <p class="text-xs text-champagne-light/40 font-body">
            © {{ new Date().getFullYear() }} Аддитив Плюс. Все права защищены.
          </p>
        </div>

        <!-- Links -->
        <div class="flex items-center justify-center gap-8">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-sm text-champagne-light/50 hover:text-champagne transition-colors duration-300 font-body"
            data-cursor="pointer"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Back to top -->
        <div class="flex items-center justify-center md:justify-end">
          <button
            @click="scrollToTop"
            class="flex items-center gap-2 text-sm text-champagne-light/50 hover:text-champagne transition-colors duration-300 font-body magnetic-btn"
            data-cursor="pointer"
          >
            <span class="btn-text">Наверх</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const links = [
  { href: '#products', label: 'Продукция' },
  { href: '#about', label: 'О нас' },
  { href: '#contact', label: 'Контакты' },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>