# Spec 010g — Document Export — Tasks

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário)

## Tarefas

- [x] `TASK-001`: Adicionar `ExportFormat`/`ExportDocumentRequest`/`ExportDocumentResponse` a `shared/types/ipc.ts` e `IPC.EXPORT` a `shared/constants/ipc.ts`.
  - Refs: `REQ-001` a `REQ-004`, `DEC-003`.
  - Verificação: `npx tsc --noEmit` limpo (só o erro pré-existente e não relacionado de `icon.png?asset`).

- [x] `TASK-002`: Mover `stripHtml` de `searchDocuments.ts` pra `src/renderer/src/lib/htmlText.ts`, reexportado/usado nos dois lugares.
  - Refs: `DEC-001`.
  - Verificação: `npx tsc --noEmit`; `searchDocuments.ts` agora importa de `./htmlText`, sem duplicação.

- [x] `TASK-003`: Criar `htmlToMarkdown.ts` (conversor DOM→Markdown pro schema deste editor).
  - Refs: `REQ-002`, `REQ-007`, `DEC-004`, `DEC-005`, `RISK-001`.
  - Verificação: revisão de código — cobre heading (h1-h6), parágrafo, negrito, itálico, tachado, `mark`→`==texto==`, código inline, bloco de código com linguagem (via classe `language-*` do lowlight), citação, listas (ordenada/não ordenada, colapsando parágrafo interno numa linha), link, `<hr>`, `<br>`. Limitação conhecida e aceita: listas aninhadas não geram indentação Markdown dedicada (RISK-001, escopo fechado).

- [x] `TASK-004`: Criar `buildExportContent.ts` (monta HTML autocontido, Markdown com `# título`, texto plano com título) e um sanitizador de nome de arquivo.
  - Refs: `REQ-001`, `REQ-002`, `REQ-004`, `DEC-006`.
  - Verificação: `npx tsc --noEmit`. Decisão de implementação não detalhada no design.md original: o HTML autocontido usa paleta clara fixa (mesmos tokens do tema claro em `global.css`), independente do tema ativo no app — mais legível/imprimível como documento e como base do PDF (DEC-002).

- [x] `TASK-005`: Criar `src/main/export.ts` com o handler `EXPORT_DOCUMENT` (diálogo nativo, escrita de arquivo, caminho especial pro PDF com janela oculta).
  - Refs: `REQ-003`, `REQ-006`, `NFR-001`, `NFR-002`, `DEC-002`, `RISK-002`.
  - Verificação: janela oculta e diretório temporário sempre limpos em `finally`; cancelar o diálogo retorna `{ canceled: true }` sem escrever nada. Simplificação em relação ao design original: `BrowserWindow.loadFile` já retorna uma Promise que resolve após o carregamento terminar, então não foi necessário um listener manual de `did-finish-load`.

- [x] `TASK-006`: Registrar `createExportHandlers` em `index.ts`; expor `exportDocument` no preload e criar a função de API no renderer.
  - Refs: `REQ-005`, `REQ-006`.
  - Verificação: `npx tsc --noEmit`; `npm run build` gera `out/main`, `out/preload` e `out/renderer` sem erros.

- [x] `TASK-007`: Adicionar submenu "Exportar" (HTML/Markdown/Texto/PDF) no `DocumentActionsMenu`.
  - Refs: `REQ-005`, `AC-006`.
  - Verificação: `documentContent` propagado do `Header` (documento aberto) e da `Sidebar`/`Navigation/Link` (lista de documentos) até o `DocumentActionsMenu`. Falta validação manual do usuário (fluxo real pelo Header e pela Sidebar).

## Validação Final

- [x] `npm run build` executado — sem erros.
- [x] `npm run lint` executado — 0 problemas.
- [ ] Fluxo manual afetado validado (`AC-001` a `AC-006`) — pendente do usuário, este sandbox não roda a GUI do Electron.
- [x] Spec atualizada com decisões finais (ver notas de verificação acima).

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-19 | TASK-001 a TASK-007 | Implementadas. `tsc`/`lint`/`build` limpos. Falta validação manual do usuário. |
