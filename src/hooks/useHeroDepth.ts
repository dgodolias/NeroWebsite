import { useEffect, type RefObject } from 'react'

export function useHeroDepth(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hero || !finePointer || reduceMotion) {
      return undefined
    }

    let rafId = 0
    let nextX = 0
    let nextY = 0

    const updateHeroDepth = () => {
      rafId = 0
      hero.style.setProperty('--hero-x', nextX.toFixed(3))
      hero.style.setProperty('--hero-y', nextY.toFixed(3))
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2

      if (!rafId) {
        rafId = requestAnimationFrame(updateHeroDepth)
      }
    }

    const onPointerLeave = () => {
      nextX = 0
      nextY = 0

      if (!rafId) {
        rafId = requestAnimationFrame(updateHeroDepth)
      }
    }

    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(rafId)
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      hero.style.removeProperty('--hero-x')
      hero.style.removeProperty('--hero-y')
    }
  }, [heroRef])
}
