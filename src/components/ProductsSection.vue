<template>
  <section id="products" class="py-24 md:py-32 bg-beige">
    <div class="max-w-container mx-auto px-6 lg:px-10">
      <!-- Section header -->
      <div class="text-center mb-16 md:mb-20">
        <span class="text-sm font-body font-medium text-champagne tracking-widest uppercase fade-up">Каталог</span>
        <h2 class="mt-4 font-display text-section font-light text-graphite fade-up">Наша продукция</h2>
        <div class="section-divider mx-auto mt-6 fade-up"></div>
      </div>

      <!-- Products grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(product, i) in products"
          :key="i"
          class="group relative p-8 md:p-10 rounded-2xl border border-border bg-white/50 hover:bg-white transition-all duration-500 hover:shadow-lg hover:shadow-champagne/5 fade-up"
          data-cursor="pointer"
        >
          <!-- Icon -->
          <div class="w-14 h-14 rounded-xl bg-champagne/10 flex items-center justify-center mb-6 group-hover:bg-champagne/20 transition-colors duration-500">
            <component :is="product.icon" />
          </div>

          <!-- Content -->
          <h3 class="font-display text-xl font-medium text-graphite mb-3">{{ product.title }}</h3>
          <p class="text-sm text-muted font-body leading-relaxed">{{ product.description }}</p>

          <!-- Hover line -->
          <div class="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-champagne to-champagne-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const IconPlasticizer = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' })
    ])
  }
}

const IconFrost = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  }
}

const IconWaterproof = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2v-5.34a2 2 0 01.23-.93L6 6.67a2 2 0 011.74-1h8.52a2 2 0 011.74 1l3.77 7.06c.15.29.23.61.23.93z' })
    ])
  }
}

const IconAccelerator = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ])
  }
}

const IconAir = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' })
    ])
  }
}

const IconModifier = {
  render() {
    return h('svg', { class: 'w-7 h-7 text-champagne', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
    ])
  }
}

const products = [
  {
    icon: IconPlasticizer,
    title: 'Суперпластификаторы',
    description: 'Повышение подвижности бетонных смесей при снижении водоцементного отношения до 30%. Увеличение прочности и долговечности конструкций.',
  },
  {
    icon: IconFrost,
    title: 'Антифризные добавки',
    description: 'Обеспечение твердения бетона при температурах до -25°C. Снижение точки замерзания воды и ускорение процессов гидратации.',
  },
  {
    icon: IconWaterproof,
    title: 'Гидроизоляционные системы',
    description: 'Комплексная защита бетонных конструкций от проникновения влаги. Повышение марки водонепроницаемости до W20.',
  },
  {
    icon: IconAccelerator,
    title: 'Ускорители твердения',
    description: 'Сокращение сроков набора прочности в 2-3 раза. Идеальны для монолитного строительства и预制ных конструкций.',
  },
  {
    icon: IconAir,
    title: 'Воздухововлекающие добавки',
    description: 'Повышение морозостойкости бетона до F1000 и более. Образование контролируемой системы микропор.',
  },
  {
    icon: IconModifier,
    title: 'Комплексные модификаторы',
    description: 'Многофункциональные добавки с синергетическим эффектом. Регулирование всех ключевых свойств бетонной смеси.',
  },
]
</script>