# Spec 010 — Controlled Expansion — Requirements

## Estado

`ready`

## Sizing

`Complex`

## Problema

Com a base estabilizada (specs `003` a `009`), o produto ainda carece de features que usuários reais esperam: renomear/duplicar documento, favoritos, recentes reais, busca por conteúdo, exportar/importar, configurações, tema, lixeira.

## Objetivo

Adicionar valor sem comprometer a base estabilizada. Cada feature entra com contrato próprio e não pode quebrar os fluxos essenciais já validados (criar, editar, salvar, buscar, excluir).

## Fora De Escopo

- Qualquer feature aqui listada como "possível" deve virar sua própria sub-spec (`010a-...`, `010b-...` etc.) antes de ser implementada — esta spec é o guarda-chuva, não a implementação direta.
- Backend remoto ou sincronização entre dispositivos.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Permitir renomear documento explicitamente (fora da extração automática de título) | Explícito (BACKLOG Sprint 8) |
| `REQ-002` | Permitir duplicar documento | Explícito (BACKLOG Sprint 8) |
| `REQ-003` | Permitir favoritar documentos | Explícito (BACKLOG Sprint 8) |
| `REQ-004` | Implementar documentos recentes reais (por data de abertura/edição, não os últimos N do store) | Explícito (BACKLOG Sprint 8; corrige o `.slice(-3)` de `tray.ts` identificado na análise) |
| `REQ-005` | Buscar por conteúdo, não só por título | Explícito (BACKLOG Sprint 8) |
| `REQ-006` | Exportar documento como `.html` | Explícito (BACKLOG Sprint 8) |
| `REQ-007` | Exportar documento como `.md` | Explícito (BACKLOG Sprint 8) |
| `REQ-008` | Importar arquivo Markdown | Explícito (BACKLOG Sprint 8) |
| `REQ-009` | Criar tela de configurações do app | Explícito (BACKLOG Sprint 8) |
| `REQ-010` | Tornar atalhos configuráveis | Explícito (BACKLOG Sprint 8) |
| `REQ-011` | Adicionar tema claro/escuro | Explícito (BACKLOG Sprint 8) |
| `REQ-012` | Adicionar lixeira ou recuperação após exclusão | Explícito (BACKLOG Sprint 8) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Cada feature nova segue o processo completo de `SPEC_DRIVEN_DEVELOPMENT.md` (sub-spec própria) antes de ser implementada |

## Restrições

- ~~Nenhuma feature pode ser implementada sem antes verificar as specs `003`-`009` como `done`~~ — **decisão do usuário em 2026-09-17**: `009-quality-testability` foi deliberadamente reordenada para ser a última spec do backlog, implementada depois da `010` (não antes). A restrição original ficava: specs `003` a `008` `done` antes de iniciar sub-specs da `010` — isso está satisfeito.
- Novas telas devem seguir o design de `openeditor.pen` (via Pencil MCP).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Cada feature entra com contrato claro (sub-spec própria) |
| `AC-002` | Nenhuma feature nova quebra criar, editar, salvar, buscar ou excluir documento |
| `AC-003` | `README.md` é atualizado junto com cada feature |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Expansão descontrolada pode reintroduzir os problemas já corrigidos na estabilização | Exigir sub-spec por feature (mitigação que segue valendo). O bloqueio original também exigia `009-quality-testability` `done` antes — removido por decisão explícita do usuário (2026-09-17), que reordenou `009` para o final do backlog. Sem suíte de testes automatizada, cada sub-spec da `010` precisa de validação manual redobrada antes de ir para `done`. |
| `RISK-002` | Sem CI/testes automatizados (spec `009` adiada), regressões introduzidas pelas features da `010` podem não ser pegas antes de chegar ao usuário | Cada sub-spec exige build + lint + validação manual explícita do usuário antes de `done`, como já vem sendo feito nas specs `003`-`008` |
