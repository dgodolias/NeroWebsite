import { Maximize2 } from 'lucide-react'

import { proofImages } from '../content'
import type { SiteContent } from '../i18n'
import type { PreviewImage } from '../preview/types'

interface ProofStripProps {
  content: SiteContent
  onOpenPreview: (image: PreviewImage) => void
}

export function ProofStrip({ content, onOpenPreview }: ProofStripProps) {
  return (
    <section className="proof-strip" aria-label="Φωτογραφίες Nero" data-reveal>
      {proofImages.map((image, index) => (
        <figure key={image.src}>
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
          />
          <button
            className="image-preview-trigger"
            type="button"
            title={content.preview.imageTitle}
            data-tooltip={content.preview.previewTip}
            aria-label={`${content.preview.previewTip} ${image.alt}`}
            onClick={() =>
              onOpenPreview({
                src: image.src,
                alt: image.alt,
                title: content.menu.proofCaptions[index],
                detail: image.alt,
                width: image.width,
                height: image.height,
              })
            }
          >
            <Maximize2 size={18} />
          </button>
          <figcaption>{content.menu.proofCaptions[index]}</figcaption>
        </figure>
      ))}
    </section>
  )
}
