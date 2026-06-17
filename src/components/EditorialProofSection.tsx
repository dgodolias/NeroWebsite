import { ArrowUpRight, Maximize2 } from 'lucide-react'

import { editorialAssets } from '../data/siteData'
import type { SiteContent } from '../i18n'
import type { PreviewImage } from '../preview/types'

interface EditorialProofSectionProps {
  content: SiteContent
  onOpenPreview: (image: PreviewImage) => void
}

export function EditorialProofSection({ content, onOpenPreview }: EditorialProofSectionProps) {
  return (
    <section className="editorial-proof" aria-label="Σημειώσεις χώρου Nero" data-reveal>
      {editorialAssets.map((item, index) => {
        const Icon = item.Icon
        const text = content.editorialAssets[index]
        const preview = {
          src: item.image,
          alt: item.alt,
          title: text.label,
          detail: text.title,
          width: item.width,
          height: item.height,
        }

        return (
          <article key={item.label}>
            <div className="editorial-proof-media">
              <img
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
              <button
                className="image-preview-trigger"
                type="button"
                title={content.preview.imageTitle}
                data-tooltip={content.preview.previewTip}
                aria-label={`${content.preview.previewTip} ${item.alt}`}
                onClick={() => onOpenPreview(preview)}
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div className="editorial-proof-copy">
              <span>
                <Icon size={17} aria-hidden="true" />
                {text.label}
              </span>
              <h3>{text.title}</h3>
              <p>{text.body}</p>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {text.action}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : (
                <button type="button" onClick={() => onOpenPreview(preview)}>
                  {text.action}
                  <Maximize2 size={15} aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}
