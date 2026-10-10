# Spec 010e — Configurable Shortcuts — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

Os dois atalhos do app hoje são fixos no código: `Ctrl+1` (criar documento, `globalShortcut` no main process) e `Cmd/Ctrl+K` (busca rápida, listener no `SearchBar`). Não há como o usuário trocar essas combinações.

## Objetivo

Deixar os dois atalhos configuráveis, persistidos localmente, com uma UI dedicada — sem construir a tela de "Configurações" inteira do Pencil (`Screen / Settings`), que tem seções (Geral, Editor, Dados locais, Zona sensível) sem relação com atalhos e sem função implementada. Consultado o Pencil MCP: o "Shortcuts Card" daquela tela define o padrão visual reaproveitado aqui (linha com nome + badge da tecla).

## Fora De Escopo

- O resto da `Screen / Settings` (nome do workspace, pasta de dados, toggles do editor, zona sensível) — cada um seria sua própria sub-spec futura, se pedido.
- Tornar "Fechar modal" (Esc) configurável — é comportamento interno dos componentes Radix (`Dialog`, `AlertDialog`, `DropdownMenu`, `Command.Dialog`) usados em vários lugares; remapear exigiria interceptar Esc em cada um deles. Mostrado como informação fixa, não editável.
- Atalhos por plataforma diferentes (o mesmo valor vale para Windows/Linux/macOS, usando `CommandOrControl` como hoje).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Persistir os atalhos configuráveis (`novo documento`, `busca rápida`) no `electron-store` | Explícito (spec `010` `REQ-010`) |
| `REQ-002` | UI para ver e gravar uma nova combinação de teclas por atalho, com o padrão visual do "Shortcuts Card" do Pencil | Explícito |
| `REQ-003` | Gravar uma combinação exige pelo menos um modificador (`Ctrl`/`Cmd`) — não aceita tecla solta, pra não colidir com digitação normal | Implícito (segurança básica de UX) |
| `REQ-004` | Não permitir salvar dois atalhos configuráveis com a mesma combinação | Implícito |
| `REQ-005` | Mudar o atalho de "novo documento" re-registra o `globalShortcut` do main process imediatamente, sem precisar reiniciar o app | Explícito |
| `REQ-006` | Mudar o atalho de "busca rápida" atualiza o listener do `SearchBar` imediatamente | Explícito |
| `REQ-007` | As dicas de atalho já exibidas no app (tela vazia, rodapé do Command Dialog) refletem os valores configurados, não mais texto fixo | Implícito (evita mostrar uma dica errada depois de reconfigurar) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Nenhuma mudança pode quebrar o atalho padrão pra quem nunca abriu a configuração (defaults iguais aos valores fixos atuais) |

## Restrições

- Sem tela de rota nova (`/settings`) — um diálogo é suficiente pro escopo de só atalhos, consistente com o `RenameDialog` já existente (spec `010c`).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Abrir o diálogo de atalhos mostra os valores atuais (padrão na primeira vez) |
| `AC-002` | Gravar uma nova combinação e salvar atualiza o atalho de verdade (testável imediatamente, sem reiniciar) |
| `AC-003` | Tentar gravar sem modificador é rejeitado com uma mensagem |
| `AC-004` | Tentar salvar dois atalhos iguais é rejeitado com uma mensagem |
| `AC-005` | As dicas em `blank.tsx` e no rodapé do `SearchBar` mostram o valor configurado atual |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Usuário grava uma combinação já usada pelo SO/outro app, e o `globalShortcut.register` falha silenciosamente (a API do Electron retorna `false`, não lança erro) | Checar o retorno de `globalShortcut.register` e reverter/avisar se falhar |
