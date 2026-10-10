# Spec 010d — Content Search — Design

## Estado

`done`

## Resumo Técnico

`SearchBar` passa a controlar a busca por conta própria (`shouldFilter={false}` no `Command`, estado de query controlado) em vez de depender do filtro fuzzy do `cmdk`. Um novo helper (`searchDocuments`) filtra por título e conteúdo (texto plano extraído via `DOMParser`) e devolve, por documento, se o match foi no título ou no conteúdo — e, se no conteúdo, um trecho de contexto. Outro helper (`formatRelativeTime`) formata `updatedAt` pro padrão do Pencil.

## Arquivos Afetados

- Novo: `src/renderer/src/lib/searchDocuments.ts`
- Novo: `src/renderer/src/lib/formatRelativeTime.ts`
- `src/renderer/src/components/SearchBar/index.tsx`

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Filtragem própria (`shouldFilter={false}` + `searchDocuments`), não o filtro fuzzy padrão do `cmdk` | O filtro padrão só enxerga o `value` de cada `Command.Item` (hoje só o título) e não expõe *onde* o match aconteceu — não dá pra decidir "match no título" vs. "match no conteúdo" nem gerar um trecho sem essa informação |
| `DEC-002` | Extração de texto plano via `new DOMParser().parseFromString(html, 'text/html').body.textContent`, não regex | `DOMParser` está disponível no processo renderer (é um browser completo) e lida corretamente com entidades HTML e tags aninhadas, ao contrário de uma regex `replace(/<[^>]+>/g, '')` |
| `DEC-003` | Trecho de contexto: ~40 caracteres antes e depois da primeira ocorrência do termo no texto plano, com reticências (`…`) nas pontas quando cortado | Tamanho suficiente pra dar contexto sem estourar a largura do item do Command Dialog (que já tem `textGrowth: fixed-width` de uma linha) |
| `DEC-004` | `searchDocuments` retorna a lista já filtrada e ordenada (match no título primeiro, depois match só no conteúdo; dentro de cada grupo, mesma ordem de `updatedAt` decrescente já usada na Sidebar) | Resultado mais previsível — título bate primeiro por ser o sinal mais forte de relevância |
| `DEC-005` | `formatRelativeTime` cobre só os buckets vistos no design (agora / minutos / horas / dias); sem biblioteca de datas nova (`date-fns` etc.) | Poucos buckets, não justifica dependência nova |

## Contratos

```ts
// searchDocuments.ts
export interface DocumentSearchResult {
  document: Document
  matchedIn: 'title' | 'content' | 'none'
  excerpt?: string // só quando matchedIn === 'content'
}

export function searchDocuments(
  documents: Document[],
  query: string,
): DocumentSearchResult[]
```

Sem mudança de contrato IPC — `content` já vem em `FetchAllDocumentsResponse`/`['documents']`.

## Alternativas Consideradas

- Manter o filtro do `cmdk` e só ampliar o `value` do `Command.Item` pra incluir o conteúdo (`value={`${title} ${plainContent}`}`): mais simples, mas não dá pra saber se o match foi no título ou no conteúdo depois — não atenderia o `REQ-002`/`REQ-003` (trecho vs. tempo relativo).

## Research Hooks

Nenhum — sizing `Medium`, sem incerteza técnica relevante.

## Impactos

- Renderer: só `SearchBar` e dois helpers novos em `lib/`.
- Nenhum impacto em main/preload/persistência.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: buscar um termo só do título, um termo só do corpo de outro documento, um termo que não existe em nenhum, e o campo vazio.
