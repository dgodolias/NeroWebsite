import { Maximize2 } from 'lucide-react'

import { moments as momentAssets } from '../content'
import type { SiteContent } from '../i18n'
import type { PreviewImage } from '../preview/types'

interface MomentsSectionProps {
  content: SiteContent
  onOpenPreview: (image: PreviewImage) => void
}

export function MomentsSection({ content, onOpenPreview }: MomentsSectionProps) {
  return (
    <section className="moments" aria-label="Nero day moments">
      {content.moments.map((moment, index) => {
        const asset = momentAssets[index]

        return (
          <article className="moment" key={moment.title} data-reveal>
            <div className="moment-copy">
              <span>{moment.kicker}</span>
              <h3>{moment.title}</h3>
              <p>{moment.body}</p>
            </div>
            <div className="moment-image-wrap">
              <img
                src={asset.image}
                alt={moment.alt}
                width={asset.width}
                height={asset.height}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <button
                className="image-preview-trigger"
                type="button"
                title={content.preview.imageTitle}
                data-tooltip={content.preview.previewTip}
                aria-label={`${content.preview.previewTip} ${moment.alt}`}
                onClick={() =>
                  onOpenPreview({
                    src: asset.image,
                    alt: moment.alt,
                    title: moment.kicker,
                    detail: moment.title,
                    width: asset.width,
                    height: asset.height,
                  })
                }
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
