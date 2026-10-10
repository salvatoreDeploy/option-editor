# Spec 010g — Document Export — Design

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário)

## Resumo Técnico

O renderer monta o conteúdo final (HTML autocontido, Markdown ou texto plano) a partir do `Document.content` já em cache — ele tem `DOMParser` disponível, o main process não. O renderer manda o conteúdo pronto por IPC; o main só cuida do que só ele pode fazer: diálogo nativo "Salvar como" e escrita em disco, e — pro PDF — renderizar o HTML autocontido numa `BrowserWindow` oculta e chamar `webContents.printToPDF`.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`ExportFormat`, `ExportDocumentRequest`, `ExportDocumentResponse`)
- `src/shared/constants/ipc.ts` (`IPC.EXPORT`)
- Novo: `src/main/export.ts` (`createExportHandlers(window)`)
- `src/main/index.ts` (chama `createExportHandlers`)
- `src/preload/index.ts` (`exportDocument`)
- Novo: `src/renderer/src/api/exportDocument.ts`
- Novo: `src/renderer/src/lib/htmlText.ts` (`stripHtml`, movido de `searchDocuments.ts` pra ser reaproveitado)
- Novo: `src/renderer/src/lib/htmlToMarkdown.ts`
- Novo: `src/renderer/src/lib/buildExportContent.ts` (monta o conteúdo final por formato)
- `src/renderer/src/lib/searchDocuments.ts` (usa o `stripHtml` movido, sem duplicar)
- `src/renderer/src/components/DocumentActionsMenu/index.tsx` (submenu "Exportar")

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Toda a transformação de conteúdo (HTML autocontido, Markdown, texto) acontece no renderer; o main só recebe a string final pronta pra salvar/renderizar | `DOMParser` só existe no renderer; fazer o main reimplementar parsing de HTML exigiria uma lib nova (`jsdom` ou similar) só pra isso |
| `DEC-002` | PDF: o renderer monta o mesmo HTML autocontido do export `.html` e manda pro main; o main carrega esse HTML numa `BrowserWindow` oculta (`show: false`) via arquivo temporário (`fs.mkdtemp`), espera `did-finish-load`, chama `printToPDF()`, salva o buffer, remove o temporário e fecha a janela | `webContents.printToPDF` só existe no main; reaproveitar o HTML do export `.html` evita ter dois caminhos de geração de conteúdo pro mesmo documento |
| `DEC-003` | Um único IPC `EXPORT_DOCUMENT({ format, suggestedFileName, content })` pros 4 formatos, não um por formato | Main já trata os 4 de forma quase idêntica (escrever string em arquivo), com só o `pdf` desviando pro caminho de `printToPDF`; um handler só evita repetição do código de diálogo/erro |
| `DEC-004` | Conversor `htmlToMarkdown` percorre o DOM (via `DOMParser`, mesma técnica de `stripHtml`) nó a nó, com uma função por tipo de tag — cobre só as tags que `Editor/index.tsx` realmente produz (`REQ-007`) | Schema fechado — não precisa (nem deveria tentar) ser um conversor HTML→Markdown genérico |
| `DEC-005` | Marca `<mark>` (extensão Highlight) vira `==texto==` no Markdown | Sintaxe de destaque já reconhecida por várias flavors de Markdown (Obsidian etc.); melhor que descartar a marcação silenciosamente |
| `DEC-006` | Nome de arquivo sugerido = título do documento sanitizado (caracteres inválidos de nome de arquivo trocados por `-`) + extensão do formato | Editar o nome depois na própria caixa de diálogo nativa já é suportado pelo SO; só precisa de um padrão razoável |

## Contratos

```ts
export type ExportFormat = 'html' | 'md' | 'txt' | 'pdf'

export interface ExportDocumentRequest {
  format: ExportFormat
  suggestedFileName: string
  content: string // HTML autocontido (html/pdf) ou já convertido (md/txt)
}

export interface ExportDocumentResponse {
  canceled: boolean
  filePath?: string
}
```

`IPC.EXPORT = { EXPORT_DOCUMENT: 'export:document' }`.

## Alternativas Consideradas

- `turndown` (lib HTML→Markdown): descartada pelo `DEC-004`/restrição — o schema é fechado e conhecido, não vale a dependência.
- Gerar o PDF a partir da janela principal (capturando a UI do app): descartado — traria Sidebar/Header/tema junto; a janela oculta com HTML limpo dá controle total do layout impresso.

## Research Hooks

Resolvido durante a análise (não é mais uma pergunta em aberto): confirmado que não existe extensão Tiptap↔Markdown já em uso no projeto, e que o escopo fechado das tags produzidas torna um conversor próprio (`DEC-004`) a opção mais simples — a pergunta original da spec `010` ("pesquisar se um serializer Tiptap↔Markdown já cobre o schema atual") está respondida.

## Impactos

- Main: novo módulo `export.ts`, registrado em `index.ts`.
- Preload: 1 método novo.
- Renderer: novos helpers de conversão, submenu no `DocumentActionsMenu`.
- Persistência: nenhuma — exportar não grava nada no `electron-store`.
- Sistema de arquivos: escreve fora da pasta de dados do app, só onde o usuário escolher no diálogo nativo; PDF usa um arquivo temporário intermediário, removido depois.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: exportar um documento com título, negrito/itálico, lista, bloco de código e citação em cada um dos 4 formatos, a partir do documento aberto e de um item fechado da Sidebar; cancelar o diálogo de salvar; abrir o `.html` num navegador e o `.pdf` num leitor de PDF.
