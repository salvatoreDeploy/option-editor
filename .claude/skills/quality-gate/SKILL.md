---
name: quality-gate
description: Run build, lint, and tests, review a spec's acceptance criteria, and record validation results in its tasks.md. Use before marking any OptionEditor spec as done.
---

# quality-gate

Portão de qualidade do OptionEditor, antes de marcar qualquer spec como `done`.

## Passos

1. Rodar `npm run build` e reportar o resultado real (não assumir que passa).
2. Rodar `npm run lint` e reportar o resultado real.
3. Se existir `npm run test` (após a spec `009-quality-testability`), rodar e reportar.
4. Abrir `specs/<id>/requirements.md` e conferir cada `AC-xxx` contra o estado atual do código/comportamento.
5. Abrir `specs/<id>/tasks.md` e conferir que "Validação Final" está de fato marcada, com "Registro De Execução" preenchido com datas e resultados reais.
6. Rodar o checklist manual de QA relevante (criar, editar/autosave, buscar, abrir pelo tray, excluir com confirmação), quando a mudança tocar esses fluxos.

## Regras

- Nunca marcar uma spec como `done` sem os passos acima terem rodado de fato nesta sessão.
- Se algo falhar, registrar o problema na própria spec (seção de execução ou um novo `RISK-xxx`) em vez de silenciar e seguir em frente.
- Se o build/lint já falhava antes da mudança em questão (dívida técnica pré-existente), deixar isso explícito no relatório em vez de atribuir a falha à mudança atual.
