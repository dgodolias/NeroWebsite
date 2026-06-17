import { venue } from '../content'
import type { SiteContent } from '../i18n'
import { publicAsset } from '../paths'

interface SiteFooterProps {
  content: SiteContent
}

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer className="site-footer" aria-label={content.footer.aria} data-reveal>
      <div className="footer-mark">
        <img src={publicAsset('/assets/refined/nero-logo.webp')} alt="Nero" width="520" height="158" decoding="async" />
        <strong>{content.venue.descriptor}</strong>
      </div>
      <div className="footer-grid">
        <a
          className="footer-map-card"
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.footer.addressAria}
        >
          <span>{content.footer.address}</span>
          <address>{content.venue.address}</address>
          <em>{content.footer.maps}</em>
        </a>
        <div>
          <span>{content.footer.hours}</span>
          <p>{content.venue.hours}</p>
        </div>
        <div>
          <span>{content.footer.contact}</span>
          <a href={`tel:${venue.tel}`}>{venue.phone}</a>
        </div>
        <div>
          <span>{content.footer.open}</span>
          <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
            {content.footer.footerMenu}
          </a>
          <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
            {content.footer.maps}
          </a>
          <a href={venue.instagramUrl} target="_blank" rel="noopener noreferrer">
            {content.footer.instagram}
          </a>
        </div>
      </div>
    </footer>
  )
}
