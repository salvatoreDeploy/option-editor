# Spec 010b — Trash / Recovery — Design

## Estado

`done`

## Resumo Técnico

`Document` ganha `deletedAt?: string`. O handler `DELETE` passa a gravar esse campo em vez de apagar a chave do store. `FETCH_ALL`/`FETCH` filtram documentos com `deletedAt`. Um novo handler `RESTORE` limpa o campo. No renderer, um `UndoToastContext` (mesmo padrão do `SearchDialogContext` da spec `007`) expõe uma função genérica de "mostrar toast com desfazer", renderizado uma vez em `Default.tsx`, chamado pelo `Header` depois de excluir com sucesso.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`deletedAt`, `RestoreDocumentRequest`, `RestoreDocumentResponse`)
- `src/shared/constants/ipc.ts` (`IPC.DOCUMENTS.RESTORE`)
- `src/main/ipc.ts` (`DELETE` vira soft-delete, `FETCH_ALL`/`FETCH` filtram, novo handler `RESTORE`)
- `src/preload/index.ts` (`restoreDocument`)
- Novo: `src/renderer/src/api/restoreDocument.ts`
- Novo: `src/renderer/src/contexts/UndoToastContext.tsx`
- Novo: `src/renderer/src/components/UndoToast/index.tsx`
- `src/renderer/src/pages/layout/default.tsx` (provider + render do toast)
- `src/renderer/src/components/Header/index.tsx` (dispara o toast após excluir)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Soft-delete via campo `deletedAt` no próprio documento, não uma coleção separada de "lixeira" no `electron-store` | Menor mudança de schema; reaproveita a estrutura `documents: Record<string, Document>` já existente |
| `DEC-002` | `FETCH_ALL` e `FETCH` filtram `deletedAt` no main process (não no renderer) | O renderer nunca deveria "ver" um documento excluído — mais simples confiar a filtragem à mesma camada que já é fonte de verdade dos dados |
| `DEC-003` | Toast genérico via Context (`UndoToastContext`), não acoplado à feature de exclusão especificamente | Reaproveitável por outras ações desfazíveis no futuro (ex. lixeira de verdade), sem custo extra agora |
| `DEC-004` | Janela de "Desfazer": 6 segundos, mesma ordem de grandeza do indicador "Salvo" (2s) mas mais longa por ser uma ação destrutiva que exige mais tempo de reação | Sem uma referência de design pra esse número; escolha pragmática, ajustável depois |
| `DEC-005` | "Desfazer" restaura e navega para `/document/:id` do documento restaurado | Fecha o ciclo — o usuário via o documento antes de excluir, então volta pra ele, não fica em uma tela vazia |

## Contratos

`Document` (depois):
```ts
export interface Document {
  id: string
  title: string
  content?: string
  updatedAt?: string
  deletedAt?: string
}
```

Novo par de request/response:
```ts
export interface RestoreDocumentRequest {
  id: string
}

export interface RestoreDocumentResponse {
  data: Document
}
```

`IPC.DOCUMENTS.RESTORE = 'documents:restore'`.

## Alternativas Consideradas

- Tela de "Lixeira" dedicada: descartada por não ter design de referência e ser maior escopo do que o problema pede agora (ver `REQ-012` original: "lixeira **ou** recuperação").
- Biblioteca de toast (ex. `sonner`, `react-hot-toast`): descartada — um toast simples com uma ação não justifica dependência nova; o app já tem o padrão de Context pra esse tipo de estado global de UI (`SearchDialogContext`).

## Research Hooks

Nenhum — sizing `Medium`, sem incerteza técnica relevante.

## Impactos

- Main: `ipc.ts` (3 handlers alterados/novos).
- Preload: 1 método novo.
- Renderer: novo Context + componente de toast, `Header` dispara, `Default` renderiza.
- Persistência: `deletedAt` é um campo novo opcional; documentos existentes continuam válidos sem migração.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: excluir um documento, confirmar que some da Sidebar/tray/busca, clicar em "Desfazer" e confirmar que volta; excluir de novo e deixar o toast expirar, confirmar que fica excluído; tentar abrir a URL de um documento excluído diretamente.
