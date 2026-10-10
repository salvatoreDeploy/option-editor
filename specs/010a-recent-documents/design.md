# Spec 010a — Recent Documents — Design

## Estado

`done`

## Resumo Técnico

Adicionar `updatedAt` ao tipo `Document` e às gravações de criação/salvamento no main process. Ordenar por essa data (decrescente) tanto no tray quanto na Sidebar, em vez de confiar na ordem de inserção do objeto no `electron-store`.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (campo `updatedAt` em `Document`)
- `src/main/ipc.ts` (CREATE e SAVE preenchem `updatedAt`)
- `src/main/tray.ts` (ordenar antes do `.slice`)
- `src/renderer/src/components/Sidebar/index.tsx` (ordenar a lista exibida)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | `updatedAt` é `string` (ISO 8601, `new Date().toISOString()`), gerado no main process dentro do handler de `CREATE`/`SAVE`, nunca recebido do renderer | Evita depender do relógio do processo renderer e mantém a fonte de verdade da data no mesmo lugar que já é fonte de verdade dos dados (`ipc.ts`) |
| `DEC-002` | Comparador de ordenação trata `updatedAt` ausente como string vazia (`''`), que ordena antes de qualquer data ISO real | Documentos antigos sem o campo (criados antes desta spec) não quebram a ordenação, só ficam no fim — sem precisar de migração |
| `DEC-003` | A mesma lógica de ordenação é usada no tray (`tray.ts`, recebe a lista já pronta via IPC) e na Sidebar (`Sidebar/index.tsx`, mesma fonte de dados) — mas cada lado ordena a própria cópia, sem introduzir um helper compartilhado só para isso | Duas ordenações de 3 linhas cada não justificam um módulo compartilhado entre main e renderer (que exigiria cruzar a fronteira de `src/shared`); mantém a mudança pequena |

## Contratos

`Document` (antes):
```ts
export interface Document {
  id: string
  title: string
  content?: string
}
```

`Document` (depois):
```ts
export interface Document {
  id: string
  title: string
  content?: string
  updatedAt?: string
}
```

`updatedAt` é opcional no tipo porque documentos antigos no store do usuário não o têm (ver `NFR-001`).

## Alternativas Consideradas

- Rastrear `openedAt` (última visualização) em vez de/além de `updatedAt`: descartado nesta spec pequena — exigiria uma nova chamada IPC disparada a cada navegação para um documento, e o valor de "recente por edição" já resolve o problema relatado (o `.slice(-3)`).

## Research Hooks

Nenhum — sizing `Small`.

## Impactos

- Main: `ipc.ts` (dois handlers), `tray.ts` (ordenação).
- Renderer: `Sidebar/index.tsx` (ordenação).
- Persistência: novo campo opcional em `Document`; documentos existentes continuam válidos sem migração.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: criar um documento novo, depois editar um documento mais antigo, conferir que ele sobe pro topo da Sidebar e aparece no menu de recentes do tray.
