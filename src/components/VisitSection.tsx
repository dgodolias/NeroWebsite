import { Camera, Check, Clock3, Copy, Phone } from 'lucide-react'

import { venue } from '../content'
import type { ServiceStatus, TodayHours } from '../data/service'
import type { SiteContent } from '../i18n'

interface VisitSectionProps {
  addressCopied: boolean
  content: SiteContent
  onCopyAddress: () => void
  serviceStatus: ServiceStatus
  todayHours: TodayHours
}

export function VisitSection({
  addressCopied,
  content,
  onCopyAddress,
  serviceStatus,
  todayHours,
}: VisitSectionProps) {
  const AddressCopyIcon = addressCopied ? Check : Copy

  return (
    <section className="visit" id="visit" data-reveal>
      <div className="visit-copy">
        <p className="eyebrow">{content.visit.eyebrow}</p>
        <h2>{content.venue.address}.</h2>
        <p>{content.visit.body}</p>
      </div>
      <div className="visit-panel">
        <div className="visit-details" aria-label="Verified visit details">
          <div className="visit-status" data-open={serviceStatus.isOpen ? 'true' : 'false'} aria-live="polite">
            <span>{content.visit.now}</span>
            <strong>{serviceStatus.value}</strong>
            <em>{serviceStatus.detail}</em>
          </div>
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Άνοιγμα διεύθυνσης Nero σε Google Maps"
          >
            <span>{content.visit.address}</span>
            <strong>{content.venue.address}</strong>
            <em>{content.visit.maps}</em>
          </a>
          <div>
            <span>{content.visit.hours}</span>
            <strong>{content.venue.hours}</strong>
          </div>
          <div>
            <span>{content.visit.today}</span>
            <strong>{todayHours.value}</strong>
            <em>{todayHours.note}</em>
          </div>
          <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
            <span>{content.visit.menu}</span>
            <strong>{content.menu.serviceRail.currentMenu}</strong>
          </a>
        </div>
        <div className="visit-actions">
          <a className="primary-link" href={`tel:${venue.tel}`}>
            <Phone size={18} />
            {venue.phone}
          </a>
          <a className="secondary-link" href={venue.instagramUrl} target="_blank" rel="noopener noreferrer">
            <Camera size={18} />
            {content.visit.instagram}
          </a>
          <button
            className="secondary-link"
            type="button"
            aria-label={content.visit.copyAddressAria}
            aria-live="polite"
            onClick={onCopyAddress}
          >
            <AddressCopyIcon size={18} />
            {addressCopied ? content.visit.copiedAddress : content.visit.copyAddress}
          </button>
          <a className="secondary-link" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
            <Clock3 size={18} />
            {content.visit.mapsOpen}
          </a>
        </div>
      </div>
    </section>
  )
}
