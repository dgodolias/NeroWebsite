import { MapPin, Menu, Phone } from 'lucide-react'

import { venue } from '../content'
import type { ServiceStatus } from '../data/service'
import type { LanguageCode, SiteContent, TranslationState } from '../i18n'
import { publicAsset } from '../paths'
import { LanguageMenu } from '../translate/LanguageMenu'
import type { ActiveSection } from '../types'

interface SiteHeaderProps {
  activeSection: ActiveSection | null
  content: SiteContent
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
  serviceStatus: ServiceStatus
  translationState: TranslationState
}

export function SiteHeader({
  activeSection,
  content,
  language,
  onLanguageChange,
  serviceStatus,
  translationState,
}: SiteHeaderProps) {
  return (
    <header className="site-header" aria-label="Nero navigation">
      <a className="brand" href="#top" aria-label="Nero homepage">
        <img src={publicAsset('/assets/refined/nero-logo.webp')} alt="" width="520" height="158" decoding="async" />
        <span>{content.venue.descriptor}</span>
      </a>
      <nav aria-label="Primary">
        <a href="#space" aria-current={activeSection === 'space' ? 'page' : undefined}>
          {content.nav.space}
        </a>
        <a href="#menu" aria-current={activeSection === 'menu' ? 'page' : undefined}>
          {content.nav.menu}
        </a>
        <a href="#visit" aria-current={activeSection === 'visit' ? 'page' : undefined}>
          {content.nav.visit}
        </a>
      </nav>
      <div className="header-actions" role="group" aria-label="Nero quick actions">
        <LanguageMenu
          content={content.language}
          language={language}
          onChange={onLanguageChange}
          state={translationState}
        />
        <a
          className="icon-action header-quick-action"
          href={venue.menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.quickActions.menu}
          title={content.quickActions.menu}
          data-tooltip={content.quickActions.menuTip}
        >
          <Menu size={18} />
        </a>
        <a
          className="icon-action header-quick-action"
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.quickActions.maps}
          title={content.quickActions.maps}
          data-tooltip={content.quickActions.mapsTip}
        >
          <MapPin size={18} />
        </a>
        <span
          className="header-status"
          data-open={serviceStatus.isOpen ? 'true' : 'false'}
          aria-label={`Nero status: ${serviceStatus.value}, ${serviceStatus.detail}`}
          aria-live="polite"
        >
          <span>{serviceStatus.value}</span>
          <strong>{serviceStatus.detail}</strong>
        </span>
        <a
          className="icon-action"
          href={`tel:${venue.tel}`}
          aria-label={content.quickActions.call}
          title={content.quickActions.call}
          data-tooltip={content.quickActions.callTip}
        >
          <Phone size={18} />
        </a>
      </div>
    </header>
  )
}
