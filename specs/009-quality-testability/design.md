# Spec 009 — Quality & Testability — Design

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário)

## Resumo Técnico

Vitest adicionado ao projeto (mesma ferramenta base do Vite/electron-vite já usado), cobrindo funções puras já isoláveis (API helpers, helpers de conteúdo/Markdown/busca, `parseContent.ts`/`getHeadings.ts`). Checklist de QA em Markdown versionado (`docs/qa-checklist.md`), expandido além do escopo original dos 5 fluxos (criação/autosave/busca/tray/exclusão) pra cobrir todas as sub-specs da `010` que já existiam quando esta spec foi executada (exportar/importar, atalhos, tema, configurações, perfil/trava local) — sem isso o checklist cobriria só uma fração pequena do app atual. Dois workflows de CI: `.github/workflows/ci.yml` novo (lint+teste em PRs, build nos 3 SOs) e um gate de qualidade adicionado ao `release.yml` já existente (lint+teste antes de empacotar, sem mudar a ferramenta/estratégia de release).

## Arquivos Afetados

- `package.json` (script `test`; devDependencies `vitest`, `jsdom`)
- Novo: `vitest.config.ts`
- Novo: `src/renderer/src/lib/*.test.ts` (`formatRelativeTime`, `keyboardShortcut`, `htmlText`, `markdownToHtml`, `htmlToMarkdown`, `searchDocuments`, `buildExportContent`)
- Novo: `src/renderer/src/components/Editor/testEditor.ts` (helper de teste — monta um `Editor` do Tiptap real, mesmo schema de título da produção) + `parseContent.test.ts` + `getHeadings.test.ts`
- Novo: `src/renderer/src/api/testWindowApi.ts` (helper de teste, tipado, sem `any`) + `*.test.ts` para uma amostra representativa dos helpers de API
- `src/renderer/src/components/Editor/getHeadings.ts` (correção de bug encontrado pelo teste — ver `DEC-004`)
- Novo: `docs/qa-checklist.md`
- Novo: `.github/workflows/ci.yml`
- `.github/workflows/release.yml` (job `quality-gate` novo, `release` passa a depender dele)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Usar Vitest em vez de Jest | Integra diretamente com a config Vite/electron-vite já existente, sem transformador adicional |
| `DEC-001b` | Fixar `vitest@^2`/`jsdom@^25` em vez das versões mais novas | `vitest@5` (latest) exige Vite `^6`/`^7`/`^8`, e este projeto está preso ao Vite `^5` pelo `electron-vite@2`; `jsdom@30` traz uma dependência transitiva (`tr46@7`) que exige Node `^22`/`>=24`, mais novo que o Node instalado neste ambiente (`20.12.2`) |
| `DEC-002` | Criar `.github/workflows/ci.yml` separado de `release.yml`, disparado em `pull_request`/`push` para `main` | Mantém o gatilho de release (por tag) intocado; `ci.yml` cobre o ciclo de desenvolvimento normal |
| `DEC-002b` | `ci.yml` tem dois jobs: `lint-and-test` (só `ubuntu-latest`, roda lint+teste) e `build` (matriz `ubuntu-latest`/`macos-latest`/`windows-latest`, roda só `npm run build`) | Lint/teste não variam por SO nesse projeto (lógica pura, sem binário nativo testado); separar evita rodar os mesmos lint/teste 3x. `build` nos 3 SOs cobre `REQ-007` — é o passo de compilação/bundling (`electron-vite build`) que pode quebrar por SO (paths, módulos nativos), não o empacotamento completo (instalador/DMG), que já é coberto pelo `release.yml` nas tags |
| `DEC-002c` | Gate de qualidade (lint+teste) adicionado como job novo (`quality-gate`) dentro do `release.yml` existente, com `release: needs: quality-gate`, em vez de reescrever o workflow de release | Resolve `AC-004` ("release não depende só de teste manual") sem violar a restrição de não mudar a estratégia/ferramenta de release (`action-electron-builder` continua a mesma) — achado na revisão crítica do `release.yml` (`TASK-006`): hoje ele empacota e publica sem rodar lint ou teste nenhuma vez |
| `DEC-003` | Checklist de QA vive em um arquivo próprio versionado (`docs/qa-checklist.md`), não só na spec, para ser reutilizável fora do processo de specs | Facilita consulta rápida sem abrir o histórico de specs |
| `DEC-004` | Corrigido `countWords` (`getHeadings.ts`) pra usar `doc.textBetween(0, doc.content.size, ' ')` em vez de `doc.textContent` | Um teste novo (`getHeadings.test.ts`) encontrou que `doc.textContent` concatena o texto de blocos diferentes sem separador (`"Dois" + "Três"` vira `"DoisTrês"`), subcontando palavras na fronteira entre blocos — bug real, pré-existente, de baixo risco e correção de uma linha; corrigido no mesmo passo em vez de só documentado, já que é exatamente o tipo de regressão que esta spec existe pra pegar |
| `DEC-005` | Cobertura de API helpers (`REQ-002`) é uma amostra representativa (9 arquivos de ~22), não todos | Os helpers de `src/renderer/src/api/*` são majoritariamente delegadores de uma linha pro `window.api` — testar os ~22 individualmente seria repetição mecânica. A amostra cobre os formatos que existem (retorno `void`, desembrulho de `{ data }`, resposta completa sem desembrulhar, parâmetro único vs. objeto) |
| `DEC-006` | Mock de `window.api` nos testes via helper tipado (`testWindowApi.ts`), nunca `as any` | O preset de lint do projeto (`@typescript-eslint/recommended` via `@rocketseat/eslint-config`) trata `no-explicit-any` como erro — o helper usa `unknown` como intermediário, permitido pela regra |

## Contratos

Nenhum contrato de produto muda. Dois contratos de processo novos: PRs precisam passar lint+teste no CI (`ci.yml`), e tags de release só publicam se lint+teste passarem (`release.yml`, `quality-gate`).

## Alternativas Consideradas

- Jest: descartado por exigir configuração adicional de transformação que o Vitest já resolve via Vite.
- Rodar lint/teste em todos os 3 SOs no `ci.yml`: descartado (`DEC-002b`) — custo de CI maior sem ganho real, já que lint/teste não dependem de SO neste projeto.
- Reescrever `release.yml` pra outra ferramenta/estratégia de release: fora de escopo por decisão explícita da spec (`Fora De Escopo`); a correção (`DEC-002c`) só adiciona um gate antes do job existente.

## Research Hooks

Resolvido durante a implementação: `electron-vite`/Vite não exigiu nenhum ajuste além dos aliases `@shared`/`@renderer` já usados no projeto, replicados em `vitest.config.ts`.

## Impactos

- Build/CI: workflow novo (`ci.yml`), job novo em `release.yml`, script `npm run test`.
- Renderer: 17 arquivos de teste novos, mais dois helpers de teste (`testEditor.ts`, `testWindowApi.ts`) e uma correção de bug real (`getHeadings.ts`).
- Nenhum impacto em runtime do app além da correção de `countWords`.

## Plano De Validação

- `npm run test` — 78 testes, todos passando.
- `npm run build`
- `npm run lint`
- Abrir um PR de teste no GitHub e confirmar que `ci.yml` dispara (lint+teste em `ubuntu-latest`, build nos 3 SOs) — **não verificável neste ambiente** (sem acesso ao GitHub Actions daqui); pendente do usuário.
- Rodar o checklist de QA (`docs/qa-checklist.md`) manualmente ao menos uma vez — pendente do usuário.
