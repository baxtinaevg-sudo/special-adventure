export function useMagnetic(el) {
  function onMouseMove(e) {
    if (!el.value) return
    const rect = el.value.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.value.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
  }

  function onMouseLeave() {
    if (!el.value) return
    el.value.style.transform = ''
    el.value.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)'
    setTimeout(() => {
      if (el.value) el.value.style.transition = ''
    }, 400)
  }

  function bind() {
    if (!el.value) return
    el.value.addEventListener('mousemove', onMouseMove)
    el.value.addEventListener('mouseleave', onMouseLeave)
  }

  function unbind() {
    if (!el.value) return
    el.value.removeEventListener('mousemove', onMouseMove)
    el.value.removeEventListener('mouseleave', onMouseLeave)
  }

  return { bind, unbind }
}