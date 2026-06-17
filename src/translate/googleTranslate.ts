import { supportedLanguages, type LanguageCode } from '../i18n'

interface GoogleTranslateConstructor {
  new (
    options: {
      autoDisplay?: boolean
      includedLanguages?: string
      pageLanguage: string
    },
    elementId: string,
  ): unknown
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: GoogleTranslateConstructor
      }
    }
    googleTranslateElementInit?: () => void
  }
}

export const googleTranslateElementId = 'google_translate_element'

const googleTranslateScriptId = 'google-translate-widget-script'
const googleTranslateScriptSrc = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
const googleTranslateLanguageCodes = supportedLanguages
  .filter((item) => item.code !== 'el')
  .map((item) => item.code)
  .join(',')

let googleTranslateReadyPromise: Promise<void> | null = null
let googleTranslateInitialized = false

export function getInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'el'

  const savedLanguage = window.localStorage.getItem('nero-language')
  const match = supportedLanguages.find((item) => item.code === savedLanguage)
  return match?.code ?? 'el'
}

function initializeGoogleTranslateElement() {
  if (googleTranslateInitialized) return

  const TranslateElement = window.google?.translate?.TranslateElement
  const mount = document.getElementById(googleTranslateElementId)
  if (!TranslateElement || !mount) return

  new TranslateElement(
    {
      pageLanguage: 'el',
      includedLanguages: googleTranslateLanguageCodes,
      autoDisplay: false,
    },
    googleTranslateElementId,
  )
  googleTranslateInitialized = true
}

export function ensureGoogleTranslateWidget() {
  if (typeof window === 'undefined') return Promise.resolve()

  if (window.google?.translate?.TranslateElement) {
    initializeGoogleTranslateElement()
    return Promise.resolve()
  }

  if (googleTranslateReadyPromise) return googleTranslateReadyPromise

  googleTranslateReadyPromise = new Promise((resolve, reject) => {
    window.googleTranslateElementInit = () => {
      initializeGoogleTranslateElement()
      resolve()
    }

    const existingScript = document.getElementById(googleTranslateScriptId)
    if (existingScript instanceof HTMLScriptElement) {
      existingScript.addEventListener(
        'load',
        () => {
          initializeGoogleTranslateElement()
          resolve()
        },
        { once: true },
      )
      existingScript.addEventListener('error', () => reject(new Error('Google Translate widget failed to load')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = googleTranslateScriptId
    script.src = googleTranslateScriptSrc
    script.async = true
    script.onerror = () => reject(new Error('Google Translate widget failed to load'))
    document.body.appendChild(script)
  })

  return googleTranslateReadyPromise
}

export function applyGoogleTranslateLanguage(language: LanguageCode) {
  const targetLanguage = language === 'el' ? '' : language

  return new Promise<boolean>((resolve) => {
    let attempts = 0
    const timer = window.setInterval(() => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
      attempts += 1

      if (combo) {
        combo.value = targetLanguage
        combo.dispatchEvent(new Event('change'))
        window.clearInterval(timer)
        resolve(true)
        return
      }

      if (attempts >= 40) {
        window.clearInterval(timer)
        resolve(false)
      }
    }, 100)
  })
}

export function clearGoogleTranslateState() {
  if (typeof window === 'undefined') return

  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT'
  const hostname = window.location.hostname
  const hostParts = hostname.split('.')
  const rootDomain = hostParts.length > 1 ? `.${hostParts.slice(-2).join('.')}` : null
  const domains = Array.from(new Set([null, hostname, `.${hostname}`, rootDomain]))

  domains.forEach((domain) => {
    const domainPart = domain ? ` domain=${domain};` : ''
    document.cookie = `googtrans=; expires=${expires}; path=/;${domainPart}`
    document.cookie = `googtrans=; expires=${expires}; path=/; SameSite=Lax;${domainPart}`
  })
}
