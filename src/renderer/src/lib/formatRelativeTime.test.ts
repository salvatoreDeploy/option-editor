import { describe, expect, it } from 'vitest'
import {
  formatRelativeTime,
  formatRelativeTimeFragment,
} from './formatRelativeTime'

function isoMinutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

describe('formatRelativeTimeFragment', () => {
  it('devolve "sem data" quando não há data', () => {
    expect(formatRelativeTimeFragment(undefined)).toBe('sem data')
  })

  it('devolve "agora" para menos de um minuto', () => {
    expect(formatRelativeTimeFragment(isoMinutesAgo(0))).toBe('agora')
  })

  it('devolve minutos para menos de uma hora', () => {
    expect(formatRelativeTimeFragment(isoMinutesAgo(5))).toBe('há 5 min')
  })

  it('devolve horas para menos de um dia', () => {
    expect(formatRelativeTimeFragment(isoHoursAgo(3))).toBe('há 3h')
  })

  it('devolve "ontem" para exatamente um dia', () => {
    expect(formatRelativeTimeFragment(isoDaysAgo(1))).toBe('ontem')
  })

  it('devolve dias para mais de um dia', () => {
    expect(formatRelativeTimeFragment(isoDaysAgo(5))).toBe('há 5 dias')
  })
})

describe('formatRelativeTime', () => {
  it('prefixa "editado" quando há data', () => {
    expect(formatRelativeTime(isoMinutesAgo(0))).toBe('editado agora')
    expect(formatRelativeTime(isoMinutesAgo(5))).toBe('editado há 5 min')
  })

  it('não prefixa quando não há data', () => {
    expect(formatRelativeTime(undefined)).toBe('sem data')
  })
})
