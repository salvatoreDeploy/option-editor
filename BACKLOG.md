# BACKLOG.md — OptionEditor

Backlog de refatoração, limpeza, estabilização e expansão do projeto.

Este backlog deve ser executado usando o processo definido em `SPEC_DRIVEN_DEVELOPMENT.md`.

Cada sprint deve ser convertida em uma ou mais specs dentro de `specs/` antes de alterar código relevante.

## Objetivo

Solidificar o OptionEditor como um app desktop Electron confiável, tipado, organizado e pronto para evolução contínua.

## Design

O arquivo `openeditor.pen` (Pencil) é a fonte do novo design do produto. Specs `001-design-system-foundation` e `002-account-settings-screens` já cobriram design-kit e telas de conta. Sprints de UI (5 e 8) devem consultar o Pencil (via MCP) antes de implementar mudanças visuais, para alinhar com o novo design em vez de manter o visual atual.

## Sprint 0 — Preparação

Spec: tarefas registradas em `specs/000-foundation/tasks.md` (não gera spec própria por não introduzir comportamento novo).

### Objetivo

Deixar o ambiente verificável e documentado.

### Entregas

- [x] Rodar `npm install`.
- [x] Validar `npm run build`.
- [x] Validar `npm run lint`.
- [x] Registrar erros atuais reais de build e lint (ver detalhes em `specs/000-foundation/tasks.md`).
- [ ] Confirmar versão mínima do Node.js.
- [ ] Criar documentação básica de setup no `README.md`.
- [x] Definir nome oficial do produto: `OptionEditor`, `TaskNet` ou outro — decidido: `OptionEditor`.

### Critérios de aceite

- [x] Projeto instala sem erro.
- [x] Build e lint rodam, mesmo que ainda apontem falhas.
- [ ] README explica como rodar localmente.

## Sprint 1 — Estabilização Técnica

Spec: `specs/003-technical-stabilization`.

### Objetivo

Remover riscos óbvios de bug e comportamento imprevisível.

### Entregas

- [x] Mover chamadas assíncronas do render para `useEffect`.
- [x] Corrigir `Sidebar` para não chamar `getDocumentsfn()` a cada render.
- [x] Adicionar confirmação antes de excluir documento.
- [x] Remover `console.log(store.path)`.
- [x] Remover IPC de teste `ping/pong`.
- [x] Renomear `shortcurts.ts` para `shortcuts.ts`.
- [x] Renomear `createShortcurts` para `createShortcuts`.
- [x] Renomear evento `abir-documento` para `open-document`.
- [x] Renomear evento `all-documento` para `documents:tray-sync`.
- [x] Remover `@ts-ignore` e o `eslint-disable @typescript-eslint/ban-ts-comment` em `src/main/ipc.ts`.
- [x] Remover `eslint-disable @typescript-eslint/no-unused-vars` em `src/renderer/src/pages/document.tsx` (revisar se o import ainda é necessário).

### Critérios de aceite

- [x] Criar, abrir, editar e excluir documento continua funcionando.
- [x] Exclusão exige confirmação.
- [x] Nenhuma chamada IPC ocorre diretamente durante renderização.
- [x] Não há `@ts-ignore` no código principal.

## Sprint 2 — Tipagem E Contratos

Spec: `specs/004-ipc-typing-contracts`.

### Objetivo

Fortalecer a fronteira entre Electron, preload e renderer.

### Entregas

- [x] Tipar corretamente `window.api`.
- [x] Remover `api: unknown` de `src/preload/index.d.ts` — hoje conflita com a declaração global `Window.api: typeof api` feita em `src/preload/index.ts`, que já é a fonte de verdade do tipo.
- [x] Criar tipo explícito para a API exposta pelo preload.
- [x] Padronizar respostas IPC.
- [x] Definir contratos em `src/shared/types`.
- [x] Tipar retorno de `fetchDocument`/`FetchDocumentResponse.data` para refletir que o documento pode não existir (`Document | undefined`), em vez de assumir sempre `Document`.
- [x] Tipar retornos das funções em `src/renderer/src/api`.
- [x] Remover eslint disables desnecessários.
- [x] Revisar imports com aliases inconsistentes (`~/*` vs `@*` em `tsconfig.json`, usados de forma misturada em `src/renderer/src/pages`).

### Critérios de aceite

- [x] Renderer reconhece `window.api.fetchDocuments`, `createDocument`, `saveDocument` e `deleteDocument` com tipos corretos.
- [x] TypeScript protege chamadas IPC.
- [x] `npm run build` passa sem erros de tipo.
- [x] Código não depende de suppressions desnecessários.

## Sprint 3 — Organização De Domínio

Spec: `specs/006-domain-organization`.

### Objetivo

Deixar o projeto com linguagem consistente e estrutura escalável.

### Entregas

- [x] Padronizar o domínio como `document`.
- [x] Consolidar nomes de funções de documento (`getDocuments`→`fetchDocuments`, `saveStateDocument`→`saveDocument`).
- [x] Separar tipos principais de documento (já eram separados em `src/shared/types/ipc.ts`: `Document` vs. tipos de request/response).
- [x] Criar constantes IPC sem espaços nos nomes (feito na spec `004-ipc-typing-contracts`).
- [x] Padronizar textos da interface em português.
- [x] Remover textos hardcoded incoerentes como `Back-end`, `Estrutura técnica` e `Untitled` fixo no breadcrumb (`src/renderer/src/components/Header/index.tsx`).
- [x] Decidir nome oficial do produto e alinhar `package.json` (`tasknet`), UI (tray/menu mostram `TaskNet`) e specs/backlog (`OptionEditor`) — decidido `OptionEditor`; `package.json`, `index.html` e o tray já alinhados.

### Critérios de aceite

- [x] Nomes internos seguem um padrão único.
- [x] UI não exibe placeholders estruturais como se fossem dados reais.
- [x] Breadcrumb/header refletem o documento aberto ou ocultam dados inexistentes.

## Sprint 4 — Persistência E Autosave

Spec: `specs/005-persistence-autosave`.

### Objetivo

Tornar o salvamento confiável e menos custoso.

### Entregas

- [x] Adicionar debounce no autosave do editor.
- [x] Evitar salvar se conteúdo não mudou.
- [x] Tratar erro ao salvar documento.
- [x] Exibir estado simples de salvamento: `Salvando...`, `Salvo`, `Erro ao salvar`.
- [x] Proteger busca de documento inexistente.
- [x] Tratar exclusão de documento aberto.
- [x] Definir schema mínimo do `electron-store`.

### Critérios de aceite

- [x] Digitar no editor não dispara escrita imediata a cada tecla.
- [x] Usuário recebe feedback de salvamento.
- [x] App não quebra ao abrir documento inexistente.
- [x] Persistência local fica previsível.

## Sprint 5 — UX Essencial

Spec: `specs/007-ux-essentials`.

### Objetivo

Melhorar o uso diário sem aumentar complexidade desnecessária. Expandida em 2026-09-14 (Pencil conectado) para migração completa de design: tokens de cor/fonte, Sidebar, Header, Editor com Inspector Panel novo, diálogos, Command Dialog de busca — ver `specs/007-ux-essentials`.

### Entregas

- [x] Melhorar tela vazia.
- [x] Melhorar criação de documento.
- [x] Adicionar edição clara do título.
- [x] Atualizar breadcrumb com título real.
- [x] Melhorar busca rápida.
- [x] Adicionar estado vazio na busca.
- [x] Adicionar loading states.
- [x] Melhorar acessibilidade básica de botões e dialogs.
- [x] Revisar responsividade mínima da janela.
- [x] Migrar tokens de design (cor, fonte, raio) para os valores de `openeditor.pen`.
- [x] Reconstruir Sidebar, Header, diálogo de exclusão e ToC seguindo o Pencil.
- [x] Adicionar Inspector Panel (novo, não existia antes).

### Critérios de aceite

- [x] Usuário entende o que fazer ao abrir o app.
- [x] Documento criado recebe foco correto.
- [x] Busca e navegação funcionam de forma fluida.
- [x] Header mostra informações reais.

## Sprint 6 — Refatoração Do Editor

Spec: `specs/008-editor-refactor`.

### Objetivo

Reduzir fragilidade da integração com Tiptap.

### Entregas

- [x] Substituir regex frágil de extração de título por lógica mais segura.
- [x] Definir modelo claro para título e conteúdo.
- [x] Revisar extensão `Document.extend`.
- [x] Garantir título vazio tratado corretamente.
- [x] Avaliar suporte a Markdown e code blocks.
- [x] Melhorar placeholder.
- [x] Revisar comportamento de autofocus.
- [x] Fazer o `ToC` (`src/renderer/src/pages/document.tsx`) refletir os headings reais do documento — hoje mostra `Back-end`/`Banco de Dados` fixos, sem relação com o conteúdo aberto (achado durante a spec `006-domain-organization`, fora do escopo dela por depender do parsing do doc do Tiptap). Implementado na prática pela spec `007-ux-essentials` (`TASK-007`), já que o `ToC` foi reconstruído junto com o resto de `document.tsx` durante a migração de design — `src/renderer/src/components/Editor/getHeadings.ts` lê os headings reais via `doc.descendants`. Validado e confirmado pelo usuário.

### Critérios de aceite

- [x] Título não quebra com HTML inesperado.
- [x] Conteúdo não é perdido durante edição.
- [x] Editor continua carregando documentos antigos.


## Sprint 7 — Expansão Controlada

Spec: `specs/010-controlled-expansion`.

### Objetivo

Adicionar valor sem comprometer a base estabilizada.

### Possíveis features

- [x] Renomear documento explicitamente — `specs/010c-document-actions`, implementada e validada.
- [x] Duplicar documento — `specs/010c-document-actions`, implementada e validada.
- [x] Favoritar documentos — `specs/010c-document-actions`, implementada e validada.
- [x] Documentos recentes reais — `specs/010a-recent-documents`, implementada e validada.
- [x] Buscar por conteúdo — `specs/010d-content-search`, implementada e validada.
- [x] Exportar documento como `.html`, `.md`, `.txt` ou `.pdf` — `specs/010g-document-export`, implementada, falta validação manual do usuário. Escopo ampliado por pedido do usuário (`.pdf` e `.txt` não previstos originalmente).
- [x] Importar arquivo Markdown — `specs/010h-markdown-import`, implementada e validada.
- [x] Criar tela de configurações do app — `specs/010i-app-settings`, implementada e validada.
- [x] Tornar atalhos configuráveis — `specs/010e-configurable-shortcuts`, implementada e validada.
- [x] Adicionar tema claro/escuro — `specs/010f-theme-toggle`, implementada e validada.
- [x] Adicionar lixeira ou recuperação após exclusão — `specs/010b-trash-recovery` (soft-delete + toast "Desfazer"), implementada e validada.
- [x] Implementar login/perfil real — `specs/010j-local-profile`, implementada e validada. O antigo `Profile.tsx` (`isAuthenticated = false` fixo) já tinha sido removido do código antes desta spec; reformulado como trava de acesso local (senha/PIN opcional, sem backend) + Perfil com dados reais, a partir do design de `specs/002-account-settings-screens` (Pencil).

### Critérios de aceite

- [ ] Cada feature entra com contrato claro.
- [ ] Nenhuma feature nova quebra criar, editar, salvar, buscar ou excluir.
- [ ] README é atualizado junto com a feature.

## Sprint 8 — Qualidade E Testabilidade

Spec: `specs/009-quality-testability`.

### Objetivo

Criar confiança para evoluir o produto.

### Entregas

- [x] Escolher e configurar um runner de testes (ex.: Vitest) — `specs/009-quality-testability`, Vitest configurado (`vitest@^2`/`jsdom@^25`, compatíveis com o Vite `^5` deste projeto), `npm run test` funcional.
- [x] Adicionar testes unitários para funções de API/contratos simples — amostra representativa de `src/renderer/src/api/*`.
- [x] Adicionar testes para helpers de documento, se criados — `parseContent.ts`/`getHeadings.ts` (via `Editor` real do Tiptap) + helpers de conteúdo/Markdown/busca das specs `010d`/`010g`/`010h`. Um teste encontrou e corrigiu um bug real de contagem de palavras (`getHeadings.ts`).
- [x] Criar checklist manual de QA — `docs/qa-checklist.md`, ampliado além dos 5 fluxos originais pra cobrir exportar/importar, atalhos, tema, configurações e perfil/trava local.
- [ ] Validar fluxo de criação de documento — checklist pronto (`docs/qa-checklist.md`, seção 1), execução manual pendente do usuário.
- [ ] Validar fluxo de edição e autosave — checklist pronto (seção 2), execução manual pendente do usuário.
- [ ] Validar fluxo de busca — checklist pronto (seção 3), execução manual pendente do usuário.
- [ ] Validar abertura pelo tray — checklist pronto (seção 4), execução manual pendente do usuário.
- [ ] Validar exclusão com confirmação — checklist pronto (seção 5), execução manual pendente do usuário.
- [x] Adicionar workflow de CI (build + lint) rodando em pull requests — `.github/workflows/ci.yml` novo (lint+teste em `ubuntu-latest`, build nos 3 SOs), falta confirmar que dispara de verdade no GitHub (sem acesso ao Actions no ambiente de implementação).
- [x] Revisar GitHub Actions — `release.yml` publicava sem rodar lint/teste nenhuma vez; corrigido com um job `quality-gate` novo, sem trocar a ferramenta/estratégia de release.
- [x] Garantir build Windows, Linux e macOS — job `build` do `ci.yml` roda `npm run build` nos 3 SOs a cada PR; execução real nos runners do GitHub pendente do usuário.

### Critérios de aceite

- [x] Existe processo repetível de validação — `npm run test` + `docs/qa-checklist.md` + CI.
- [x] Release não depende apenas de teste manual informal — `release.yml` agora exige lint+teste (`quality-gate`) antes de publicar.
- [x] Build local passa — `npm run build` ok.



## Padrões Recomendados

- TypeScript estrito, sem `any` e sem `@ts-ignore`.
- IPC sempre definido em `src/shared`.
- Renderer nunca acessa Electron diretamente fora do preload.
- Toda ação destrutiva exige confirmação.
- Toda operação assíncrona tem tratamento de erro.
- Autosave sempre com debounce.
- Nome de domínio único: `document`.
- Arquivos em kebab-case.
- Componentes React em PascalCase.
- Commits em Conventional Commits, preferencialmente em português.

## Ordem Recomendada

1. Sprint 0 — Preparação.
2. Sprint 1 — Estabilização Técnica.
3. Sprint 2 — Tipagem E Contratos.
4. Sprint 4 — Persistência E Autosave.
5. Sprint 3 — Organização De Domínio.
6. Sprint 5 — UX Essencial.
7. Sprint 6 — Refatoração Do Editor.
8. Sprint 8 — Expansão Controlada.
9. Sprint 7 — Qualidade E Testabilidade.

Ordem original previa a Sprint 7 (Qualidade e Testabilidade) antes da Sprint 8 (Expansão Controlada). Invertida por decisão explícita do usuário em 2026-09-17: a `009-quality-testability` passa a ser a última spec implementada, depois de toda a expansão de features da `010-controlled-expansion` (ver `RISK-001`/`RISK-002` em `specs/010-controlled-expansion/requirements.md`).

Esta lista também corrigia um erro de rotulagem: os itens 8/9 estavam com os nomes das sprints trocados entre si (a numeração dizia "Sprint 7 — Expansão Controlada" e "Sprint 8 — Qualidade E Testabilidade", mas Expansão Controlada é a Sprint 8 e Qualidade E Testabilidade é a Sprint 7, conforme as seções acima neste mesmo arquivo).

