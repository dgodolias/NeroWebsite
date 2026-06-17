import { Maximize2 } from 'lucide-react'

import { spaceAssets } from '../data/siteData'
import type { SiteContent } from '../i18n'
import type { PreviewImage } from '../preview/types'

interface SpaceCardsProps {
  content: SiteContent
  onOpenPreview: (image: PreviewImage) => void
}

export function SpaceCards({ content, onOpenPreview }: SpaceCardsProps) {
  return (
    <section className="space-cards" aria-label="Nero space selector">
      {content.spaces.map((space, index) => {
        const asset = spaceAssets[index]

        return (
          <article key={space.title} data-reveal>
            <div className="space-image-wrap">
              <img
                src={asset.image}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                loading="lazy"
                decoding="async"
              />
              <button
                className="image-preview-trigger"
                type="button"
                title={content.preview.imageTitle}
                data-tooltip={content.preview.previewTip}
                aria-label={`${content.preview.previewTip} ${asset.alt}`}
                onClick={() =>
                  onOpenPreview({
                    src: asset.image,
                    alt: asset.alt,
                    title: content.preview.spaceTitle,
                    detail: space.title,
                    width: asset.width,
                    height: asset.height,
                  })
                }
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div className="space-copy">
              <span className="space-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{space.title}</h3>
              <p>{space.body}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
