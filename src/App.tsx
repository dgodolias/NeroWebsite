import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock3,
  Coffee,
  Copy,
  GlassWater,
  Globe2,
  MapPin,
  Martini,
  Maximize2,
  Menu,
  Phone,
  Pizza,
  Salad,
  Sandwich,
  Utensils,
  Wine,
  X,
} from 'lucide-react'
import {
  moments as momentAssets,
  proofImages,
  venue,
} from './content'
import { greekContent, supportedLanguages, type LanguageCode, type SiteContent, type TranslationState } from './i18n'
import { publicAsset } from './paths'

gsap.registerPlugin(ScrollTrigger)

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

const googleTranslateElementId = 'google_translate_element'
const googleTranslateScriptId = 'google-translate-widget-script'
const googleTranslateScriptSrc = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
const googleTranslateLanguageCodes = supportedLanguages
  .filter((item) => item.code !== 'el')
  .map((item) => item.code)
  .join(',')

let googleTranslateReadyPromise: Promise<void> | null = null
let googleTranslateInitialized = false

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getInitialLanguage(): LanguageCode {
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

function ensureGoogleTranslateWidget() {
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

function applyGoogleTranslateLanguage(language: LanguageCode) {
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

function clearGoogleTranslateState() {
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

type GoogleTranslateWidgetProps = {
  language: LanguageCode
  onStateChange: (state: TranslationState) => void
}

function GoogleTranslateWidget({ language, onStateChange }: GoogleTranslateWidgetProps) {
  useEffect(() => {
    let cancelled = false

    async function updateLanguage() {
      if (language === 'el') {
        if (googleTranslateInitialized) {
          await applyGoogleTranslateLanguage('el')
        }
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

type LanguageMenuProps = {
  content: SiteContent['language']
  language: LanguageCode
  onChange: (language: LanguageCode) => void
  state: TranslationState
}

function LanguageMenu({ content, language, onChange, state }: LanguageMenuProps) {
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
          data-lenis-prevent
          data-lenis-prevent-touch
          data-lenis-prevent-wheel
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

function menuIconFor(title: string) {
  if (title.includes('ESPRESSO')) return <Coffee size={18} />
  if (title.includes('BRUNCH')) return <Sandwich size={18} />
  if (title.includes('ΠΟΤΑ')) return <Martini size={18} />
  if (title.includes('ΠΙΤΣ')) return <Pizza size={18} />
  if (title.includes('ΣΑΛΑ')) return <Salad size={18} />
  if (title.includes('ΚΡΑΣ')) return <Wine size={18} />
  if (title.includes('ΑΝΑΨ')) return <GlassWater size={18} />
  return <Utensils size={18} />
}

const serviceProgramme = [
  { time: '09:00', action: 'Καφέδες', Icon: Coffee },
  { time: 'All day', action: 'Φαγητό', Icon: Utensils },
  { time: 'Βράδυ', action: 'Ποτά', Icon: Martini },
]

const spaceAssets = [
  {
    image: publicAsset('/assets/refined/nero-stone-terrace.webp'),
    alt: 'Nero stone courtyard tables',
    width: 1400,
    height: 980,
  },
  {
    image: publicAsset('/assets/refined/nero-fireplace-lounge.webp'),
    alt: 'Nero warm interior lounge',
    width: 1400,
    height: 934,
  },
  {
    image: publicAsset('/assets/refined/nero-day-lounge.webp'),
    alt: 'Nero daytime lounge seating',
    width: 1400,
    height: 926,
  },
]

const menuProofs = [
  {
    label: 'Καφές',
    title: 'Freddo Espresso',
    detail: 'Από την ενότητα ESPRESSO του τωρινού menu.',
    image: publicAsset('/assets/refined/nero-espresso.webp'),
    alt: 'Nero espresso service',
    width: 1100,
    height: 788,
  },
  {
    label: 'Brunch',
    title: 'Club Sandwich NERO',
    detail: 'Club sandwich με το όνομα του Nero στον κατάλογο.',
    image: publicAsset('/assets/refined/nero-club.webp'),
    alt: 'Nero club sandwich',
    width: 1200,
    height: 916,
  },
  {
    label: 'Κουζίνα',
    title: 'Ραβιόλι',
    detail: 'Πιάτο κουζίνας από το food κομμάτι του καταλόγου.',
    image: publicAsset('/assets/refined/nero-pasta.webp'),
    alt: 'Nero pasta dish',
    width: 1200,
    height: 746,
  },
  {
    label: 'Bar',
    title: 'COZA NOSTRA',
    detail: 'Cocktail από το bar section του QuaR menu.',
    image: publicAsset('/assets/refined/nero-fireplace-lounge.webp'),
    alt: 'Nero warm interior lounge',
    width: 1400,
    height: 934,
  },
]

const housePaths = [
  {
    label: 'Καφές',
    meta: '09:00 / Espresso',
    title: 'Καφές από νωρίς',
    body: 'Espresso, freddo, cappuccino και ροφήματα από τον τωρινό κατάλογο.',
    action: 'Καφέδες',
    href: venue.menuUrl,
    external: true,
    image: publicAsset('/assets/refined/nero-cappuccino.webp'),
    alt: 'Nero cappuccino served at the table',
    width: 1100,
    height: 704,
    Icon: Coffee,
  },
  {
    label: 'Κουζίνα',
    meta: 'All day / φαγητό',
    title: 'Κάτι για το τραπέζι',
    body: 'Club Sandwich NERO, pasta, pizza, σαλάτες και πιάτα κουζίνας.',
    action: 'Φαγητό',
    href: venue.menuUrl,
    external: true,
    image: publicAsset('/assets/refined/nero-pasta.webp'),
    alt: 'Nero pasta dish',
    width: 1200,
    height: 746,
    Icon: Utensils,
  },
  {
    label: 'Χάρτης',
    meta: 'Πευκών 1',
    title: 'Αυλή έξω, lounge μέσα',
    body: 'Δύο χώροι για διαφορετική ώρα της ημέρας, στην ίδια γωνία της Πευκών.',
    action: 'Χάρτης',
    href: venue.mapUrl,
    external: true,
    image: publicAsset('/assets/refined/nero-stone-terrace.webp'),
    alt: 'Nero stone terrace and outdoor tables',
    width: 1400,
    height: 980,
    Icon: MapPin,
  },
]

const houseDossier = [
  {
    label: 'Menu',
    value: 'QuaR',
    title: 'Το menu στο QuaR',
    body: 'Ο τωρινός κατάλογος ανοίγει σε νέα καρτέλα. Καφές, brunch, πιάτα κουζίνας και ποτό είναι όλα εκεί.',
    action: 'Δες το menu',
    href: venue.menuUrl,
    external: true,
    Icon: Menu,
  },
  {
    label: 'Σήμερα',
    value: '09:00',
    title: 'Από τις 09:00',
    body: 'Για espresso, freddo και τα πρώτα τραπέζια της ημέρας.',
    action: 'Ωράριο',
    href: '#menu',
    external: false,
    Icon: Coffee,
  },
  {
    label: 'Διεύθυνση',
    value: 'Πευκών 1',
    title: 'Πευκών 1',
    body: 'Στη γωνία με τη Μελίνας Μερκούρη, στο Νέο Ηράκλειο.',
    action: 'Google Maps',
    href: venue.mapUrl,
    external: true,
    Icon: MapPin,
  },
  {
    label: 'Late',
    value: '02:00',
    title: 'Πιο αργά Παρασκευή και Σάββατο',
    body: 'Τις δύο αυτές μέρες το ωράριο πάει μέχρι τις 02:00.',
    action: 'Τηλέφωνο',
    href: `tel:${venue.tel}`,
    external: false,
    Icon: Martini,
  },
]

const editorialAssets = [
  {
    label: 'Arrival',
    title: 'Η αυλή φαίνεται από τον δρόμο.',
    body: 'Πέτρα, τραπέζια έξω και μια είσοδος που δεν χρειάζεται πολλά για να τη βρεις.',
    action: 'Άνοιγμα χάρτη',
    href: venue.mapUrl,
    image: publicAsset('/assets/refined/nero-street-arrival.webp'),
    alt: 'Nero stone exterior and terrace from Pefkon street',
    width: 1200,
    height: 864,
    Icon: MapPin,
  },
  {
    label: 'Interior',
    title: 'Μέσα είναι πιο ήσυχα.',
    body: 'Για φαγητό, ποτό ή απλώς να κάτσεις λίγο πιο ήσυχα από τον δρόμο.',
    action: 'Δες τη φωτογραφία',
    href: null,
    image: publicAsset('/assets/refined/nero-copper-lounge.webp'),
    alt: 'Nero interior lounge with copper lighting',
    width: 1400,
    height: 852,
    Icon: Camera,
  },
]

const menuRoutes = [
  {
    index: '01',
    label: 'Καφές',
    time: '09:00',
    title: 'Πρώτα ο καφές',
    detail: 'Freddo espresso, cappuccino, latte και ελληνικός από την ενότητα ESPRESSO.',
    Icon: Coffee,
  },
  {
    index: '02',
    label: 'Brunch',
    time: 'All day',
    title: 'Για το τραπέζι',
    detail: 'Club Sandwich NERO, scrambled eggs και croque madame από το BRUNCH κομμάτι.',
    Icon: Sandwich,
  },
  {
    index: '03',
    label: 'Κουζίνα',
    time: 'Kitchen',
    title: 'Κουζίνα',
    detail: 'Πίτσες, σαλάτες, ζυμαρικά και πιάτα κουζίνας για όποιον μένει παραπάνω.',
    Icon: Utensils,
  },
  {
    index: '04',
    label: 'Bar',
    time: 'Βράδυ',
    title: 'Ποτό και κρασί',
    detail: 'COZA NOSTRA, ποτά, μπίρες, κρασιά και αφρώδη για το βράδυ.',
    Icon: Martini,
  },
]

const menuEvidence = [
  {
    label: 'Menu',
    value: 'QuaR',
    detail: 'Τωρινός ψηφιακός κατάλογος',
    href: venue.menuUrl,
    external: true,
    Icon: Menu,
  },
  {
    label: 'Τι θα βρεις',
    value: 'Freddo / Club / COZA',
    detail: 'Καφές, brunch και bar',
    href: venue.menuUrl,
    external: true,
    Icon: Utensils,
  },
  {
    label: 'Πού είναι',
    value: 'Πευκών 1',
    detail: 'Χάρτης, τηλέφωνο και ωράριο',
    href: '#visit',
    external: false,
    Icon: MapPin,
  },
] as const

const pageRoutes = [
  {
    key: 'space',
    index: '01',
    label: 'Χώρος',
    detail: 'Αυλή / lounge',
    href: '#space',
    Icon: Camera,
  },
  {
    key: 'menu',
    index: '02',
    label: 'Menu',
    detail: 'QuaR κατάλογος',
    href: '#menu',
    Icon: Menu,
  },
  {
    key: 'visit',
    index: '03',
    label: 'Visit',
    detail: 'Χάρτης / τηλέφωνο',
    href: '#visit',
    Icon: MapPin,
  },
] as const

type PreviewImage = {
  src: string
  alt: string
  title: string
  detail: string
  width: number
  height: number
}

function getPreviewGallery(content: SiteContent): PreviewImage[] {
  const rawPreviewGallery: PreviewImage[] = [
    ...content.moments.map((moment, index) => {
      const asset = momentAssets[index]

      return {
        src: asset.image,
        alt: moment.alt,
        title: moment.kicker,
        detail: moment.title,
        width: asset.width,
        height: asset.height,
      }
    }),
    ...proofImages.map((image, index) => ({
      src: image.src,
      alt: image.alt,
      title: content.menu.proofCaptions[index],
      detail: image.alt,
      width: image.width,
      height: image.height,
    })),
    ...editorialAssets.map((asset, index) => {
      const item = content.editorialAssets[index]

      return {
        src: asset.image,
        alt: asset.alt,
        title: item.label,
        detail: item.title,
        width: asset.width,
        height: asset.height,
      }
    }),
    ...content.spaces.map((space, index) => {
      const asset = spaceAssets[index]

      return {
        src: asset.image,
        alt: asset.alt,
        title: content.preview.spaceTitle,
        detail: space.title,
        width: asset.width,
        height: asset.height,
      }
    }),
  ]

  return rawPreviewGallery.filter(
    (item, index, gallery) => gallery.findIndex((candidate) => candidate.src === item.src) === index,
  )
}

type TodayHours = {
  value: string
  note: string
}

type ServiceStatus = {
  isOpen: boolean
  value: string
  detail: string
}

type ProgrammeCue = {
  index: number
  label: string
  detail: string
}

const openMinute = 9 * 60
const kitchenMinute = 12 * 60
const barMinute = 21 * 60

function closingHourForDay(day: number) {
  return day === 5 || day === 6 ? 2 : 1
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

function getTodayHours(date = new Date(), labels: SiteContent['todayHours'] = greekContent.todayHours): TodayHours {
  const weekendLate = date.getDay() === 5 || date.getDay() === 6

  return weekendLate
    ? { value: '09:00 - 02:00', note: labels.weekendNote }
    : { value: '09:00 - 01:00', note: labels.weekdayNote }
}

function getServiceStatus(date = new Date(), labels: SiteContent['status'] = greekContent.status): ServiceStatus {
  const day = date.getDay()
  const previousDay = (day + 6) % 7
  const minute = date.getHours() * 60 + date.getMinutes()
  const todayClosingHour = closingHourForDay(day)
  const previousClosingHour = closingHourForDay(previousDay)

  if (minute >= openMinute) {
    return { isOpen: true, value: labels.openNow, detail: `${labels.closes} ${formatHour(todayClosingHour)}` }
  }

  if (minute < previousClosingHour * 60) {
    return { isOpen: true, value: labels.openNow, detail: `${labels.closes} ${formatHour(previousClosingHour)}` }
  }

  return { isOpen: false, value: labels.closedNow, detail: `${labels.opens} 09:00` }
}

function getProgrammeCue(
  date: Date,
  serviceStatus: ServiceStatus,
  labels: SiteContent['status'] = greekContent.status,
): ProgrammeCue {
  const minute = date.getHours() * 60 + date.getMinutes()

  if (!serviceStatus.isOpen) {
    return { index: 0, label: labels.next, detail: '09:00' }
  }

  if (minute < openMinute || minute >= barMinute) {
    return { index: 2, label: labels.now, detail: labels.bar }
  }

  if (minute >= kitchenMinute) {
    return { index: 1, label: labels.now, detail: labels.kitchen }
  }

  return { index: 0, label: labels.now, detail: labels.coffee }
}

function getArrivalEssentials(
  todayHours: TodayHours,
  serviceStatus: ServiceStatus,
  content: SiteContent['arrival'],
) {
  return [
    { ...content.essentials[0], href: venue.menuUrl, external: true, Icon: Menu },
    { ...content.essentials[1], href: `tel:${venue.tel}`, external: false, Icon: Phone },
    { ...content.essentials[2], href: venue.mapUrl, external: true, Icon: MapPin },
    {
      ...content.essentials[3],
      value: todayHours.value,
      detail: todayHours.note,
      status: serviceStatus,
      Icon: Clock3,
    },
  ]
}

function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const previewModalRef = useRef<HTMLDivElement | null>(null)
  const previewThumbsRef = useRef<HTMLDivElement | null>(null)
  const previewThumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const closePreviewRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const previewPointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const previewIndexRef = useRef(0)
  const copyAddressTimerRef = useRef<number | null>(null)
  const [activeSection, setActiveSection] = useState<'space' | 'menu' | 'visit' | null>(null)
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const content = greekContent
  const [translationState, setTranslationState] = useState<TranslationState>('idle')
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null)
  const [addressCopied, setAddressCopied] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const todayHours = getTodayHours(now, content.todayHours)
  const serviceStatus = getServiceStatus(now, content.status)
  const programmeCue = getProgrammeCue(now, serviceStatus, content.status)
  const arrivalEssentials = getArrivalEssentials(todayHours, serviceStatus, content.arrival)
  const previewGallery = getPreviewGallery(content)
  const isPreviewOpen = previewImage !== null
  const exactPreviewIndex = previewImage
    ? previewGallery.findIndex(
        (item) =>
          item.src === previewImage.src &&
          item.title === previewImage.title &&
          item.detail === previewImage.detail,
      )
    : -1
  const sourcePreviewIndex = previewImage ? previewGallery.findIndex((item) => item.src === previewImage.src) : -1
  const previewPosition = exactPreviewIndex >= 0 ? exactPreviewIndex : sourcePreviewIndex >= 0 ? sourcePreviewIndex : 0
  previewIndexRef.current = previewPosition

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    if (nextLanguage === 'el' && language !== 'el') {
      window.localStorage.setItem('nero-language', 'el')
      clearGoogleTranslateState()
      window.location.reload()
      return
    }

    setLanguage(nextLanguage)
  }

  const openPreview = (image: PreviewImage) => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPreviewImage(image)
  }

  const showPreviewAt = (index: number) => {
    const nextIndex = (index + previewGallery.length) % previewGallery.length
    setPreviewImage(previewGallery[nextIndex])
  }

  const showPreviousPreview = () => showPreviewAt(previewPosition - 1)
  const showNextPreview = () => showPreviewAt(previewPosition + 1)
  const AddressCopyIcon = addressCopied ? Check : Copy

  const copyAddress = async () => {
    if (!navigator.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(venue.address)
    } catch {
      setAddressCopied(false)
      return
    }

    setAddressCopied(true)

    if (copyAddressTimerRef.current) {
      window.clearTimeout(copyAddressTimerRef.current)
    }

    copyAddressTimerRef.current = window.setTimeout(() => {
      setAddressCopied(false)
      copyAddressTimerRef.current = null
    }, 2200)
  }

  const handlePreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const target = event.target as HTMLElement
    if (target.closest('button')) return

    previewPointerStartRef.current = { x: event.clientX, y: event.clientY }
  }

  const handlePreviewPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = previewPointerStartRef.current
    previewPointerStartRef.current = null
    if (!start) return

    const target = event.target as HTMLElement
    if (target.closest('button')) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y

    if (Math.abs(deltaX) < 48 || Math.abs(deltaY) > 80) return
    if (deltaX < 0) showNextPreview()
    else showPreviousPreview()
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    if (reduceMotion) {
      root.dataset.motion = 'reduced'
      gsap.set('[data-reveal]', { autoAlpha: 1, y: 0 })

      return () => {
        delete root.dataset.motion
        gsap.set('[data-reveal]', { clearProps: 'opacity,visibility,transform' })
      }
    }

    root.dataset.motion = 'full'
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 })
    let rafId = 0

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)

    const hero = heroRef.current
    const heroImage = hero?.querySelector('.hero-media')

    if (hero && heroImage) {
      gsap.to(heroImage, {
        scale: 1.075,
        filter: 'saturate(0.94) brightness(0.64)',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%' },
        },
      )
    })

    return () => {
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      lenis.destroy()
      delete root.dataset.motion
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hero || !finePointer || reduceMotion) {
      return undefined
    }

    let rafId = 0
    let nextX = 0
    let nextY = 0

    const updateHeroDepth = () => {
      rafId = 0
      hero.style.setProperty('--hero-x', nextX.toFixed(3))
      hero.style.setProperty('--hero-y', nextY.toFixed(3))
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2

      if (!rafId) {
        rafId = requestAnimationFrame(updateHeroDepth)
      }
    }

    const onPointerLeave = () => {
      nextX = 0
      nextY = 0

      if (!rafId) {
        rafId = requestAnimationFrame(updateHeroDepth)
      }
    }

    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(rafId)
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      hero.style.removeProperty('--hero-x')
      hero.style.removeProperty('--hero-y')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('nero-language', language)
  }, [language])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (copyAddressTimerRef.current) {
        window.clearTimeout(copyAddressTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const sectionIds = ['space', 'menu', 'visit'] as const
    const root = document.documentElement
    let rafId = 0

    const updateActiveSection = () => {
      const anchor = window.scrollY + window.innerHeight * 0.34
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight)
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      const nextSection = sectionIds.reduce<'space' | 'menu' | 'visit' | null>((current, sectionId) => {
        const section = document.getElementById(sectionId)
        if (!section || anchor < section.offsetTop) return current
        return sectionId
      }, null)

      root.style.setProperty('--scroll-progress', scrollProgress.toFixed(4))
      setActiveSection((current) => (current === nextSection ? current : nextSection))
    }

    const scheduleUpdate = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      root.style.removeProperty('--scroll-progress')
    }
  }, [])

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = cursorRef.current

    if (!cursor || !finePointer || reduceMotion) {
      return undefined
    }

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cursorX = x
    let cursorY = y
    let rafId = 0

    document.documentElement.classList.add('custom-cursor-ready')

    const tick = () => {
      cursorX += (x - cursorX) * 0.22
      cursorY += (y - cursorY) * 0.22
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      cursor.dataset.active = target.closest('a, button') ? 'true' : 'false'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('custom-cursor-ready')
    }
  }, [])

  useEffect(() => {
    if (!isPreviewOpen) return undefined

    const originalOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setPreviewImage(null)
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const offset = event.key === 'ArrowLeft' ? -1 : 1
        const nextIndex = (previewIndexRef.current + offset + previewGallery.length) % previewGallery.length
        setPreviewImage(previewGallery[nextIndex])
        return
      }

      if (event.key === 'Tab') {
        const focusableControls = Array.from(
          previewModalRef.current?.querySelectorAll<HTMLButtonElement>('button:not([tabindex="-1"])') ?? [],
        )
        if (focusableControls.length === 0) return

        const activeIndex = focusableControls.indexOf(document.activeElement as HTMLButtonElement)
        const offset = event.shiftKey ? -1 : 1
        const nextIndex =
          activeIndex === -1
            ? 0
            : (activeIndex + offset + focusableControls.length) % focusableControls.length
        event.preventDefault()
        focusableControls[nextIndex].focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => closePreviewRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.setTimeout(() => restoreFocusRef.current?.focus(), 0)
    }
  }, [isPreviewOpen])

  useEffect(() => {
    if (!isPreviewOpen) return

    const activeThumb = previewThumbButtonRefs.current[previewPosition]
    if (!activeThumb) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeThumb.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [isPreviewOpen, previewPosition])

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
      <GoogleTranslateWidget language={language} onStateChange={setTranslationState} />
      <div className="skip-links" aria-label="Skip links">
        <a href="#menu">{content.skip.menu}</a>
        <a href="#visit">{content.skip.visit}</a>
      </div>

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
            onChange={handleLanguageChange}
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

      <main id="top">
        <section className="hero" ref={heroRef}>
          <img
            className="hero-media"
            src={publicAsset('/assets/refined/nero-day-lounge.webp')}
            alt={content.hero.heroAlt}
            width="1400"
            height="926"
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-depth-stack" aria-hidden="true">
            <figure className="hero-depth-card is-terrace">
              <img
                src={publicAsset('/assets/refined/nero-stone-terrace.webp')}
                alt=""
                width="1400"
                height="980"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="hero-depth-card is-copper">
              <img
                src={publicAsset('/assets/refined/nero-copper-lounge.webp')}
                alt=""
                width="1400"
                height="852"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <button
            className="image-preview-trigger hero-preview-trigger"
            type="button"
            title={content.preview.imageTitle}
            data-tooltip={content.preview.previewTip}
            aria-label={content.hero.previewAria}
            onClick={() =>
              openPreview({
                src: publicAsset('/assets/refined/nero-day-lounge.webp'),
                alt: content.hero.heroAlt,
                title: content.hero.previewTitle,
                detail: content.hero.previewDetail,
                width: 1400,
                height: 926,
              })
            }
          >
            <Maximize2 size={18} />
          </button>
          <div className="hero-content">
            <p className="eyebrow">
              {content.hero.eyebrowPrefix} / {content.venue.area}
            </p>
            <h1 className="hero-title">
              <span className="hero-title-line" style={{ '--line-index': 0 } as CSSProperties}>
                <span>Nero</span>
              </span>
              <span className="hero-title-line" style={{ '--line-index': 1 } as CSSProperties}>
                <span>Cafe Bar</span>
              </span>
              <span className="hero-title-line" style={{ '--line-index': 2 } as CSSProperties}>
                <span>Restaurant.</span>
              </span>
            </h1>
            <p className="hero-copy">
              {content.hero.copy}
            </p>
            <div className="hero-actions">
              <a className="primary-link" href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
                <Menu size={18} />
                {content.hero.menuAction}
              </a>
              <a className="secondary-link" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} />
                {content.hero.mapAction}
              </a>
            </div>
          </div>
          <div className="hero-stats" aria-label="Nero quick facts">
            {content.hero.stats.map((item, index) => {
              const content = (
                <>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </>
              )

              if (index === 2) {
                return (
                  <a
                    className="hero-stat hero-stat-action"
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
            aria-label="Άνοιγμα διεύθυνσης Nero σε Google Maps"
                    key={item.label}
                  >
                    {content}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )
              }

              return (
                <div className="hero-stat" key={item.label}>
                  {content}
                </div>
              )
            })}
          </div>
        </section>

        <section className="arrival-strip" aria-label="Nero arrival essentials">
          {arrivalEssentials.map((item) => {
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

        <nav className="page-route" aria-label="Nero page route" data-reveal>
          {pageRoutes.map((route, index) => {
            const Icon = route.Icon

            return (
              <a
                href={route.href}
                aria-current={activeSection === route.key ? 'page' : undefined}
                key={route.key}
              >
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

        <section className="intro-band" id="space" data-reveal>
          <div>
            <p className="eyebrow">{content.intro.eyebrow}</p>
            <h2>{content.intro.title}</h2>
          </div>
          <p>{content.intro.body}</p>
        </section>

        <section className="house-dossier" aria-label="Βασικά στοιχεία Nero" data-reveal>
          <div className="house-dossier-copy">
            <p className="eyebrow">{content.houseDossierIntro.eyebrow}</p>
            <h2>{content.houseDossierIntro.title}</h2>
            <p>{content.houseDossierIntro.body}</p>
          </div>
          <div className="house-dossier-grid">
            {houseDossier.map((item, index) => {
              const Icon = item.Icon
              const text = content.houseDossier[index]

              return (
                <a
                  className="house-dossier-item"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  key={item.label}
                >
                  <span>
                    <Icon size={18} aria-hidden="true" />
                    {text.label}
                  </span>
                  <strong>{text.value}</strong>
                  <h3>{text.title}</h3>
                  <p>{text.body}</p>
                  <em>
                    {text.action}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </em>
                </a>
              )
            })}
          </div>
        </section>

        <section className="editorial-proof" aria-label="Σημειώσεις χώρου Nero" data-reveal>
          {editorialAssets.map((item, index) => {
            const Icon = item.Icon
            const text = content.editorialAssets[index]
            const preview = {
              src: item.image,
              alt: item.alt,
              title: text.label,
              detail: text.title,
              width: item.width,
              height: item.height,
            }

            return (
              <article key={item.label}>
                <div className="editorial-proof-media">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    className="image-preview-trigger"
                    type="button"
                    title={content.preview.imageTitle}
                    data-tooltip={content.preview.previewTip}
                    aria-label={`${content.preview.previewTip} ${item.alt}`}
                    onClick={() => openPreview(preview)}
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
                <div className="editorial-proof-copy">
                  <span>
                    <Icon size={17} aria-hidden="true" />
                    {text.label}
                  </span>
                  <h3>{text.title}</h3>
                  <p>{text.body}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {text.action}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <button type="button" onClick={() => openPreview(preview)}>
                      {text.action}
                      <Maximize2 size={15} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </section>

        <section className="house-index" aria-label="Τρόποι επίσκεψης Nero">
          <div className="house-index-copy" data-reveal>
            <div>
              <p className="eyebrow">{content.houseIndex.eyebrow}</p>
              <h2>{content.houseIndex.title}</h2>
            </div>
            <p>{content.houseIndex.body}</p>
          </div>
          <div className="house-paths" data-reveal>
            {housePaths.map((path, index) => {
              const Icon = path.Icon
              const text = content.housePaths[index]

              return (
                <a
                  className="house-path"
                  href={path.href}
                  target={path.external ? '_blank' : undefined}
                  rel={path.external ? 'noopener noreferrer' : undefined}
                  key={path.label}
                >
                  <img
                    src={path.image}
                    alt={path.alt}
                    width={path.width}
                    height={path.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="house-path-meta">
                    <Icon size={17} aria-hidden="true" />
                    {text.meta}
                  </span>
                  <strong>{text.title}</strong>
                  <p>{text.body}</p>
                  <em>
                    {text.action}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </em>
                </a>
              )
            })}
          </div>
        </section>

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

        <section className="moments" aria-label="Nero day moments">
          {content.moments.map((moment, index) => {
            const asset = momentAssets[index]

            return (
            <article className="moment" key={moment.title} data-reveal>
              <div className="moment-copy">
                <span>{moment.kicker}</span>
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>
              </div>
              <div className="moment-image-wrap">
                <img
                  src={asset.image}
                  alt={moment.alt}
                  width={asset.width}
                  height={asset.height}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <button
                  className="image-preview-trigger"
                  type="button"
                  title={content.preview.imageTitle}
                  data-tooltip={content.preview.previewTip}
                  aria-label={`${content.preview.previewTip} ${moment.alt}`}
                  onClick={() =>
                    openPreview({
                      src: asset.image,
                      alt: moment.alt,
                      title: moment.kicker,
                      detail: moment.title,
                      width: asset.width,
                      height: asset.height,
                    })
                  }
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </article>
            )
          })}
        </section>

        <section className="texture-section menu-showcase" id="menu">
          <div className="section-heading menu-heading" data-reveal>
            <div>
              <p className="eyebrow">{content.menu.headingEyebrow}</p>
              <h2>{content.menu.headingTitle}</h2>
            </div>
            <p>{content.menu.headingBody}</p>
          </div>
          <div className="menu-evidence-strip" aria-label="Στοιχεία menu Nero" data-reveal>
            {menuEvidence.map((item, index) => {
              const Icon = item.Icon
              const text = content.menu.evidence[index]

              return (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  key={item.label}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{text.label}</span>
                  <strong>{text.value}</strong>
                  <em>{text.detail}</em>
                </a>
              )
            })}
          </div>
          <div className="menu-categories" data-reveal>
            {content.menu.categories.map((category, index) => (
              <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={category.title}>
                <span className="menu-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="menu-category-icon">{menuIconFor(category.title)}</span>
                <h3>{category.title}</h3>
                <p>{category.sample}</p>
                <strong>{category.count}</strong>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
          <div className="menu-route-board" aria-label="Menu Nero ανά ώρα" data-reveal>
            <div className="menu-route-lead">
              <p className="eyebrow">{content.menu.routeLeadEyebrow}</p>
              <h3>{content.menu.routeLeadTitle}</h3>
            </div>
            <div className="menu-route-list">
              {menuRoutes.map((route, index) => {
                const Icon = route.Icon
                const text = content.menu.routes[index]

                return (
                  <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={route.index}>
                    <span>{route.index}</span>
                    <Icon size={18} aria-hidden="true" />
                    <small>{text.label}</small>
                    <strong>{text.time}</strong>
                    <h4>{text.title}</h4>
                    <p>{text.detail}</p>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
          <div className="menu-proof-panel" aria-label="Παραδείγματα menu Nero" data-reveal>
            <a className="menu-proof-feature" href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={menuProofs[0].image}
                alt={menuProofs[0].alt}
                width={menuProofs[0].width}
                height={menuProofs[0].height}
                loading="lazy"
                decoding="async"
              />
              <span>{content.menu.proofs[0].label}</span>
              <strong>{content.menu.proofs[0].title}</strong>
              <p>{content.menu.proofs[0].detail}</p>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <div className="menu-proof-list">
              {menuProofs.slice(1).map((item, index) => {
                const text = content.menu.proofs[index + 1]

                return (
                <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item.title}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{text.label}</span>
                  <strong>{text.title}</strong>
                  <p>{text.detail}</p>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                )
              })}
            </div>
          </div>
          <div className="menu-grid" data-reveal>
            {content.menu.highlights.map((item) => (
              <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item}>
                {menuIconFor(item)}
                <span>{item}</span>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
          <div className="signature-menu" data-reveal>
            {content.menu.signature.map((item) => (
              <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer" key={item.name}>
                <span>{item.group}</span>
                <strong>{item.name}</strong>
                <p>{item.detail}</p>
                <em>{item.price}</em>
              </a>
            ))}
          </div>
          <div className="service-rail" aria-label="Nero service essentials" data-reveal>
            <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
              <Menu size={18} />
              <span>{content.menu.serviceRail.menu}</span>
              <strong>QuaR</strong>
            </a>
            <a href={`tel:${venue.tel}`}>
              <Phone size={18} />
              <span>{content.menu.serviceRail.call}</span>
              <strong>{venue.phone}</strong>
            </a>
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={18} />
              <span>{content.menu.serviceRail.address}</span>
              <strong>{content.venue.address}</strong>
            </a>
            <div>
              <Clock3 size={18} />
              <span>{content.menu.serviceRail.hours}</span>
              <strong>{content.venue.hours}</strong>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Φωτογραφίες Nero" data-reveal>
          {proofImages.map((image, index) => (
            <figure key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
              <button
                  className="image-preview-trigger"
                  type="button"
                  title={content.preview.imageTitle}
                  data-tooltip={content.preview.previewTip}
                  aria-label={`${content.preview.previewTip} ${image.alt}`}
                  onClick={() =>
                    openPreview({
                      src: image.src,
                      alt: image.alt,
                      title: content.menu.proofCaptions[index],
                      detail: image.alt,
                      width: image.width,
                      height: image.height,
                  })
                }
              >
                  <Maximize2 size={18} />
                </button>
              <figcaption>{content.menu.proofCaptions[index]}</figcaption>
            </figure>
          ))}
        </section>

        <section className="space-cards" aria-label="Nero space selector">
          {content.spaces.map((space, index) => {
            const asset = spaceAssets[index]

            return (
              <article key={space.title} data-reveal>
                <div className="space-image-wrap">
                  <img
                    src={asset.image}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    className="image-preview-trigger"
                    type="button"
                    title={content.preview.imageTitle}
                    data-tooltip={content.preview.previewTip}
                    aria-label={`${content.preview.previewTip} ${asset.alt}`}
                    onClick={() =>
                      openPreview({
                        src: asset.image,
                        alt: asset.alt,
                        title: content.preview.spaceTitle,
                        detail: space.title,
                        width: asset.width,
                        height: asset.height,
                      })
                    }
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
                <div className="space-copy">
                  <span className="space-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{space.title}</h3>
                  <p>{space.body}</p>
                </div>
              </article>
            )
          })}
        </section>

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
              <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Άνοιγμα διεύθυνσης Nero σε Google Maps">
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
                onClick={copyAddress}
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
      </main>

      <footer className="site-footer" aria-label={content.footer.aria} data-reveal>
        <div className="footer-mark">
          <img src={publicAsset('/assets/refined/nero-logo.webp')} alt="Nero" width="520" height="158" decoding="async" />
          <strong>{content.venue.descriptor}</strong>
        </div>
        <div className="footer-grid">
          <a
            className="footer-map-card"
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.footer.addressAria}
          >
            <span>{content.footer.address}</span>
            <address>{content.venue.address}</address>
            <em>{content.footer.maps}</em>
          </a>
          <div>
            <span>{content.footer.hours}</span>
            <p>{content.venue.hours}</p>
          </div>
          <div>
            <span>{content.footer.contact}</span>
            <a href={`tel:${venue.tel}`}>{venue.phone}</a>
          </div>
          <div>
            <span>{content.footer.open}</span>
            <a href={venue.menuUrl} target="_blank" rel="noopener noreferrer">
              {content.footer.footerMenu}
            </a>
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
              {content.footer.maps}
            </a>
            <a href={venue.instagramUrl} target="_blank" rel="noopener noreferrer">
              {content.footer.instagram}
            </a>
          </div>
        </div>
      </footer>

      {previewImage ? (
        <div
          className="image-preview-modal"
          ref={previewModalRef}
          role="dialog"
          aria-modal="true"
          aria-label={content.preview.dialogAria}
        >
          <button
            className="image-preview-backdrop"
            type="button"
            tabIndex={-1}
            aria-label={content.preview.backdropAria}
            onClick={() => setPreviewImage(null)}
          />
          <div
            className="image-preview-shell"
            onPointerDown={handlePreviewPointerDown}
            onPointerUp={handlePreviewPointerUp}
            onPointerCancel={() => {
              previewPointerStartRef.current = null
            }}
          >
            <button
              ref={closePreviewRef}
              className="image-preview-close"
              type="button"
              title={content.preview.closeTitle}
              data-tooltip={content.preview.closeTip}
              aria-label={content.preview.closeAria}
              onClick={() => setPreviewImage(null)}
            >
              <X size={20} />
            </button>
            <div className="image-preview-controls" aria-label={content.preview.controlsAria}>
              <button
                type="button"
                title={content.preview.previousTitle}
                data-tooltip={content.preview.previousTip}
                aria-label={content.preview.previousAria}
                onClick={showPreviousPreview}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                title={content.preview.nextTitle}
                data-tooltip={content.preview.nextTip}
                aria-label={content.preview.nextAria}
                onClick={showNextPreview}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <img
              className="image-preview-main"
              src={previewImage.src}
              alt={previewImage.alt}
              width={previewImage.width}
              height={previewImage.height}
              decoding="async"
            />
            <div className="image-preview-caption">
              <span>{previewImage.title}</span>
              <strong>{previewImage.detail}</strong>
              <em>
                {String(previewPosition + 1).padStart(2, '0')} / {String(previewGallery.length).padStart(2, '0')}
              </em>
              <div className="image-preview-thumbs" ref={previewThumbsRef} aria-label={content.preview.galleryThumbsAria}>
                {previewGallery.map((item, index) => (
                  <button
                    type="button"
                    key={`${item.src}-${index}`}
                    ref={(element) => {
                      previewThumbButtonRefs.current[index] = element
                    }}
                    aria-label={`${content.preview.showImage} ${index + 1}: ${item.alt}`}
                    aria-current={index === previewPosition ? 'true' : undefined}
                    onClick={() => showPreviewAt(index)}
                  >
                    <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default App
