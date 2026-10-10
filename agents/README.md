# Agents — OptionEditor

Este diretório documenta como agentes e skills devem atuar neste projeto.

Os papéis abaixo estão implementados como subagentes reais do Claude Code em `.claude/agents/*.md` (invocáveis pela ferramenta de agente). Este arquivo continua sendo a documentação operacional/conceitual de referência; `.claude/agents/` é a configuração executável.

## Princípios

- Agentes devem trabalhar a partir de specs em `specs/`.
- Agentes não devem implementar comportamento novo sem spec.
- Agentes devem preferir mudanças pequenas e verificáveis.
- Agentes devem preservar o domínio atual do projeto: editor desktop de documentos.
- Agentes devem registrar decisões relevantes na spec relacionada.
- Agentes devem seguir as fases `Specify`, `Design`, `Tasks` e `Execute`.
- Agentes devem ajustar profundidade conforme sizing: `Small`, `Medium`, `Large` ou `Complex`.

## Responsabilidades Sugeridas

| Papel | Responsabilidade | Implementação |
|---|---|---|
| `spec-planner` | Executar Specify e revisar escopo antes da implementação | `.claude/agents/spec-planner.md` |
| `electron-maintainer` | Cuidar de Electron, IPC, preload, tray e build | `.claude/agents/electron-maintainer.md` |
| `renderer-maintainer` | Cuidar de React, Tiptap, UI e estado do renderer | `.claude/agents/renderer-maintainer.md` |
| `quality-reviewer` | Revisar riscos, testes, lint, build e critérios de aceite | `.claude/agents/quality-reviewer.md` |

## Fluxo Recomendado

1. Abrir a spec ativa.
2. Confirmar sizing.
3. Verificar requisitos e tarefas.
4. Implementar a menor tarefa possível.
5. Validar comportamento.
6. Atualizar checklist da spec.
