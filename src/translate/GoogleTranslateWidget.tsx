import { useEffect } from 'react'

import type { LanguageCode, TranslationState } from '../i18n'
import {
  applyGoogleTranslateLanguage,
  ensureGoogleTranslateWidget,
  googleTranslateElementId,
} from './googleTranslate'

interface GoogleTranslateWidgetProps {
  language: LanguageCode
  onStateChange: (state: TranslationState) => void
}

export function GoogleTranslateWidget({ language, onStateChange }: GoogleTranslateWidgetProps) {
  useEffect(() => {
    let cancelled = false

    async function updateLanguage() {
      if (language === 'el') {
        await applyGoogleTranslateLanguage('el')
        if (!cancelled) {
          onStateChange('idle')
        }
        return
      }

      onStateChange('loading')

      try {
        await ensureGoogleTranslateWidget()
        const applied = await applyGoogleTranslateLanguage(language)
        if (!cancelled) {
          onStateChange(applied ? 'ready' : 'error')
        }
      } catch {
        if (!cancelled) {
          onStateChange('error')
        }
      }
    }

    void updateLanguage()

    return () => {
      cancelled = true
    }
  }, [language, onStateChange])

  return (
    <div className="google-translate-shell notranslate" translate="no" aria-hidden="true">
      <div id={googleTranslateElementId} />
    </div>
  )
}
