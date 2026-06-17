# Premium Hospitality Pattern Notes

## Sources Reviewed

- Framer restaurant design examples, 2026: mobile-first, strong photography, native menu flow, visible booking/menu actions.
- Site Builder Report bar website examples, 2026: atmosphere-matching design, high-quality imagery, simple navigation, menu, contact, map, hours.
- The Wolseley Piccadilly official site: restrained landmark positioning, daypart dining paths, visible menus and booking/contact actions.
- sketch London official site: room/service segmentation, immediate menu/reservation paths, gallery-led atmosphere without over-explaining.
- Dalloway Terrace official site: image-first terrace identity, persistent menu/reservation paths, and hours/contact details close to decision points.
- Balthazar NYC official site: direct venue facts, reservations, menus and location hierarchy with very little decorative copy.
- Athenee Athens official site: premium cafe/restaurant tone with concise hours, contact, social and place-first imagery.
- Scorpios Mykonos official site: space/programme selection as the primary hospitality navigation pattern.
- Dante NYC: short homepage sections with clear paths to reservations, menus, celebrate/shop.
- Bar 1806: old-world elegance, story-led menu blocks, multiple venue/experience sections.
- Scorpios: space selector, restrained nav, reserve CTA, large image-led hospitality ecosystem.
- QuaR Nero API: current Nero store data, address, declared Myriad Pro font, and live menu categories/products.
- 2026 pattern refresh: Awwwards hospitality/food collections, Site Builder Report restaurant examples, and current restaurant website guides all reinforce immersive real photography plus persistent menu/location/contact access.

Source URLs checked in this pass:

- https://www.thewolseleypiccadilly.com/
- https://sketch.london/
- https://dallowayterrace.com/
- https://www.doylecollection.com/hotels/the-bloomsbury-hotel/dining/dalloway-terrace
- https://www.dante-nyc.com/
- https://www.framer.com/blog/restaurant-website-design-examples/
- https://www.sitebuilderreport.com/inspiration/bar-websites
- https://www.posusa.com/examples-of-best-restaurant-website-design/
- https://scorpios.com/
- https://www.atheneeathens.gr/en/
- https://www.dante-nyc.com/location/dante-nyc/
- https://sketch.london/

## 2026 Premium Pattern Pass

Additional pass requested on 2026-06-17, focused on premium cafe/bar/restaurant
sites rather than generic landing-page examples.

Observed patterns worth transferring:

- Decision-first hospitality paths: premium venues tend to offer three or four
  immediate routes such as menus, reservations, spaces or visit details before
  the visitor reaches dense content.
- Real image-led cards: repeated options work best when each option is anchored
  in actual venue/product photography, with very short copy and a clear action.
- Daypart and space segmentation: high-class all-day venues often sell the
  rhythm of the day and the rooms/terraces as navigational structure, not as
  long descriptive prose.
- Concierge-level practical details: hours, location, phone and menu links
  should stay close to decision points instead of being buried in a final
  contact page.
- Mobile gallery polish: image previews should feel touch-native with swipe or
  equivalent next/previous behavior, while still keeping keyboard controls.

Nero-safe applications from this pass:

- Added a `Nero visit paths` layer with three verified actions: Espresso menu,
  Kitchen menu and Open map.
- Used only existing refined Nero assets in that layer: cappuccino, pasta and
  stone terrace.
- Kept the copy grounded in QuaR-backed menu/service facts and verified address
  context.
- Added swipe-style pointer navigation to the real Nero image preview, without
  changing the curated image set or adding generated imagery.

## 2026 High-Class Venue Pattern Refresh

Research pass on 2026-06-17, requested after the design direction was already
working, focused on premium hospitality venues and current restaurant/bar design
roundups.

Sources reviewed:

- sketch London: room-by-room services, times, menu links and booking paths are
  exposed together instead of hiding the practical choice behind story pages.
- Dante NYC: reservations, hours/location, menus and daypart menus are treated
  as primary navigation for a historic cafe/bar identity.
- Scorpios Mykonos: space selection is a top-level hospitality pattern, with
  restaurant, terrace, beach and private event paths presented as venue choices.
- Athenee Athens: premium Greek restaurant/bar presentation keeps hours,
  address, phone and social contact close to the brand identity.
- Site Builder Report bar examples, POSUSA restaurant examples and Framer
  restaurant examples: 2026 guidance repeatedly points to mobile-first access
  to menu, hours, location, contact/reservation and authentic venue or food
  photography.

Transferable patterns chosen for Nero:

- Make verified venue facts actionable where the visitor first notices them.
- Keep maps, menu, call and hours available without introducing a reservation
  claim or any unverified service path.
- Treat address and current status as concierge information, not passive footer
  metadata.
- Preserve the restrained Myriad Pro typography and real Nero photo system while
  adding only low-friction interaction improvements.
- Keep icon-only controls visually quiet, but name them on hover/focus so the
  interface stays polished instead of cryptic.
- Keep keyboard focus as intentional as hover states: a premium surface should
  feel navigable without relying on a pointer.

Nero-safe applications from this refresh:

- The hero address fact now opens Google Maps directly, turning the first-view
  facts into a decision path without adding a new CTA cluster.
- The visit details address row now opens Google Maps and labels that action
  explicitly.
- The footer address block now also opens Google Maps, keeping the final
  verified contact surface as actionable as the visit panel.
- The desktop header now keeps the verified QuaR menu, Google Maps, current
  status and call actions visible together, matching premium venue sites where
  practical decisions remain persistent.
- Header, arrival and visit open/closed cues now use polite live regions, and
  the copy-address button announces its copied state.
- Header quick icons, image preview buttons and gallery controls now carry
  restrained hover/focus tooltips, keeping the premium minimal chrome while
  clarifying unfamiliar symbols.
- Keyboard focus now uses the same restrained gold edge and glow as pointer
  affordances on quick actions, gallery controls and footer links.
- Visual QA now checks that the hero map fact remains visible on desktop,
  standard mobile and compact mobile hero captures.

## 2026 Grand Cafe / Luxury Cafe Research Pass

Additional research pass on 2026-06-17 after the user asked for deeper study of
similar premium, high-class venues. The pass focused on transferable patterns
only; no external venue content, claims or imagery should enter the Nero page.

Official sources reviewed in this pass:

- https://www.santambroeus.com/
- https://www.ralphscoffee.com/
- https://www.cafekitsune.com/
- https://www.thewolseley.com/
- https://dallowayterrace.com/
- https://sketch.london/
- https://www.lpmrestaurants.com/
- https://www.zumarestaurant.com/
- https://www.laduree.com/
- https://www.angelina-paris.fr/

Patterns observed:

- Premium cafe/restaurant sites compress practical decisions into a concise
  venue card: menu, location, hours, contact or reservation.
- Luxury cafe brands use daypart logic heavily: morning coffee, table food,
  afternoon or all-day menu, evening bar/service.
- High-class venue sites lean on real, inspectable photography and use short
  editorial captions instead of long descriptive blocks.
- Menus often feel curated by service moment instead of being shown as a raw
  catalogue dump.
- Location/arrival is treated as part of the experience, not merely footer
  metadata.

Nero-safe applications from this pass:

- Added a `Nero house card` dossier using only verified Nero actions: QuaR menu,
  programme/menu anchor, Google Maps and phone.
- Added a real-image arrival/lounge editorial layer using deterministic refined
  Nero official photos: `nero-street-arrival.webp` and `nero-copper-lounge.webp`.
- Added a curated menu route board that turns QuaR-backed categories and known
  menu items into four daypart paths: Coffee, Brunch, Kitchen and Bar.
- Kept all new practical links on QuaR, Google Maps or telephone only.
- Added tests and visual QA captures for the new dossier, editorial proof and
  menu route sections.
- Reduced-motion visitors now keep the same content immediately visible without
  smooth-scroll/parallax setup, preserving the premium interface without
  forcing motion.

## Patterns Applied To Nero

- Space-first hero with only the necessary actions: menu, map, phone.
- Fine-line editorial grid instead of decorative card clutter.
- Menu preview is not generic; it uses live QuaR categories and representative items.
- Day-to-night rhythm section mirrors premium venue sites that sell the visit as an experience, not just a menu.
- Service essentials rail after the menu preview keeps QuaR menu, phone, address and hours close to the point where visitors decide what to do next.
- Mobile header quick actions keep menu, map and phone available after the desktop navigation collapses, without adding a bottom overlay over the venue photography.
- Header controls expose named primary navigation and quick-action groups so the restrained visual UI stays clear to assistive technology.
- Social preview metadata uses the refined real Nero hero photo so shared links carry the venue atmosphere without generated or old-site assets.
- Refined local images declare intrinsic dimensions to keep the image-led layout stable as photos load.
- The day-rhythm cards now behave like a premium service programme: each daypart has a time cue, icon and QuaR menu path instead of only passive copy.
- The day-rhythm cards now mark the current or next service path from the verified hours, so the all-day experience points visitors toward coffee, kitchen or bar without inventing availability claims.
- The former text-only space cards now act as a real Nero space selector using approved Nero terrace/lounge photos.
- The proof gallery now uses short editorial captions, keeping the imagery inspectable while adding the kind of quiet indexing common on high-end venue sites.
- External new-tab actions use `noopener noreferrer`, keeping the action layer polished and technically safe.
- Keyboard-only visitors get focus-revealed skip paths to the menu and visit sections, preserving the visual restraint while improving real usability.
- The footer now exposes the verified address with semantic `address` markup, matching the direct contact clarity common on premium venue sites.
- Visual QA now includes a 320px mobile capture so the refined header/action system is protected on compact phones, not only standard mobile widths.
- The visit close-out now includes a restrained verified-details table for address, hours and current QuaR menu before the outbound actions, echoing premium venue sites that reduce decision friction at the end of the page.
- Desktop navigation now uses subtle active-section state with `aria-current`, giving orientation without adding visible instructional copy or extra UI chrome.
- The hero now gives an immediate hint of the next section and hands off into an arrival essentials strip, mirroring premium hospitality sites that keep menu, contact, map and hours within reach before visitors scroll deeply.
- The menu section now includes a real-image menu proof panel, pairing QuaR-backed Nero items with refined Nero assets so the catalogue feels inspectable instead of abstract.
- Real Nero imagery now opens in an in-page preview modal, giving the venue and food photography the inspectable gallery behavior common on premium hospitality sites without adding stock or generated venue content.
- The image preview now traps keyboard focus on its close control and returns focus to the original image trigger, keeping the gallery polished for keyboard visitors as well as pointer users.
- The image preview now behaves as a curated venue gallery with previous/next controls, arrow-key navigation and a restrained counter, using only the existing refined Nero photography.
- The image preview now includes a restrained thumbnail filmstrip, keeping the visitor inside the real Nero photo set while making the gallery feel curated rather than incidental.
- The thumbnail filmstrip now follows the active image on mobile and keyboard navigation, keeping the current Nero image visible inside the compact gallery controls.
- The preview gallery now deduplicates repeated photo sources, so the counter and thumbnails represent a tighter curated Nero set while section-specific captions still open from their original context.
- The arrival and visit areas now surface the derived today-hours range from the verified weekly schedule, reducing decision friction while keeping the full hours visible elsewhere.
- The arrival and visit areas now add a derived `Now` status from the verified weekly schedule, mirroring premium restaurant sites that answer "can I go now?" before sending visitors to map, call or menu actions.
- The new visit-path layer borrows the premium decision-first pattern: coffee, kitchen and visit actions are visible as real-image choices before the visitor reaches denser sections.
- The preview gallery now supports swipe-style pointer navigation on mobile-sized flows, matching the tactile feel common in premium image-led hospitality sites.
- The desktop header now carries a restrained open/closed cue derived from the verified schedule, keeping "can I go now?" visible without crowding the mobile action header.
- The hero now uses the brighter real Nero daytime lounge asset for the first viewport and social preview, preserving the premium dark overlay while making the venue itself visible immediately.
- The desktop hero image can now be opened directly in the curated real-image preview, making the first venue photo inspectable without adding another CTA row.
- The visit close-out now includes a copy-address action for the verified address, reducing friction without adding a map embed or any unverified venue data.
- Structured data now includes only verified social `sameAs` profiles, improving venue identity clarity without linking to the old Nero site.
- The hero and visit address facts are now Google Maps actions, applying the
  premium hospitality pattern of making hours/location/contact immediately
  actionable.
- The footer verified address is now an actionable map card too, so the final
  contact layer does not regress into passive metadata.
- Current-status and copy-address state changes now announce politely to
  assistive technology, preserving the restrained visual UI while improving
  the real decision flow.
- Header quick actions are now persistent across desktop and mobile: direct
  QuaR menu, Google Maps and call stay close to the status cue without adding
  unverified reservation or booking claims.
- Icon-only controls now expose concise tooltip metadata and CSS hover/focus
  labels, so the visual language stays minimal without hiding meaning.
- Focus-visible states now match the interface's gold-line language on key
  interactive surfaces, preserving accessibility without adding visual noise.
- The house-card dossier borrows premium venue decision compression while
  staying grounded in Nero's verified menu, address, hours and phone paths.
- The new arrival/lounge editorial layer uses only real refined Nero photos,
  giving location and interior atmosphere the same inspectable weight as the
  menu imagery.
- The menu route board now presents the QuaR-backed catalogue as four service
  moments, matching luxury cafe daypart navigation without inventing a booking
  or event layer.
- Reduced-motion preference is now handled explicitly in JS, so reveal content
  does not depend on scroll animation.
- Screenshot-led mobile tuning now keeps the house-card, menu-route and visit
  sections more decision-focused on small screens, especially the practical
  address block.
- The fixed header now carries a very thin scroll-progress line, giving the
  long editorial page orientation without adding another visible navigation
  widget or unverified content.
- A slim post-arrival route rail now exposes only the three verified page paths:
  space, QuaR-backed menu and visit details. This borrows the premium hospitality
  "concierge index" pattern without adding reservations, claims or old-site links.
- The menu area now starts with a compact source ledger: QuaR menu, verified
  Nero examples and the existing visit anchor. This applies the premium
  "proof before promise" pattern while avoiding invented dishes or claims.
- Typography stays Myriad Pro first, with restrained weight shifts and no unrelated display fonts.
- No live link or network dependency points to the old Nero website.

## Pattern Boundaries

- Do not copy another venue's imagery, wording, layout, or brand signature.
- Do not invent Nero products, events, awards, chef stories, or claims.
- Product/menu examples should come from QuaR or be removed.
- Venue imagery must remain real Nero imagery or be replaced by real Nero imagery from an approved source.
