# Specs — OptionEditor

Diretório de specs do projeto.

Cada spec representa uma mudança planejada, com requisitos, desenho técnico e tarefas verificáveis.

## Specs Atuais

| ID | Nome | Estado | Objetivo |
|---|---|---|---|
| `000-foundation` | Foundation | `ready` | Definir base de estabilização, padrões e próximos passos do projeto |
| `001-design-system-foundation` | Design System Foundation | `done` | Criar design-kit e telas base no Pencil para orientar a refatoração da UI |
| `002-account-settings-screens` | Account Settings Screens | `done` | Criar telas de login, perfil e configurações no Pencil |
| `003-technical-stabilization` | Technical Stabilization | `done` | Sprint 1 do backlog: efeitos colaterais em render, confirmação de exclusão, remoção de logs/IPC de teste, typos |
| `004-ipc-typing-contracts` | IPC Typing & Contracts | `done` | Sprint 2 do backlog: tipagem de `window.api` e contratos IPC em `src/shared` |
| `005-persistence-autosave` | Persistence & Autosave | `done` | Sprint 4 do backlog: debounce, tratamento de erro e schema do `electron-store` |
| `006-domain-organization` | Domain Organization | `done` | Sprint 3 do backlog: nomenclatura de domínio, constantes IPC, textos hardcoded |
| `007-ux-essentials` | UX Essentials | `done` | Sprint 5 do backlog, expandida em 2026-09-14 pra migração completa de design a partir do Pencil (tokens, Sidebar, Header, diálogos, Inspector Panel novo) |
| `008-editor-refactor` | Editor Refactor | `done` | Sprint 6 do backlog: extração de título sem regex frágil, modelo de conteúdo do Tiptap |
| `010-controlled-expansion` | Controlled Expansion | `in-progress` | Sprint 8 do backlog: features novas pós-estabilização — reordenada antes da `009` por decisão do usuário (2026-09-17) |
| `010a-recent-documents` | Recent Documents | `done` | Sub-spec da `010`: documentos recentes reais (por `updatedAt`, não por posição no array) no tray e na Sidebar |
| `010b-trash-recovery` | Trash / Recovery | `done` | Sub-spec da `010`: exclusão vira soft-delete + toast "Desfazer" |
| `010c-document-actions` | Document Actions | `done` | Sub-spec da `010`: renomear, duplicar e favoritar (Header e Sidebar) |
| `010d-content-search` | Content Search | `done` | Sub-spec da `010`: busca por título e conteúdo no Command Dialog |
| `010e-configurable-shortcuts` | Configurable Shortcuts | `done` | Sub-spec da `010`: atalhos de "novo documento" e "busca rápida" configuráveis, via diálogo |
| `010f-theme-toggle` | Theme Toggle | `done` | Sub-spec da `010`: tema claro/escuro |
| `010g-document-export` | Document Export | `in-progress` | Sub-spec da `010`: exportar documento como `.html`, `.md`, `.txt` ou `.pdf` — falta validação manual do usuário |
| `010h-markdown-import` | Markdown Import | `done` | Sub-spec da `010`: importar arquivo `.md`/`.markdown` como documento novo, caminho inverso da `010g` |
| `010i-app-settings` | App Settings Screen | `done` | Sub-spec da `010`: tela `/settings` (nome do workspace, pasta de dados, atalhos, autosave e verificação ortográfica togláveis, limpar dados locais), a partir do desenho `Screen / Settings` do Pencil |
| `010j-local-profile` | Local Profile & Lock | `done` | Sub-spec da `010`: trava de acesso local opcional (senha/PIN com hash) + tela `/profile` (identidade, estatísticas reais, feed de atividade real), a partir dos desenhos `Screen / Login` e `Screen / Profile` do Pencil |
| `009-quality-testability` | Quality & Testability | `in-progress` | Sprint 8 do backlog: testes (Vitest), checklist de QA, CI de build/lint/teste em PRs + gate de qualidade no release — falta validação manual do usuário (rodar o checklist, confirmar que o CI dispara no GitHub) |

Ordem de execução atual: `010` (e suas sub-specs `010a`, `010b`, ...) antes da `009`, por decisão explícita do usuário — ver "Ordem Recomendada" no `BACKLOG.md`.

## Como Criar Uma Nova Spec

1. Classificar a mudança como `Small`, `Medium`, `Large` ou `Complex`.
2. Copiar os arquivos de `specs/_template/` para `specs/<id>-<nome>/`.
3. Preencher `requirements.md` com a fase `Specify`.
4. Preencher `design.md` quando o sizing exigir desenho técnico.
5. Preencher `tasks.md` com tarefas atômicas.
6. Atualizar esta tabela.

## Template

```text
specs/001-example/
  requirements.md
  design.md
  tasks.md
```

O template base está em `specs/_template/`.

## Fases

- `Specify`: escopo explícito e implícito, requisitos e aceite.
- `Design`: decisões técnicas, arquivos afetados, contratos e riscos.
- `Tasks`: tarefas atômicas com verificação.
- `Execute`: implementação, validação e atualização da spec.

## Status Permitidos

- `draft`
- `ready`
- `in-progress`
- `done`
- `blocked`
