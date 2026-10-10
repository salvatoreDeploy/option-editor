# Spec 010c — Document Actions (Renomear / Duplicar / Favoritar) — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O único jeito de nomear um documento hoje é editando o `<h1>` dentro do editor — não dá pra renomear, duplicar ou favoritar um documento a partir da Sidebar, sem abri-lo. O botão "Mais" do `Header` (spec `007`) foi deixado sem funcionalidade de propósito, já que não existiam ações reais pra colocar nele.

## Objetivo

Adicionar renomear, duplicar e favoritar, acessíveis tanto no documento aberto (menu "Mais" do `Header`) quanto por documento na Sidebar (menu "..." por item, reintroduzindo o affordance removido na spec `006`/`007` — removido antes por não ter nenhuma função, agora tem três).

## Fora De Escopo

- Reorganizar a Sidebar em seções "Favoritos"/"Todos" — favoritos só sobem para o topo da lista (ordenação), sem cabeçalho de seção novo (sem referência de design pro Pencil pra essa estrutura, e é mais trabalho do que o pedido justifica agora).
- Renomear/duplicar/favoritar em lote (múltipla seleção).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Permitir renomear documento explicitamente, sem precisar editar o `<h1>` no corpo | Explícito (BACKLOG Sprint 8 / spec `010` `REQ-001`) |
| `REQ-002` | Permitir duplicar documento (novo id, mesmo título com sufixo "(cópia)", mesmo conteúdo) | Explícito (spec `010` `REQ-002`) |
| `REQ-003` | Permitir favoritar/desfavoritar documento | Explícito (spec `010` `REQ-003`) |
| `REQ-004` | Documentos favoritados aparecem primeiro na lista da Sidebar (favorito antes, `updatedAt` decrescente dentro de cada grupo) | Implícito (senão favoritar não tem efeito perceptível) |
| `REQ-005` | Ações disponíveis a partir do `Header` (documento aberto) e da Sidebar (por item, documento fechado) | Explícito |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Duplicar não pode duplicar um documento excluído (soft-deleted) |
| `NFR-002` | Renomear/duplicar/favoritar não pode quebrar o autosave nem o fluxo de exclusão já validados |

## Restrições

- Sem tela nova no Pencil pra isso (desconectado nesta sessão); os menus usam os componentes/tokens já migrados (`Button/Ghost`, `Dialog/Base`, cores de `--accent`/`--popover`).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Renomear pelo menu do `Header` ou da Sidebar atualiza o título em ambos os lugares imediatamente |
| `AC-002` | Duplicar cria um novo documento independente (editar a cópia não afeta o original) |
| `AC-003` | Favoritar marca visualmente o documento (ícone de estrela preenchido) e ele sobe para o topo da lista |
| `AC-004` | Desfavoritar reverte a marcação e a posição |
| `AC-005` | As três ações funcionam tanto no documento aberto quanto em qualquer item da lista da Sidebar |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Renomear (Header ou Sidebar) um documento que está aberto no momento deixa o título divergente do `<h1>` visível no editor até a próxima edição (que reverteria a renomeação, já que o autosave extrai o título do `<h1>`) | **Resolvido**: `document.tsx` detecta quando o título muda por uma via externa (não pela própria digitação) e força o `Editor` a remontar com o conteúdo atualizado — não precisou esconder a opção em lugar nenhum |
