# Spec 010g — Document Export — Requirements

## Estado

`in-progress` (implementação concluída, falta validação manual do usuário)

## Sizing

`Large`

## Problema

Não existe nenhuma forma de tirar um documento do app — o conteúdo só existe dentro do `electron-store`.

## Objetivo

Exportar um documento como `.html`, `.md`, `.txt` ou `.pdf`, a partir do documento aberto (`Header`) ou de qualquer item da Sidebar (documento fechado). Pedido do usuário incluiu `.pdf` além dos dois formatos já previstos no `BACKLOG.md` (`.html`, `.md`); `.txt` foi acrescentado por ser praticamente gratuito uma vez que o texto plano já precisa ser extraído pro `.md`.

## Fora De Escopo

- Importar Markdown (`REQ-008` da spec `010`) — é uma sub-spec própria (ler/validar arquivo externo é uma preocupação diferente de gerar um), fica pra depois.
- Exportar múltiplos documentos de uma vez (lote).
- Templates de PDF customizáveis (cabeçalho, rodapé, numeração de página) — o PDF é uma renderização direta e simples do conteúdo, sem essa camada.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Exportar como `.html` — documento HTML autocontido (`<title>`, `<h1>` do título, conteúdo) | Explícito (BACKLOG Sprint 8) |
| `REQ-002` | Exportar como `.md` | Explícito (BACKLOG Sprint 8) |
| `REQ-003` | Exportar como `.pdf` | Explícito (pedido do usuário) |
| `REQ-004` | Exportar como `.txt` (texto plano) | Explícito (pedido do usuário, "mais opções para este escopo") |
| `REQ-005` | Ação disponível no menu do documento aberto (`Header`) e de qualquer item da Sidebar (documento fechado) | Implícito (mesmo padrão do `DocumentActionsMenu`, spec `010c`) |
| `REQ-006` | Usa o diálogo nativo "Salvar como" do SO — usuário escolhe onde salvar | Implícito (sem isso não é realmente "exportar", só geraria um arquivo num lugar fixo) |
| `REQ-007` | Conversão HTML→Markdown/texto cobre os nós/marcas que o editor deste app realmente produz (heading, parágrafo, negrito, itálico, tachado, código inline, bloco de código com linguagem, citação, listas, divisor, quebra de linha, destaque) | Implícito (a conversão só precisa ser correta pro que o Tiptap deste app gera, não Markdown genérico universal) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Gerar o PDF não pode deixar uma janela extra visível pro usuário (renderização em janela oculta) |
| `NFR-002` | Cancelar o diálogo "Salvar como" não deve gerar erro nem arquivo nenhum |

## Restrições

- Sem dependência nova de conversão HTML↔Markdown — o app já sabe exatamente quais tags o próprio editor produz (schema fechado, não é Markdown genérico), então um conversor próprio é mais simples e sem risco de dependência do que uma lib generalista.
- Geração de PDF via `webContents.printToPDF` (nativo do Electron), sem lib externa.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Exportar como `.html` gera um arquivo que abre corretamente num navegador, com o título certo |
| `AC-002` | Exportar como `.md` preserva heading, negrito, itálico, listas, código e citação corretamente |
| `AC-003` | Exportar como `.txt` contém só texto, sem tags/markup |
| `AC-004` | Exportar como `.pdf` gera um arquivo PDF válido e legível, sem abrir nenhuma janela visível extra |
| `AC-005` | Cancelar o diálogo de salvar não deixa nenhum arquivo nem estado quebrado |
| `AC-006` | Exportar funciona tanto pelo documento aberto quanto por um item fechado da Sidebar |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Conversor de Markdown próprio pode não cobrir algum caso de HTML gerado pelo editor | Escopo fechado (`REQ-007`) — só precisa cobrir exatamente as extensões Tiptap usadas neste app (`Editor/index.tsx`), não Markdown/HTML arbitrário |
| `RISK-002` | Janela oculta usada pra gerar o PDF pode vazar (não fechar) se algo falhar no meio | `try/finally` garantindo `window.close()` mesmo em caso de erro |
