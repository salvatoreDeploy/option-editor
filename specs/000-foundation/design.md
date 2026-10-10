# Spec 000 — Foundation Design

## Estado

`ready`

## Decisão Técnica

O projeto adotará documentação local em Markdown para specs e coordenação de agentes.

Isso mantém o processo versionável, simples e independente de plataforma.

## Modelo De Processo

O processo adotado possui quatro fases:

- `Specify`: requisitos rastreáveis com IDs.
- `Design`: decisões técnicas proporcionais ao sizing.
- `Tasks`: tarefas atômicas com aceite e verificação.
- `Execute`: implementação, validação e atualização da spec.

## Sizing Adaptativo

- `Small`: documentação mínima, foco em tarefa e verificação.
- `Medium`: requisitos e design resumido.
- `Large`: requisitos e design completos.
- `Complex`: inclui research hooks e análise de risco mais profunda.

## Arquivos Criados

- `SPEC_DRIVEN_DEVELOPMENT.md`
- `specs/README.md`
- `specs/000-foundation/requirements.md`
- `specs/000-foundation/design.md`
- `specs/000-foundation/tasks.md`
- `agents/README.md`
- `agents/skills/README.md`
- `specs/_template/requirements.md`
- `specs/_template/design.md`
- `specs/_template/tasks.md`

## Relação Com O Backlog

O `BACKLOG.md` continua sendo o plano macro por sprints.

As specs passam a ser a fonte operacional para implementação.

## Fluxo De Uso

Antes de modificar código:

1. Identificar a sprint ou problema.
2. Criar ou abrir a spec correspondente.
3. Validar requisitos.
4. Implementar tarefas listadas.
5. Atualizar status e critérios de aceite.

## Riscos

- Specs excessivamente grandes podem virar documentação morta.
- Specs pequenas demais podem fragmentar decisões importantes.
- O backlog pode ficar divergente das specs se não for atualizado.

## Mitigações

- Cada spec deve ter escopo pequeno e entregável.
- Toda alteração de comportamento deve atualizar a spec relacionada.
- O `specs/README.md` deve listar o estado atual das specs.
