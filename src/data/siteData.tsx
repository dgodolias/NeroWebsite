import {
  Camera,
  Coffee,
  GlassWater,
  MapPin,
  Martini,
  Menu,
  Pizza,
  Salad,
  Sandwich,
  Utensils,
  Wine,
} from 'lucide-react'

import { venue } from '../content'
import { publicAsset } from '../paths'

export function menuIconFor(title: string) {
  if (title.includes('ESPRESSO')) return <Coffee size={18} />
  if (title.includes('BRUNCH')) return <Sandwich size={18} />
  if (title.includes('ΠΟΤΑ')) return <Martini size={18} />
  if (title.includes('ΠΙΤΣ')) return <Pizza size={18} />
  if (title.includes('ΣΑΛΑ')) return <Salad size={18} />
  if (title.includes('ΚΡΑΣ')) return <Wine size={18} />
  if (title.includes('ΑΝΑΨ')) return <GlassWater size={18} />
  return <Utensils size={18} />
}

export const serviceProgramme = [
  { time: '09:00', action: 'Καφέδες', Icon: Coffee },
  { time: 'All day', action: 'Φαγητό', Icon: Utensils },
  { time: 'Βράδυ', action: 'Ποτά', Icon: Martini },
]

export const spaceAssets = [
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

export const menuProofs = [
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

export const housePaths = [
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

export const houseDossier = [
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

export const editorialAssets = [
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

export const menuRoutes = [
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

export const menuEvidence = [
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

export const pageRoutes = [
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
