import { ArrowUpRight } from 'lucide-react'

import { housePaths } from '../data/siteData'
import type { SiteContent } from '../i18n'

interface HouseIndexSectionProps {
  content: SiteContent
}

export function HouseIndexSection({ content }: HouseIndexSectionProps) {
  return (
    <section className="house-index" aria-label="Τρόποι επίσκεψης Nero">
      <div className="house-index-copy" data-reveal>
        <div>
          <p className="eyebrow">{content.houseIndex.eyebrow}</p>
          <h2>{content.houseIndex.title}</h2>
        </div>
        <p>{content.houseIndex.body}</p>
      </div>
      <div className="house-paths" data-reveal>
        {housePaths.map((path, index) => {
          const Icon = path.Icon
          const text = content.housePaths[index]

          return (
            <a
              className="house-path"
              href={path.href}
              target={path.external ? '_blank' : undefined}
              rel={path.external ? 'noopener noreferrer' : undefined}
              key={path.label}
            >
              <img
                src={path.image}
                alt={path.alt}
                width={path.width}
                height={path.height}
                loading="lazy"
                decoding="async"
              />
              <span className="house-path-meta">
                <Icon size={17} aria-hidden="true" />
                {text.meta}
              </span>
              <strong>{text.title}</strong>
              <p>{text.body}</p>
              <em>
                {text.action}
                <ArrowUpRight size={15} aria-hidden="true" />
              </em>
            </a>
          )
        })}
      </div>
    </section>
  )
}
