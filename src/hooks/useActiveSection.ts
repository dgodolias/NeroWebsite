import { useEffect, useState } from 'react'

import type { ActiveSection } from '../types'

const sectionIds = ['space', 'menu', 'visit'] as const

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null)

  useEffect(() => {
    const root = document.documentElement
    let rafId = 0

    const updateActiveSection = () => {
      const anchor = window.scrollY + window.innerHeight * 0.34
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight)
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      const nextSection = sectionIds.reduce<ActiveSection | null>((current, sectionId) => {
        const section = document.getElementById(sectionId)
        if (!section || anchor < section.offsetTop) return current
        return sectionId
      }, null)

      root.style.setProperty('--scroll-progress', scrollProgress.toFixed(4))
      setActiveSection((current) => (current === nextSection ? current : nextSection))
    }

    const scheduleUpdate = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      root.style.removeProperty('--scroll-progress')
    }
  }, [])

  return activeSection
}
