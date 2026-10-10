# Spec 008 — Editor Refactor — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O título do documento é extraído do HTML do Tiptap via uma regex frágil (`/(<h1>(?<title>.+)<\/h1>(?<content>.+)?)/`), que quebra com HTML inesperado (múltiplas linhas, tags aninhadas, ausência de `h1`). Não há modelo claro separando "título" de "conteúdo" no editor.

## Objetivo

Definir um modelo confiável para título e conteúdo do documento, sem depender de parsing de HTML por regex.

## Fora De Escopo

- Suporte completo a Markdown/import-export (spec `010-controlled-expansion`).
- Mudança de biblioteca de editor (continua Tiptap).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Substituir a regex de extração de título por uma lógica mais segura, usando a API do Tiptap/ProseMirror para ler o nó de heading em vez de parsear a string HTML | Explícito (BACKLOG Sprint 6) |
| `REQ-002` | Definir um modelo claro separando título e conteúdo (tipos/funções puras, testáveis) | Explícito (BACKLOG Sprint 6) |
| `REQ-003` | Revisar a extensão `Document.extend({ content: 'heading block*' })` garantindo que o contrato "primeiro nó é sempre heading" seja respeitado | Explícito (BACKLOG Sprint 6) |
| `REQ-004` | Garantir que título vazio seja tratado corretamente (fallback consistente, hoje `'Untitled'`) | Explícito (BACKLOG Sprint 6) |
| `REQ-005` | Avaliar suporte a Markdown e code blocks (o projeto já usa `CodeBlockLowlight`; avaliar se falta algo) | Explícito (BACKLOG Sprint 6) |
| `REQ-006` | Melhorar o placeholder do editor | Explícito (BACKLOG Sprint 6) |
| `REQ-007` | Revisar comportamento de autofocus | Explícito (BACKLOG Sprint 6) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | A nova extração de título deve ser coberta por teste unitário (depende de `009-quality-testability` ter o runner configurado, ou esta spec configura o mínimo necessário para testar essa função pura) |

## Restrições

- Manter compatibilidade com documentos já salvos no formato atual (HTML com `<h1>` inicial).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Título não quebra com HTML inesperado (múltiplos parágrafos, tags aninhadas, heading ausente) |
| `AC-002` | Conteúdo não é perdido durante a edição |
| `AC-003` | Editor continua carregando documentos antigos corretamente |
| `AC-004` | Título vazio resulta em um fallback consistente e documentado |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Trocar a extração de título pode alterar sutilmente o título de documentos já existentes | Testar com uma amostra de documentos reais/gerados antes de considerar concluído |
