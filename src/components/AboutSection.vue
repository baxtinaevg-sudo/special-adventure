<template>
  <section id="about" class="py-24 md:py-32 bg-beige relative">
    <div class="max-w-container mx-auto px-6 lg:px-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <!-- Left: Text content -->
        <div>
          <span class="text-sm font-body font-medium text-champagne tracking-widest uppercase fade-up">О компании</span>
          <h2 class="mt-4 font-display text-section font-light text-graphite fade-up">
            Наука, которая<br />работает на вас
          </h2>
          <div class="section-divider mt-6 mb-8 fade-up"></div>
          <p class="text-base md:text-lg text-muted font-body leading-relaxed fade-up">
            Компания «Аддитив Плюс» — ведущий производитель химических добавок для бетона и строительных смесей. Мы объединяем передовые научные исследования с практическим опытом для создания продуктов, которые превосходят ожидания.
          </p>
          <p class="mt-5 text-base md:text-lg text-muted font-body leading-relaxed fade-up">
            Наша лаборатория постоянно работает над разработкой новых составов, адаптированных к российским климатическим условиям и специфическим требованиям строительных проектов.
          </p>

          <!-- Features -->
          <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-for="(feature, i) in features" :key="i" class="flex gap-4 fade-up">
              <div class="w-10 h-10 rounded-lg bg-champagne/10 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-display text-base font-medium text-graphite">{{ feature.title }}</h4>
                <p class="text-sm text-muted font-body mt-1">{{ feature.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual element -->
        <div class="relative fade-up">
          <div class="aspect-[4/5] rounded-2xl bg-gradient-to-br from-champagne/20 to-champagne-dark/10 border border-border flex items-center justify-center overflow-hidden">
            <!-- Decorative molecular structure -->
            <div class="relative w-full h-full flex items-center justify-center">
              <div class="absolute w-32 h-32 rounded-full border border-champagne/30 animate-pulse"></div>
              <div class="absolute w-48 h-48 rounded-full border border-champagne/20" style="animation: pulse 3s ease-in-out infinite 0.5s"></div>
              <div class="absolute w-64 h-64 rounded-full border border-champagne/10" style="animation: pulse 4s ease-in-out infinite 1s"></div>
              
              <!-- Center molecule icon -->
              <svg class="w-20 h-20 text-champagne/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
          <!-- Floating badge -->
          <div class="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-graphite text-beige px-6 py-4 rounded-xl shadow-lg">
            <div class="font-display text-2xl font-light">15+</div>
            <div class="text-xs text-champagne-light/70 font-body">лет опыта</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: 'Собственная лаборатория',
    desc: 'Полный цикл исследований и разработок',
  },
  {
    title: 'Сертификация',
    desc: 'Соответствие ГОСТ и международным стандартам',
  },
  {
    title: 'Техподдержка 24/7',
    desc: 'Экспертное сопровождение на каждом этапе',
  },
  {
    title: 'Эко-ответственность',
    desc: 'Безопасные составы для человека и среды',
  },
]
</script>