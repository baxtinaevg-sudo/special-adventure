<template>
  <div ref="cursorEl" class="custom-cursor"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const cursorEl = ref(null)
let cursorX = 0, cursorY = 0, mouseX = 0, mouseY = 0
let rafId = null

function updateCursor() {
  cursorX += (mouseX - cursorX) * 0.15
  cursorY += (mouseY - cursorY) * 0.15
  if (cursorEl.value) {
    cursorEl.value.style.left = cursorX + 'px'
    cursorEl.value.style.top = cursorY + 'px'
  }
  rafId = requestAnimationFrame(updateCursor)
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function addHoverListeners() {
  document.querySelectorAll('a, button, .product-item').forEach(el => {
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
  })
}

function onEnter() {
  if (cursorEl.value) cursorEl.value.classList.add('active')
}
function onLeave() {
  if (cursorEl.value) cursorEl.value.classList.remove('active')
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  rafId = requestAnimationFrame(updateCursor)
  // Delay to ensure DOM is ready
  setTimeout(addHoverListeners, 3000)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>