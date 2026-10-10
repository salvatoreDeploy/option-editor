# Spec 010j — Local Profile & Lock — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Contratos — tipos de auth/activity em `src/shared/types/ipc.ts`; `IPC.AUTH`/`IPC.ACTIVITY` em `src/shared/constants/ipc.ts`.
  - Refs: `REQ-001`–`REQ-009`.
  - Aceite: tipos/constantes disponíveis para main/preload/renderer.
  - Verificação: `npm run build` — ok.

- [x] `TASK-002`: `src/main/store.ts` — `auth: AuthRecord | null` (default `null`) e `activity: ActivityEntry[]` (default `[]`) no `StoreType`, entradas no `schema`.
  - Refs: `REQ-001`, `REQ-009`.
  - Aceite: `store.get('auth')`/`store.get('activity')` funcionam com os defaults.
  - Verificação: `npm run build` — ok.

- [x] `TASK-003`: `src/main/auth.ts` — `createAuthHandlers()`: `FETCH_STATUS`, `SET_PASSWORD` (hash com `scryptSync`+salt), `REMOVE_PASSWORD` (exige senha atual), `UNLOCK` (`timingSafeEqual`), `LOCK`. Registrado em `src/main/index.ts`.
  - Refs: `REQ-001`–`REQ-006`, `NFR-001`, `NFR-002`, `DEC-001`, `DEC-004`, `DEC-005`.
  - Aceite: fluxo completo (definir → bloquear → desbloquear com senha certa/errada → remover com senha certa/errada) funciona via IPC.
  - Verificação: `npm run build`; revisão de código; fluxo manual validado pelo usuário no app real (definir, bloquear, desbloquear, remover senha).

- [x] `TASK-004`: `src/main/activity.ts` — `pushActivity(action, documentTitle)` (lista capada em 20) + `createActivityHandlers()` (`ACTIVITY.FETCH`). Registrado em `src/main/index.ts`.
  - Refs: `REQ-009`, `DEC-007`, `RISK-003`.
  - Aceite: `pushActivity` escreve e capa corretamente; `FETCH` devolve a lista.
  - Verificação: `npm run build`; revisão de código.

- [x] `TASK-005`: `src/main/ipc.ts` — `pushActivity` dentro de `CREATE` ("created"), `RENAME` ("renamed"), `DELETE` ("deleted"), `RESTORE` ("restored"), `DUPLICATE` ("duplicated"); `CLEAR_ALL` também `store.set('activity', [])`.
  - Refs: `REQ-009`, `REQ-010`, `DEC-008`, `RISK-004`.
  - Aceite: cada ação gera exatamente uma entrada; `SAVE`/`TOGGLE_FAVORITE` não geram nenhuma; `CLEAR_ALL` esvazia o log.
  - Verificação: `npm run build`; revisão de código handler por handler — os 5 pontos de instrumentação conferidos um a um.

- [x] `TASK-006`: Preload (`src/preload/index.ts`) + APIs do renderer (`fetchAuthStatus.ts`, `setPassword.ts`, `removePassword.ts`, `unlock.ts`, `lock.ts`, `fetchActivity.ts`).
  - Refs: `REQ-001`–`REQ-009`.
  - Aceite: `window.api.*` tipado e chamável do renderer pra todos os 6 métodos novos.
  - Verificação: `npm run build` — ok.

- [x] `TASK-007`: `src/renderer/src/lib/formatRelativeTime.ts` — extraído `formatRelativeTimeFragment` (sem prefixo), `formatRelativeTime` virou wrapper fino.
  - Refs: `DEC-009`.
  - Aceite: `SearchBar` continua mostrando "editado agora"/"editado há X" sem mudança visual.
  - Verificação: `npm run build`; revisão do único call site (`SearchBar/index.tsx`) — comportamento preservado.

- [x] `TASK-008`: `src/renderer/src/components/AuthGate.tsx` + `src/renderer/src/App.tsx` envolve `<Routes />`.
  - Refs: `REQ-001`, `REQ-002`, `DEC-003`.
  - Aceite: sem senha, renderiza os filhos direto; com senha e bloqueado, renderiza a tela de bloqueio; desbloquear invalida a query e troca pra os filhos.
  - Verificação: harness isolado (React real + `window.api` mockado, Chrome headless) — fluxo completo testado: locked→Lock screen→senha errada (erro inline, continua bloqueado)→senha certa→Profile real aparece. Ver nota de validação abaixo.

- [x] `TASK-009`: `src/renderer/src/pages/lock.tsx` — tela de bloqueio (`Screen / Login` do Pencil): headline, descrição, campo de senha, "Entrar no workspace", erro inline em senha errada. Sem opção de pular/criar senha (`DEC-002`).
  - Refs: `REQ-003`, `NFR-003`.
  - Aceite: cobre `AC-003`.
  - Verificação: harness isolado — layout fiel ao Pencil, senha errada mostra "Senha incorreta." e não desbloqueia, senha certa desbloqueia.

- [x] `TASK-010`: `src/renderer/src/pages/profile.tsx` + `components/Profile/Sidebar.tsx` + `components/Profile/PasswordDialogs.tsx` — identidade (nome do workspace, iniciais, selo "Modo local"), estatísticas reais (`DEC-006`), feed de atividade real, ações ("Editar perfil"/"Abrir configurações" → `/settings`, "Bloquear workspace"/"Definir senha local"/"Remover senha local").
  - Refs: `REQ-004`–`REQ-011`.
  - Aceite: cobre `AC-004`–`AC-007`.
  - Verificação: harness isolado — estatísticas (documentos/palavras/último salvamento) calculadas corretamente a partir de documentos mockados; feed de atividade renderiza as entradas reais com ação+título+tempo relativo; botões trocam corretamente entre "Definir senha local" (sem senha) e "Bloquear workspace"/"Remover senha local" (com senha).

- [x] `TASK-011`: Rota `/profile` em `Routes.tsx`; ícone novo na Sidebar principal (`src/renderer/src/components/Sidebar/index.tsx`) navegando pra lá.
  - Refs: `REQ-012`.
  - Aceite: ícone visível, navega corretamente.
  - Verificação: `npm run build`/`npm run lint`; revisão de código; fluxo manual validado pelo usuário.

## Validação Final

- [x] `npm run build` executado — sem erros.
- [x] `npm run lint` executado — sem erros (2 erros de `react/no-unescaped-entities` corrigidos durante a implementação, ver Registro de Execução).
- [x] Fluxo manual afetado validado (`AC-001`–`AC-009`) — usuário testou no app real e aprovou ("funcionou").
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-10-06 | Spec criada | `requirements.md`/`design.md`/`tasks.md` preenchidos a partir do desenho real consultado no Pencil (nós `v3qmi4`/`Screen / Login` e `cqABk`/`Screen / Profile`) e de duas decisões de escopo confirmadas com o usuário (trava local real; log de atividade real) |
| 2026-10-06 | `TASK-001`–`TASK-011` | Implementadas. `npm run build` ok; `npm run lint` acusou 2 erros de `react/no-unescaped-entities` (aspas retas dentro de JSX em `profile.tsx`, no texto do feed de atividade) — corrigido trocando por `&quot;`. Depois disso, `npm run build`/`npm run lint` sem erros nem warnings |
| 2026-10-06 | Validação visual | Harness isolado (`esbuild` + Chrome headless) montando `AuthGate`/`Lock`/`Profile` reais com `window.api` mockado (estado mutável simulando `auth`) — confirmou layout fiel ao Pencil para as duas telas novas, o fluxo completo de bloqueio→erro→desbloqueio trocando de verdade entre `Lock` e o app, e os cálculos de estatísticas/atividade do Perfil batendo com os dados mockados. Arquivos temporários do harness removidos após a validação, nada ficou no repositório |
| 2026-10-10 | Validação manual | Usuário testou o fluxo completo no app real e aprovou ("funcionou"). Spec concluída. |
