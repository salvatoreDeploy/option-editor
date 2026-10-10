# Spec 010 — Controlled Expansion — Design

## Estado

`ready`

## Resumo Técnico

Esta spec é um guarda-chuva (sizing `Complex`): não descreve a implementação de cada feature, apenas o processo pelo qual cada uma vira uma sub-spec própria (`010a`, `010b`, ...) seguindo `SPEC_DRIVEN_DEVELOPMENT.md` na íntegra (Specify, Design, Tasks, Execute), já que envolve incerteza técnica e risco de regressão na base recém-estabilizada.

## Arquivos Afetados

Depende de cada sub-spec; potencialmente toda a árvore `src/`.

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Nenhuma feature desta spec é implementada diretamente aqui; cada uma exige sua própria pasta em `specs/010a-<nome>/` etc. | Mantém rastreabilidade individual por feature e evita uma spec gigante e desatualizável |
| `DEC-002` | Ordem sugerida: `documentos recentes reais` e `lixeira/recuperação` primeiro (corrigem comportamento hoje incorreto/arriscado), depois `renomear`/`duplicar`/`favoritar`, depois exportação/importação, depois configurações/tema/atalhos | Prioriza correções de comportamento sobre features puramente aditivas |

## Contratos

A definir por sub-spec.

## Alternativas Consideradas

- Implementar todas as features em uma única spec grande: descartado — contraria o próprio princípio de "profundidade proporcional ao tamanho da mudança" do `SPEC_DRIVEN_DEVELOPMENT.md`.

## Research Hooks

- Para exportação/importação Markdown: pesquisar se um serializer Tiptap↔Markdown já cobre o schema atual (`heading` + `block*`) sem perda de formatação.
- Para tema claro/escuro: verificar como o Tailwind está configurado hoje (`tailwind.config.js`) para decidir entre `class` strategy ou `media`.

## Impactos

A definir por sub-spec.

## Plano De Validação

- Cada sub-spec define seu próprio plano de validação; esta spec-guarda-chuva só é considerada "avançando" quando tiver ao menos uma sub-spec `ready` ou `done`.
