import type { getArrivalEssentials } from '../data/service'

interface ArrivalStripProps {
  items: ReturnType<typeof getArrivalEssentials>
}

export function ArrivalStrip({ items }: ArrivalStripProps) {
  return (
    <section className="arrival-strip" aria-label="Nero arrival essentials">
      {items.map((item) => {
        const Icon = item.Icon
        const status = 'status' in item ? item.status : null
        const content = (
          <>
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {'detail' in item ? <em>{item.detail}</em> : null}
            {status ? (
              <small data-open={status.isOpen ? 'true' : 'false'} aria-live="polite">
                <b>{status.value}</b>
                <span>{status.detail}</span>
              </small>
            ) : null}
          </>
        )

        if ('href' in item && item.href) {
          return (
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              key={item.label}
            >
              {content}
            </a>
          )
        }

        return <div key={item.label}>{content}</div>
      })}
    </section>
  )
}
