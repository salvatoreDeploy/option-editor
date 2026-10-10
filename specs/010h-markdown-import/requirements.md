# Spec 010h — Markdown Import — Requirements

## Estado

`done`

## Sizing

`Large`

## Problema

Não existe forma de trazer conteúdo externo para dentro do app — a única forma de popular um documento é digitando manualmente no editor. Quem já tem anotações em `.md` (de outro app ou de um export anterior do próprio OptionEditor, spec `010g-document-export`) não tem como reaproveitá-las.

## Objetivo

Importar um arquivo `.md`/`.markdown` do disco como um novo documento: o usuário escolhe o arquivo pelo diálogo nativo "Abrir arquivo", o app converte o Markdown para o formato interno do editor (Tiptap) e cria um documento novo já populado, navegando direto para ele.

## Fora De Escopo

- Importar outros formatos (`.html`, `.docx`, `.txt` genérico) — só `.md`/`.markdown`, conforme pedido original (`REQ-008` da spec `010`).
- Importar em lote (múltiplos arquivos de uma vez).
- Atualizar/mesclar um documento já existente a partir de um arquivo — import sempre cria um documento novo.
- Suporte a Markdown genérico/CommonMark completo (tabelas, listas aninhadas, imagens, frontmatter YAML, HTML embutido) — cobre só a mesma superfície de nós que o editor deste app produz e que a spec `010g` já cobre no sentido inverso (heading, parágrafo, negrito, itálico, tachado, código inline, bloco de código com linguagem, citação, listas simples de um nível, divisor, quebra de linha, destaque). Ver `RISK-001`.
- Preservar formatação que o schema do editor não representa (ex.: linhas de tabela viram texto solto).

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Ação "Importar Markdown" disponível na Sidebar, perto de "Novo documento" | Implícito (ponto de entrada natural, mesmo padrão de `CreatePage`) |
| `REQ-002` | Usa o diálogo nativo "Abrir arquivo" do SO, filtrado para `.md`/`.markdown` | Implícito (mesmo padrão de `REQ-006` da spec `010g`, só que no sentido de abrir) |
| `REQ-003` | Primeira linha não vazia do arquivo no formato `# Título` vira o título do documento e não entra no corpo; se não houver, o nome do arquivo (sem extensão) vira o título | Implícito (mesmo padrão de `buildMarkdownDocument` da spec `010g`, que sempre prefixa o export com `# título`) |
| `REQ-004` | Conversão Markdown→HTML cobre heading, parágrafo, negrito, itálico, tachado, destaque, código inline, bloco de código com linguagem, citação, listas (não aninhadas), divisor e quebra de linha — o inverso exato de `htmlToMarkdown` (spec `010g`) | Explícito (BACKLOG Sprint 8, "vira sub-spec própria", + necessidade de cobrir o que o editor sabe representar) |
| `REQ-005` | Importar cria um documento novo (via fluxo já existente de criar+salvar) e navega para ele, igual ao criar um documento em branco | Implícito (mesmo comportamento de `useCreateDocument`) |
| `REQ-006` | Cancelar o diálogo "Abrir arquivo" não cria documento nem gera erro | Implícito (mesmo padrão de `NFR-002` da spec `010g`) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Leitura do arquivo e diálogo nativo rodam no main process — o renderer nunca acessa o sistema de arquivos diretamente (padrão já estabelecido no projeto) |
| `NFR-002` | Falha ao ler o arquivo (permissão, arquivo corrompido/binário) não deixa a UI travada nem cria documento parcial — erro tratado e reportado no console, mesmo padrão do `onError` de `exportDocumentFn` |

## Restrições

- Sem dependência nova de parsing de Markdown (`remark`, `marked`, etc.) — mesmo raciocínio da restrição da spec `010g`: o schema de destino é fechado e conhecido, então um conversor próprio é mais simples e sem risco de dependência extra.
- Conversão roda inteiramente no renderer (parsing de texto puro, sem precisar de `DOMParser` nem de nenhuma API exclusiva do main) — só a leitura do arquivo em si precisa do main.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Importar um `.md` com `# Título` na primeira linha cria um documento com esse título exato e sem a linha do heading duplicada no corpo |
| `AC-002` | Importar um `.md` sem heading na primeira linha usa o nome do arquivo como título |
| `AC-003` | Negrito, itálico, tachado, destaque, código inline, bloco de código com linguagem, citação, listas e divisor do arquivo aparecem corretamente formatados no editor após a importação |
| `AC-004` | Cancelar o diálogo de abrir arquivo não cria nenhum documento novo nem exibe erro |
| `AC-005` | Documento importado aparece na Sidebar e pode ser editado, salvo e excluído normalmente, sem tratamento especial |
| `AC-006` | Exportar como `.md` (spec `010g`) um documento e reimportar esse mesmo arquivo reproduz título e formatação originais (round-trip razoável, dentro do escopo definido em `REQ-004`) |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Conversor próprio de Markdown pode não cobrir toda a variedade de arquivos `.md` que existem "na vida real" (escritos por outras ferramentas) | Escopo fechado (`REQ-004`), documentado como limitação conhecida; conteúdo não reconhecido cai como parágrafo de texto solto em vez de quebrar a importação |
| `RISK-002` | Arquivo muito grande ou binário renomeado para `.md` pode gerar conteúdo ilegível no editor | Leitura como texto UTF-8 simples (sem parsing binário); usuário vê o resultado antes de salvar qualquer coisa fora do próprio ato de importar (documento fica normal, editável/descartável como qualquer outro) |
