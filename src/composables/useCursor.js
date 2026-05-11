import { onMounted, onUnmounted, ref } from 'vue'

export function useCursor() {
  const dotX = ref(0)
  const dotY = ref(0)
  const ringX = ref(0)
  const ringY = ref(0)
  const hovering = ref(false)

  let targetX = 0
  let targetY = 0
  let currentDotX = 0
  let currentDotY = 0
  let currentRingX = 0
  let currentRingY = 0
  let animationId = null

  function onMouseMove(e) {
    targetX = e.clientX
    targetY = e.clientY
  }

  function onMouseOver(e) {
    const target = e.target
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.magnetic-btn') ||
      target.dataset.cursor === 'pointer'
    ) {
      hovering.value = true
    }
  }

  function onMouseOut(e) {
    const target = e.target
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.magnetic-btn') ||
      target.dataset.cursor === 'pointer'
    ) {
      hovering.value = false
    }
  }

  function animate() {
    const ease = 0.15
    const ringEase = 0.08

    currentDotX += (targetX - currentDotX) * ease
    currentDotY += (targetY - currentDotY) * ease
    currentRingX += (targetX - currentRingX) * ringEase
    currentRingY += (targetY - currentRingY) * ringEase

    dotX.value = currentDotX
    dotY.value = currentDotY
    ringX.value = currentRingX
    ringY.value = currentRingY

    animationId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    if (window.innerWidth < 768) return

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)
    animate()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseover', onMouseOver)
    window.removeEventListener('mouseout', onMouseOut)
    if (animationId) cancelAnimationFrame(animationId)
  })

  return { dotX, dotY, ringX, ringY, hovering }
}