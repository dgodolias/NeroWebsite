export const supportedLanguages = [
  { code: 'el', displayCode: 'GR', label: 'Ελληνικά' },
  { code: 'en', displayCode: 'EN', label: 'English' },
  { code: 'de', displayCode: 'DE', label: 'Deutsch' },
  { code: 'fr', displayCode: 'FR', label: 'Français' },
  { code: 'it', displayCode: 'IT', label: 'Italiano' },
  { code: 'es', displayCode: 'ES', label: 'Español' },
  { code: 'ru', displayCode: 'RU', label: 'Русский' },
  { code: 'zh-CN', displayCode: 'ZH', label: '中文' },
  { code: 'ar', displayCode: 'AR', label: 'العربية' },
  { code: 'tr', displayCode: 'TR', label: 'Türkçe' },
  { code: 'bg', displayCode: 'BG', label: 'Български' },
  { code: 'ro', displayCode: 'RO', label: 'Română' },
  { code: 'uk', displayCode: 'UA', label: 'Українська' },
  { code: 'pl', displayCode: 'PL', label: 'Polski' },
  { code: 'nl', displayCode: 'NL', label: 'Nederlands' },
  { code: 'pt', displayCode: 'PT', label: 'Português' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

export type TranslationState = 'idle' | 'loading' | 'ready' | 'error'

export const greekContent = {
  language: {
    label: 'Γλώσσα',
    aria: 'Αλλαγή γλώσσας Nero',
    original: 'Ελληνικό πρωτότυπο',
    loading: 'Google Translate φορτώνει',
    ready: 'Google Translate widget ενεργό',
    error: 'Η μετάφραση δεν είναι διαθέσιμη αυτή τη στιγμή.',
  },
  skip: {
    menu: 'Πήγαινε στο menu',
    visit: 'Πήγαινε στο visit',
  },
  nav: {
    space: 'ΧΩΡΟΣ',
    menu: 'ΜΕΝΟΥ',
    visit: 'ΕΠΙΣΚΕΨΗ',
  },
  quickActions: {
    menu: 'Άνοιγμα menu Nero',
    maps: 'Άνοιγμα Nero σε Google Maps',
    call: 'Κλήση στο Nero',
    menuTip: 'Menu',
    mapsTip: 'Χάρτης',
    callTip: 'Κλήση',
  },
  venue: {
    descriptor: 'Cafe Bar Restaurant',
    area: 'Νέο Ηράκλειο',
    address: 'Πευκών 1 & Μ. Μερκούρη, Νέο Ηράκλειο 14122',
    hours: 'Κυρ.-Πεμ. 09:00 - 01:00 / Παρ.-Σαβ. 09:00 - 02:00',
  },
  todayHours: {
    weekdayNote: 'Κυρ.-Πεμ.',
    weekendNote: 'Παρ.-Σαβ.',
  },
  status: {
    openNow: 'Ανοιχτά τώρα',
    closedNow: 'Κλειστά τώρα',
    now: 'Τώρα',
    next: 'Μετά',
    closes: 'Κλείνει',
    opens: 'Ανοίγει',
    coffee: 'Καφές',
    kitchen: 'Κουζίνα',
    bar: 'Bar',
  },
  hero: {
    eyebrowPrefix: 'Cafe Bar Restaurant',
    heroAlt: 'Nero daytime lounge interior in Neo Irakleio',
    previewTitle: 'Χώρος',
    previewDetail: 'Ημέρα στο εσωτερικό του Nero',
    previewAria: 'Προβολή εσωτερικού Nero ημέρα',
    copy:
      'Στην Πευκών, το Nero είναι για καφέ από το πρωί, φαγητό μέσα στη μέρα και ποτό το βράδυ.',
    menuAction: 'Δες το menu',
    mapAction: 'Χάρτης',
    stats: [
      { value: '09:00', label: 'Πρώτος καφές' },
      { value: '02:00', label: 'Παρασκευή / Σάββατο' },
      { value: 'Πευκών 1', label: 'Νέο Ηράκλειο' },
    ],
  },
  arrival: {
    essentials: [
      { label: 'Menu', value: 'QuaR menu' },
      { label: 'Τηλέφωνο', value: '210 284 0002' },
      { label: 'Χάρτης', value: 'Πευκών 1 & Μ. Μερκούρη, Νέο Ηράκλειο 14122' },
      { label: 'Σήμερα' },
    ],
  },
  pageRoutes: [
    { label: 'Χώρος', detail: 'Αυλή / lounge' },
    { label: 'Menu', detail: 'QuaR κατάλογος' },
    { label: 'Επίσκεψη', detail: 'Χάρτης / τηλέφωνο' },
  ],
  intro: {
    eyebrow: 'Nero / Νέο Ηράκλειο',
    title: 'Περνάς για καφέ. Μένεις και για φαγητό.',
    body:
      'Το πρωί πας για espresso και freddo, μέσα στη μέρα τρως κάτι από την κουζίνα, το βράδυ κάθεσαι για ποτό.',
  },
  houseDossierIntro: {
    eyebrow: 'Τα βασικά',
    title: 'Όσα θες πριν ξεκινήσεις.',
    body:
      'Menu, τηλέφωνο, χάρτης και σημερινό ωράριο είναι εδώ για να μη γυρνάς από σελίδα σε σελίδα.',
  },
  houseDossier: [
    {
      label: 'Menu',
      value: 'QuaR',
      title: 'Το menu στο QuaR',
      body: 'Ο τωρινός κατάλογος ανοίγει σε νέα καρτέλα. Καφές, brunch, πιάτα κουζίνας και ποτό είναι όλα εκεί.',
      action: 'Δες το menu',
    },
    {
      label: 'Σήμερα',
      value: '09:00',
      title: 'Από τις 09:00',
      body: 'Για espresso, freddo και τα πρώτα τραπέζια της ημέρας.',
      action: 'Ωράριο',
    },
    {
      label: 'Διεύθυνση',
      value: 'Πευκών 1',
      title: 'Πευκών 1',
      body: 'Στη γωνία με τη Μελίνας Μερκούρη, στο Νέο Ηράκλειο.',
      action: 'Google Maps',
    },
    {
      label: 'Ως αργά',
      value: '02:00',
      title: 'Πιο αργά Παρασκευή και Σάββατο',
      body: 'Τις δύο αυτές μέρες το ωράριο πάει μέχρι τις 02:00.',
      action: 'Τηλέφωνο',
    },
  ],
  editorialAssets: [
    {
      label: 'Arrival',
      title: 'Η αυλή φαίνεται από τον δρόμο.',
      body: 'Πέτρα, τραπέζια έξω και μια είσοδος που δεν χρειάζεται πολλά για να τη βρεις.',
      action: 'Άνοιγμα χάρτη',
    },
    {
      label: 'Interior',
      title: 'Μέσα είναι πιο ήσυχα.',
      body:
        'Για φαγητό, ποτό ή απλώς να κάτσεις λίγο πιο ήσυχα από τον δρόμο.',
      action: 'Δες τη φωτογραφία',
    },
  ],
  houseIndex: {
    eyebrow: 'Τι κάνεις εδώ',
    title: 'Καφές πρώτα, κάτι από την κουζίνα μετά, ποτό το βράδυ.',
    body:
      'Αν θες απλώς να πας, ο χάρτης είναι δίπλα. Αν θες να χαζέψεις πρώτα, το menu ανοίγει στο QuaR.',
  },
  housePaths: [
    {
      label: 'Καφές',
      meta: '09:00 / Espresso',
      title: 'Καφές από νωρίς',
      body: 'Espresso, freddo, cappuccino και ροφήματα από τον τωρινό κατάλογο.',
      action: 'Καφέδες',
    },
    {
      label: 'Κουζίνα',
      meta: 'All day / φαγητό',
      title: 'Κάτι για το τραπέζι',
      body: 'Club Sandwich NERO, pasta, pizza, σαλάτες και πιάτα κουζίνας.',
      action: 'Φαγητό',
    },
    {
      label: 'Χάρτης',
      meta: 'Πευκών 1',
      title: 'Αυλή έξω, lounge μέσα',
      body: 'Δύο χώροι για διαφορετική ώρα της ημέρας, στην ίδια γωνία της Πευκών.',
      action: 'Χάρτης',
    },
  ],
  serviceProgramme: [
    { time: '09:00', action: 'Καφέδες' },
    { time: 'All day', action: 'Φαγητό' },
    { time: 'Βράδυ', action: 'Ποτά' },
  ],
  experienceNotes: [
    {
      label: 'Morning',
      title: 'Πρώτα ο καφές',
      body: 'Από τις 09:00, με espresso, freddo και τα κλασικά ροφήματα της ημέρας.',
    },
    {
      label: 'Table',
      title: 'Μετά, κάτι να φας',
      body: 'Brunch, σαλάτες, ζυμαρικά και comfort επιλογές για να μη μείνεις μόνο στον καφέ.',
    },
    {
      label: 'Night',
      title: 'Το βράδυ αλλάζει λίγο',
      body: 'Ποτό, cocktails, μπίρες και κρασί. Μέσα το κλίμα είναι πιο ήρεμο.',
    },
  ],
  moments: [
    {
      kicker: 'Καφές',
      title: 'Ο πρώτος καφές της μέρας.',
      body:
        'Cappuccino ή espresso, τραπέζι στην αυλή ή μέσα, ανάλογα με την ώρα και τη διάθεση.',
      alt: 'Nero cappuccino served at the table',
    },
    {
      kicker: 'Χώρος',
      title: 'Πέτρα, σκιά και τραπέζια στην Πευκών.',
      body:
        'Το Nero δεν κρύβεται. Το βλέπεις από τον δρόμο και κάθεσαι εύκολα, ειδικά όταν ο καιρός το σηκώνει.',
      alt: 'Nero stone terrace and outdoor tables',
    },
    {
      kicker: 'Βράδυ',
      title: 'Το βράδυ μένεις λίγο παραπάνω.',
      body:
        'Το εσωτερικό είναι πιο ήσυχο και δουλεύει καλά για ποτό, φαγητό ή μια βραδινή συνάντηση.',
      alt: 'Nero interior lounge with warm lighting',
    },
  ],
  menu: {
    headingEyebrow: 'Ψηφιακό menu / QuaR',
    headingTitle: 'Το menu είναι στο QuaR και μένει απλό.',
    headingBody:
      'Καφέδες, brunch, πιάτα κουζίνας, ποτά και κρασιά. Τα ανοίγεις στο QuaR, χωρίς να ψάχνεις παλιές σελίδες.',
    evidence: [
      { label: 'Menu', value: 'QuaR', detail: 'Τωρινός ψηφιακός κατάλογος' },
      { label: 'Τι θα βρεις', value: 'Freddo / Club / COZA', detail: 'Καφές, brunch και bar' },
      { label: 'Πού είναι', value: 'Πευκών 1', detail: 'Χάρτης, τηλέφωνο και ωράριο' },
    ],
    categories: [
      {
        title: 'ESPRESSO',
        count: '11 επιλογές',
        sample: 'Espresso, cappuccino, latte, freddo espresso, ελληνικός.',
      },
      {
        title: 'BRUNCH',
        count: '15 επιλογές',
        sample: 'Club Sandwich NERO, scrambled eggs, croque madame, τορτίγιες.',
      },
      {
        title: 'ΠΟΤΑ',
        count: 'cocktails & spirits',
        sample: 'Signature cocktails, ποτά 60ml, μπίρες, κρασιά και αφρώδη.',
      },
      {
        title: 'ΚΟΥΖΙΝΑ',
        count: 'φαγητό όλη μέρα',
        sample: 'Πίτσες, ορεκτικά, σαλάτες, comfort, ζυμαρικά, κυρίως πιάτα.',
      },
    ],
    routeLeadEyebrow: 'Ανά ώρα',
    routeLeadTitle: 'Αν δεν ξέρεις από πού να ξεκινήσεις, δες το ανά ώρα.',
    routes: [
      {
        label: 'Καφές',
        time: '09:00',
        title: 'Πρώτα ο καφές',
        detail: 'Freddo espresso, cappuccino, latte και ελληνικός από την ενότητα ESPRESSO.',
      },
      {
        label: 'Brunch',
        time: 'All day',
        title: 'Για το τραπέζι',
        detail: 'Club Sandwich NERO, scrambled eggs και croque madame από το BRUNCH κομμάτι.',
      },
      {
        label: 'Κουζίνα',
        time: 'Kitchen',
        title: 'Κουζίνα',
        detail: 'Πίτσες, σαλάτες, ζυμαρικά και πιάτα κουζίνας για όποιον μένει παραπάνω.',
      },
      {
        label: 'Bar',
        time: 'Βράδυ',
        title: 'Ποτό και κρασί',
        detail: 'COZA NOSTRA, ποτά, μπίρες, κρασιά και αφρώδη για το βράδυ.',
      },
    ],
    proofs: [
      {
        label: 'Coffee',
        title: 'Freddo Espresso',
        detail: 'Από την ενότητα ESPRESSO του τωρινού menu.',
      },
      {
        label: 'Brunch',
        title: 'Club Sandwich NERO',
        detail: 'Club sandwich με το όνομα του Nero στον κατάλογο.',
      },
      {
        label: 'Kitchen',
        title: 'Ραβιόλι',
        detail: 'Πιάτο κουζίνας από το food κομμάτι του καταλόγου.',
      },
      {
        label: 'Bar',
        title: 'COZA NOSTRA',
        detail: 'Cocktail από το bar section του QuaR menu.',
      },
    ],
    proofCaptions: ['Κουζίνα', 'Καφές', 'Lounge', 'Brunch'],
    highlights: ['ESPRESSO', 'BRUNCH', 'ΠΟΤΑ', 'ΠΙΤΣΕΣ', 'ΟΡΕΚΤΙΚΑ', 'ΣΑΛΑΤΕΣ', 'COMFORT', 'ΚΡΑΣΙΑ'],
    signature: [
      {
        group: 'Coffee',
        name: 'Freddo Espresso',
        price: '4.4',
        detail: 'Από το τμήμα ESPRESSO του ψηφιακού καταλόγου QuaR.',
      },
      {
        group: 'Brunch',
        name: 'Club Sandwich NERO',
        price: '9.6',
        detail: 'Κοτόπουλο, bacon, gouda, πατάτες και dressing NERO.',
      },
      {
        group: 'Cocktail',
        name: 'COZA NOSTRA',
        price: '8.9',
        detail: 'Aged rum, coco rum, fresh pineapple και lime.',
      },
      {
        group: 'Kitchen',
        name: 'Ραβιόλι',
        price: '9.8',
        detail: 'Με ανθότυρο, σπανάκι και σάλτσα ντομάτας.',
      },
    ],
    serviceRail: {
      menu: 'Menu',
      call: 'Τηλέφωνο',
      address: 'Διεύθυνση',
      hours: 'Ωράριο',
      currentMenu: 'QuaR / τωρινό menu',
    },
  },
  spaces: [
    {
      title: 'Πέτρα και αυλή',
      body:
        'Το κτίριο και τα έξω τραπέζια δίνουν στο Nero κάτι που θυμάσαι όταν περνάς από την Πευκών.',
    },
    {
      title: 'Καφές, φαγητό, ποτό',
      body:
        'Ο κατάλογος πάει από espresso και cappuccino μέχρι club sandwich, pasta και πιάτα κουζίνας.',
    },
    {
      title: 'Σημείο γειτονιάς',
      body:
        'Πευκών και Μελίνας Μερκούρη, για πρωινό ραντεβού αλλά και για βραδινή έξοδο.',
    },
  ],
  visit: {
    eyebrow: 'Visit',
    body: 'Κυρ.-Πεμ. 09:00 - 01:00 / Παρ.-Σαβ. 09:00 - 02:00. Πάρε τηλέφωνο, άνοιξε χάρτη ή δες πρώτα το menu.',
    now: 'Τώρα',
    address: 'Διεύθυνση',
    hours: 'Ωράριο',
    today: 'Σήμερα',
    menu: 'Menu',
    maps: 'Google Maps',
    copyAddress: 'Αντιγραφή διεύθυνσης',
    copiedAddress: 'Αντιγράφηκε',
    copyAddressAria: 'Αντιγραφή διεύθυνσης Nero',
    mapsOpen: 'Άνοιγμα σε Maps',
    instagram: 'Instagram',
  },
  footer: {
    aria: 'Nero contact footer',
    addressAria: 'Άνοιγμα διεύθυνσης Nero σε Google Maps',
    address: 'Διεύθυνση',
    hours: 'Ωράριο',
    contact: 'Επικοινωνία',
    open: 'Άνοιγμα',
    footerMenu: 'Menu στο QuaR',
    maps: 'Google Maps',
    instagram: 'Instagram',
  },
  preview: {
    imageTitle: 'Προβολή εικόνας',
    previewTip: 'Προβολή',
    closeTitle: 'Κλείσιμο',
    closeTip: 'Κλείσιμο',
    closeAria: 'Κλείσιμο προβολής εικόνας',
    backdropAria: 'Κλείσιμο προβολής',
    dialogAria: 'Προβολή φωτογραφίας Nero',
    controlsAria: 'Χειριστήρια φωτογραφιών Nero',
    previousTitle: 'Προηγούμενη εικόνα',
    previousTip: 'Προηγούμενη',
    previousAria: 'Προηγούμενη φωτογραφία Nero',
    nextTitle: 'Επόμενη εικόνα',
    nextTip: 'Επόμενη',
    nextAria: 'Επόμενη φωτογραφία Nero',
    galleryThumbsAria: 'Μικρογραφίες Nero',
    showImage: 'Δες φωτογραφία Nero',
    spaceTitle: 'Χώρος',
  },
} as const

export type SiteContent = typeof greekContent
