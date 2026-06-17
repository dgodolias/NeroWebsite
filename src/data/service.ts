import { Clock3, MapPin, Menu, Phone } from 'lucide-react'

import { venue } from '../content'
import { greekContent, type SiteContent } from '../i18n'

export interface TodayHours {
  value: string
  note: string
}

export interface ServiceStatus {
  isOpen: boolean
  value: string
  detail: string
}

export interface ProgrammeCue {
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

export function getTodayHours(
  date = new Date(),
  labels: SiteContent['todayHours'] = greekContent.todayHours,
): TodayHours {
  const weekendLate = date.getDay() === 5 || date.getDay() === 6

  return weekendLate
    ? { value: '09:00 - 02:00', note: labels.weekendNote }
    : { value: '09:00 - 01:00', note: labels.weekdayNote }
}

export function getServiceStatus(
  date = new Date(),
  labels: SiteContent['status'] = greekContent.status,
): ServiceStatus {
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

export function getProgrammeCue(
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

export function getArrivalEssentials(
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
