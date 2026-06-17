import { ArrowUpRight } from 'lucide-react'

import { venue } from '../content'
import type { ProgrammeCue } from '../data/service'
import { serviceProgramme } from '../data/siteData'
import type { SiteContent } from '../i18n'

interface RhythmPanelProps {
  content: SiteContent
  programmeCue: ProgrammeCue
}

export function RhythmPanel({ content, programmeCue }: RhythmPanelProps) {
  return (
    <section className="rhythm-panel" aria-label="Nero service programme">
      {content.experienceNotes.map((note, index) => {
        const programme = serviceProgramme[index]
        const Icon = programme.Icon
        const programmeText = content.serviceProgramme[index]
        const cueActive = programmeCue.index === index

        return (
          <article key={note.label} data-current={cueActive ? 'true' : undefined} data-reveal>
            <div className="rhythm-top">
              <span>{note.label}</span>
              <strong>{programmeText.time}</strong>
            </div>
            {cueActive ? (
              <small className="rhythm-current">
                <b>{programmeCue.label}</b>
                <span>{programmeCue.detail}</span>
              </small>
            ) : null}
            <Icon size={20} aria-hidden="true" />
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <a
              className="rhythm-link"
              href={venue.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${programmeText.action} at Nero on QuaR`}
            >
              {programmeText.action}
              <ArrowUpRight size={15} />
            </a>
          </article>
        )
      })}
    </section>
  )
}
