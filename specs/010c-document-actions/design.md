# Spec 010c — Document Actions — Design

## Estado

`done`

## Resumo Técnico

Três novas operações IPC (`RENAME`, `DUPLICATE`, `TOGGLE_FAVORITE`) mais um campo `favorite?: boolean` em `Document`. No renderer, um menu dropdown (`@radix-ui/react-dropdown-menu`, dependência nova) reutilizado em dois lugares: botão "Mais" do `Header` (documento aberto) e um botão "..." por item na Sidebar (documento fechado). Renomear usa um diálogo simples (`@radix-ui/react-dialog`, dependência nova — não é destrutivo, não deveria usar `AlertDialog`) com um campo de texto.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`favorite`, `RenameDocumentRequest/Response`, `DuplicateDocumentResponse`, `ToggleFavoriteDocumentRequest/Response`)
- `src/shared/constants/ipc.ts` (`RENAME`, `DUPLICATE`, `TOGGLE_FAVORITE`)
- `src/main/ipc.ts` (3 handlers novos)
- `src/preload/index.ts` (3 métodos novos)
- Novos: `src/renderer/src/api/renameDocument.ts`, `duplicateDocument.ts`, `toggleFavoriteDocument.ts`
- Novo: `src/renderer/src/components/DocumentActionsMenu/index.tsx` (dropdown reutilizável)
- Novo: `src/renderer/src/components/RenameDialog/index.tsx`
- `src/renderer/src/components/Header/index.tsx` (menu "Mais" ganha ações)
- `src/renderer/src/components/Sidebar/Navigation/Link.tsx` (botão "..." por item)
- `src/renderer/src/components/Sidebar/index.tsx` (ordenação favorito-primeiro)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | `RENAME` é uma operação dedicada que só atualiza `title`/`updatedAt`, nunca `content` | Evita reusar `SAVE` (que sempre grava `content` também) de forma ambígua; deixa claro que renomear não mexe no corpo |
| `DEC-002` | `DUPLICATE` roda inteiramente no main process: lê o documento original, gera novo `id` (`randomUUID`), título `"${original.title} (cópia)"`, mesmo `content`, `updatedAt` novo, `favorite: false` (cópia não herda o favorito) | Mantém a fonte de verdade dos dados no main, mesmo padrão de `CREATE` |
| `DEC-003` | `TOGGLE_FAVORITE` recebe só o `id` e inverte o valor atual no servidor (não recebe o novo valor do cliente) | Evita condição de corrida se o toggle for clicado duas vezes rápido — o servidor sempre parte do estado real gravado |
| `DEC-004` | Menu de ações é um componente único (`DocumentActionsMenu`) parametrizado por `documentId` e `onRenamed`/etc., usado tanto no `Header` quanto no item da Sidebar | Evita duplicar a lista de itens do menu em dois lugares |
| `DEC-005` | Ordenação da Sidebar passa a ser `favorite` (true primeiro) e, dentro de cada grupo, `updatedAt` decrescente (já existente da spec `010a`) | Único critério de "destaque" simples, sem precisar de seções visuais novas (ver "Fora De Escopo") |
| ~~`DEC-006`~~ | ~~O item "Renomear" do menu da Sidebar fica desabilitado/oculto quando `documentId === idDocument` da rota atual~~ | **Substituído durante a execução**: em vez de esconder a opção, `document.tsx` detecta renomeação externa (título mudou sem vir da própria digitação, comparado via `lastEmittedTitleRef`) e força o `Editor` a remontar (`key={editorKey}`) com o conteúdo atualizado. Resolve o `RISK-001` de verdade, sem tirar a função do usuário no documento aberto — que era exatamente o caso de uso mais comum |

## Contratos

```ts
export interface Document {
  id: string
  title: string
  content?: string
  updatedAt?: string
  deletedAt?: string
  favorite?: boolean
}

export interface RenameDocumentRequest { id: string; title: string }
export interface RenameDocumentResponse { data: Document }

export interface DuplicateDocumentRequest { id: string }
export interface DuplicateDocumentResponse { data: Document }

export interface ToggleFavoriteDocumentRequest { id: string }
export interface ToggleFavoriteDocumentResponse { data: Document }
```

`IPC.DOCUMENTS.RENAME = 'documents:rename'`, `DUPLICATE = 'documents:duplicate'`, `TOGGLE_FAVORITE = 'documents:toggle-favorite'`.

## Alternativas Consideradas

- Reaproveitar `SAVE` pra renomear (mandando `content` igual ao que já está): descartado pelo `DEC-001` — obriga o chamador a saber o `content` atual, frágil quando chamado da Sidebar (que não tem o `content` carregado, só o `FetchAllDocumentsResponse` que inclui `content`, mas é desnecessário mandar de volta).
- Um único IPC genérico `UPDATE_DOCUMENT` com campos parciais: descartado — menos explícito que operações nomeadas, e o projeto já segue o padrão de um handler por operação.

## Research Hooks

Nenhum — sizing `Medium`, sem incerteza técnica relevante.

## Impactos

- Main: `ipc.ts` (3 handlers).
- Preload: 3 métodos.
- Renderer: `Header`, `Sidebar`/`Navigation/Link`, 2 componentes novos (menu, diálogo de renomear), 3 funções de API novas.
- Persistência: `favorite` é campo novo opcional; documentos existentes continuam válidos sem migração.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: renomear pelo Header e pela Sidebar (documento fechado), duplicar e confirmar independência das cópias, favoritar/desfavoritar e ver a lista reordenar, confirmar que "Renomear" não aparece pro documento atualmente aberto na Sidebar.
