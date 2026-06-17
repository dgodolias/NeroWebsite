import { useEffect } from 'react'

export function useSiteMotion() {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (reduceMotion || !('IntersectionObserver' in window)) {
      root.dataset.motion = 'reduced'
      revealItems.forEach((item) => {
        item.dataset.revealed = 'true'
      })

      return () => {
        delete root.dataset.motion
        revealItems.forEach((item) => {
          delete item.dataset.revealed
        })
      }
    }

    root.dataset.motion = 'full'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const item = entry.target as HTMLElement
          item.dataset.revealed = 'true'
          observer.unobserve(item)
        })
      },
      { rootMargin: '0px 0px -14% 0px', threshold: 0.08 },
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      delete root.dataset.motion
    }
  }, [])
}
