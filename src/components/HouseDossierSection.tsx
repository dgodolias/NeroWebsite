import { ArrowUpRight } from 'lucide-react'

import { houseDossier } from '../data/siteData'
import type { SiteContent } from '../i18n'

interface HouseDossierSectionProps {
  content: SiteContent
}

export function HouseDossierSection({ content }: HouseDossierSectionProps) {
  return (
    <section className="house-dossier" aria-label="Βασικά στοιχεία Nero" data-reveal>
      <div className="house-dossier-copy">
        <p className="eyebrow">{content.houseDossierIntro.eyebrow}</p>
        <h2>{content.houseDossierIntro.title}</h2>
        <p>{content.houseDossierIntro.body}</p>
      </div>
      <div className="house-dossier-grid">
        {houseDossier.map((item, index) => {
          const Icon = item.Icon
          const text = content.houseDossier[index]

          return (
            <a
              className="house-dossier-item"
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              key={item.label}
            >
              <span>
                <Icon size={18} aria-hidden="true" />
                {text.label}
              </span>
              <strong>{text.value}</strong>
              <h3>{text.title}</h3>
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
