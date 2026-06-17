import type { PointerEventHandler, RefObject } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import type { SiteContent } from '../i18n'
import type { PreviewImage } from './types'

interface ImagePreviewModalProps {
  closeButtonRef: RefObject<HTMLButtonElement | null>
  content: SiteContent['preview']
  gallery: PreviewImage[]
  image: PreviewImage | null
  modalRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  onNext: () => void
  onPointerCancel: () => void
  onPointerDown: PointerEventHandler<HTMLDivElement>
  onPointerUp: PointerEventHandler<HTMLDivElement>
  onPrevious: () => void
  onShowAt: (index: number) => void
  position: number
  thumbButtonRefs: RefObject<(HTMLButtonElement | null)[]>
  thumbsRef: RefObject<HTMLDivElement | null>
}

export function ImagePreviewModal({
  closeButtonRef,
  content,
  gallery,
  image,
  modalRef,
  onClose,
  onNext,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  onPrevious,
  onShowAt,
  position,
  thumbButtonRefs,
  thumbsRef,
}: ImagePreviewModalProps) {
  if (!image) return null

  return (
    <div className="image-preview-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label={content.dialogAria}>
      <button
        className="image-preview-backdrop"
        type="button"
        tabIndex={-1}
        aria-label={content.backdropAria}
        onClick={onClose}
      />
      <div
        className="image-preview-shell"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <button
          ref={closeButtonRef}
          className="image-preview-close"
          type="button"
          title={content.closeTitle}
          data-tooltip={content.closeTip}
          aria-label={content.closeAria}
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="image-preview-controls" aria-label={content.controlsAria}>
          <button
            type="button"
            title={content.previousTitle}
            data-tooltip={content.previousTip}
            aria-label={content.previousAria}
            onClick={onPrevious}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            title={content.nextTitle}
            data-tooltip={content.nextTip}
            aria-label={content.nextAria}
            onClick={onNext}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <img
          className="image-preview-main"
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          decoding="async"
        />
        <div className="image-preview-caption">
          <span>{image.title}</span>
          <strong>{image.detail}</strong>
          <em>
            {String(position + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </em>
          <div className="image-preview-thumbs" ref={thumbsRef} aria-label={content.galleryThumbsAria}>
            {gallery.map((item, index) => (
              <button
                type="button"
                key={`${item.src}-${index}`}
                ref={(element) => {
                  thumbButtonRefs.current[index] = element
                }}
                aria-label={`${content.showImage} ${index + 1}: ${item.alt}`}
                aria-current={index === position ? 'true' : undefined}
                onClick={() => onShowAt(index)}
              >
                <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
