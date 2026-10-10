# Spec 006 — Domain Organization — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

Nomenclatura inconsistente no domínio do produto: código usa `document` mas a UI mostra "Estrutura técnica", "Back-end" e "Untitled" fixos no breadcrumb como se fossem dados reais; o nome do produto varia entre `tasknet` (`package.json`), `TaskNet` (UI do tray/menu) e `OptionEditor` (specs/backlog).

## Objetivo

Depende de `003-technical-stabilization` (nomes de evento) e `004-ipc-typing-contracts` (constantes IPC sem espaço). Consolidar `document` como domínio único, remover textos hardcoded incoerentes, e alinhar o nome oficial do produto em todos os lugares.

## Fora De Escopo

- Mudanças de UX além da correção de textos incoerentes (spec `007-ux-essentials`).
- Novo design visual (tratado via Pencil em specs de design).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Confirmar `document` como nome de domínio único (funções, tipos, arquivos) | Explícito (BACKLOG Sprint 3) |
| `REQ-002` | Consolidar nomes de funções relacionadas a documento (evitar sinônimos como `getDocuments`/`fetchDocuments` coexistindo sem critério) | Explícito (BACKLOG Sprint 3) |
| `REQ-003` | Remover textos hardcoded incoerentes no breadcrumb/header: `Back-end`, `Estrutura técnica`, `Untitled` fixo | Explícito (BACKLOG Sprint 3) |
| `REQ-004` | Padronizar textos da interface em português | Explícito (BACKLOG Sprint 3) |
| `REQ-005` | Definir e aplicar o nome oficial do produto em `package.json`, tray/menu e documentação | Explícito (BACKLOG Sprint 3, decisão original na Sprint 0) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Renomear identificadores não pode quebrar `npm run build` |

## Restrições

- A decisão do nome oficial do produto precisa estar registrada (Sprint 0 / `specs/000-foundation`) antes de executar `REQ-005`.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Nomes internos de função/tipo relacionados a documento seguem um padrão único, sem sinônimos redundantes |
| `AC-002` | UI não exibe placeholders estruturais (`Back-end`, `Estrutura técnica`) como se fossem dados reais |
| `AC-003` | Breadcrumb/header refletem o título do documento aberto |
| `AC-004` | O nome do produto é o mesmo em `package.json`, UI (tray/menu) e documentação |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Renomear funções amplamente usadas pode gerar imports quebrados espalhados | Fazer a renomeação incrementalmente, validando `npm run build` a cada arquivo alterado |
