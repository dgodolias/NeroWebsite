import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2 } from 'lucide-react'

import { supportedLanguages, type LanguageCode, type SiteContent, type TranslationState } from '../i18n'
import { classNames } from '../utils/classNames'

interface LanguageMenuProps {
  content: SiteContent['language']
  language: LanguageCode
  onChange: (language: LanguageCode) => void
  state: TranslationState
}

export function LanguageMenu({ content, language, onChange, state }: LanguageMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const currentLanguage = supportedLanguages.find((item) => item.code === language) ?? supportedLanguages[0]
  const statusLabel: Record<TranslationState, string> = {
    idle: content.original,
    loading: content.loading,
    ready: content.ready,
    error: content.error,
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <div className="language-picker" ref={menuRef}>
      <button
        className="language-trigger"
        type="button"
        aria-label={content.aria}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={content.aria}
        data-tooltip={content.label}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="language-kicker">{content.label}</span>
        <span className="language-current">
          <Globe2 size={15} aria-hidden="true" />
          <span className="language-current-label">{currentLanguage.label}</span>
          <span className="language-current-code">{currentLanguage.displayCode}</span>
        </span>
        <span
          className={classNames('language-state-dot', `is-${state}`)}
          title={statusLabel[state]}
          aria-hidden="true"
        />
        <ChevronDown className={classNames('language-chevron', isOpen && 'is-open')} size={15} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          className="language-panel"
          role="listbox"
          aria-label={content.label}
          onTouchMove={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          {supportedLanguages.map((item) => {
            const isSelected = item.code === language

            return (
              <button
                className={classNames('language-option', isSelected && 'is-selected')}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-language={item.code}
                key={item.code}
                onClick={() => {
                  onChange(item.code)
                  setIsOpen(false)
                }}
              >
                <span className="language-name">{item.label}</span>
                <span className="language-code">{item.displayCode}</span>
                {isSelected ? <Check size={15} aria-hidden="true" /> : null}
              </button>
            )
          })}
          {state !== 'idle' ? (
            <p className="language-panel-status" role="status">
              <span className={classNames('language-state-dot', `is-${state}`)} aria-hidden="true" />
              {statusLabel[state]}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
