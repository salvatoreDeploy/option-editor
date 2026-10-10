# Spec 009 — Quality & Testability — Requirements

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário — inclusive confirmar que o CI dispara de verdade no GitHub)

## Sizing

`Medium`

## Problema

O projeto não tem nenhum framework de teste instalado, nem checklist formal de QA. O CI (`.github/workflows/release.yml`) só roda em tags de release, sem verificação de build/lint em pull requests.

## Objetivo

Criar confiança para evoluir o produto: testes básicos, checklist manual de QA e CI de verificação em PRs.

## Fora De Escopo

- Testes end-to-end de UI completos (fica como possível evolução, não bloqueia esta spec).
- Mudar a estratégia de release atual (`release.yml` continua para tags).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Escolher e configurar um runner de testes (ex. Vitest, já que o projeto usa Vite via `electron-vite`) | Explícito (achado na análise) |
| `REQ-002` | Adicionar testes unitários para funções de API/contratos simples (`src/renderer/src/api/*`) | Explícito (BACKLOG Sprint 7) |
| `REQ-003` | Adicionar testes para helpers de documento criados nas specs anteriores (ex. `parseContent.ts` da spec `008`) | Explícito (BACKLOG Sprint 7) |
| `REQ-004` | Criar checklist manual de QA cobrindo criação, edição/autosave, busca, abertura pelo tray e exclusão com confirmação | Explícito (BACKLOG Sprint 7) |
| `REQ-005` | Adicionar workflow de CI (build + lint) rodando em pull requests | Explícito (achado na análise) |
| `REQ-006` | Revisar o workflow de release existente | Explícito (BACKLOG Sprint 7) |
| `REQ-007` | Garantir build Windows, Linux e macOS | Explícito (BACKLOG Sprint 7) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Testes não podem depender de uma instância real do Electron rodando (unitários puros para lógica isolada) |

## Restrições

- Nenhuma dependência de teste deve exigir sandbox/display gráfico no CI (evitar testes que precisem abrir uma janela Electron real nesta primeira etapa).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Existe um comando `npm run test` funcional |
| `AC-002` | Existe processo repetível de validação manual (checklist) |
| `AC-003` | Um pull request roda build e lint automaticamente antes de poder ser mergeado |
| `AC-004` | Release não depende apenas de teste manual informal |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Configurar CI de PR pode expor erros de build/lint já existentes e represados | Rodar `npm run build`/`npm run lint` localmente primeiro e registrar/corrigir os erros encontrados antes de tornar o CI obrigatório |
