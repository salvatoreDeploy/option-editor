import { describe, expect, it } from 'vitest'
import {
  buildHtmlDocument,
  buildMarkdownDocument,
  buildPlainTextDocument,
  sanitizeFileName,
} from './buildExportContent'

describe('sanitizeFileName', () => {
  it('remove caracteres inválidos de nome de arquivo', () => {
    expect(sanitizeFileName('Relatório/Final:Q3*2026?')).toBe(
      'RelatórioFinalQ32026',
    )
  })

  it('colapsa espaços múltiplos', () => {
    expect(sanitizeFileName('Um    Título   Com   Espaços')).toBe(
      'Um Título Com Espaços',
    )
  })

  it('usa "Sem título" quando o resultado fica vazio', () => {
    expect(sanitizeFileName('   ')).toBe('Sem título')
    expect(sanitizeFileName('///')).toBe('Sem título')
  })
})

describe('buildHtmlDocument', () => {
  it('inclui o título escapado e o conteúdo', () => {
    const html = buildHtmlDocument('A & B', '<p>Olá</p>')

    expect(html).toContain('<title>A &amp; B</title>')
    expect(html).toContain('<h1>A &amp; B</h1>')
    expect(html).toContain('<p>Olá</p>')
    expect(html).toContain('<!DOCTYPE html>')
  })
})

describe('buildMarkdownDocument', () => {
  it('prefixa o título como heading de nível 1', () => {
    const markdown = buildMarkdownDocument('Meu Título', '<p>Corpo</p>')

    expect(markdown.startsWith('# Meu Título\n\n')).toBe(true)
    expect(markdown).toContain('Corpo')
  })
})

describe('buildPlainTextDocument', () => {
  it('junta título e texto plano do conteúdo, sem tags', () => {
    const text = buildPlainTextDocument(
      'Título',
      '<p>Com <strong>marcação</strong></p>',
    )

    expect(text).toBe('Título\n\nCom marcação\n')
  })
})
