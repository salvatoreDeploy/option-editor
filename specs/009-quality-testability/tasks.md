# Spec 009 — Quality & Testability — Tasks

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário)

## Tarefas

- [x] `TASK-001`: Instalar e configurar Vitest.
  - Refs: `REQ-001`, `AC-001`, `DEC-001`, `DEC-001b`.
  - Aceite: `npm run test` executa e passa.
  - Verificação: `npm run test` — passou já na primeira configuração (`vitest@^2`/`jsdom@^25`, compatíveis com Vite `^5`/Node `20.12.2` deste ambiente).

- [x] `TASK-002`: Adicionar testes para `src/renderer/src/api/*`.
  - Refs: `REQ-002`, `DEC-005`, `DEC-006`.
  - Verificação: `npm run test` — 9 arquivos (`createDocument`, `fetchDocument`, `fetchDocuments`, `saveDocument`, `deleteDocument`, `clearAllDocuments`, `unlock`, `setPassword`), amostra representativa dos formatos de wrapper existentes.

- [x] `TASK-003`: Adicionar testes para helpers de documento.
  - Refs: `REQ-003`.
  - Verificação: `npm run test` — cobertos `parseContent.ts`/`getHeadings.ts` (via `Editor` real do Tiptap, mesmo schema de produção) e os helpers de conteúdo que foram crescendo nas specs `010d`/`010g`/`010h` (`formatRelativeTime`, `keyboardShortcut`, `htmlText`, `markdownToHtml`, `htmlToMarkdown`, `searchDocuments`, `buildExportContent`) — escopo ampliado além do `parseContent.ts` original porque esses helpers não existiam quando a spec foi rascunhada e são exatamente o tipo de lógica pura que `NFR-001` pede pra cobrir.

- [x] `TASK-004`: Criar checklist manual de QA.
  - Refs: `REQ-004`, `AC-002`, `DEC-003`.
  - Subtarefas:
    - Validar fluxo de criação de documento.
    - Validar fluxo de edição e autosave.
    - Validar fluxo de busca.
    - Validar abertura pelo tray.
    - Validar exclusão com confirmação.
  - Verificação: `docs/qa-checklist.md` criado, cobrindo os 5 fluxos originais + exportar/importar, atalhos, tema, configurações e perfil/trava local (specs `010e`–`010j`, que não existiam quando `REQ-004` foi escrito). Execução manual do checklist pendente do usuário.

- [x] `TASK-005`: Criar workflow de CI (build + lint) em pull requests.
  - Refs: `REQ-005`, `AC-003`, `DEC-002`, `DEC-002b`, `RISK-001`.
  - Aceite: `.github/workflows/ci.yml` roda `npm run lint`/`npm run test` (ubuntu) e `npm run build` (ubuntu/macos/windows) em PRs pra `main`.
  - Verificação: `npm run build`/`npm run lint`/`npm run test` passam localmente antes de tornar o CI obrigatório (`RISK-001` mitigado). Disparo real do workflow no GitHub pendente do usuário (sem acesso ao Actions deste ambiente).

- [x] `TASK-006`: Revisar o workflow de release existente.
  - Refs: `REQ-006`.
  - Verificação: leitura crítica de `release.yml` — achado: publicava sem rodar lint ou teste nenhuma vez, contradizendo `AC-004`. Corrigido com um job `quality-gate` novo (`DEC-002c`), sem trocar a ferramenta/estratégia de release (fora de escopo).

- [x] `TASK-007`: Garantir build Windows, Linux e macOS.
  - Refs: `REQ-007`, `AC-004`, `DEC-002b`.
  - Verificação: job `build` do `ci.yml` roda `npm run build` (compilação/bundling via `electron-vite`) nos 3 SOs a cada PR — é o passo que pode quebrar por SO (paths, resolução de módulo). O empacotamento completo (instalador/DMG/AppImage) já é coberto pelo `release.yml` existente nas tags, fora do escopo de mudar aqui. Execução real nos runners do GitHub pendente do usuário.

## Validação Final

- [x] `npm run build` executado — sem erros.
- [x] `npm run lint` executado — sem erros.
- [x] `npm run test` executado — 78 testes, todos passando.
- [ ] Checklist de QA executado manualmente ao menos uma vez — pendente do usuário.
- [ ] CI (`ci.yml`) e gate de qualidade (`release.yml`) disparando de verdade no GitHub — pendente do usuário (sem acesso ao Actions deste ambiente de implementação).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-10-10 | `TASK-001` | `npm install -D vitest jsdom` inicialmente falhou (ERESOLVE — `vitest@5` exige Vite `^6`+, este projeto usa Vite `^5` via `electron-vite@2`); resolvido fixando `vitest@^2`. `jsdom@30` instalado primeiro trouxe `EBADENGINE` (dependência transitiva `tr46@7` exige Node `^22`/`>=24`, ambiente tem `20.12.2`); trocado por `jsdom@^25`, sem warnings. `vitest.config.ts` criado com os aliases `@shared`/`@renderer` do projeto e `environment: 'jsdom'` |
| 2026-10-10 | `TASK-002`/`TASK-003` | 17 arquivos de teste criados, 78 testes, todos passando de primeira (exceto um). Um teste novo de `countWords` (`getHeadings.test.ts`) encontrou um bug real e pré-existente: `doc.textContent` junta texto de blocos diferentes sem espaço, subcontando palavras na fronteira entre blocos. Corrigido trocando por `doc.textBetween(0, doc.content.size, ' ')` — depois disso, `npm run test` passou 100% |
| 2026-10-10 | Correção de lint | Testes de API usavam `as any` pra mockar `window.api`, batendo no `@typescript-eslint/no-explicit-any` (erro, não warning, no preset deste projeto). Corrigido com `testWindowApi.ts`, um helper tipado que usa `unknown` como intermediário em vez de `any` |
| 2026-10-10 | `TASK-004` | `docs/qa-checklist.md` criado — expandido além do escopo original (5 fluxos) pra cobrir as sub-specs da `010` que já existem hoje, senão o checklist cobriria só uma fração pequena do app atual |
| 2026-10-10 | `TASK-005`/`TASK-006`/`TASK-007` | `.github/workflows/ci.yml` criado (lint+teste em `ubuntu-latest`, build nos 3 SOs, em PRs e push pra `main`). Revisão do `release.yml` encontrou que ele publicava sem rodar lint/teste — corrigido com um job `quality-gate` novo do qual o job `release` passa a depender, sem trocar a ferramenta de release (`action-electron-builder`) em si |
