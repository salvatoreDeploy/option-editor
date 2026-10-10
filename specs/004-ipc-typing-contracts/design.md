# Spec 004 — IPC Typing & Contracts — Design

## Estado

`done`

## Resumo Técnico

Consolidar a tipagem de `window.api` em um único tipo exportado de `src/preload/index.ts`, remover a declaração conflitante em `index.d.ts`, tornar explícito que buscar um documento pode retornar `undefined`, e limpar os valores das constantes IPC.

## Arquivos Afetados

- `src/preload/index.ts`
- `src/preload/index.d.ts`
- `src/shared/constants/ipc.ts`
- `src/shared/types/ipc.ts`
- `src/renderer/src/api/*.ts`
- `src/renderer/src/pages/document.tsx` (consumo de `fetchDocument` possivelmente `undefined`)
- `tsconfig.json` (aliases)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Exportar `export type PreloadApi = typeof api` em `src/preload/index.ts` e usar `Window.api: PreloadApi` tanto ali quanto em `index.d.ts` | Elimina a duplicação/conflito de declaração global sem precisar reescrever a API |
| `DEC-002` | `index.d.ts` importa o tipo de `index.ts` em vez de redeclarar `unknown` | Uma única fonte de verdade para o tipo da API exposta |
| `DEC-003` | Padronizar em `@*` para imports internos ao `src` e remover o alias `~/*`, ajustando os poucos usos existentes | `@*` já é o padrão mais comum no código; reduz uma forma redundante de importar o mesmo caminho |

## Contratos

Antes:
```ts
export interface FetchDocumentResponse {
  data: Document
}
```

Depois:
```ts
export interface FetchDocumentResponse {
  data: Document | undefined
}
```

Constantes IPC passam de `'documents: fetch-all'` para `'documents:fetch-all'` (mesmo padrão para os demais canais).

## Alternativas Consideradas

- Usar `zod` para validar o formato dos documentos lidos do `electron-store`: descartado neste momento por estar fora do escopo (tipagem estática, não validação em runtime); pode ser revisitado na spec `005-persistence-autosave` se necessário.

## Research Hooks

Nenhum.

## Impactos

- Preload: tipo único exportado, sem mudança de comportamento.
- Renderer: pontos que consomem `fetchDocument` precisam tratar `undefined` explicitamente.
- Persistência: nenhuma mudança de schema, só de tipo estático.

## Plano De Validação

- `npm run build` (sem erros de tipo).
- `npm run lint`.
- Revisar manualmente que abrir um documento existente e um id inexistente na URL não quebra a UI (o tratamento de erro de fato fica para a spec `005-persistence-autosave`; aqui só garantimos que o tipo obriga o código a considerar o caso).
