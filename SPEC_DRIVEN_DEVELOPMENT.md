# SPEC_DRIVEN_DEVELOPMENT.md — OptionEditor

Este documento define como o OptionEditor será evoluído usando Spec-Driven Development orientado por intenção.

## Propósito

O processo existe para transformar pedidos vagos em blueprints rastreáveis antes de escrever código.

Ele deve reduzir ambiguidade, preservar decisões técnicas e garantir que implementação, validação e commits estejam conectados ao motivo da mudança.

## Regra Central

Nenhuma mudança relevante de código deve ser feita sem uma spec correspondente em `specs/`.

Mudanças pequenas de manutenção podem referenciar uma spec existente, mas não devem introduzir comportamento novo sem registro.

## Princípios

- Intenção antes de implementação.
- Profundidade proporcional ao tamanho da mudança.
- Requisitos explícitos e implícitos sempre rastreáveis.
- Tarefas atômicas com critérios de aceite verificáveis.
- Execução persistente até validação ou bloqueio documentado.
- Compatível com qualquer agente ou IDE.

## Sizing

Cada mudança deve receber um tamanho antes da implementação.

| Tamanho | Quando usar | Fases obrigatórias |
|---|---|---|
| `Small` | Correção localizada, sem mudança arquitetural | Specify resumido, Tasks, Execute |
| `Medium` | Refatoração ou feature em poucos arquivos | Specify, Design resumido, Tasks, Execute |
| `Large` | Mudança em múltiplos módulos ou fluxos | Specify completo, Design completo, Tasks, Execute |
| `Complex` | Mudança com incerteza técnica, migração ou risco alto | Specify completo, Design completo, research hooks, Tasks, Execute |

## Fases

### 1. Specify

Mapeia o escopo explícito e implícito da mudança.

Saídas esperadas:

- Problema.
- Objetivo.
- Fora de escopo.
- Requisitos com IDs únicos.
- Restrições.
- Critérios de aceite.

Formato de IDs:

- `REQ-001`: requisito funcional ou técnico.
- `NFR-001`: requisito não funcional.
- `AC-001`: critério de aceite.
- `RISK-001`: risco identificado.

### 2. Design

Define como a mudança será implementada.

Esta fase deve ser proporcional ao sizing. Em mudanças `Small`, pode ser um bloco curto dentro da spec.

Saídas esperadas:

- Arquivos afetados.
- Decisões técnicas.
- Alternativas consideradas, quando relevante.
- Contratos de dados ou IPC.
- Impactos no renderer, preload e main process.
- Research hooks para dúvidas técnicas.
- Riscos e mitigação.

### 3. Tasks

Quebra o trabalho em etapas atômicas.

Cada tarefa deve ter:

- ID único.
- Referência aos requisitos atendidos.
- Critério de aceite.
- Verificação esperada.

Formato recomendado:

```text
TASK-001: Corrigir efeito colateral no Sidebar
Refs: REQ-001, AC-001
Aceite: chamada de sync do tray ocorre apenas em useEffect
Verificação: revisar render e executar fluxo de abertura do app
```

### 4. Execute

Guia implementação e validação.

Regras:

- Implementar uma tarefa por vez.
- Preferir mudanças pequenas.
- Atualizar checklist da spec durante a execução.
- Rodar validações relevantes.
- Registrar bloqueios na própria spec.
- Fazer commits atômicos quando o projeto estiver em Git.

## Estrutura

```text
specs/
  README.md
  _template/
    requirements.md
    design.md
    tasks.md
  000-foundation/
    requirements.md
    design.md
    tasks.md
agents/
  README.md
  skills/
    README.md
```

## Ciclo De Trabalho

1. Classificar o tamanho: `Small`, `Medium`, `Large` ou `Complex`.
2. Criar ou atualizar uma spec em `specs/<id>-<nome>/`.
3. Executar a fase `Specify` em `requirements.md`.
4. Executar a fase `Design` em `design.md`, quando exigido pelo sizing.
5. Executar a fase `Tasks` em `tasks.md`.
6. Implementar uma tarefa por vez na fase `Execute`.
7. Validar build, lint e comportamento manual relevante.
8. Atualizar a spec com decisões tomadas durante a implementação.

## Formato De Uma Spec

Cada spec deve conter:

- `requirements.md`: sizing, problema, objetivos, requisitos, fora de escopo e critérios de aceite.
- `design.md`: arquitetura, arquivos afetados, decisões técnicas, riscos e research hooks.
- `tasks.md`: tarefas atômicas, referências, critérios de aceite, verificação e estado de execução.

## Estados De Uma Spec

- `draft`: proposta inicial ainda não implementada.
- `ready`: pronta para implementação.
- `in-progress`: implementação em andamento.
- `done`: implementada e validada.
- `blocked`: depende de decisão, recurso ou correção externa.

## Padrões De Implementação

- TypeScript estrito.
- Sem `any`.
- Sem `@ts-ignore`, exceto com justificativa registrada na spec.
- IPC declarado em `src/shared`.
- Renderer acessa Electron apenas via preload.
- Ações destrutivas exigem confirmação.
- Operações assíncronas precisam de tratamento de erro.
- Autosave deve usar debounce.
- Arquivos em kebab-case.
- Componentes React em PascalCase.

## Critérios Globais De Qualidade

Uma mudança só é considerada concluída quando:

- `npm run build` foi executado ou há justificativa registrada para não executar.
- `npm run lint` foi executado ou há justificativa registrada para não executar.
- O fluxo manual afetado foi validado.
- A spec relacionada foi atualizada.

## Commits Atômicos

Quando o diretório estiver em um repositório Git, commits devem ser pequenos e conectados à spec.

Formato recomendado:

```text
<tipo>(<escopo>): <descrição>

Refs: specs/<id>-<nome>, TASK-001
```

Não fazer commit sem verificar `git status`, `git diff` e os arquivos alterados.

## Convenção De IDs

Specs devem usar numeração incremental:

```text
000-foundation
001-technical-stabilization
002-ipc-contracts
003-autosave-persistence
```

## Relação Com O Backlog

O `BACKLOG.md` descreve as sprints.

As specs descrevem exatamente como cada bloco será implementado.

Quando uma sprint começar, suas entregas devem ser convertidas em uma ou mais specs.
