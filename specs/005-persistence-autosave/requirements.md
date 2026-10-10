# Spec 005 — Persistence & Autosave — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O autosave dispara `saveDocument` a cada tecla digitada no editor (`src/renderer/src/pages/document.tsx`), sem debounce, sem checar se o conteúdo mudou e sem tratamento de erro. Buscar um documento inexistente ou excluir o documento aberto no momento não têm comportamento definido. O `electron-store` não tem schema/versão mínima documentada.

## Objetivo

Depende de `004-ipc-typing-contracts` (tipagem de `fetchDocument` como possivelmente `undefined`). Tornar o salvamento previsível, barato e resiliente a erro, e dar feedback simples de estado ao usuário.

## Fora De Escopo

- Novo design visual do indicador de salvamento além de um texto simples (o visual final vem do Pencil, tratado em spec de UX/design).
- Sincronização remota ou multi-dispositivo.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Adicionar debounce no autosave do editor (não salvar a cada tecla) | Explícito (BACKLOG Sprint 4) |
| `REQ-002` | Não chamar `saveDocument` se título e conteúdo não mudaram desde o último salvamento | Explícito (BACKLOG Sprint 4) |
| `REQ-003` | Tratar erro ao salvar documento (IPC pode rejeitar) | Explícito (BACKLOG Sprint 4) |
| `REQ-004` | Exibir estado simples de salvamento: `Salvando...`, `Salvo`, `Erro ao salvar` | Explícito (BACKLOG Sprint 4) |
| `REQ-005` | Proteger a busca de documento inexistente (usar o tipo `Document | undefined` da spec 004 e exibir um estado tratado, não tela em branco) | Explícito (BACKLOG Sprint 4) |
| `REQ-006` | Tratar exclusão do documento atualmente aberto (navegar para fora antes/depois de excluir, sem deixar o editor apontando para um id que não existe mais) | Explícito (BACKLOG Sprint 4) |
| `REQ-007` | Definir schema mínimo do `electron-store` (versão, migração básica se o formato mudar) | Explícito (BACKLOG Sprint 4) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | O debounce não pode fazer o usuário perder conteúdo ao fechar o app logo após digitar (salvar no unmount/fechamento se houver mudança pendente) |
| `NFR-002` | Erros de salvamento não podem quebrar a UI (sem tela branca/crash) |

## Restrições

- Manter `electron-store` como mecanismo de persistência (fora de escopo trocar por outro storage).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Digitar no editor não dispara escrita imediata a cada tecla (delay perceptível e configurado) |
| `AC-002` | Editar e não mudar nada (ex. só mover o cursor) não gera nova escrita no store |
| `AC-003` | Usuário recebe feedback visual de salvando/salvo/erro |
| `AC-004` | Abrir um id de documento inexistente mostra um estado tratado (não tela em branco) |
| `AC-005` | Excluir o documento aberto não deixa o editor em estado inconsistente |
| `AC-006` | O `electron-store` tem uma versão de schema registrada |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Debounce mal calibrado pode atrasar demais o feedback percebido pelo usuário | Escolher um intervalo curto (na ordem de algumas centenas de ms) e validar manualmente a sensação de digitação |
| `RISK-002` | Comparar conteúdo para evitar salvar pode custar mais do que simplesmente salvar, se feito de forma ingênua | Comparar por referência/hash simples do último payload salvo, não por diff profundo |
