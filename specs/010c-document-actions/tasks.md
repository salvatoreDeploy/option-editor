# Spec 010c — Document Actions — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar `favorite?: boolean` a `Document` e os contratos de request/response de `RENAME`/`DUPLICATE`/`TOGGLE_FAVORITE`.
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`, `DEC-001`, `DEC-002`, `DEC-003`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-002`: Adicionar as 3 constantes IPC novas.
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`.
  - Verificação: revisão de código.

- [x] `TASK-003`: Implementar handlers `RENAME`, `DUPLICATE`, `TOGGLE_FAVORITE` em `ipc.ts`.
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`, `AC-002`, `NFR-001`, `DEC-001`, `DEC-002`, `DEC-003`.
  - Verificação: os três handlers checam `!existing || existing.deletedAt` e lançam erro — documento excluído não pode ser renomeado/duplicado/favoritado.
  - Nota: achado durante a implementação — o handler `SAVE` sobrescrevia o documento inteiro (`{id, title, content, updatedAt}`), o que apagaria `favorite` (e `deletedAt`) a cada autosave. Corrigido pra fazer merge com o documento existente antes de gravar (`...existing` primeiro no spread).

- [x] `TASK-004`: Instalar `@radix-ui/react-dropdown-menu` e `@radix-ui/react-dialog`; expor os 3 métodos no preload e criar as 3 funções de API no renderer.
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-005`: Criar `DocumentActionsMenu` (dropdown com Renomear/Duplicar/Favoritar).
  - Refs: `REQ-005`, `AC-005`, `DEC-004`.
  - Verificação: revisão de código — hook `useDocumentActions` centraliza as 3 mutations e a atualização de cache, reaproveitado pelo menu em ambos os lugares.

- [x] `TASK-006`: Criar `RenameDialog`.
  - Refs: `REQ-001`, `AC-001`.
  - Verificação: revisão de código.

- [x] `TASK-007`: Conectar `DocumentActionsMenu` no `Header` (documento aberto) e no item da Sidebar (documento fechado).
  - Refs: `REQ-005`, `AC-001`, `AC-005`.
  - Verificação: revisão de código.
  - Nota: o `RISK-001` original (renomear o documento aberto deixaria o `<h1>` do editor divergente até a próxima edição reverter) foi resolvido de verdade em vez de contornado escondendo o menu — `document.tsx` agora detecta quando `result.title` muda por uma via externa (comparando com o último título emitido pela própria digitação) e força o `Editor` a remontar (`key={editorKey}`) com o `initialContent` atualizado. `DEC-006` (esconder "Renomear" pro item aberto) ficou obsoleto e não foi implementado — o menu de ações aparece igual em todo lugar.

- [x] `TASK-008`: Ordenar a Sidebar por `favorite` primeiro, depois `updatedAt`.
  - Refs: `REQ-004`, `AC-003`, `AC-004`, `DEC-005`.
  - Verificação: revisão de código (`sortedDocuments` em `Sidebar/index.tsx`). Documento favorito também ganha um ícone de estrela preenchida no lugar do ícone de arquivo padrão.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings.
- [x] Fluxo manual afetado validado (`AC-001` a `AC-005`).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-19 | `TASK-001` a `TASK-008` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. `RISK-001` resolvido de forma definitiva (remount do editor em renomeação externa), não só contornado. |
| 2026-09-19 | Refinamento (pedido do usuário) | `DocumentActionsMenu`, `RenameDialog` e os botões de gatilho ("Mais" no Header, "..." na Sidebar) ficaram mais compactos: menos padding, ícones menores (`h-4 w-4` → `h-3.5 w-3.5`), fonte do menu em `13px`, diálogo de renomear com `max-w-xs` em vez de `max-w-sm`. |
| 2026-09-19 | Validação manual | Usuário confirmou: "testado e aprovado". Spec concluída. |
