import type { SiteContent } from '../i18n'

interface IntroBandProps {
  content: SiteContent['intro']
}

export function IntroBand({ content }: IntroBandProps) {
  return (
    <section className="intro-band" id="space" data-reveal>
      <div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2>{content.title}</h2>
      </div>
      <p>{content.body}</p>
    </section>
  )
}
