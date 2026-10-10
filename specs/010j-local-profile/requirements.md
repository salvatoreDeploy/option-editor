# Spec 010j — Local Profile & Lock — Requirements

## Estado

`done`

## Sizing

`Complex`

## Problema

O `BACKLOG.md` pede "Implementar login/perfil real" — hoje não existe nenhuma UI de perfil ou login no app (o antigo `Profile.tsx`, com `isAuthenticated = false` fixo e dados de exemplo hardcoded, já foi removido do código, mas nunca foi substituído por nada real). O design já existe no Pencil (`specs/002-account-settings-screens`, telas `Screen / Login` e `Screen / Profile`), mas esse design foi desenhado para um app **sem backend**: o próprio texto de ajuda da tela de login diz "A senha local é uma camada de bloqueio visual. Sincronização e contas remotas podem ser adicionadas depois." — ou seja, não é autenticação de rede, é uma trava de acesso local opcional.

## Objetivo

Implementar uma trava de acesso local (senha/PIN opcional, guardado só neste dispositivo) que bloqueia o app ao abrir (se configurada) e pode ser reativada a qualquer momento ("Bloquear workspace"); e uma tela de Perfil com identidade local (nome do workspace, já existente desde a spec `010i`), estatísticas reais (documentos, palavras, último salvamento) e um feed de atividade recente real (criar/renomear/excluir/restaurar/duplicar documento).

## Fora De Escopo

- Qualquer autenticação de rede/remota (OAuth, contas, sincronização) — não existe backend neste projeto; o próprio Pencil já previu isso como "futuro" (`RISK-001` da spec `002`).
- Criptografar o conteúdo dos documentos — a trava é só uma barreira de UI para acesso casual (ex. dispositivo compartilhado), não um mecanismo de segurança de dados. Os documentos continuam em texto plano no `electron-store`, exatamente como hoje.
- Múltiplos usuários/perfis no mesmo dispositivo — uma trava só, para o workspace local como um todo.
- Recuperação de senha esquecida — é um PIN local simples; se esquecida, a única saída é remover o arquivo de dados do `electron-store` manualmente (mesma lógica de qualquer trava local simples sem backend).
- "Continuar sem bloqueio local" como forma de pular uma trava já configurada — manter esse botão quando uma senha já existe tornaria a trava inútil (qualquer um poderia clicar e entrar). Só faz sentido durante a configuração inicial (ver `REQ-004`).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Tela de bloqueio (`/`, substituindo toda a navegação) aparece sempre que uma senha local está configurada e a sessão ainda não foi desbloqueada nesta execução do app | Explícito (desenho do Pencil, `Screen / Login`) + decisão do usuário (2026-10-06): trava local real |
| `REQ-002` | Se nenhuma senha local estiver configurada, o app abre direto nos documentos — a tela de bloqueio nunca aparece (comportamento atual preservado) | Implícito (a trava é opcional, não pode adicionar fricção pra quem não a configurou) |
| `REQ-003` | Campo de senha na tela de bloqueio, botão "Entrar no workspace" valida contra o hash salvo; senha errada mostra erro inline, sem travar a UI | Explícito (desenho do Pencil) |
| `REQ-004` | Definir/alterar/remover a senha local acontece na tela de Perfil, não na tela de bloqueio — a tela de bloqueio só verifica uma senha já existente | Implícito (decisão de design — ver `DEC-002`) |
| `REQ-005` | Remover a senha local exige digitar a senha atual novamente (mesmo já estando dentro do app) | Implícito (pequena barreira contra "peguei o dispositivo já desbloqueado e desliguei a trava pra sempre") |
| `REQ-006` | Botão "Bloquear workspace" na tela de Perfil re-trava a sessão imediatamente, sem fechar o app | Explícito (desenho do Pencil, nó `jFOZz`) |
| `REQ-007` | Tela de Perfil mostra identidade local: nome do workspace (mesmo campo da spec `010i`), iniciais como avatar, selo "Modo local" | Explícito (desenho do Pencil) |
| `REQ-008` | Tela de Perfil mostra estatísticas reais: total de documentos (não excluídos), total de palavras somado de todos os documentos, data/hora do último salvamento | Explícito (desenho do Pencil) + decisão do usuário (2026-10-06): dados reais, não estáticos |
| `REQ-009` | Tela de Perfil mostra um feed real de atividade recente (últimas ações: criar, renomear, excluir, restaurar, duplicar documento), não uma lista decorativa | Explícito (desenho do Pencil) + decisão do usuário (2026-10-06): implementar de verdade |
| `REQ-010` | "Limpar dados locais" (spec `010i`) também limpa o log de atividade — ele referenciaria documentos que não existem mais | Implícito (consistência com `010i` `NFR-003`) |
| `REQ-011` | Ação "Abrir configurações" na tela de Perfil navega para `/settings` | Explícito (desenho do Pencil) |
| `REQ-012` | Ponto de entrada para `/profile` a partir da Sidebar principal (ícone, junto dos já existentes de tema/atalhos/configurações) | Implícito (sem isso a tela é inacessível) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | A senha nunca é persistida em texto plano — só hash + salt (`scrypt`, nativo do Node, sem dependência nova) |
| `NFR-002` | Verificação de senha usa comparação de tempo constante (`crypto.timingSafeEqual`), não `===` direto |
| `NFR-003` | A UI nunca afirma ou sugere que a trava local criptografa dados ou protege contra acesso técnico ao arquivo do `electron-store` — só contra abrir o app pela interface |
| `NFR-004` | Registrar atividade não pode tornar nenhuma operação de documento (criar/renomear/excluir/restaurar/duplicar) mais lenta de forma perceptível — é só um `store.set` a mais, síncrono e local |

## Restrições

- Sem dependência nova — `crypto` (nativo do Node) para hash; nenhuma lib de autenticação, nenhuma lib de criptografia externa.
- Reaproveita padrões já existentes (`AlertDialog`/`Dialog` do Radix, estrutura de sidebar própria da spec `010i`, `formatRelativeTime` já existente) em vez de criar novos padrões de UI.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Sem senha configurada, abrir o app vai direto pros documentos, como hoje |
| `AC-002` | Definir uma senha local no Perfil e reiniciar o app mostra a tela de bloqueio antes de qualquer outra coisa |
| `AC-003` | Senha correta desbloqueia e mostra o app normalmente; senha errada mostra erro e não desbloqueia |
| `AC-004` | "Bloquear workspace" no Perfil volta pra tela de bloqueio imediatamente, sem fechar o app nem perder o documento sendo editado (autosave força o flush ao desmontar) |
| `AC-005` | Remover a senha local exige a senha atual; depois disso, reiniciar o app não mostra mais a tela de bloqueio |
| `AC-006` | As estatísticas do Perfil (documentos, palavras, último salvamento) batem com os dados reais — criar/editar/excluir um documento muda os números |
| `AC-007` | Criar, renomear, excluir, restaurar e duplicar um documento aparece no feed de atividade do Perfil, com título e tempo relativo corretos |
| `AC-008` | "Limpar dados locais" (spec `010i`) esvazia também o feed de atividade |
| `AC-009` | Nenhuma feature existente (criar, editar, salvar, buscar, excluir, exportar, importar, atalhos, tema, configurações) quebra com a adição desta trava/tela |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Usuário interpretar a senha local como proteção de dados real (achar que os documentos ficam criptografados) | Textos da UI deixam explícito que é só uma trava de acesso visual, mesmo texto de intenção do Pencil (`NFR-003`) |
| `RISK-002` | Esquecer a senha local tranca o usuário fora do próprio app | Documentado como limitação conhecida (`Fora De Escopo`) — é um PIN local simples, não um sistema de conta recuperável |
| `RISK-003` | Log de atividade crescer sem limite no `electron-store` ao longo do tempo | Lista capada em tamanho fixo (ver `design.md`) — sempre mantém só as entradas mais recentes |
| `RISK-004` | Instrumentar `pushActivity` dentro dos handlers de documento existentes (`ipc.ts`) pode introduzir um bug sutil se um handler for esquecido ou duplicado | Cada handler tocado é revisado individualmente nas tarefas (`tasks.md`), um de cada vez, com verificação própria |
