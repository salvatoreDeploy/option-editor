# Spec 010h — Markdown Import — Design

## Estado

`done`

## Resumo Técnico

O main process cuida só do que exige privilégio: diálogo nativo "Abrir arquivo" e leitura do arquivo em disco (texto bruto em UTF-8). Ele devolve pro renderer o conteúdo bruto e o nome do arquivo (sem extensão). Todo o parsing de Markdown→HTML acontece no renderer, em texto puro (sem precisar de `DOMParser` nem de nenhuma API do main) — é o caminho inverso de `htmlToMarkdown` (spec `010g`). Depois de converter, o renderer reaproveita o fluxo já existente de criar documento (`createDocument`) + salvar (`saveDocument`) e navega pro documento novo, igual ao clicar em "Novo documento".

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`ImportMarkdownResponse`)
- `src/shared/constants/ipc.ts` (`IPC.IMPORT`)
- Novo: `src/main/import.ts` (`createImportHandlers(window)`)
- `src/main/index.ts` (chama `createImportHandlers`)
- `src/preload/index.ts` (`importMarkdown`)
- Novo: `src/renderer/src/api/importMarkdown.ts`
- Novo: `src/renderer/src/lib/markdownToHtml.ts` (`markdownToHtml(rawMarkdown, fallbackTitle)`)
- `src/renderer/src/lib/htmlText.ts` (`escapeHtml` exportado, reaproveitado por `markdownToHtml`)
- Novo: `src/renderer/src/hooks/useImportMarkdown.ts`
- `src/renderer/src/components/Sidebar/CreatePage.tsx` (botão secundário "Importar Markdown")

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Parsing de Markdown→HTML acontece inteiramente no renderer, por texto (regex/linha a linha), sem `DOMParser` | Diferente do export (que precisa de `DOMParser` pra andar num DOM já existente), aqui a entrada é texto puro — não há DOM de origem, só a string do arquivo |
| `DEC-002` | Conversor cobre exatamente os nós que `htmlToMarkdown` sabe gerar (heading, parágrafo, negrito, itálico, tachado, destaque, código inline, bloco de código com linguagem, citação de um nível, listas de um nível não aninhadas, divisor, quebra de linha) — não é um parser CommonMark completo | Mesmo raciocínio de escopo fechado da `010g`/`DEC-004`: o schema de destino (Tiptap deste app) é conhecido e fechado, cobrir mais que isso seria trabalho sem retorno e risco de dependência nova |
| `DEC-003` | Título: primeira linha não vazia do arquivo casando com `/^#\s+.+/` vira o título e é removida do corpo antes do parsing dos blocos; caso contrário o nome do arquivo (sem extensão, devolvido pelo main) é o título | Espelha exatamente o formato que `buildMarkdownDocument` (spec `010g`) gera na exportação (`# título\n\n corpo`), fechando o round-trip export→import |
| `DEC-004` | Import cria o documento reaproveitando `createDocument` (cria vazio) seguido de `saveDocument(id, título, conteúdo)`, em vez de um IPC novo de "criar já com conteúdo" | Reaproveita 100% do fluxo/cache do React Query que `useCreateDocument` já resolve (invalidação de lista, navegação); não precisa de handler novo em `main/ipc.ts` só pra isso |
| `DEC-005` | Um único IPC `IMPORT_MARKDOWN` sem parâmetros — abre o diálogo, lê o arquivo e devolve `{ canceled, fileName?, content? }` num só round-trip | Mesmo padrão de round-trip único da spec `010g` (`EXPORT_DOCUMENT`); não há necessidade de separar "escolher arquivo" de "ler arquivo" em duas chamadas |
| `DEC-006` | Blocos de código nó a nó via segmentação linha a linha (fences, blockquote, listas, heading, hr, parágrafo) — mesma técnica de "uma função por tipo de bloco" usada em `convertNode`/`convertList` de `htmlToMarkdown` | Consistência de estilo com o conversor irmão, mesma legibilidade |

## Contratos

```ts
export interface ImportMarkdownResponse {
  canceled: boolean
  fileName?: string // nome do arquivo sem extensão — fallback de título (REQ-003)
  content?: string // conteúdo bruto do arquivo, UTF-8
}
```

`IPC.IMPORT = { IMPORT_MARKDOWN: 'import:markdown' }`.

```ts
// src/renderer/src/lib/markdownToHtml.ts
export interface ParsedMarkdown {
  title: string
  content: string // HTML do corpo, sem o heading do título — mesmo formato de Document.content
}

export function markdownToHtml(rawMarkdown: string, fallbackTitle: string): ParsedMarkdown
```

## Alternativas Consideradas

- `marked`/`markdown-it` (lib de parsing Markdown): descartada pela mesma restrição da `010g` — o schema de destino é fechado, uma lib genérica traria suporte a nós (tabelas, HTML embutido, footnotes) que o editor nem sabe renderizar, além de ser uma dependência nova só pra um caminho de conversão que a `010g` já provou ser viável escrever à mão.
- Ler o arquivo no renderer via `<input type="file">` (sem IPC/diálogo nativo): descartada — quebraria `NFR-001` (renderer não deve tocar sistema de arquivos fora do preload) e o padrão já estabelecido pelo export, que usa diálogo nativo do Electron.
- IPC novo "criar documento com conteúdo" num só handler no main: descartada por `DEC-004` — reaproveitar `createDocument` + `saveDocument` já resolve cache/navegação sem duplicar lógica que `useCreateDocument` já tem.

## Research Hooks

Nenhuma dúvida técnica em aberto — a spec `010g` já resolveu a pergunta de fundo (se valia um parser/serializer de terceiros) na direção HTML→Markdown, e a decisão (`DEC-002`) é usar o mesmo raciocínio na direção inversa.

## Impactos

- Main: novo módulo `import.ts`, registrado em `index.ts`.
- Preload: 1 método novo (`importMarkdown`).
- Renderer: novo lib de parsing, novo hook, botão novo na Sidebar.
- Persistência: cria um documento novo no `electron-store`, exatamente como "Novo documento" — nenhum schema novo.
- Sistema de arquivos: só leitura, fora da pasta de dados do app, no arquivo que o usuário escolher no diálogo nativo.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: importar um `.md` com heading na primeira linha e outro sem heading; conferir título em cada caso. Importar um arquivo cobrindo negrito, itálico, tachado, destaque, código inline, bloco de código com linguagem, citação, lista e divisor, e conferir a formatação no editor depois de aberto. Cancelar o diálogo de abrir arquivo e confirmar que nenhum documento novo aparece na Sidebar. Exportar um documento como `.md` (spec `010g`) e reimportar o mesmo arquivo, comparando título/formatação com o original.
