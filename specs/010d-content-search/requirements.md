# Spec 010d — Content Search — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

A busca rápida (`SearchBar`, Command Dialog) filtra só pelo título — usa o filtro fuzzy padrão do `cmdk` sobre `value={document.title}`. Um documento com o termo buscado só no corpo (não no título) nunca aparece no resultado.

## Objetivo

Buscar por título **e** conteúdo, mostrando um trecho do conteúdo (com o termo buscado em contexto) quando o match não é no título — consultado `Screen / Quick Search` no `openeditor.pen` via Pencil MCP antes de implementar.

## Fora De Escopo

- Ranking/relevância sofisticada (ex. TF-IDF, busca fuzzy tolerante a erro de digitação) — só correspondência de substring, case-insensitive, igual ao filtro de título que já existia.
- Destacar (highlight) visualmente o termo buscado dentro do trecho exibido — mostrar o trecho já ajuda bastante; o highlight fica como possível refinamento futuro.
- Indexação/cache de busca — a lista de documentos já vem inteira do `['documents']` (React Query), filtrar em memória é suficiente pro volume de dados de um app local pessoal.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Buscar por conteúdo, não só por título | Explícito (spec `010` `REQ-005`) |
| `REQ-002` | Quando o match for só no conteúdo (não no título), mostrar um trecho do conteúdo ao redor do termo buscado, no lugar do subtítulo genérico | Explícito (achado ao consultar `Screen / Quick Search` no Pencil — o padrão visual "Command Item" já reserva uma linha de subtítulo pra isso) |
| `REQ-003` | Quando o match for no título, o subtítulo mostra "Documento · " + tempo relativo desde `updatedAt` (ex. "editado agora", "2 dias atrás"), como no design do Pencil — hoje mostra só "Documento" fixo | Explícito (achado ao consultar o Pencil; o design já define esse padrão, só não estava implementado) |
| `REQ-004` | Busca não depende mais do filtro fuzzy interno do `cmdk` — filtragem própria, pra poder decidir título vs. conteúdo e gerar o trecho | Implícito (necessário pro `REQ-002`) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Filtrar em memória não pode travar a UI perceptivelmente para o volume de documentos de um usuário típico deste app (dezenas, não milhares) |
| `NFR-002` | Documentos excluídos (soft-deleted, spec `010b`) continuam fora da busca — já garantido por `FETCH_ALL` filtrar `deletedAt`, não regride |

## Restrições

- Nenhuma tela nova — só a busca existente (`Screen / Quick Search` já cobre a estrutura necessária).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Buscar um termo que só existe no corpo de um documento (não no título) retorna esse documento |
| `AC-002` | O resultado com match só no conteúdo mostra um trecho de texto plano (sem tags HTML) contendo o termo |
| `AC-003` | O resultado com match no título mostra "Documento · " + tempo relativo, não mais o texto fixo "Documento" |
| `AC-004` | Buscar com o campo vazio continua mostrando todos os documentos, como antes |
| `AC-005` | "Criar novo documento" continua aparecendo nos resultados |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Extrair texto plano de HTML no processo errado (ex. regex ingênua) pode incluir lixo (tags mal removidas, entidades HTML) | Usar `DOMParser` do próprio navegador (disponível no renderer) pra extrair `textContent`, não regex |
