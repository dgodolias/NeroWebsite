import { publicAsset } from './paths'

export const venue = {
  name: 'Nero',
  descriptor: 'Cafe Bar Restaurant',
  area: 'Νέο Ηράκλειο',
  address: 'Πευκών 1 & Μ. Μερκούρη, Νέο Ηράκλειο 14122',
  phone: '210 284 0002',
  tel: '+302102840002',
  hours: 'Κυρ.-Πεμ. 09:00 - 01:00 / Παρ.-Σαβ. 09:00 - 02:00',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Nero%20Cafe%20Bar%20Restaurant%20Pefkon%201%20Neo%20Irakleio',
  instagramUrl:
    'https://www.instagram.com/explore/locations/237183279/nero-cafe-bar-restaurant/',
  facebookUrl: 'https://www.facebook.com/NeroCafeBarRestaurant',
  menuUrl: 'https://quar.gr/stores/n/nero#menu',
}

export const heroStats = [
  { value: '09:00', label: 'πρώτος καφές' },
  { value: '02:00', label: 'Παρασκευή / Σάββατο' },
  { value: 'Πευκών 1', label: 'Νέο Ηράκλειο' },
]

export const moments = [
  {
    kicker: 'Καφές',
    title: 'Ο πρώτος καφές της μέρας.',
    body:
      'Cappuccino ή espresso, τραπέζι στην αυλή ή μέσα, ανάλογα με την ώρα και τη διάθεση.',
    image: publicAsset('/assets/refined/nero-cappuccino.webp'),
    alt: 'Nero cappuccino served at the table',
    width: 1100,
    height: 704,
  },
  {
    kicker: 'Χώρος',
    title: 'Πέτρα, σκιά και τραπέζια στην Πευκών.',
    body:
      'Το Nero δεν κρύβεται. Το βλέπεις από τον δρόμο και κάθεσαι εύκολα, ειδικά όταν ο καιρός το σηκώνει.',
    image: publicAsset('/assets/refined/nero-stone-terrace.webp'),
    alt: 'Nero stone terrace and outdoor tables',
    width: 1400,
    height: 980,
  },
  {
    kicker: 'Βράδυ',
    title: 'Το βράδυ μένεις λίγο παραπάνω.',
    body:
      'Το εσωτερικό είναι πιο ήσυχο και δουλεύει καλά για ποτό, φαγητό ή μια βραδινή συνάντηση.',
    image: publicAsset('/assets/refined/nero-fireplace-lounge.webp'),
    alt: 'Nero interior lounge with warm lighting',
    width: 1400,
    height: 934,
  },
]

export const proofImages = [
  { src: publicAsset('/assets/refined/nero-pasta.webp'), alt: 'Nero pasta dish', width: 1200, height: 746 },
  { src: publicAsset('/assets/refined/nero-espresso.webp'), alt: 'Nero espresso service', width: 1100, height: 788 },
  {
    src: publicAsset('/assets/refined/nero-day-lounge.webp'),
    alt: 'Nero daytime lounge seating',
    width: 1400,
    height: 926,
  },
  { src: publicAsset('/assets/refined/nero-club.webp'), alt: 'Nero club sandwich', width: 1200, height: 916 },
]

export const menuHighlights = [
  'ESPRESSO',
  'BRUNCH',
  'ΠΟΤΑ',
  'ΠΙΤΣΕΣ',
  'ΟΡΕΚΤΙΚΑ',
  'ΣΑΛΑΤΕΣ',
  'COMFORT',
  'ΚΡΑΣΙΑ',
]

export const menuCategories = [
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
    sample: 'Signature cocktails, ποτά 60ml, μπύρες, κρασιά και αφρώδη.',
  },
  {
    title: 'ΚΟΥΖΙΝΑ',
    count: 'φαγητό όλη μέρα',
    sample: 'Πίτσες, ορεκτικά, σαλάτες, comfort, ζυμαρικά, κυρίως πιάτα.',
  },
]

export const signatureMenu = [
  {
    group: 'Coffee',
    name: 'Freddo Espresso',
    detail: 'Από το τμήμα ESPRESSO του ψηφιακού καταλόγου QuaR.',
  },
  {
    group: 'Brunch',
    name: 'Club Sandwich NERO',
    detail: 'Κοτόπουλο, bacon, gouda, πατάτες και dressing NERO.',
  },
  {
    group: 'Cocktail',
    name: 'COZA NOSTRA',
    detail: 'Aged rum, coco rum, fresh pineapple και lime.',
  },
  {
    group: 'Kitchen',
    name: 'ΡΑΒΙΟΛΙ',
    detail: 'Με ανθότυρο, σπανάκι και σάλτσα ντομάτας.',
  },
]

export const experienceNotes = [
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
    body: 'Ποτό, cocktails, μπύρες και κρασί. Μέσα το κλίμα είναι πιο ήρεμο.',
  },
]

export const spaces = [
  {
    title: 'Πέτρα και αυλή',
    body: 'Το κτίριο και τα έξω τραπέζια δίνουν στο Nero κάτι που θυμάσαι όταν περνάς από την Πευκών.',
  },
  {
    title: 'Καφές, φαγητό, ποτό',
    body: 'Ο κατάλογος πάει από espresso και cappuccino μέχρι club sandwich, pasta και πιάτα κουζίνας.',
  },
  {
    title: 'Σημείο γειτονιάς',
    body: 'Πευκών και Μελίνας Μερκούρη, για πρωινό ραντεβού αλλά και για βραδινή έξοδο.',
  },
]
