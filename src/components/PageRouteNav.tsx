import type { SiteContent } from '../i18n'
import type { ActiveSection } from '../types'
import { pageRoutes } from '../data/siteData'

interface PageRouteNavProps {
  activeSection: ActiveSection | null
  content: SiteContent
}

export function PageRouteNav({ activeSection, content }: PageRouteNavProps) {
  return (
    <nav className="page-route" aria-label="Nero page route" data-reveal>
      {pageRoutes.map((route, index) => {
        const Icon = route.Icon

        return (
          <a href={route.href} aria-current={activeSection === route.key ? 'page' : undefined} key={route.key}>
            <span className="page-route-index">{route.index}</span>
            <span className="page-route-copy">
              <strong>{content.pageRoutes[index].label}</strong>
              <em>{content.pageRoutes[index].detail}</em>
            </span>
            <Icon size={17} aria-hidden="true" />
          </a>
        )
      })}
    </nav>
  )
}
