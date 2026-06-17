import { ArrowUpRight, ChevronRight, Clock3, MapPin, Menu, Phone } from 'lucide-react'

import { proofImages, venue } from '../content'
import { menuEvidence, menuIconFor, menuProofs, menuRoutes } from '../data/siteData'
import type { SiteContent } from '../i18n'

interface MenuShowcaseSectionProps {
  content: SiteContent
}

export function MenuShowcaseSection({ content }: MenuShowcaseSectionProps) {
  return (
    <section className="texture-section menu-showcase" id="menu">
      <div className="section-heading menu-heading" data-reveal>
        <div>
          <p className="eyebrow">{content.menu.headingEyebrow}</p>
          <h2>{content.menu.headingTitle}</h2>
        </div>
        <p>{content.menu.headingBody}</p>
      </div>
      <div className="menu-evidence-strip" aria-label="Στοιχεία menu Nero" data-reveal>
        {menuEvidence.map((item, index) => {
          const Icon = item.Icon
          const text = content.menu.evidence[index]

          return (
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              key={item.label}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{text.label}</span>
              <strong>{text.value}</strong>
              <em>{text.detail}</em>
            </a>
          )
        })}
      </div>
      <div className="menu-categories" data-reveal>
        {content.menu.categories.map((category, index) => (
          <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={category.title}>
            <span className="menu-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="menu-category-icon">{menuIconFor(category.title)}</span>
            <h3>{category.title}</h3>
            <p>{category.sample}</p>
            <strong>{category.count}</strong>
            <ChevronRight size={18} />
          </a>
        ))}
      </div>
      <div className="menu-route-board" aria-label="Menu Nero ανά ώρα" data-reveal>
        <div className="menu-route-lead">
          <p className="eyebrow">{content.menu.routeLeadEyebrow}</p>
          <h3>{content.menu.routeLeadTitle}</h3>
        </div>
        <div className="menu-route-list">
          {menuRoutes.map((route, index) => {
            const Icon = route.Icon
            const text = content.menu.routes[index]

            return (
              <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={route.index}>
                <span>{route.index}</span>
                <Icon size={18} aria-hidden="true" />
                <small>{text.label}</small>
                <strong>{text.time}</strong>
                <h4>{text.title}</h4>
                <p>{text.detail}</p>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>
      <div className="menu-proof-panel" aria-label="Παραδείγματα menu Nero" data-reveal>
        <a className="menu-proof-feature" href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={menuProofs[0].image}
            alt={menuProofs[0].alt}
            width={menuProofs[0].width}
            height={menuProofs[0].height}
            loading="lazy"
            decoding="async"
          />
          <span>{content.menu.proofs[0].label}</span>
          <strong>{content.menu.proofs[0].title}</strong>
          <p>{content.menu.proofs[0].detail}</p>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <div className="menu-proof-list">
          {menuProofs.slice(1).map((item, index) => {
            const text = content.menu.proofs[index + 1]

            return (
              <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item.title}>
                <img
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                />
                <span>{text.label}</span>
                <strong>{text.title}</strong>
                <p>{text.detail}</p>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>
      <div className="menu-grid" data-reveal>
        {content.menu.highlights.map((item) => (
          <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item}>
            {menuIconFor(item)}
            <span>{item}</span>
            <ArrowUpRight size={16} />
          </a>
        ))}
      </div>
      <div className="signature-menu" data-reveal>
        {content.menu.signature.map((item) => (
          <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item.name}>
            <span>{item.group}</span>
            <strong>{item.name}</strong>
            <p>{item.detail}</p>
            <em>{item.price}</em>
          </a>
        ))}
      </div>
      <div className="service-rail" aria-label="Nero service essentials" data-reveal>
        <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
          <Menu size={18} />
          <span>{content.menu.serviceRail.menu}</span>
          <strong>QuaR</strong>
        </a>
        <a href={`tel:${venue.tel}`}>
          <Phone size={18} />
          <span>{content.menu.serviceRail.call}</span>
          <strong>{venue.phone}</strong>
        </a>
        <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
          <MapPin size={18} />
          <span>{content.menu.serviceRail.address}</span>
          <strong>{content.venue.address}</strong>
        </a>
        <div>
          <Clock3 size={18} />
          <span>{content.menu.serviceRail.hours}</span>
          <strong>{content.venue.hours}</strong>
        </div>
      </div>
    </section>
  )
}

export { proofImages }
