from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "http://127.0.0.1:5317"
OUT = Path("screenshots")


def wait_for_images(page, selector: str) -> None:
    page.evaluate(
        """
        async (selector) => {
          const images = [...document.querySelectorAll(selector)];
          await Promise.all(images.map(async (image) => {
            if (!(image instanceof HTMLImageElement)) return;
            if (!image.complete) {
              await new Promise((resolve) => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
              });
            }
            if (image.decode) {
              await image.decode().catch(() => undefined);
            }
          }));
        }
        """,
        selector,
    )


def capture(
    name: str,
    viewport: dict[str, int],
    full_page: bool = False,
    mobile: bool = False,
) -> dict:
    OUT.mkdir(exist_ok=True)
    errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            viewport=viewport,
            device_scale_factor=3 if mobile else 1,
            is_mobile=mobile,
            has_touch=mobile,
        )
        page.on("console", lambda msg: errors.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(URL, wait_until="networkidle")
        page.locator(".hero-media").wait_for(state="visible")
        wait_for_images(page, ".hero-media")
        page.screenshot(path=OUT / f"{name}.png", full_page=full_page)
        metrics = page.evaluate(
            """
            () => {
              const hero = document.querySelector('.hero-media');
              const arrival = document.querySelector('.arrival-strip');
              const headerStatus = document.querySelector('.header-status');
              const headerMenu = document.querySelector('.header-actions a[aria-label="Open Nero menu"]');
              const headerMap = document.querySelector('.header-actions a[aria-label="Open Nero in Google Maps"]');
              const heroMapStat = document.querySelector('.hero-stats a[href*="google.com/maps"]');
              const rect = hero.getBoundingClientRect();
              const arrivalRect = arrival.getBoundingClientRect();
              const headerStatusRect = headerStatus?.getBoundingClientRect();
              const headerMenuRect = headerMenu?.getBoundingClientRect();
              const headerMapRect = headerMap?.getBoundingClientRect();
              const heroMapStatRect = heroMapStat?.getBoundingClientRect();
              return {
                title: document.title,
                overflow: document.documentElement.scrollWidth - window.innerWidth,
                heroWidth: Math.round(rect.width),
                heroHeight: Math.round(rect.height),
                heroNaturalWidth: hero.naturalWidth,
                heroFilter: getComputedStyle(hero).filter,
                arrivalTop: Math.round(arrivalRect.top),
                arrivalPeekVisible: arrivalRect.top < window.innerHeight && arrivalRect.bottom > 0,
                headerStatusVisible: Boolean(
                  headerStatus &&
                    getComputedStyle(headerStatus).display !== 'none' &&
                    headerStatusRect &&
                    headerStatusRect.width > 0 &&
                    headerStatusRect.height > 0,
                ),
                headerMenuVisible: Boolean(
                  headerMenu &&
                    getComputedStyle(headerMenu).display !== 'none' &&
                    headerMenuRect &&
                    headerMenuRect.width > 0 &&
                    headerMenuRect.height > 0,
                ),
                headerMapVisible: Boolean(
                  headerMap &&
                    getComputedStyle(headerMap).display !== 'none' &&
                    headerMapRect &&
                    headerMapRect.width > 0 &&
                    headerMapRect.height > 0,
                ),
                tooltipMissing: [...document.querySelectorAll('.icon-action, .image-preview-trigger')]
                  .some((control) => !control.getAttribute('data-tooltip')),
                heroMapStatVisible: Boolean(
                  heroMapStat &&
                    getComputedStyle(heroMapStat).display !== 'none' &&
                    heroMapStatRect &&
                    heroMapStatRect.width > 0 &&
                    heroMapStatRect.height > 0,
                ),
                generatedAssets: [...performance.getEntriesByType('resource')]
                  .some((entry) => entry.name.includes('/assets/generated/')),
                oldNeroResources: [...performance.getEntriesByType('resource')]
                  .some((entry) => entry.name.includes('nerocafe.gr')),
                oldNeroLinks: [...document.querySelectorAll('a')]
                  .some((anchor) => anchor.href.includes('nerocafe.gr') || anchor.href.includes('/catalogue')),
              };
            }
            """
        )
        browser.close()

    return {"name": name, "metrics": metrics, "errors": errors}


def capture_section(name: str, selector: str, viewport: dict[str, int], mobile: bool = False) -> dict:
    OUT.mkdir(exist_ok=True)
    errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            viewport=viewport,
            device_scale_factor=3 if mobile else 1,
            is_mobile=mobile,
            has_touch=mobile,
        )
        page.on("console", lambda msg: errors.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(URL, wait_until="networkidle")
        page.evaluate(
            """
            (selector) => {
              const target = document.querySelector(selector);
              if (!target) return;
              const top = target.getBoundingClientRect().top + window.scrollY - 126;
              window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
            }
            """,
            selector,
        )
        page.wait_for_timeout(700)
        wait_for_images(page, f"{selector} img")
        page.screenshot(path=OUT / f"{name}.png", full_page=False)
        metrics = page.evaluate(
            """
            (selector) => {
              const target = document.querySelector(selector);
              const copyAddress = document.querySelector('#visit button[aria-label="Copy Nero address"]');
              const footerMapCard = document.querySelector('.site-footer a[aria-label="Open Nero footer address in Google Maps"]');
              const rect = target?.getBoundingClientRect();
              const copyAddressRect = copyAddress?.getBoundingClientRect();
              const footerMapCardRect = footerMapCard?.getBoundingClientRect();
              const images = [...(target?.querySelectorAll('img') ?? [])];
              const routeLinks = target?.matches('.page-route')
                ? [...target.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'))
                : null;
              const menuEvidenceLinks = target?.matches('.menu-evidence-strip')
                ? [...target.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'))
                : null;
              return {
              overflow: document.documentElement.scrollWidth - window.innerWidth,
              sectionMissing: !target,
              sectionHeight: rect ? Math.round(rect.height) : 0,
              imageCount: images.length,
              loadedImages: images.filter((image) => image.complete && image.naturalWidth > 0).length,
              routeLinks,
              menuEvidenceLinks,
              copyAddressVisible: Boolean(
                target &&
                  copyAddress &&
                  target.contains(copyAddress) &&
                  getComputedStyle(copyAddress).display !== 'none' &&
                  copyAddressRect &&
                  copyAddressRect.width > 0 &&
                  copyAddressRect.height > 0,
              ),
              footerMapCardVisible: Boolean(
                target &&
                  footerMapCard &&
                  target.contains(footerMapCard) &&
                  getComputedStyle(footerMapCard).display !== 'none' &&
                  footerMapCardRect &&
                  footerMapCardRect.width > 0 &&
                  footerMapCardRect.height > 0,
              ),
              generatedAssets: [...performance.getEntriesByType('resource')]
                .some((entry) => entry.name.includes('/assets/generated/')),
              oldNeroResources: [...performance.getEntriesByType('resource')]
                .some((entry) => entry.name.includes('nerocafe.gr')),
              oldNeroLinks: [...document.querySelectorAll('a')]
                .some((anchor) => anchor.href.includes('nerocafe.gr') || anchor.href.includes('/catalogue')),
              };
            }
            """,
            selector,
        )
        browser.close()

    return {"name": name, "metrics": metrics, "errors": errors}


def capture_preview(name: str, button_label: str, viewport: dict[str, int], mobile: bool = False) -> dict:
    OUT.mkdir(exist_ok=True)
    errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            viewport=viewport,
            device_scale_factor=3 if mobile else 1,
            is_mobile=mobile,
            has_touch=mobile,
        )
        page.on("console", lambda msg: errors.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(URL, wait_until="networkidle")
        button = page.locator(f'button[aria-label="{button_label}"]')
        button.scroll_into_view_if_needed()
        button.click()
        page.get_by_role("dialog", name="Nero image preview").wait_for(state="visible")
        wait_for_images(page, ".image-preview-main")
        page.screenshot(path=OUT / f"{name}.png", full_page=False)
        metrics = page.evaluate(
            """
            () => ({
              overflow: document.documentElement.scrollWidth - window.innerWidth,
              modalVisible: Boolean(document.querySelector('.image-preview-modal')),
              modalImageSrc: document.querySelector('.image-preview-main')?.getAttribute('src') ?? '',
              tooltipMissing: [...document.querySelectorAll('.image-preview-close, .image-preview-controls button')]
                .some((control) => !control.getAttribute('data-tooltip')),
              generatedAssets: [...performance.getEntriesByType('resource')]
                .some((entry) => entry.name.includes('/assets/generated/')),
              oldNeroResources: [...performance.getEntriesByType('resource')]
                .some((entry) => entry.name.includes('nerocafe.gr')),
              oldNeroLinks: [...document.querySelectorAll('a')]
                .some((anchor) => anchor.href.includes('nerocafe.gr') || anchor.href.includes('/catalogue')),
            })
            """
        )
        browser.close()

    return {"name": name, "metrics": metrics, "errors": errors}


if __name__ == "__main__":
    results = [
        capture("nero-desktop", {"width": 1440, "height": 920}),
        capture("nero-tablet", {"width": 920, "height": 900}),
        capture("nero-mobile", {"width": 390, "height": 844}, mobile=True),
        capture("nero-mobile-compact", {"width": 320, "height": 740}, mobile=True),
        capture_section("nero-arrival-desktop", ".arrival-strip", {"width": 1440, "height": 920}),
        capture_section("nero-arrival-mobile", ".arrival-strip", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-route-desktop", ".page-route", {"width": 1440, "height": 920}),
        capture_section("nero-route-mobile", ".page-route", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-dossier-desktop", ".house-dossier", {"width": 1440, "height": 920}),
        capture_section("nero-dossier-mobile", ".house-dossier", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-editorial-proof-desktop", ".editorial-proof", {"width": 1440, "height": 920}),
        capture_section("nero-editorial-proof-mobile", ".editorial-proof", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-paths-desktop", ".house-index", {"width": 1440, "height": 920}),
        capture_section("nero-paths-mobile", ".house-index", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-programme-desktop", ".rhythm-panel", {"width": 1440, "height": 920}),
        capture_section("nero-programme-mobile", ".rhythm-panel", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-menu-desktop", "#menu", {"width": 1440, "height": 920}),
        capture_section("nero-menu-mobile", "#menu", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-menu-evidence-desktop", ".menu-evidence-strip", {"width": 1440, "height": 920}),
        capture_section("nero-menu-evidence-mobile", ".menu-evidence-strip", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-menu-route-desktop", ".menu-route-board", {"width": 1440, "height": 920}),
        capture_section("nero-menu-route-mobile", ".menu-route-board", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-menu-proof-desktop", ".menu-proof-panel", {"width": 1440, "height": 920}),
        capture_section("nero-menu-proof-mobile", ".menu-proof-panel", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-service-desktop", ".service-rail", {"width": 1440, "height": 920}),
        capture_section("nero-service-mobile", ".service-rail", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-space-desktop", ".space-cards", {"width": 1440, "height": 920}),
        capture_section("nero-space-mobile", ".space-cards", {"width": 390, "height": 844}, mobile=True),
        capture_preview(
            "nero-image-preview-desktop",
            "Preview Nero stone courtyard tables",
            {"width": 1440, "height": 920},
        ),
        capture_preview(
            "nero-hero-preview-desktop",
            "Preview Nero daytime lounge interior",
            {"width": 1440, "height": 920},
        ),
        capture_preview(
            "nero-editorial-preview-desktop",
            "Preview Nero interior lounge with copper lighting",
            {"width": 1440, "height": 920},
        ),
        capture_preview(
            "nero-image-preview-mobile",
            "Preview Nero stone courtyard tables",
            {"width": 390, "height": 844},
            mobile=True,
        ),
        capture_section("nero-visit-desktop", "#visit", {"width": 1440, "height": 920}),
        capture_section("nero-visit-mobile", "#visit", {"width": 390, "height": 844}, mobile=True),
        capture_section("nero-footer-mobile", ".site-footer", {"width": 390, "height": 844}, mobile=True),
    ]

    for result in results:
        print(result["name"], result["metrics"], "errors=", result["errors"])

    failures: list[str] = []
    for result in results:
        metrics = result["metrics"]
        if result["errors"]:
            failures.append(f"{result['name']}: browser errors {result['errors']}")
        if metrics["overflow"] > 1:
            failures.append(f"{result['name']}: horizontal overflow {metrics['overflow']}")
        if metrics.get("sectionMissing"):
            failures.append(f"{result['name']}: section selector was not found")
        if metrics.get("imageCount", 0) and metrics.get("loadedImages") != metrics.get("imageCount"):
            failures.append(
                f"{result['name']}: only {metrics.get('loadedImages')} of {metrics.get('imageCount')} images loaded"
            )
        if result["name"].startswith("nero-visit") and not metrics.get("copyAddressVisible"):
            failures.append(f"{result['name']}: copy address action is not visible")
        if result["name"].startswith("nero-footer") and not metrics.get("footerMapCardVisible"):
            failures.append(f"{result['name']}: footer map card is not visible")
        if result["name"].startswith("nero-route") and metrics.get("routeLinks") != ["#space", "#menu", "#visit"]:
            failures.append(f"{result['name']}: page route anchors changed ({metrics.get('routeLinks')})")
        if result["name"].startswith("nero-menu-evidence") and metrics.get("menuEvidenceLinks") != [
            "https://quar.gr/stores/n/nero#menu",
            "https://quar.gr/stores/n/nero#menu",
            "#visit",
        ]:
            failures.append(f"{result['name']}: menu evidence anchors changed ({metrics.get('menuEvidenceLinks')})")
        if metrics["generatedAssets"]:
            failures.append(f"{result['name']}: generated assets requested")
        if metrics["oldNeroResources"] or metrics["oldNeroLinks"]:
            failures.append(f"{result['name']}: old Nero resource/link detected")
        if metrics.get("tooltipMissing"):
            failures.append(f"{result['name']}: icon-only control is missing tooltip metadata")
        if "image-preview" in result["name"] and not metrics.get("modalVisible"):
            failures.append(f"{result['name']}: image preview modal did not open")
        if "image-preview" in result["name"] and not metrics.get("modalImageSrc", "").startswith("/assets/refined/"):
            failures.append(f"{result['name']}: image preview is not a refined Nero asset")

    hero_results = [result for result in results if result["name"] in {"nero-desktop", "nero-tablet", "nero-mobile", "nero-mobile-compact"}]
    mobile_hero_results = [result for result in hero_results if result["name"] in {"nero-mobile", "nero-mobile-compact"}]

    for result in hero_results:
        if not result["metrics"].get("arrivalPeekVisible"):
            failures.append(f"{result['name']}: arrival strip is not visible in first viewport")
        hero_filter = result["metrics"].get("heroFilter", "")
        if "brightness(0." in hero_filter:
            failures.append(f"{result['name']}: hero photo treatment is too dark ({hero_filter})")
        if not result["metrics"].get("heroMapStatVisible"):
            failures.append(f"{result['name']}: hero map fact is not visible")
        if not result["metrics"].get("headerMenuVisible"):
            failures.append(f"{result['name']}: header menu quick action is not visible")
        if not result["metrics"].get("headerMapVisible"):
            failures.append(f"{result['name']}: header map quick action is not visible")

    if not results[0]["metrics"].get("headerStatusVisible"):
        failures.append("nero-desktop: header status is not visible")

    if not results[1]["metrics"].get("headerStatusVisible"):
        failures.append("nero-tablet: header status is not visible")

    for result in mobile_hero_results:
        if result["metrics"].get("headerStatusVisible"):
            failures.append(f"{result['name']}: header status should stay hidden on mobile")

    if failures:
        raise SystemExit("\n".join(failures))
