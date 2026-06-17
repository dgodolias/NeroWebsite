import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import type { PreviewImage } from '../preview/types'

export function usePreviewController(previewGallery: PreviewImage[]) {
  const previewModalRef = useRef<HTMLDivElement | null>(null)
  const previewThumbsRef = useRef<HTMLDivElement | null>(null)
  const previewThumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const closePreviewRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const previewPointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const previewIndexRef = useRef(0)
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null)
  const isPreviewOpen = previewImage !== null
  const exactPreviewIndex = previewImage
    ? previewGallery.findIndex(
        (item) =>
          item.src === previewImage.src &&
          item.title === previewImage.title &&
          item.detail === previewImage.detail,
      )
    : -1
  const sourcePreviewIndex = previewImage ? previewGallery.findIndex((item) => item.src === previewImage.src) : -1
  const previewPosition = exactPreviewIndex >= 0 ? exactPreviewIndex : sourcePreviewIndex >= 0 ? sourcePreviewIndex : 0
  previewIndexRef.current = previewPosition

  const closePreview = () => setPreviewImage(null)

  const openPreview = (image: PreviewImage) => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPreviewImage(image)
  }

  const showPreviewAt = (index: number) => {
    const nextIndex = (index + previewGallery.length) % previewGallery.length
    setPreviewImage(previewGallery[nextIndex])
  }

  const showPreviousPreview = () => showPreviewAt(previewPosition - 1)
  const showNextPreview = () => showPreviewAt(previewPosition + 1)

  const handlePreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const target = event.target as HTMLElement
    if (target.closest('button')) return

    previewPointerStartRef.current = { x: event.clientX, y: event.clientY }
  }

  const handlePreviewPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = previewPointerStartRef.current
    previewPointerStartRef.current = null
    if (!start) return

    const target = event.target as HTMLElement
    if (target.closest('button')) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y

    if (Math.abs(deltaX) < 48 || Math.abs(deltaY) > 80) return
    if (deltaX < 0) showNextPreview()
    else showPreviousPreview()
  }

  useEffect(() => {
    if (!isPreviewOpen) return undefined

    const originalOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setPreviewImage(null)
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const offset = event.key === 'ArrowLeft' ? -1 : 1
        const nextIndex = (previewIndexRef.current + offset + previewGallery.length) % previewGallery.length
        setPreviewImage(previewGallery[nextIndex])
        return
      }

      if (event.key === 'Tab') {
        const focusableControls = Array.from(
          previewModalRef.current?.querySelectorAll<HTMLButtonElement>('button:not([tabindex="-1"])') ?? [],
        )
        if (focusableControls.length === 0) return

        const activeIndex = focusableControls.indexOf(document.activeElement as HTMLButtonElement)
        const offset = event.shiftKey ? -1 : 1
        const nextIndex =
          activeIndex === -1
            ? 0
            : (activeIndex + offset + focusableControls.length) % focusableControls.length
        event.preventDefault()
        focusableControls[nextIndex].focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => closePreviewRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.setTimeout(() => restoreFocusRef.current?.focus(), 0)
    }
  }, [isPreviewOpen, previewGallery])

  useEffect(() => {
    if (!isPreviewOpen) return

    const activeThumb = previewThumbButtonRefs.current[previewPosition]
    if (!activeThumb) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeThumb.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [isPreviewOpen, previewPosition])

  return {
    closePreview,
    closePreviewRef,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    openPreview,
    previewImage,
    previewModalRef,
    previewPosition,
    previewThumbButtonRefs,
    previewThumbsRef,
    showNextPreview,
    showPreviewAt,
    showPreviousPreview,
    resetPreviewPointer: () => {
      previewPointerStartRef.current = null
    },
  }
}
