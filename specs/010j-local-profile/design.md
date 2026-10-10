# Spec 010j — Local Profile & Lock — Design

## Estado

`done`

## Resumo Técnico

Dois recursos novos, independentes mas que convivem na mesma tela de Perfil: (1) uma trava local opcional — senha com hash (`scrypt`) guardada no `electron-store`, estado "desbloqueado" mantido em memória no main process (nunca persistido — tranca de novo a cada abertura do app), verificada por um `AuthGate` no topo da árvore React que decide entre mostrar a tela de bloqueio ou o app inteiro; (2) um log de atividade — lista capada de eventos (criar/renomear/excluir/restaurar/duplicar documento), escrita pelos próprios handlers de documento já existentes em `ipc.ts`, lida pela tela de Perfil. As estatísticas do Perfil (documentos/palavras/último salvamento) não precisam de IPC novo — são calculadas no renderer a partir dos documentos que a Sidebar já busca (`fetchDocuments`, cache do React Query).

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`AuthStatusResponse`, `SetPasswordRequest`, `RemovePasswordRequest`, `UnlockRequest`, `UnlockResponse`, `ActivityAction`, `ActivityEntry`, `FetchActivityResponse`)
- `src/shared/constants/ipc.ts` (`IPC.AUTH`, `IPC.ACTIVITY`)
- `src/main/store.ts` (`auth: AuthRecord | null`, `activity: ActivityEntry[]` no `StoreType`, defaults, schema)
- Novo: `src/main/auth.ts` (`createAuthHandlers()`)
- Novo: `src/main/activity.ts` (`createActivityHandlers()`, `pushActivity(action, documentTitle)`)
- `src/main/ipc.ts` (chama `pushActivity` dentro de `CREATE`/`RENAME`/`DELETE`/`RESTORE`/`DUPLICATE`; `CLEAR_ALL` também zera `activity`)
- `src/main/index.ts` (registra `createAuthHandlers()`/`createActivityHandlers()`)
- `src/preload/index.ts` (métodos novos de auth/activity)
- Novo: `src/renderer/src/api/fetchAuthStatus.ts`, `setPassword.ts`, `removePassword.ts`, `unlock.ts`, `lock.ts`, `fetchActivity.ts`
- Novo: `src/renderer/src/components/AuthGate.tsx`
- `src/renderer/src/App.tsx` (envolve `<Routes />` com `<AuthGate>`)
- Novo: `src/renderer/src/pages/lock.tsx` (tela de bloqueio — `Screen / Login` do Pencil)
- Novo: `src/renderer/src/pages/profile.tsx`
- Novo: `src/renderer/src/components/Profile/Sidebar.tsx`, `SetPasswordDialog.tsx`
- `src/renderer/src/Routes.tsx` (rota `/profile`)
- `src/renderer/src/components/Sidebar/index.tsx` (ícone novo → `/profile`)
- `src/renderer/src/lib/formatRelativeTime.ts` (extrai `formatRelativeTimeFragment` sem o prefixo "editado", reaproveitado pelo feed de atividade)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Estado "desbloqueado" vive só em memória no main process (variável de módulo em `auth.ts`), nunca no `electron-store` | É exatamente o comportamento esperado de uma trava: tranca de novo a cada vez que o app abre. Persistir "desbloqueado" derrotaria o propósito |
| `DEC-002` | Definir/alterar/remover senha só acontece na tela de Perfil — a tela de bloqueio (`lock.tsx`) só tem o campo de verificação, sem opção de "criar senha" nem "continuar sem senha" | Pular uma senha que já existe através da própria tela que deveria bloqueá-la tornaria a trava decorativa; a Pencil desenhou "Continuar sem bloqueio local" pensando num fluxo de primeiro acesso, mas como `REQ-002` já cobre esse caso (sem senha configurada, nunca aparece a tela), esse botão não tem papel funcional real na tela de bloqueio em si — fica de fora dela (`RISK` evitado: trava que não trava) |
| `DEC-003` | `AuthGate` fica em `App.tsx`, por fora de `<Routes />` — quando bloqueado, renderiza só a tela de bloqueio (sem contexto de rota, já que ela não navega pra lugar nenhum, só desbloqueia in-place) | Mais simples que meter lógica de redirecionamento dentro do React Router; a tela de bloqueio substitui a árvore inteira, não é "mais uma rota" |
| `DEC-004` | Hash de senha com `crypto.scryptSync` (64 bytes, salt aleatório de 16 bytes via `crypto.randomBytes`), comparação com `crypto.timingSafeEqual` | Nativo do Node, zero dependência nova (`NFR-001`/`NFR-002`); `scrypt` é apropriado pra senha de baixa entropia (PIN curto) por ser deliberadamente lento/custoso computacionalmente |
| `DEC-005` | Remover senha exige reenviar a senha atual (`REQ-005`), verificada com o mesmo hash antes de apagar `store.auth` | Pequena barreira a mais contra desligar a trava permanentemente com o dispositivo já desbloqueado na mão de outra pessoa |
| `DEC-006` | Estatísticas do Perfil (documentos/palavras/último salvamento) calculadas no **renderer**, a partir do cache já existente de `fetchDocuments` (`['documents']`), sem IPC novo | Esse dado já está carregado (a Sidebar principal já faz esse fetch); duplicar isso como um endpoint novo no main seria recalcular a mesma coisa duas vezes. Contagem de palavras via `stripHtml` (já existe em `lib/htmlText.ts`) + split por espaço, mesmo padrão já usado em `searchDocuments.ts` |
| `DEC-007` | Log de atividade é uma lista capada (20 entradas mais recentes) no `electron-store`, escrita diretamente dentro dos handlers de documento existentes em `ipc.ts` (não um event bus/sistema de eventos) | Só 5 pontos de instrumentação (`CREATE`/`RENAME`/`DELETE`/`RESTORE`/`DUPLICATE`), cada um já sabe exatamente qual título logar — um event bus seria abstração sem necessidade real pra esse volume |
| `DEC-008` | `SAVE` (autosave) e `TOGGLE_FAVORITE` **não** geram entrada de atividade | `SAVE` dispara a cada ~600ms de debounce durante digitação — logar isso inundaria o feed com ruído sem sinal nenhum; `TOGGLE_FAVORITE` é uma ação menor e frequente, pouco interessante como "atividade recente" |
| `DEC-009` | `formatRelativeTime` (usado hoje só na `SearchBar`, sempre com o prefixo "editado") é dividido: `formatRelativeTimeFragment` devolve só o pedaço de tempo ("agora", "há 5 min", "ontem"...), e `formatRelativeTime` vira um wrapper fino que prefixa "editado " — preserva o único call site existente e dá ao feed de atividade (que tem seus próprios verbos por ação: "criado", "renomeado"...) a versão sem prefixo | Evita duas implementações de cálculo de tempo relativo; a `SearchBar` continua funcionando exatamente igual |
| `DEC-010` | `/profile` é uma rota raiz própria (igual `/settings`, `DEC-002` da spec `010i`), com sua própria sidebar (`Perfil`/`Configurações`/`Documentos`) — não reaproveita `SettingsSidebar` | As duas sidebars têm itens de navegação completamente diferentes e semânticas diferentes (uma rola seção, a outra navega entre rotas); compartilhar um componente genérico agora seria abstrair cedo demais por uma soma de ~60 linhas cada — ver "Alternativas Consideradas" |

## Contratos

```ts
export interface AuthStatusResponse {
  hasPassword: boolean
  isUnlocked: boolean // sempre `true` quando hasPassword é `false`
}

export interface SetPasswordRequest {
  password: string
}

export interface RemovePasswordRequest {
  password: string // senha atual, pra confirmar — ver DEC-005
}

export interface UnlockRequest {
  password: string
}

export interface UnlockResponse {
  success: boolean
}

export type ActivityAction =
  | 'created'
  | 'renamed'
  | 'deleted'
  | 'restored'
  | 'duplicated'

export interface ActivityEntry {
  id: string
  action: ActivityAction
  documentTitle: string
  createdAt: string // ISO
}

export interface FetchActivityResponse {
  data: ActivityEntry[]
}
```

```ts
IPC.AUTH = {
  FETCH_STATUS: 'auth:fetch-status',
  SET_PASSWORD: 'auth:set-password',
  REMOVE_PASSWORD: 'auth:remove-password',
  UNLOCK: 'auth:unlock',
  LOCK: 'auth:lock',
}
IPC.ACTIVITY = {
  FETCH: 'activity:fetch',
}
```

`store.ts`:
```ts
interface AuthRecord {
  passwordHash: string
  salt: string
}

interface StoreType {
  // ...já existentes
  auth: AuthRecord | null
  activity: ActivityEntry[]
}
```
Defaults: `auth: null`, `activity: []`.

## Alternativas Consideradas

- Deixar "Continuar sem bloqueio local" na tela de bloqueio, igual ao mock do Pencil: descartada (`DEC-002`) — com uma senha já configurada, um botão de pular tornaria a trava inútil; fidelidade literal ao mock perde pra correção funcional aqui.
- Guardar `isUnlocked` no `electron-store` (persistido): descartada (`DEC-001`) — contradiz o próprio conceito de "trava que tranca ao abrir o app".
- IPC novo no main só pra calcular estatísticas do Perfil: descartada (`DEC-006`) — o dado já está no cache do renderer, recalcular no main seria trabalho duplicado.
- Sistema de eventos/event bus genérico para atividade: descartado (`DEC-007`) — 5 pontos de instrumentação não justificam essa abstração agora.
- Componente de sidebar genérico compartilhado entre `/settings` e `/profile`: descartado por ora (`DEC-010`) — pouca duplicação real, naturezas de navegação diferentes; se uma terceira tela desse tipo aparecer, aí sim vale extrair.

## Research Hooks

Nenhuma dúvida técnica em aberto — as duas decisões de escopo em aberto (trava real vs. decorativa; implementar atividade vs. remover do escopo) já foram resolvidas por decisão explícita do usuário (2026-10-06) antes desta fase de design.

## Impactos

- Main: `store.ts` ganha duas chaves (`auth`, `activity`); dois módulos novos (`auth.ts`, `activity.ts`); `ipc.ts` ganha 5 chamadas de `pushActivity` + um reset em `CLEAR_ALL`.
- Preload: 6 métodos novos (5 de auth, 1 de activity).
- Renderer: um gate novo em `App.tsx` por cima de todas as rotas; duas páginas novas (`lock.tsx`, `profile.tsx`) com sidebar própria; ícone novo na Sidebar principal; pequeno refactor em `formatRelativeTime.ts`.
- Persistência: schema do `electron-store` ganha `auth`/`activity`. Nenhum dado de documento muda de formato.
- Segurança: hash local com `scrypt`, sem rede, sem criptografia de dados — ver `NFR-001`–`NFR-003` e `RISK-001`/`RISK-002`.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: sem senha configurada, abrir o app normalmente (`AC-001`). Definir uma senha no Perfil, reiniciar o app, confirmar que a tela de bloqueio aparece antes de tudo (`AC-002`). Testar senha errada (erro inline, não desbloqueia) e certa (`AC-003`). Editar um documento e clicar "Bloquear workspace" — confirmar que a edição foi salva antes de travar, e que a tela de bloqueio volta (`AC-004`). Remover a senha exigindo a senha atual, reiniciar e confirmar que não bloqueia mais (`AC-005`). Criar/editar/excluir documentos e conferir que as estatísticas do Perfil batem (`AC-006`). Criar, renomear, excluir, restaurar e duplicar um documento, conferindo que cada ação aparece no feed de atividade (`AC-007`). Rodar "Limpar dados locais" (spec `010i`) e confirmar que o feed de atividade também esvazia (`AC-008`).
