import { expect, test } from '@playwright/test'

test('renders Nero hero, menu links, and no horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nero')
  await expect(page.getByRole('link', { name: /Δες το menu/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(page.getByRole('link', { name: 'Άνοιγμα διεύθυνσης Nero σε Google Maps' }).first()).toHaveAttribute(
    'href',
    /google\.com\/maps/,
  )
  await expect(page.locator('.hero-copy')).toContainText('Στην Πευκών')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)

  await page.locator('#visit').scrollIntoViewIfNeeded()
  await expect(page.locator('#visit h2')).toContainText('Πευκών 1 & Μ. Μερκούρη')
})

test('menu preview uses QuaR categories and no old website links', async ({ page }) => {
  await page.goto('/')
  await page.locator('#menu').scrollIntoViewIfNeeded()

  await expect(page.getByText('Ψηφιακό menu / QuaR')).toBeVisible()
  await expect(page.getByRole('link', { name: /BRUNCH/ }).first()).toBeVisible()

  await page.locator('.signature-menu').scrollIntoViewIfNeeded()
  await expect(page.locator('.signature-menu').getByRole('link', { name: /Club Sandwich NERO/ })).toBeVisible()
  await expect(page.locator('.signature-menu').getByRole('link', { name: /COZA NOSTRA/ })).toBeVisible()

  const oldLinks = await page
    .locator('a[href*="nerocafe"], a[href*="catalogue"]')
    .evaluateAll((links) => links.length)
  expect(oldLinks).toBe(0)
})

test('structured data points to the QuaR menu and verified location', async ({ page }) => {
  await page.goto('/')

  const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
  expect(structuredData).not.toBeNull()

  const parsed = JSON.parse(structuredData ?? '{}')
  expect(parsed.hasMenu).toBe('https://quar.gr/stores/n/nero#menu')
  expect(parsed.telephone).toBe('+302102840002')
  expect(parsed.address.streetAddress).toContain('Πευκών 1')
  expect(parsed.image).toContain('/assets/refined/nero-day-lounge.webp')
  expect(parsed.sameAs).toContain(
    'https://www.instagram.com/explore/locations/237183279/nero-cafe-bar-restaurant/',
  )
  expect(parsed.sameAs).toContain('https://www.facebook.com/NeroCafeBarRestaurant')
  expect(parsed.openingHoursSpecification[0].dayOfWeek).toContain('Sunday')
  expect(JSON.stringify(parsed)).not.toContain('nerocafe.gr')
})

test('social previews use the real refined Nero hero image', async ({ page }) => {
  await page.goto('/')

  const ogImage = page.locator('meta[property="og:image"]')
  const twitterImage = page.locator('meta[name="twitter:image"]')

  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
    'href',
    '/assets/refined/nero-day-lounge.webp',
  )
  await expect(ogImage).toHaveAttribute('content', '/assets/refined/nero-day-lounge.webp')
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    'Nero daytime lounge interior in Neo Irakleio',
  )
  await expect(twitterImage).toHaveAttribute('content', '/assets/refined/nero-day-lounge.webp')

  const socialImageContent = await page
    .locator('meta[property="og:image"], meta[name="twitter:image"]')
    .evaluateAll((metas) => metas.map((meta) => meta.getAttribute('content') ?? '').join(' '))

  expect(socialImageContent).not.toContain('/assets/generated/')
  expect(socialImageContent).not.toContain('nerocafe.gr')
})

test('favicon uses the supplied Nero store logo file', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.png')

  const response = await page.request.get('/favicon.png')
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('image/png')
})

test('language picker drives the free Google Translate widget without API keys', async ({ page }) => {
  let apiRequestCount = 0
  let widgetScriptCount = 0

  await page.route('https://translation.googleapis.com/**', async (route) => {
    apiRequestCount += 1
    await route.abort()
    return
  })

  await page.route('https://translate.google.com/translate_a/element.js?**', async (route) => {
    widgetScriptCount += 1
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.google = {
          translate: {
            TranslateElement: function(options, elementId) {
              window.__neroTranslateOptions = options;
              const mount = document.getElementById(elementId);
              const select = document.createElement('select');
              select.className = 'goog-te-combo';
              const original = document.createElement('option');
              original.value = '';
              select.appendChild(original);
              String(options.includedLanguages || '').split(',').filter(Boolean).forEach(function(code) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code;
                select.appendChild(option);
              });
              select.addEventListener('change', function() {
                document.body.dataset.googleTranslated = select.value || 'el';
                const kicker = document.querySelector('.language-kicker');
                if (kicker) {
                  kicker.textContent = select.value === 'en' ? 'Language' : 'Γλώσσα';
                }
              });
              mount.appendChild(select);
            }
          }
        };
        window.googleTranslateElementInit();
      `,
    })
  })

  await page.goto('/')

  await expect(page.locator('script[src*="translate.google.com/translate_a/element.js"]')).toHaveCount(0)

  const trigger = page.locator('.language-trigger')
  const picker = page.locator('.language-picker')
  await expect(trigger).toBeVisible()
  await expect(picker).not.toHaveClass(/notranslate/)
  await expect(picker).not.toHaveAttribute('translate', 'no')
  await trigger.click()

  const panel = page.locator('.language-panel')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.language-option')).toHaveCount(16)
  await expect(panel.locator('.language-code')).toHaveText([
    'GR',
    'EN',
    'DE',
    'FR',
    'IT',
    'ES',
    'RU',
    'ZH',
    'AR',
    'TR',
    'BG',
    'RO',
    'UA',
    'PL',
    'NL',
    'PT',
  ])

  await panel.locator('.language-option[data-language="en"]').click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('#google_translate_element .goog-te-combo')).toHaveValue('en')
  await expect(page.locator('body')).toHaveAttribute('data-google-translated', 'en')
  await expect(page.locator('.language-kicker')).toHaveText('Language')
  await expect(page.locator('.language-state-dot.is-ready').first()).toBeVisible()
  await expect(page.locator('.hero-actions .primary-link')).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect.poll(() => widgetScriptCount).toBe(1)
  await expect.poll(() => apiRequestCount).toBe(0)

  const reload = page.waitForEvent('load')
  await trigger.click()
  await page.locator('.language-option[data-language="el"]').click()
  await reload
  await expect(page.locator('html')).toHaveAttribute('lang', 'el')
  await expect(page.locator('.language-trigger')).toContainText('Γλώσσα')
  await expect(page.locator('script[src*="translate.google.com/translate_a/element.js"]')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('nero-language'))).toBe('el')
})

test('footer keeps verified contact actions visible', async ({ page }) => {
  await page.goto('/')
  await page.locator('.site-footer').scrollIntoViewIfNeeded()

  const footer = page.getByLabel('Nero contact footer')
  await expect(page.getByLabel('Nero contact footer')).toContainText('Cafe Bar Restaurant')
  await expect(page.locator('.site-footer address')).toContainText('Πευκών 1 & Μ. Μερκούρη')
  await expect(footer.getByRole('link', { name: 'Άνοιγμα διεύθυνσης Nero σε Google Maps' })).toHaveAttribute(
    'href',
    /google\.com\/maps/,
  )
  await expect(footer.getByRole('link', { name: 'Menu στο QuaR', exact: true })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(footer.getByRole('link', { name: 'Google Maps', exact: true })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Instagram' })).toBeVisible()
})

test('footer brand mark stays compact below the visit card', async ({ page }) => {
  await page.goto('/')
  await page.locator('.site-footer').scrollIntoViewIfNeeded()

  const footerMark = page.locator('.footer-mark')
  const footerLogo = footerMark.locator('img')
  const footerGrid = page.locator('.footer-grid')

  await expect(footerLogo).toBeVisible()

  const markBox = await footerMark.boundingBox()
  const logoBox = await footerLogo.boundingBox()
  const gridBox = await footerGrid.boundingBox()

  if (!markBox || !logoBox || !gridBox) throw new Error('Footer layout boxes were not available')

  expect(logoBox.width).toBeLessThanOrEqual(110)
  expect(markBox.height).toBeLessThanOrEqual(70)
  expect(markBox.y + markBox.height).toBeLessThanOrEqual(gridBox.y + 1)
})

test('visit section presents verified details before outbound actions', async ({ page }) => {
  await page.goto('/')
  await page.locator('#visit').scrollIntoViewIfNeeded()

  const details = page.getByLabel('Verified visit details')
  await expect(details).toContainText('Πευκών 1 & Μ. Μερκούρη')
  await expect(details).toContainText('Κυρ.-Πεμ. 09:00 - 01:00')
  await expect(details.getByRole('link', { name: /Άνοιγμα διεύθυνσης Nero σε Google Maps/ })).toHaveAttribute(
    'href',
    /google\.com\/maps/,
  )
  await expect(details.getByRole('link', { name: /Menu\s+QuaR \/ τωρινό menu/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )

  const oldLinks = await details
    .locator('a[href*="nerocafe"], a[href*="catalogue"]')
    .evaluateAll((links) => links.length)
  expect(oldLinks).toBe(0)
})

test('visit section copies the verified Nero address without leaving the page', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as Window & { __copiedNeroAddress?: string }).__copiedNeroAddress = text
        },
      },
    })
  })

  await page.goto('/')
  await page.locator('#visit').scrollIntoViewIfNeeded()

  const copyAddress = page.getByRole('button', { name: 'Αντιγραφή διεύθυνσης Nero' })
  await expect(copyAddress).toBeVisible()
  await copyAddress.click()
  await expect(copyAddress).toContainText('Αντιγράφηκε')

  const copiedAddress = await page.evaluate(
    () => (window as Window & { __copiedNeroAddress?: string }).__copiedNeroAddress ?? '',
  )
  expect(copiedAddress).toContain('1 &')
  expect(copiedAddress).toContain('14122')
})

test('service essentials rail keeps menu, phone, map, and hours close to the menu', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero service essentials').scrollIntoViewIfNeeded()

  const rail = page.getByLabel('Nero service essentials')
  await expect(rail.getByRole('link', { name: /Menu\s+QuaR/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(rail.getByRole('link', { name: /Τηλέφωνο\s+210 284 0002/ })).toHaveAttribute(
    'href',
    'tel:+302102840002',
  )
  await expect(rail.getByRole('link', { name: /Διεύθυνση/ })).toContainText('Πευκών 1')
  await expect(rail.getByText('Κυρ.-Πεμ.')).toBeVisible()
  await expect(rail.getByText('09:00 - 01:00')).toBeVisible()
})

test('arrival essentials are visible from the first viewport', async ({ page }) => {
  await page.goto('/')

  const strip = page.getByLabel('Nero arrival essentials')
  await expect(strip).toBeVisible()
  await expect(strip.getByRole('link', { name: /Menu\s+QuaR menu/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(strip.getByRole('link', { name: /Τηλέφωνο\s+210 284 0002/ })).toHaveAttribute(
    'href',
    'tel:+302102840002',
  )
  await expect(strip.getByRole('link', { name: /Χάρτης/ })).toHaveAttribute('href', /google\.com\/maps/)
  await expect(strip).toContainText('09:00 - 01:00')

  const top = await strip.evaluate((element) => element.getBoundingClientRect().top)
  const viewportHeight = await page.evaluate(() => window.innerHeight)
  expect(top).toBeLessThan(viewportHeight)
})

test('page route rail exposes the verified space menu and visit anchors', async ({ page }) => {
  await page.goto('/')

  const route = page.getByLabel('Nero page route')
  await route.scrollIntoViewIfNeeded()
  await expect(route).toBeVisible()
  await expect(route.locator('a[href="#space"]')).toBeVisible()
  await expect(route.locator('a[href="#menu"]')).toBeVisible()
  await expect(route.locator('a[href="#visit"]')).toBeVisible()

  await page.locator('#menu').evaluate((element) => {
    window.scrollTo({ top: (element as HTMLElement).offsetTop, behavior: 'instant' })
  })
  await expect(route.locator('a[href="#menu"]')).toHaveAttribute('aria-current', 'page')

  const unsafeLinks = await route.locator('a').evaluateAll((links) =>
    links
      .map((link) => (link as HTMLAnchorElement).href)
      .filter((href) => href.includes('nerocafe.gr') || href.includes('/catalogue')),
  )
  expect(unsafeLinks).toEqual([])
})

test('visit paths use verified Nero assets and actions', async ({ page }) => {
  await page.goto('/')
  const paths = page.getByLabel('Τρόποι επίσκεψης Nero')
  await paths.scrollIntoViewIfNeeded()

  await expect(paths).toBeVisible()
  await expect(paths.getByText('Τι κάνεις εδώ')).toBeVisible()
  await expect(paths.getByRole('link', { name: /Καφέδες/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(paths.getByRole('link', { name: /Φαγητό/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(paths.getByRole('link', { name: /Χάρτης/ })).toHaveAttribute('href', /google\.com\/maps/)

  const imageSources = await paths.locator('img').evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute('src')),
  )
  expect(imageSources).toEqual([
    '/assets/refined/nero-cappuccino.webp',
    '/assets/refined/nero-pasta.webp',
    '/assets/refined/nero-stone-terrace.webp',
  ])

  const unsafeResources = await paths.locator('a, img').evaluateAll((nodes) =>
    nodes
      .map((node) => {
        if (node instanceof HTMLAnchorElement) return node.href
        if (node instanceof HTMLImageElement) return node.currentSrc
        return ''
      })
      .filter((value) => value.includes('/assets/generated/') || value.includes('nerocafe.gr')),
  )
  expect(unsafeResources).toEqual([])
})

test('house dossier and space notes stay grounded in Nero facts', async ({ page }) => {
  await page.goto('/')

  const dossier = page.getByLabel('Βασικά στοιχεία Nero')
  await dossier.scrollIntoViewIfNeeded()
  await expect(dossier).toContainText('Τα βασικά')
  await expect(dossier).toContainText('Πευκών 1')
  await expect(dossier).toContainText('02:00')
  await expect(dossier.getByRole('link', { name: /Το menu στο QuaR/ })).toHaveAttribute(
    'href',
    'https://quar.gr/stores/n/nero#menu',
  )
  await expect(dossier.getByRole('link', { name: /Πευκών 1/ })).toHaveAttribute(
    'href',
    /google\.com\/maps/,
  )
  await expect(dossier.getByRole('link', { name: /Πιο αργά Παρασκευή και Σάββατο/ })).toHaveAttribute(
    'href',
    'tel:+302102840002',
  )

  const editorial = page.getByLabel('Σημειώσεις χώρου Nero')
  await editorial.scrollIntoViewIfNeeded()
  await expect(editorial).toContainText('Η αυλή φαίνεται από τον δρόμο')
  await expect(editorial).toContainText('Μέσα είναι πιο ήσυχα')
  await expect(editorial.getByRole('link', { name: /Άνοιγμα χάρτη/ })).toHaveAttribute('href', /google\.com\/maps/)
  await expect(editorial.getByRole('button', { name: 'Προβολή Nero interior lounge with copper lighting' })).toBeVisible()

  const imageSources = await editorial.locator('img').evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute('src')),
  )
  expect(imageSources).toEqual([
    '/assets/refined/nero-street-arrival.webp',
    '/assets/refined/nero-copper-lounge.webp',
  ])

  const unsafeResources = await page.locator('.house-dossier a, .editorial-proof a, .editorial-proof img').evaluateAll((nodes) =>
    nodes
      .map((node) => {
        if (node instanceof HTMLAnchorElement) return node.href
        if (node instanceof HTMLImageElement) return node.currentSrc
        return ''
      })
      .filter((value) => value.includes('/assets/generated/') || value.includes('nerocafe.gr')),
  )
  expect(unsafeResources).toEqual([])
})

test('menu route turns QuaR categories into practical daypart paths', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Menu Nero ανά ώρα').scrollIntoViewIfNeeded()

  const route = page.getByLabel('Menu Nero ανά ώρα')
  await expect(route).toContainText('Ανά ώρα')
  for (const label of ['Πρώτα ο καφές', 'Για το τραπέζι', 'Κουζίνα', 'Ποτό και κρασί']) {
    await expect(route).toContainText(label)
  }

  const routeHrefs = await route.locator('a').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
  )
  expect(routeHrefs).toEqual([
    'https://quar.gr/stores/n/nero#menu',
    'https://quar.gr/stores/n/nero#menu',
    'https://quar.gr/stores/n/nero#menu',
    'https://quar.gr/stores/n/nero#menu',
  ])

  const oldLinks = await route
    .locator('a[href*="nerocafe"], a[href*="catalogue"]')
    .evaluateAll((links) => links.length)
  expect(oldLinks).toBe(0)
})

test('menu facts keep examples tied to QuaR and visit details', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Στοιχεία menu Nero').scrollIntoViewIfNeeded()

  const ledger = page.getByLabel('Στοιχεία menu Nero')
  await expect(ledger).toContainText('QuaR')
  await expect(ledger).toContainText('Freddo')
  await expect(ledger).toContainText('COZA')

  const hrefs = await ledger.locator('a').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
  )
  expect(hrefs).toEqual(['https://quar.gr/stores/n/nero#menu', 'https://quar.gr/stores/n/nero#menu', '#visit'])

  const oldLinks = await ledger
    .locator('a[href*="nerocafe"], a[href*="catalogue"]')
    .evaluateAll((links) => links.length)
  expect(oldLinks).toBe(0)
})

test('arrival and visit details surface the verified today hours', async ({ page }) => {
  const weekendLate = [5, 6].includes(new Date().getDay())
  const expectedHours = weekendLate ? '09:00 - 02:00' : '09:00 - 01:00'
  const expectedRange = weekendLate ? 'Παρ.-Σαβ.' : 'Κυρ.-Πεμ.'

  await page.goto('/')

  const strip = page.getByLabel('Nero arrival essentials')
  await expect(strip).toContainText('Σήμερα')
  await expect(strip).toContainText(expectedHours)
  await expect(strip).toContainText(expectedRange)

  await page.locator('#visit').scrollIntoViewIfNeeded()
  const details = page.getByLabel('Verified visit details')
  await expect(details).toContainText('Σήμερα')
  await expect(details).toContainText(expectedHours)
  await expect(details).toContainText(expectedRange)
})

test('open-status cue is derived from the verified weekly hours', async ({ browser }) => {
  const cases = [
    { iso: '2026-06-17T12:00:00+03:00', value: 'Ανοιχτά τώρα', detail: 'Κλείνει 01:00' },
    { iso: '2026-06-17T03:00:00+03:00', value: 'Κλειστά τώρα', detail: 'Ανοίγει 09:00' },
  ]

  for (const item of cases) {
    const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5317' })
    await context.addInitScript((iso) => {
      const fixedTime = new Date(iso).getTime()
      const RealDate = Date

      class MockDate extends RealDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedTime)
            return
          }

          super(...args)
        }

        static now() {
          return fixedTime
        }
      }

      window.Date = MockDate as DateConstructor
    }, item.iso)

    const page = await context.newPage()
    await page.goto('/')

    const headerStatus = page.locator('.header-status')
    await expect(headerStatus).toHaveAttribute('data-open', item.value === 'Ανοιχτά τώρα' ? 'true' : 'false')
    await expect(headerStatus).toContainText(item.value)
    await expect(headerStatus).toContainText(item.detail)

    const strip = page.getByLabel('Nero arrival essentials')
    await expect(strip).toContainText(item.value)
    await expect(strip).toContainText(item.detail)

    await page.locator('#visit').scrollIntoViewIfNeeded()
    const details = page.getByLabel('Verified visit details')
    await expect(details).toContainText('Τώρα')
    await expect(details).toContainText(item.value)
    await expect(details).toContainText(item.detail)

    await context.close()
  }
})

test('service programme marks the current all-day path without inventing content', async ({ browser }) => {
  const cases = [
    { iso: '2026-06-17T10:15:00+03:00', action: 'Καφέδες', label: 'Τώρα', detail: 'Καφές' },
    { iso: '2026-06-17T15:30:00+03:00', action: 'Φαγητό', label: 'Τώρα', detail: 'Κουζίνα' },
    { iso: '2026-06-17T22:30:00+03:00', action: 'Ποτά', label: 'Τώρα', detail: 'Bar' },
    { iso: '2026-06-17T04:00:00+03:00', action: 'Καφέδες', label: 'Μετά', detail: '09:00' },
  ]

  for (const item of cases) {
    const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5317' })
    await context.addInitScript((iso) => {
      const fixedTime = new Date(iso).getTime()
      const RealDate = Date

      class MockDate extends RealDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedTime)
            return
          }

          super(...args)
        }

        static now() {
          return fixedTime
        }
      }

      window.Date = MockDate as DateConstructor
    }, item.iso)

    const page = await context.newPage()
    await page.goto('/')
    await page.getByLabel('Nero service programme').scrollIntoViewIfNeeded()

    const currentCards = page.locator('.rhythm-panel article[data-current="true"]')
    await expect(currentCards).toHaveCount(1)
    await expect(currentCards).toContainText(item.action)
    await expect(currentCards).toContainText(item.label)
    await expect(currentCards).toContainText(item.detail)

    await context.close()
  }
})

test('keyboard skip links expose menu and visit shortcuts on focus', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  const activeText = await page.evaluate(() => document.activeElement?.textContent)
  expect(activeText).toContain('Πήγαινε στο menu')

  const skipMenu = page.getByRole('link', { name: 'Πήγαινε στο menu' })
  await expect(skipMenu).toBeFocused()
  await expect(skipMenu).toBeVisible()
  await skipMenu.click()
  await expect(page.locator('#menu')).toBeInViewport()
})

test('keyboard focus gives header quick actions a visible focus ring', async ({ page }) => {
  await page.goto('/')

  for (let tabIndex = 0; tabIndex < 12; tabIndex += 1) {
    await page.keyboard.press('Tab')
    const activeLabel = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '')
    if (activeLabel === 'Άνοιγμα menu Nero') break
  }

  const activeLabel = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '')
  expect(activeLabel).toBe('Άνοιγμα menu Nero')

  const focusStyle = await page.evaluate(() => {
    const active = document.activeElement
    if (!(active instanceof HTMLElement)) return null
    const styles = getComputedStyle(active)

    return {
      boxShadow: styles.boxShadow,
      outlineColor: styles.outlineColor,
    }
  })

  expect(focusStyle?.outlineColor).toContain('200')
  expect(focusStyle?.boxShadow).not.toBe('none')
})

test('reduced motion keeps content visible without smooth reveal motion', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:5317',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')

  const hiddenRevealCount = await page.locator('[data-reveal]').evaluateAll((nodes) =>
    nodes.filter((node) => {
      const styles = getComputedStyle(node as HTMLElement)
      return styles.opacity === '0' || styles.visibility === 'hidden'
    }).length,
  )
  expect(hiddenRevealCount).toBe(0)

  const htmlClass = (await page.locator('html').getAttribute('class')) ?? ''
  expect(htmlClass).not.toContain('custom-cursor-ready')

  await context.close()
})

test('desktop primary navigation tracks the current section while scrolling', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium')

  await page.goto('/')

  const spaceLink = page.locator('.site-header nav a[href="#space"]')
  const menuLink = page.locator('.site-header nav a[href="#menu"]')
  const visitLink = page.locator('.site-header nav a[href="#visit"]')

  await page.locator('#space').scrollIntoViewIfNeeded()
  await expect(spaceLink).toHaveAttribute('aria-current', 'page')

  await page.locator('#menu').scrollIntoViewIfNeeded()
  await expect(menuLink).toHaveAttribute('aria-current', 'page')
  await expect(spaceLink).not.toHaveAttribute('aria-current', 'page')

  await page.locator('#visit').scrollIntoViewIfNeeded()
  await expect(visitLink).toHaveAttribute('aria-current', 'page')
  await expect(menuLink).not.toHaveAttribute('aria-current', 'page')
})

test('service programme turns dayparts into actionable QuaR menu paths', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero service programme').scrollIntoViewIfNeeded()

  const programme = page.getByLabel('Nero service programme')
  for (const time of ['09:00', 'All day', 'Βράδυ']) {
    const timeCue = programme.locator('.rhythm-top strong', { hasText: time })
    await timeCue.scrollIntoViewIfNeeded()
    await expect(timeCue).toBeVisible()
  }

  for (const name of ['Καφέδες', 'Φαγητό', 'Ποτά']) {
    const link = programme.getByRole('link', { name: new RegExp(name) })
    await link.scrollIntoViewIfNeeded()
    await expect(link).toHaveAttribute('href', 'https://quar.gr/stores/n/nero#menu')
  }
})

test('space selector and proof gallery use real refined Nero assets', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()

  const spaceSelector = page.getByLabel('Nero space selector')
  for (const src of [
    '/assets/refined/nero-stone-terrace.webp',
    '/assets/refined/nero-fireplace-lounge.webp',
    '/assets/refined/nero-day-lounge.webp',
  ]) {
    const image = spaceSelector.locator(`img[src="${src}"]`)
    await image.scrollIntoViewIfNeeded()
    await expect(image).toBeVisible()
  }

  await page.getByLabel('Φωτογραφίες Nero').scrollIntoViewIfNeeded()
  const proofGallery = page.getByLabel('Φωτογραφίες Nero')
  for (const caption of ['Κουζίνα', 'Καφές']) {
    const label = proofGallery.getByText(caption)
    await label.scrollIntoViewIfNeeded()
    await expect(label).toBeVisible()
  }

  const nonNeroImages = await page
    .locator('[aria-label="Nero space selector"] img, [aria-label="Φωτογραφίες Nero"] img')
    .evaluateAll((images) =>
      images
        .map((image) => (image as HTMLImageElement).currentSrc)
        .filter((src) => src.includes('/assets/generated/') || src.includes('nerocafe.gr')),
    )
  expect(nonNeroImages).toEqual([])
})

test('real Nero images can be previewed without leaving the page', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()

  await page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' }).click()

  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')
  await expect(dialog).toContainText('Πέτρα και αυλή')

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Προβολή Nero pasta dish' }).click()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-pasta.webp')
  await dialog.getByRole('button', { name: 'Κλείσιμο προβολής εικόνας' }).click()
  await expect(dialog).toBeHidden()
})

test('desktop hero image can be inspected as a real Nero gallery image', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium')

  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Προβολή εσωτερικού Nero ημέρα' })
  await expect(trigger).toBeVisible()
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-day-lounge.webp')
  await expect(dialog).toContainText('Ημέρα στο εσωτερικό του Nero')
  await expect(dialog).toContainText('06 / 09')
})

test('image preview navigates through the real Nero gallery', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()

  await page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' }).click()
  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })

  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')
  await dialog.getByRole('button', { name: 'Επόμενη φωτογραφία Nero' }).click()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-fireplace-lounge.webp')

  await page.keyboard.press('ArrowLeft')
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')
  await expect(dialog).toContainText('02 / 09')

  const espressoThumb = dialog.getByRole('button', { name: 'Δες φωτογραφία Nero 5: Nero espresso service' })
  await espressoThumb.click()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-espresso.webp')
  await expect(espressoThumb).toHaveAttribute('aria-current', 'true')
  await expect(dialog).toContainText('05 / 09')

  const thumbSources = await dialog.locator('.image-preview-thumbs img').evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute('src')),
  )
  expect(thumbSources).toHaveLength(9)
  expect(new Set(thumbSources).size).toBe(thumbSources.length)
})

test('mobile image preview supports swipe-style gallery navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')

  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' }).click()

  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  const image = dialog.locator('.image-preview-main')
  await expect(image).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')

  const box = await image.boundingBox()
  if (!box) throw new Error('Preview image box was not available')

  await image.dispatchEvent('pointerdown', {
    button: 0,
    clientX: box.x + box.width * 0.76,
    clientY: box.y + box.height * 0.5,
    pointerType: 'touch',
  })
  await image.dispatchEvent('pointerup', {
    button: 0,
    clientX: box.x + box.width * 0.24,
    clientY: box.y + box.height * 0.5,
    pointerType: 'touch',
  })
  await expect(image).toHaveAttribute('src', '/assets/refined/nero-fireplace-lounge.webp')

  await image.dispatchEvent('pointerdown', {
    button: 0,
    clientX: box.x + box.width * 0.24,
    clientY: box.y + box.height * 0.5,
    pointerType: 'touch',
  })
  await image.dispatchEvent('pointerup', {
    button: 0,
    clientX: box.x + box.width * 0.76,
    clientY: box.y + box.height * 0.5,
    pointerType: 'touch',
  })
  await expect(image).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')
})

test('mobile thumbnail filmstrip follows the active Nero image', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')

  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' }).click()

  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  const strip = dialog.locator('.image-preview-thumbs')

  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-stone-terrace.webp')
  await page.keyboard.press('ArrowLeft')
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-cappuccino.webp')
  await expect
    .poll(() => strip.evaluate((element) => Math.round((element as HTMLElement).scrollLeft)))
    .toBeLessThan(24)

  await page.keyboard.press('ArrowLeft')
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-copper-lounge.webp')
  await expect
    .poll(() => strip.evaluate((element) => Math.round((element as HTMLElement).scrollLeft)))
    .toBeGreaterThan(0)

  await dialog.getByRole('button', { name: 'Δες φωτογραφία Nero 1: Nero cappuccino served at the table' }).click()
  await expect(dialog.locator('.image-preview-main')).toHaveAttribute('src', '/assets/refined/nero-cappuccino.webp')
  await expect
    .poll(() => strip.evaluate((element) => Math.round((element as HTMLElement).scrollLeft)))
    .toBeLessThan(24)
})

test('image preview keeps keyboard focus inside the modal and restores it to the trigger', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()

  const trigger = page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  const closeButton = dialog.getByRole('button', { name: 'Κλείσιμο προβολής εικόνας' })

  await expect(dialog).toBeVisible()
  await expect(closeButton).toBeFocused()

  const previousButton = dialog.getByRole('button', { name: 'Προηγούμενη φωτογραφία Nero' })
  await page.keyboard.press('Tab')
  await expect(previousButton).toBeFocused()

  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('menu proof panel pairs real Nero images with QuaR-backed items', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Παραδείγματα menu Nero').scrollIntoViewIfNeeded()

  const menuProof = page.getByLabel('Παραδείγματα menu Nero')
  for (const name of ['Freddo Espresso', 'Club Sandwich NERO', 'Ραβιόλι', 'COZA NOSTRA']) {
    await expect(menuProof.getByRole('link', { name: new RegExp(name) })).toHaveAttribute(
      'href',
      'https://quar.gr/stores/n/nero#menu',
    )
  }

  const imageSources = await menuProof.locator('img').evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute('src')),
  )
  expect(imageSources).toEqual([
    '/assets/refined/nero-espresso.webp',
    '/assets/refined/nero-club.webp',
    '/assets/refined/nero-pasta.webp',
    '/assets/refined/nero-fireplace-lounge.webp',
  ])
})

test('external new-tab actions use noopener and noreferrer', async ({ page }) => {
  await page.goto('/')

  const incompleteRel = await page.locator('a[target="_blank"]').evaluateAll((links) =>
    links
      .map((link) => ({
        href: (link as HTMLAnchorElement).href,
        rel: (link as HTMLAnchorElement).rel.split(/\s+/).filter(Boolean),
      }))
      .filter((link) => !link.rel.includes('noopener') || !link.rel.includes('noreferrer'))
      .map((link) => link.href),
  )

  expect(incompleteRel).toEqual([])
})

test('persistent header exposes quick menu and map actions without losing desktop nav', async ({
  page,
}, testInfo) => {
  await page.goto('/')

  const quickActions = page.getByRole('group', { name: 'Nero quick actions' })
  const mobileMenu = page.getByRole('link', { name: 'Άνοιγμα menu Nero' })
  const mobileMap = page.getByRole('link', { name: 'Άνοιγμα Nero σε Google Maps' })

  await expect(quickActions).toBeVisible()
  await expect(mobileMenu).toBeVisible()
  await expect(mobileMenu).toHaveAttribute('href', 'https://quar.gr/stores/n/nero#menu')
  await expect(mobileMap).toBeVisible()
  await expect(mobileMap).toHaveAttribute('href', /google\.com\/maps/)
  await expect(page.getByRole('link', { name: 'Κλήση στο Nero' })).toBeVisible()

  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.header-status')).toBeHidden()
  } else {
    await expect(page.locator('.header-status')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Menu' })).toBeVisible()
  }
})

test('header progress line tracks long-page scroll position', async ({ page }) => {
  await page.goto('/')

  const initialProgress = await page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress') || '0'),
  )
  expect(initialProgress).toBeLessThan(0.05)

  await page.locator('#visit').scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress') || '0'),
      ),
    )
    .toBeGreaterThan(0.45)

  const headerProgressTransform = await page
    .locator('.site-header')
    .evaluate((element) => getComputedStyle(element, '::after').transform)
  expect(headerProgressTransform).not.toBe('none')
})

test('icon-only controls expose concise tooltips without adding visible copy', async ({ page }, testInfo) => {
  await page.goto('/')

  const headerMenu = page.getByRole('link', { name: 'Άνοιγμα menu Nero' })
  const headerMap = page.getByRole('link', { name: 'Άνοιγμα Nero σε Google Maps' })
  const headerCall = page.getByRole('link', { name: 'Κλήση στο Nero' })

  await expect(headerMenu).toHaveAttribute('data-tooltip', 'Menu')
  await expect(headerMenu).toHaveAttribute('title', 'Άνοιγμα menu Nero')
  await expect(headerMap).toHaveAttribute('data-tooltip', 'Χάρτης')
  await expect(headerCall).toHaveAttribute('data-tooltip', 'Κλήση')

  const previewTriggersWithoutTooltip = await page.locator('.image-preview-trigger').evaluateAll((triggers) =>
    triggers.filter((trigger) => !trigger.getAttribute('data-tooltip')).length,
  )
  expect(previewTriggersWithoutTooltip).toBe(0)

  if (testInfo.project.name !== 'mobile') {
    const menuTooltip = await headerMenu.evaluate((element) => getComputedStyle(element, '::after').content)
    expect(menuTooltip).toContain('Menu')
  }

  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()
  const previewTrigger = page.locator('.space-cards .image-preview-trigger[data-tooltip="Προβολή"]').first()
  await previewTrigger.scrollIntoViewIfNeeded()
  await previewTrigger.click()
  const dialog = page.getByRole('dialog', { name: 'Προβολή φωτογραφίας Nero' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Κλείσιμο προβολής εικόνας' })).toHaveAttribute('data-tooltip', 'Κλείσιμο')
  await expect(dialog.getByRole('button', { name: 'Προηγούμενη φωτογραφία Nero' })).toHaveAttribute('data-tooltip', 'Προηγούμενη')
  await expect(dialog.getByRole('button', { name: 'Επόμενη φωτογραφία Nero' })).toHaveAttribute('data-tooltip', 'Επόμενη')
})

test('compact 320px viewport keeps the header and hero free of horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Άνοιγμα menu Nero' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Άνοιγμα Nero σε Google Maps' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Κλήση στο Nero' })).toBeVisible()

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('real refined Nero assets load and hero has visual pixels', async ({ page }) => {
  await page.goto('/')
  const heroImage = page.locator('.hero-media')

  await expect(heroImage).toBeVisible()
  await expect(heroImage).toHaveAttribute('alt', 'Nero daytime lounge interior in Neo Irakleio')
  const loaded = await heroImage.evaluate((image) => {
    const img = image as HTMLImageElement
    return (
      img.complete &&
      img.naturalWidth > 1000 &&
      img.currentSrc.includes('/assets/refined/nero-day-lounge.webp')
    )
  })

  expect(loaded).toBe(true)
})

test('refined Nero images declare intrinsic dimensions to reduce layout shift', async ({ page }) => {
  await page.goto('/')

  const missingDimensions = await page.locator('img[src*="/assets/refined/"]').evaluateAll((images) =>
    images
      .map((image) => image as HTMLImageElement)
      .filter((image) => !image.getAttribute('width') || !image.getAttribute('height'))
      .map((image) => image.getAttribute('src')),
  )

  expect(missingDimensions).toEqual([])
})

test('no generated venue imagery is requested', async ({ page }) => {
  const requestedUrls: string[] = []
  page.on('request', (request) => requestedUrls.push(request.url()))

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  expect(requestedUrls.some((url) => url.includes('/assets/generated/'))).toBe(false)
  expect(requestedUrls.some((url) => url.includes('nerocafe.gr'))).toBe(false)
})

test('custom cursor activates only on desktop pointer', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium')

  await page.goto('/')
  await page.mouse.move(320, 320)
  await expect(page.locator('.custom-cursor')).toBeVisible()
})

test('custom cursor stays above image preview popups', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium')

  await page.goto('/')
  await page.getByLabel('Nero space selector').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Προβολή Nero stone courtyard tables' }).click()
  await page.mouse.move(900, 420)

  const layers = await page.evaluate(() => {
    const cursor = document.querySelector('.custom-cursor')
    const modal = document.querySelector('.image-preview-modal')
    if (!(cursor instanceof HTMLElement) || !(modal instanceof HTMLElement)) return null

    return {
      cursor: Number.parseInt(getComputedStyle(cursor).zIndex, 10),
      modal: Number.parseInt(getComputedStyle(modal).zIndex, 10),
      cursorOpacity: getComputedStyle(cursor).opacity,
    }
  })

  expect(layers).not.toBeNull()
  expect(layers?.cursor).toBeGreaterThan(layers?.modal ?? 0)
  expect(layers?.cursorOpacity).toBe('1')
})

