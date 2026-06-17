import type { CSSProperties, RefObject } from 'react'
import { ArrowUpRight, MapPin, Maximize2, Menu } from 'lucide-react'

import { venue } from '../content'
import type { SiteContent } from '../i18n'
import { publicAsset } from '../paths'
import type { PreviewImage } from '../preview/types'

interface HeroProps {
  content: SiteContent
  heroRef: RefObject<HTMLElement | null>
  onOpenPreview: (image: PreviewImage) => void
}

export function Hero({ content, heroRef, onOpenPreview }: HeroProps) {
  return (
    <section className="hero" ref={heroRef}>
      <img
        className="hero-media"
        src={publicAsset('/assets/refined/nero-day-lounge.webp')}
        alt={content.hero.heroAlt}
        width="1400"
        height="926"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-shade" />
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-depth-stack" aria-hidden="true">
        <figure className="hero-depth-card is-terrace">
          <img
            src={publicAsset('/assets/refined/nero-stone-terrace.webp')}
            alt=""
            width="1400"
            height="980"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <figure className="hero-depth-card is-copper">
          <img
            src={publicAsset('/assets/refined/nero-copper-lounge.webp')}
            alt=""
            width="1400"
            height="852"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
      <button
        className="image-preview-trigger hero-preview-trigger"
        type="button"
        title={content.preview.imageTitle}
        data-tooltip={content.preview.previewTip}
        aria-label={content.hero.previewAria}
        onClick={() =>
          onOpenPreview({
            src: publicAsset('/assets/refined/nero-day-lounge.webp'),
            alt: content.hero.heroAlt,
            title: content.hero.previewTitle,
            detail: content.hero.previewDetail,
            width: 1400,
            height: 926,
          })
        }
      >
        <Maximize2 size={18} />
      </button>
      <div className="hero-content">
        <p className="eyebrow">
          {content.hero.eyebrowPrefix} / {content.venue.area}
        </p>
        <h1 className="hero-title">
          <span className="hero-title-line" style={{ '--line-index': 0 } as CSSProperties}>
            <span>Nero</span>
          </span>
          <span className="hero-title-line" style={{ '--line-index': 1 } as CSSProperties}>
            <span>Cafe Bar</span>
          </span>
          <span className="hero-title-line" style={{ '--line-index': 2 } as CSSProperties}>
            <span>Restaurant.</span>
          </span>
        </h1>
        <p className="hero-copy">{content.hero.copy}</p>
        <div className="hero-actions">
          <a className="primary-link" href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
            <Menu size={18} />
            {content.hero.menuAction}
          </a>
          <a className="secondary-link" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={18} />
            {content.hero.mapAction}
          </a>
        </div>
      </div>
      <div className="hero-stats" aria-label="Nero quick facts">
        {content.hero.stats.map((item, index) => {
          const statContent = (
            <>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </>
          )

          if (index === 2) {
            return (
              <a
                className="hero-stat hero-stat-action"
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Άνοιγμα διεύθυνσης Nero σε Google Maps"
                key={item.label}
              >
                {statContent}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )
          }

          return (
            <div className="hero-stat" key={item.label}>
              {statContent}
            </div>
          )
        })}
      </div>
    </section>
  )
}
