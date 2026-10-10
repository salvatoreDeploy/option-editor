---
name: spec-authoring
description: Create a new spec for OptionEditor from specs/_template/, classify its sizing, and fill in the Specify phase (requirements.md). Use when starting work on a BACKLOG.md sprint that has no spec yet, or when a change request has no corresponding spec.
---

# spec-authoring

Cria uma spec nova em `specs/<id>-<nome>/` seguindo `SPEC_DRIVEN_DEVELOPMENT.md`.

## Passos

1. Leia `BACKLOG.md` e `specs/README.md` para achar o próximo ID livre e confirmar se a sprint/pedido já tem spec.
2. Classifique o tamanho da mudança:
   - `Small`: correção localizada, sem mudança arquitetural.
   - `Medium`: refatoração ou feature em poucos arquivos.
   - `Large`: mudança em múltiplos módulos ou fluxos.
   - `Complex`: incerteza técnica, migração ou risco alto.
3. Copie `specs/_template/requirements.md`, `design.md` e `tasks.md` para `specs/<id>-<nome>/`.
4. Preencha `requirements.md`:
   - `Problema`, `Objetivo`, `Fora De Escopo`.
   - Tabela `Requisitos` com IDs `REQ-001`, `REQ-002`, ... e a origem de cada um (explícito no pedido, ou implícito/achado na análise).
   - Tabela `Requisitos Não Funcionais` (`NFR-xxx`).
   - Tabela `Critérios De Aceite` (`AC-xxx`) — cada um deve ser verificável objetivamente.
   - Tabela `Riscos` (`RISK-xxx`) com mitigação.
5. Se o sizing for `Small`, o `design.md` pode ficar como um bloco curto dentro do próprio `requirements.md` em vez de um arquivo completo — mas o arquivo ainda deve existir com o resumo.
6. Atualize a tabela em `specs/README.md` com a nova spec (estado inicial `draft` ou `ready`, se já revisada).
7. Se a spec cobre uma sprint do `BACKLOG.md`, adicione a referência `Spec: specs/<id>-<nome>` na seção daquela sprint.

## Regras

- IDs seguem sempre `REQ-`, `NFR-`, `AC-`, `RISK-` (nunca `RF-`/`RNF-`).
- Nunca pule direto para código a partir desta skill — o produto final aqui é a spec, não a implementação (isso é a skill `spec-execute`).
