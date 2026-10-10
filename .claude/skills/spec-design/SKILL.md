---
name: spec-design
description: Fill in the Design phase (design.md) of an existing OptionEditor spec — technical decisions, affected files, contracts, risks, research hooks. Use after requirements.md exists and the sizing is Medium or larger.
---

# spec-design

Preenche `design.md` de uma spec já existente (com `requirements.md` pronto), seguindo `SPEC_DRIVEN_DEVELOPMENT.md`.

## Passos

1. Leia `requirements.md` da spec para entender problema, objetivo e requisitos (`REQ-xxx`).
2. Se o sizing for `Small`, um bloco curto no `requirements.md` pode bastar — confirme antes de escrever um `design.md` inteiro desnecessário.
3. Para `Medium`, `Large` ou `Complex`, preencha em `design.md`:
   - `Resumo Técnico`: a solução proposta em poucas frases.
   - `Arquivos Afetados`: lista real de paths, não descrição vaga.
   - `Decisões Técnicas` (`DEC-xxx`): cada decisão com o motivo — inclua alternativas descartadas quando relevante.
   - `Contratos`: para specs que tocam `src/shared/`, `src/preload/` ou IPC, mostre o "antes" e "depois" do contrato quando possível.
   - `Impactos`: main process, preload, renderer, persistência — marque explicitamente "nenhum impacto" onde for o caso, não omita a seção.
   - `Research Hooks`: só para `Complex`, ou quando houver dúvida técnica real not resolvida pela leitura do código atual.
   - `Plano De Validação`: comandos (`npm run build`, `npm run lint`, `npm run test`) e o fluxo manual específico a validar.

## Regras

- Toda decisão de `DEC-xxx` deve amarrar de volta a um `REQ-xxx` ou `RISK-xxx` do `requirements.md` — se não amarra a nada, provavelmente é escopo novo não registrado, e deve voltar para a skill `spec-authoring` primeiro.
- Se a mudança envolve o design visual do Pencil (`openeditor.pen`), registre isso como Research Hook até o MCP do Pencil estar acessível, em vez de inventar o layout.
