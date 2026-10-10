import { describe, expect, it } from 'vitest'
import { escapeHtml, stripHtml } from './htmlText'

describe('stripHtml', () => {
  it('remove tags e devolve só o texto', () => {
    expect(stripHtml('<p>Olá <strong>mundo</strong></p>')).toBe('Olá mundo')
  })

  it('devolve string vazia pra HTML vazio', () => {
    expect(stripHtml('')).toBe('')
  })

  it('preserva texto de múltiplos blocos', () => {
    expect(stripHtml('<p>Um</p><p>Dois</p>')).toBe('UmDois')
  })
})

describe('escapeHtml', () => {
  it('escapa &, < e >', () => {
    expect(escapeHtml('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d')
  })

  it('não mexe em texto sem caracteres especiais', () => {
    expect(escapeHtml('texto normal')).toBe('texto normal')
  })
})
