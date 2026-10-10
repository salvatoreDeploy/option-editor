# Spec 000 — Foundation Tasks

## Estado

`ready`

## Tarefas

- [x] Criar `BACKLOG.md` com sprints de estabilização e expansão.
- [x] Criar `SPEC_DRIVEN_DEVELOPMENT.md`.
- [x] Criar `specs/README.md`.
- [x] Criar `specs/000-foundation/requirements.md`.
- [x] Criar `specs/000-foundation/design.md`.
- [x] Criar `specs/000-foundation/tasks.md`.
- [x] Criar `agents/README.md`.
- [x] Criar `agents/skills/README.md`.
- [x] Atualizar `BACKLOG.md` para apontar para specs rastreáveis.
- [x] Atualizar processo com fases `Specify`, `Design`, `Tasks` e `Execute`.
- [x] Adicionar sizing adaptativo `Small`, `Medium`, `Large` e `Complex`.
- [x] Criar templates reutilizáveis em `specs/_template/`.

## Tarefas De Preparação (Sprint 0 Do Backlog)

Tarefas de manutenção que não introduzem comportamento novo, por isso ficam registradas aqui em vez de em uma spec própria (ver regra em `SPEC_DRIVEN_DEVELOPMENT.md`).

- [x] Rodar `npm install` — ok, 839 pacotes instalados (Node v20.12.2 usado nesta sessão), 75 vulnerabilidades reportadas pelo `npm audit` (não avaliadas ainda, ver nota abaixo).
- [x] Validar `npm run build` e registrar erros reais encontrados — `electron-vite build` passa. `npx tsc --noEmit` (checagem de tipo mais estrita, não coberta pelo build do Vite) aponta 1 erro real: `src/main/index.ts(4,18): error TS2307: Cannot find module '../../resources/icon.png?asset'` (falta declaração de tipo para import de asset `?asset` do Vite). A hipótese original de conflito em `Window.api` (`unknown` vs `typeof api`) **não gera erro hoje** porque `tsconfig.json` tem `skipLibCheck: true`, que suprime a checagem cruzada entre declarações `.d.ts`; o conflito continua real e é tratado na spec `004-ipc-typing-contracts`.
- [x] Validar `npm run lint` e registrar erros reais encontrados — 0 erros, 2 warnings (`react-hooks/exhaustive-deps` em `Sidebar/index.tsx` e `Sidebar/CreatePage.tsx`). O de `Sidebar/index.tsx` foi corrigido durante a spec `003-technical-stabilization`; o de `CreatePage.tsx` permanece, fora do escopo da `003`.
- [ ] Confirmar versão mínima do Node.js e adicionar campo `engines` em `package.json`.
- [ ] Criar documentação básica de setup no `README.md`.
- [x] Definir nome oficial do produto: `OptionEditor`, `TaskNet` ou outro — decidido `OptionEditor` (propagado em `package.json`, `index.html`, tray e `README.md` na spec `006-domain-organization`).

## Validação

- [ ] Revisar documentação criada.
- [ ] Confirmar que a próxima implementação terá spec própria.

## Correção De Numeração (2026-09-11)

A recomendação original abaixo apontava `001-technical-stabilization`, mas os IDs `001` e `002` já foram usados por `001-design-system-foundation` e `002-account-settings-screens` (specs de design, não desta trilha de estabilização). A numeração desta trilha continua a partir de `003`.

## Specs Recomendadas Para O Backlog

Cada sprint do `BACKLOG.md` (a partir da Sprint 1) vira uma spec própria, na ordem recomendada pelo próprio backlog:

| Spec | Sprint | Escopo resumido |
|---|---|---|
| `003-technical-stabilization` | Sprint 1 | Efeitos colaterais em render, confirmação de exclusão, remoção de logs/IPC de teste, typos de shortcuts/tray |
| `004-ipc-typing-contracts` | Sprint 2 | Tipagem de `window.api`, contratos IPC em `src/shared/types` |
| `005-persistence-autosave` | Sprint 4 | Debounce de autosave, tratamento de erro, schema do `electron-store` |
| `006-domain-organization` | Sprint 3 | Nomenclatura de domínio `document`, constantes IPC, textos hardcoded |
| `007-ux-essentials` | Sprint 5 | Estados vazios, loading, título, breadcrumb, acessibilidade |
| `008-editor-refactor` | Sprint 6 | Extração de título sem regex frágil, modelo de conteúdo do Tiptap |
| `009-quality-testability` | Sprint 7 | Testes, checklist de QA, CI de build/lint |
| `010-controlled-expansion` | Sprint 8 | Features novas pós-estabilização |

A ordem de execução segue a seção "Ordem Recomendada" do `BACKLOG.md`.
