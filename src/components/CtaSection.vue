<template>
  <section id="contact" class="py-24 md:py-32 bg-graphite relative overflow-hidden">
    <!-- Background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-champagne/5 rounded-full blur-3xl"></div>

    <div class="max-w-container mx-auto px-6 lg:px-10 relative z-10 text-center">
      <span class="text-sm font-body font-medium text-champagne tracking-widest uppercase fade-up">Свяжитесь с нами</span>
      <h2 class="mt-6 font-display text-cta font-light text-beige max-w-3xl mx-auto fade-up">
        Готовы начать<br />сотрудничество?
      </h2>
      <p class="mt-6 text-base md:text-lg text-champagne-light/60 font-body max-w-xl mx-auto fade-up">
        Оставьте заявку, и наши специалисты подберут оптимальное решение для вашего проекта
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 fade-up">
        <a
          href="mailto:info@additivplus.ru"
          class="magnetic-btn px-10 py-4 bg-champagne text-graphite font-body font-medium text-sm rounded-full hover:bg-champagne-light transition-colors duration-300 tracking-wider"
          data-cursor="pointer"
        >
          <span class="btn-text">Оставить заявку</span>
        </a>
        <a
          href="tel:+78001234567"
          class="magnetic-btn px-10 py-4 border border-champagne/30 text-champagne font-body font-medium text-sm rounded-full hover:border-champagne/60 transition-colors duration-300 tracking-wider"
          data-cursor="pointer"
        >
          <span class="btn-text">Позвонить</span>
        </a>
      </div>

      <!-- Contact info -->
      <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div class="fade-up">
          <div class="text-champagne/60 text-sm font-body mb-2">Телефон</div>
          <a href="tel:+78001234567" class="text-beige font-display text-lg hover:text-champagne transition-colors" data-cursor="pointer">
            8 (800) 123-45-67
          </a>
        </div>
        <div class="fade-up">
          <div class="text-champagne/60 text-sm font-body mb-2">Email</div>
          <a href="mailto:info@additivplus.ru" class="text-beige font-display text-lg hover:text-champagne transition-colors" data-cursor="pointer">
            info@additivplus.ru
          </a>
        </div>
        <div class="fade-up">
          <div class="text-champagne/60 text-sm font-body mb-2">Адрес</div>
          <span class="text-beige font-display text-lg">Москва, Россия</span>
        </div>
      </div>
    </div>
  </section>
</template>