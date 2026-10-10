# Spec 010 — Controlled Expansion — Tasks

## Estado

`in-progress`

## Tarefas

- [x] `TASK-001`: Confirmar que as specs `003` a `009` estão `done` antes de iniciar qualquer sub-spec desta.
  - Refs: `RISK-001`.
  - Verificação: `specs/003` a `008` estão `done`. `009-quality-testability` **não** está — decisão explícita do usuário (2026-09-17) de reordenar `009` para o final do backlog, depois da `010`. Restrição original ajustada em `requirements.md`.

- [x] `TASK-002`: Criar sub-spec `010a-recent-documents` (documentos recentes reais, corrige `.slice(-3)` de `tray.ts`).
  - Refs: `REQ-004`, `DEC-002`.
  - Verificação: `specs/010a-recent-documents/` criada e implementada; falta validação manual do usuário.

- [x] `TASK-003`: Criar sub-spec `010b-trash-recovery` (lixeira/recuperação após exclusão).
  - Refs: `REQ-012`, `DEC-002`.
  - Verificação: `specs/010b-trash-recovery/` criada e implementada; falta validação manual do usuário.

- [x] `TASK-004`: Criar sub-spec `010c-document-actions` (renomear, duplicar, favoritar).
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`.
  - Verificação: `specs/010c-document-actions/` criada e implementada; falta validação manual do usuário.

- [x] `TASK-005`: Criar sub-spec `010d-content-search` (busca por conteúdo).
  - Refs: `REQ-005`.
  - Verificação: `specs/010d-content-search/` criada e implementada — consultado `Screen / Quick Search` no Pencil, que revelou o padrão "Documento · tempo relativo" no subtítulo (não implementado até então) e confirmou que não há highlight/trecho desenhado, então o trecho de conteúdo foi um acréscimo justificado pela própria estrutura do Command Item. Falta validação manual do usuário.

- [x] `TASK-006`: Criar sub-spec `010e-configurable-shortcuts` (atalhos configuráveis).
  - Refs: `REQ-010`.
  - Verificação: `specs/010e-configurable-shortcuts/` criada e implementada — consultado `Screen / Settings` no Pencil; escopo restrito só à parte de atalhos (o "Shortcuts Card"), sem construir a tela de configurações inteira (as outras seções dela não têm função implementada e ficariam decorativas). Falta validação manual do usuário. Escolhida por pedido explícito do usuário, fora da ordem original (`010e` era import/export).
  - Nota: `010f-import-export` e `010g-settings-theme` (nome do workspace, toggles do editor, tema claro/escuro, zona sensível) ficam para depois, renumeradas.

- [x] `TASK-007`: Criar sub-spec `010f-theme-toggle` (tema claro/escuro).
  - Refs: `REQ-011`.
  - Verificação: `specs/010f-theme-toggle/` criada e implementada — consultado o Pencil (`get_variables`): o kit só define o tema escuro, sem eixo de tema nem par claro. Paleta clara derivada dos valores canônicos `zinc` do shadcn/ui (mesma família que o próprio kit já cita como inspiração), não inventada. Falta validação manual do usuário. Escolhida por pedido explícito do usuário, fora da ordem original (`010f` era import/export).
  - Nota: `010g-import-export` e `010h-settings-rest` (nome do workspace, toggles do editor, zona sensível) ficam pra depois, renumeradas de novo.

- [x] `TASK-008`: Criar sub-spec `010g-document-export` (exportar `.html`/`.md`/`.txt`/`.pdf`).
  - Refs: `REQ-006`, `REQ-007`.
  - Verificação: `specs/010g-document-export/` criada e implementada. Escopo ampliado por pedido do usuário: `.pdf` (não previsto originalmente) e `.txt` (quase grátis, mesmo pipeline do `.md`). Importar Markdown virou sua própria sub-spec futura (`010i-markdown-import`) — é uma preocupação diferente (ler/validar entrada externa) de gerar uma saída. Falta validação manual do usuário.

- [ ] `TASK-009`: Criar sub-spec `010h-markdown-import` (importar arquivo Markdown).
  - Refs: `REQ-008`.

- [ ] `TASK-010`: Criar sub-spec `010i-settings-rest` (tela de configurações restante: nome do workspace, pasta de dados, toggles do editor, zona sensível).
  - Refs: `REQ-009`.

## Validação Final

- [ ] Cada sub-spec criada tem seu próprio ciclo Specify/Design/Tasks/Execute.
- [ ] `README.md` atualizado a cada feature entregue.
- [ ] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| | | |
