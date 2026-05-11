import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

let lenisInstance = null

export function useLenis() {
  onMounted(() => {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  onUnmounted(() => {
    if (lenisInstance) {
      lenisInstance.destroy()
      lenisInstance = null
    }
  })

  return {
    get lenis() {
      return lenisInstance
    }
  }
}