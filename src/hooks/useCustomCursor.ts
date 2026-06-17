import { useEffect, type RefObject } from 'react'

export function useCustomCursor(cursorRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = cursorRef.current

    if (!cursor || !finePointer || reduceMotion) {
      return undefined
    }

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cursorX = x
    let cursorY = y
    let rafId = 0

    document.documentElement.classList.add('custom-cursor-ready')

    const tick = () => {
      cursorX += (x - cursorX) * 0.22
      cursorY += (y - cursorY) * 0.22
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      cursor.dataset.active = target.closest('a, button') ? 'true' : 'false'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('custom-cursor-ready')
    }
  }, [cursorRef])
}
