# Spec 010f — Theme Toggle — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar o bloco `:root[data-theme="light"]` em `global.css` com a paleta clara.
  - Refs: `REQ-001`, `DEC-001`.
  - Verificação: revisão de código — todos os tokens do tema escuro têm par no claro (`zinc` do shadcn/ui).

- [x] `TASK-002`: Criar `ThemeContext` (estado, `localStorage`, aplica `data-theme` no `<html>`).
  - Refs: `REQ-002`, `REQ-003`, `REQ-004`, `DEC-002`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-003`: Script anti-FOUC.
  - Refs: `REQ-005`, `AC-004`, `DEC-003`.
  - Verificação: `npm run build` — confirmado que `theme-init.js` foi copiado pra `out/renderer/` e `index.html` referencia `./theme-init.js` antes do bundle principal.
  - Nota: precisou ser um arquivo `.js` estático em `src/renderer/public/`, não um `<script>` inline no `index.html` — a CSP do app só permite `script-src 'self'`, que bloquearia um script inline sem afrouxar a política.

- [x] `TASK-004`: Botão de alternância na Sidebar.
  - Refs: `REQ-002`, `AC-001`.
  - Verificação: `npm run build` — ok. Ícone Sol/Lua ao lado do botão de atalhos (spec `010e`).

- [x] `TASK-005`: `Editor` usa `prose`/`prose-invert` condicional ao tema.
  - Refs: `REQ-006`, `AC-005`, `DEC-004`.
  - Verificação: `npm run build` — ok.
  - Nota: implementado sem recriar o editor Tiptap a cada troca de tema — `prose`/`prose-invert` movidos de `editorProps.attributes.class` (fixo na criação do editor) pro `className` do `<EditorContent>` (prop React normal, reativa), que já é descendente de onde as classes de tipografia se aplicam.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings.
- [x] Fluxo manual afetado validado (`AC-001` a `AC-005`).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-19 | `TASK-001` a `TASK-005` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-19 | Validação manual | Usuário confirmou: "testado e aprovado". Spec concluída. |
