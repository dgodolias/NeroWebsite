import { useEffect, useMemo, useRef, useState } from 'react'

import { ArrivalStrip } from './components/ArrivalStrip'
import { EditorialProofSection } from './components/EditorialProofSection'
import { Hero } from './components/Hero'
import { HouseDossierSection } from './components/HouseDossierSection'
import { HouseIndexSection } from './components/HouseIndexSection'
import { IntroBand } from './components/IntroBand'
import { MenuShowcaseSection } from './components/MenuShowcaseSection'
import { MomentsSection } from './components/MomentsSection'
import { PageRouteNav } from './components/PageRouteNav'
import { ProofStrip } from './components/ProofStrip'
import { RhythmPanel } from './components/RhythmPanel'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SkipLinks } from './components/SkipLinks'
import { SpaceCards } from './components/SpaceCards'
import { VisitSection } from './components/VisitSection'
import { venue } from './content'
import { getArrivalEssentials, getProgrammeCue, getServiceStatus, getTodayHours } from './data/service'
import { useActiveSection } from './hooks/useActiveSection'
import { useAddressCopy } from './hooks/useAddressCopy'
import { useClock } from './hooks/useClock'
import { useCustomCursor } from './hooks/useCustomCursor'
import { useHeroDepth } from './hooks/useHeroDepth'
import { usePreviewController } from './hooks/usePreviewController'
import { useSiteMotion } from './hooks/useSiteMotion'
import { greekContent, type LanguageCode, type TranslationState } from './i18n'
import { getPreviewGallery } from './preview/gallery'
import { ImagePreviewModal } from './preview/ImagePreviewModal'
import { GoogleTranslateWidget } from './translate/GoogleTranslateWidget'
import { clearGoogleTranslateState, getInitialLanguage } from './translate/googleTranslate'

const content = greekContent

function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [translationState, setTranslationState] = useState<TranslationState>('idle')
  const activeSection = useActiveSection()
  const now = useClock()
  const todayHours = getTodayHours(now, content.todayHours)
  const serviceStatus = getServiceStatus(now, content.status)
  const programmeCue = getProgrammeCue(now, serviceStatus, content.status)
  const arrivalEssentials = getArrivalEssentials(todayHours, serviceStatus, content.arrival)
  const previewGallery = useMemo(() => getPreviewGallery(content), [])
  const preview = usePreviewController(previewGallery)
  const { addressCopied, copyAddress } = useAddressCopy(venue.address)

  useSiteMotion(heroRef)
  useHeroDepth(heroRef)
  useCustomCursor(cursorRef)

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('nero-language', language)
  }, [language])

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    if (nextLanguage === 'el' && language !== 'el') {
      window.localStorage.setItem('nero-language', 'el')
      clearGoogleTranslateState()
      window.location.reload()
      return
    }

    setLanguage(nextLanguage)
  }

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
      <GoogleTranslateWidget language={language} onStateChange={setTranslationState} />
      <SkipLinks content={content.skip} />
      <SiteHeader
        activeSection={activeSection}
        content={content}
        language={language}
        onLanguageChange={handleLanguageChange}
        serviceStatus={serviceStatus}
        translationState={translationState}
      />

      <main id="top">
        <Hero content={content} heroRef={heroRef} onOpenPreview={preview.openPreview} />
        <ArrivalStrip items={arrivalEssentials} />
        <PageRouteNav activeSection={activeSection} content={content} />
        <IntroBand content={content.intro} />
        <HouseDossierSection content={content} />
        <EditorialProofSection content={content} onOpenPreview={preview.openPreview} />
        <HouseIndexSection content={content} />
        <RhythmPanel content={content} programmeCue={programmeCue} />
        <MomentsSection content={content} onOpenPreview={preview.openPreview} />
        <MenuShowcaseSection content={content} />
        <ProofStrip content={content} onOpenPreview={preview.openPreview} />
        <SpaceCards content={content} onOpenPreview={preview.openPreview} />
        <VisitSection
          addressCopied={addressCopied}
          content={content}
          onCopyAddress={copyAddress}
          serviceStatus={serviceStatus}
          todayHours={todayHours}
        />
      </main>

      <SiteFooter content={content} />
      <ImagePreviewModal
        closeButtonRef={preview.closePreviewRef}
        content={content.preview}
        gallery={previewGallery}
        image={preview.previewImage}
        modalRef={preview.previewModalRef}
        onClose={preview.closePreview}
        onNext={preview.showNextPreview}
        onPointerCancel={preview.resetPreviewPointer}
        onPointerDown={preview.handlePreviewPointerDown}
        onPointerUp={preview.handlePreviewPointerUp}
        onPrevious={preview.showPreviousPreview}
        onShowAt={preview.showPreviewAt}
        position={preview.previewPosition}
        thumbButtonRefs={preview.previewThumbButtonRefs}
        thumbsRef={preview.previewThumbsRef}
      />
    </>
  )
}

export default App
