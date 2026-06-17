import type { SiteContent } from '../i18n'

interface SkipLinksProps {
  content: SiteContent['skip']
}

export function SkipLinks({ content }: SkipLinksProps) {
  return (
    <div className="skip-links" aria-label="Skip links">
      <a href="#menu">{content.menu}</a>
      <a href="#visit">{content.visit}</a>
    </div>
  )
}
