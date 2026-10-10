# Spec 010a — Recent Documents — Requirements

## Estado

`done`

## Sizing

`Small`

## Problema

`src/main/tray.ts` monta o menu "Documentos recentes..." do tray com `.slice(-3)` sobre a lista de documentos na ordem em que `Object.values(store.get('documents'))` os devolve — ordem de inserção no objeto (criação), não recência real. Além disso, `Document` não tem nenhum campo de data, então não existe informação pra calcular recência de verdade.

## Objetivo

Fazer "documentos recentes" (tray e, por consistência, a lista da Sidebar) refletirem a data real da última edição, não a ordem de criação.

## Fora De Escopo

- "Recente" por data de *abertura* (visualização sem edição) — usar apenas a data de última edição/salvamento, que já é um evento existente no fluxo. Rastrear abertura exigiria uma IPC nova a cada navegação, fora do escopo desta spec pequena.
- Lixeira/recuperação (spec `010b-trash-recovery`).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Adicionar `updatedAt` (ISO 8601, definido pelo main process, não confiado do renderer) ao tipo `Document` | Explícito (achado na análise original, BACKLOG Sprint 8) |
| `REQ-002` | Preencher `updatedAt` ao criar um documento | Implícito (necessário pro `REQ-001` fazer sentido desde o primeiro save) |
| `REQ-003` | Atualizar `updatedAt` a cada salvamento (autosave) | Explícito |
| `REQ-004` | Tray monta "Documentos recentes" ordenando por `updatedAt` decrescente, não por posição no array | Explícito (corrige o `.slice(-3)` da análise original) |
| `REQ-005` | Lista de documentos da Sidebar também ordena por `updatedAt` decrescente, por consistência com o conceito de "recentes" | Implícito |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Documentos já existentes no store do usuário (sem `updatedAt`, criados antes desta spec) não podem sumir da lista nem quebrar a ordenação — tratados como "mais antigos" (ordenados por último) até serem salvos de novo |

## Restrições

- Sem migração formal do `electron-store` (o bloco `migrations` em `store.ts` continua vazio) — `updatedAt` ausente é tratado como valor mínimo na ordenação, não como erro.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Criar um documento e depois editar um documento mais antigo faz o editado aparecer primeiro na lista/tray |
| `AC-002` | Documentos existentes (sem `updatedAt`) continuam aparecendo normalmente, só ficam no fim da ordenação até serem editados |
| `AC-003` | O menu de "Documentos recentes" do tray reflete os 3 documentos editados mais recentemente |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Reordenar a lista da Sidebar pode surpreender o usuário (lista deixa de seguir a ordem de criação) | É o comportamento esperado de "recentes"; comunicado nesta spec, não é um bug |
