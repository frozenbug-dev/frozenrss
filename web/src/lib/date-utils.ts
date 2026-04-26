import {formatDistanceToNow} from 'date-fns/formatDistanceToNow'
import {formatRelative} from 'date-fns/formatRelative'
import {isToday} from 'date-fns/isToday'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatDate(date: Date) {
  return dateFormatter.format(date)
}

export function formatTimeDistance(date: Date) {
  if (isToday(date)) return formatDistanceToNow(date, {addSuffix: true})
  return formatRelative(date, new Date())
}
