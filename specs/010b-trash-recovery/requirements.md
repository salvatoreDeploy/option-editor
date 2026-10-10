# Spec 010b — Trash / Recovery — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

Excluir um documento hoje é permanente e imediato (`store.delete`-equivalente direto no `electron-store`, sem período de graça). Um clique errado no botão "Excluir" do `Header` — mesmo com a confirmação da spec `003` — perde o documento para sempre.

## Objetivo

Dar uma segunda chance depois de excluir, sem construir uma tela de lixeira completa (não existe design pra isso no `openeditor.pen`, e `REQ-012` da spec `010` aceita "lixeira **ou** recuperação").

## Fora De Escopo

- Tela dedicada de "Lixeira" listando todos os documentos excluídos (sem design de referência; se vier a ser pedida, é uma sub-spec própria).
- Expiração automática/purga definitiva de documentos com exclusão "esquecida" (soft-delete permanece no store indefinidamente por ora).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Excluir um documento passa a ser soft-delete (marcado com `deletedAt`), não remoção imediata do store | Explícito (BACKLOG Sprint 8 / spec `010` `REQ-012`) |
| `REQ-002` | Documentos com `deletedAt` não aparecem em `FETCH_ALL` (Sidebar, tray, busca) nem são abertos por `FETCH` (tratados como não encontrados) | Implícito (senão "excluído" não parece excluído) |
| `REQ-003` | Depois de excluir, mostrar um toast com ação "Desfazer" por alguns segundos | Explícito |
| `REQ-004` | "Desfazer" restaura o documento (limpa `deletedAt`) e reabre o documento restaurado | Explícito |
| `REQ-005` | Nova operação IPC `RESTORE` para reverter o soft-delete | Implícito (necessário pro `REQ-004`) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | O toast não pode bloquear interação com o resto do app (não é um modal) |
| `NFR-002` | Nenhuma mudança pode afetar os fluxos já validados de criar/editar/salvar/buscar |

## Restrições

- Sem tela nova no Pencil para isso (Pencil MCP está desconectado nesta sessão, e mesmo conectado não há uma tela de "Lixeira" nas telas já desenhadas) — o toast usa os tokens de design já migrados (`popover`, `border`, `secondary`), sem inventar um novo padrão visual.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Excluir um documento faz ele sumir da Sidebar, do tray e da busca imediatamente |
| `AC-002` | Um toast com "Desfazer" aparece logo após a exclusão |
| `AC-003` | Clicar em "Desfazer" dentro da janela de tempo traz o documento de volta (Sidebar, tray, busca) e reabre ele |
| `AC-004` | Deixar o toast expirar sem clicar em "Desfazer" mantém o documento excluído |
| `AC-005` | Abrir a URL de um documento excluído (ex. `/document/:id` de um id já excluído) mostra o estado de "documento não encontrado" já existente, não um erro novo |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Documentos soft-deleted acumulam no store indefinidamente (sem purga) | Aceito nesta spec (fora de escopo); registrado no BACKLOG como possível item futuro se o acúmulo incomodar na prática |
| `RISK-002` | Toast pode ficar preso na tela se a lógica de dispensar falhar | Usar `setTimeout` com cleanup em `useEffect`, mesmo padrão já usado no indicador de "Salvo" (spec `005`) |
