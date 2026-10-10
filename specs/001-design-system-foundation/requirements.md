# Spec 001 — Design System Foundation Requirements

## Estado

`done`

## Sizing

`Large`

## Problema

O OptionEditor precisa de telas e componentes visuais de referência antes da refatoração de UI.

Hoje o projeto possui uma interface funcional, mas sem design-kit documentado, com textos hardcoded e estados críticos pouco definidos.

## Objetivo

Criar no Pencil um design-kit inspirado em shadcn/ui e telas base para orientar a refatoração do renderer React.

## Fora De Escopo

- Implementar código React nesta spec.
- Trocar Tailwind ou Tiptap.
- Criar backend ou sincronização remota.
- Criar telas mobile completas nesta primeira etapa.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Criar tokens visuais para cores, tipografia, espaçamento e raio | Explícito |
| `REQ-002` | Criar componentes reutilizáveis compatíveis com padrões shadcn/ui | Explícito |
| `REQ-003` | Criar tela vazia inicial do editor | Implícito |
| `REQ-004` | Criar tela principal de edição de documento | Implícito |
| `REQ-005` | Criar modal de busca rápida | Implícito |
| `REQ-006` | Criar modal de confirmação de exclusão | Implícito |
| `REQ-007` | Criar estados de loading, erro e salvamento | Implícito |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | O design deve respeitar a stack atual: Electron, React, Tailwind, Tiptap e Radix |
| `NFR-002` | O design deve ser implementável com componentes simples e classes Tailwind |
| `NFR-003` | O design deve evitar ornamentação excessiva e priorizar clareza funcional |

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | O arquivo `openeditor.pen` contém tokens visuais definidos |
| `AC-002` | O arquivo contém componentes reutilizáveis para button, input, badge, document row e dialog |
| `AC-003` | O arquivo contém tela vazia inicial |
| `AC-004` | O arquivo contém tela principal do editor |
| `AC-005` | O arquivo contém tela de busca rápida |
| `AC-006` | O arquivo contém tela de confirmação de exclusão |
| `AC-007` | Layouts não estão colapsados ou com conteúdo cortado |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Design ficar mais complexo que a implementação atual suporta | Usar componentes shadcn-like simples e implementáveis com Tailwind |
| `RISK-002` | Telas ficarem genéricas demais | Basear telas nos fluxos reais do OptionEditor |
