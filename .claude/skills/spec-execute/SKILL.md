---
name: spec-execute
description: Implement one atomic task at a time from an OptionEditor spec's tasks.md, updating its checklist and execution log as you go. Use when a spec is ready (requirements.md and, if needed, design.md are filled in) and it's time to write code.
---

# spec-execute

Executa a fase `Execute` de uma spec já pronta (`requirements.md`, e `design.md` quando exigido pelo sizing).

## Passos

1. Abra `tasks.md` da spec e escolha **uma** `TASK-xxx` não concluída, respeitando a ordem listada (tarefas anteriores costumam ser pré-requisito das seguintes).
2. Implemente só o que a tarefa descreve — nada de aproveitar para fazer mais do que o escopo da tarefa.
3. Rode a verificação descrita na própria tarefa (comando ou fluxo manual).
4. Marque a tarefa como concluída no `tasks.md` e adicione uma linha em "Registro De Execução" com data, tarefa e resultado real (não "ok" genérico — diga o que foi validado).
5. Repita para a próxima tarefa, uma de cada vez.
6. Ao concluir todas as tarefas, rode a "Validação Final" da spec (`npm run build`, `npm run lint`, fluxo manual, testes se existirem) e só então considere acionar a skill/agente `quality-reviewer` para decidir se a spec vira `done`.

## Regras

- Preferir mudanças pequenas e commits atômicos (um commit por tarefa ou por grupo pequeno de tarefas relacionadas), quando o usuário pedir para commitar.
- Se uma tarefa revelar um bloqueio (dependência não resolvida, decisão de produto pendente), registre o bloqueio na spec (estado `blocked`) em vez de decidir sozinho por um caminho não coberto pela spec.
- Nunca implemente uma tarefa de uma spec `draft` — ela precisa estar `ready` primeiro (ver `spec-planner`/`spec-design`).
