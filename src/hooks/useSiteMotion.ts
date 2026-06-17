import { useEffect, type RefObject } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSiteMotion(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    if (reduceMotion) {
      root.dataset.motion = 'reduced'
      gsap.set('[data-reveal]', { autoAlpha: 1, y: 0 })

      return () => {
        delete root.dataset.motion
        gsap.set('[data-reveal]', { clearProps: 'opacity,visibility,transform' })
      }
    }

    root.dataset.motion = 'full'
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 })
    let rafId = 0

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)

    const hero = heroRef.current
    const heroImage = hero?.querySelector('.hero-media')

    if (hero && heroImage) {
      gsap.to(heroImage, {
        scale: 1.075,
        filter: 'saturate(0.94) brightness(0.64)',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%' },
        },
      )
    })

    return () => {
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      lenis.destroy()
      delete root.dataset.motion
    }
  }, [heroRef])
}
