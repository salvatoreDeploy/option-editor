# Skills — OptionEditor

Skills são capacidades recorrentes usadas para evoluir o projeto.

Este diretório documenta skills do projeto. Cada uma está implementada de fato em `.claude/skills/<nome>/SKILL.md`, invocável pela ferramenta de skill do Claude Code. Este arquivo é a documentação conceitual de referência.

## Skills Sugeridas

### `spec-authoring`

Implementação: `.claude/skills/spec-authoring/SKILL.md`.

Uso:

- Criar novas specs.
- Classificar mudanças como `Small`, `Medium`, `Large` ou `Complex`.
- Executar a fase `Specify`.
- Quebrar sprints em requisitos, desenho técnico e tarefas.
- Atualizar status de specs.

### `spec-design`

Implementação: `.claude/skills/spec-design/SKILL.md`.

Uso:

- Executar a fase `Design`.
- Registrar decisões técnicas.
- Mapear arquivos afetados.
- Criar research hooks para mudanças `Complex`.

### `spec-execute`

Implementação: `.claude/skills/spec-execute/SKILL.md`.

Uso:

- Implementar tarefas atômicas.
- Atualizar checklist durante execução.
- Registrar validações e bloqueios.
- Preparar commits atômicos quando houver Git.

### `electron-ipc-hardening`

Implementação: `.claude/skills/electron-ipc-hardening/SKILL.md`.

Uso:

- Revisar contratos IPC.
- Tipar preload e renderer.
- Remover canais inconsistentes.
- Garantir que renderer não acesse Electron fora do preload.

### `renderer-stabilization`

Implementação: `.claude/skills/renderer-stabilization/SKILL.md`.

Uso:

- Corrigir efeitos colaterais em renderização.
- Melhorar estado de loading e erro.
- Revisar React Query e fluxo de navegação.

### `editor-persistence`

Implementação: `.claude/skills/editor-persistence/SKILL.md`.

Uso:

- Melhorar autosave.
- Adicionar debounce.
- Evitar perda de conteúdo.
- Validar leitura e escrita no `electron-store`.

### `quality-gate`

Implementação: `.claude/skills/quality-gate/SKILL.md`.

Uso:

- Rodar build e lint.
- Revisar critérios de aceite.
- Criar checklist manual de QA.
- Registrar validações executadas.
