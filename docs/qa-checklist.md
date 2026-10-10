# Checklist Manual de QA — OptionEditor

Processo repetível de validação manual, complementar aos testes automatizados (`npm run test`) e ao build/lint (`npm run build`, `npm run lint`). Rodar antes de cada release e sempre que uma spec nova tocar um desses fluxos.

Convenção: `[ ]` pendente, `[x]` passou, `[!]` falhou (anotar o problema ao lado).

## 1. Criação de documento

- [ ] "Novo documento" na Sidebar cria um documento vazio e navega pra ele.
- [ ] O cursor/foco cai no título, pronto pra digitar.
- [ ] O atalho configurado de "Novo documento" (padrão `Ctrl/Cmd+1`) funciona com o app em foco.
- [ ] O documento novo aparece imediatamente na lista da Sidebar.

## 2. Edição e autosave

- [ ] Digitar no título reflete em tempo real no breadcrumb do Header e na Sidebar.
- [ ] Com autosave ligado (padrão): parar de digitar por ~1s salva sozinho; o indicador no Header mostra "Salvando..." e depois "Salvo agora".
- [ ] Com autosave desligado (`/settings`): editar não salva sozinho; o indicador mostra "Não salvo"; `Ctrl/Cmd+S` salva manualmente e o indicador muda pra "Salvo agora".
- [ ] Fechar/trocar de documento com uma edição pendente não perde o conteúdo (o `flush` do autosave salva antes de desmontar).
- [ ] Negrito, itálico, tachado, código inline, bloco de código (com highlight de sintaxe), citação, lista e divisor funcionam no editor.
- [ ] O ToC lateral reflete os headings reais do documento e rola até a seção certa ao clicar.
- [ ] O documento continua carregando corretamente depois de reabrir o app (fechar e abrir de novo).

## 3. Busca

- [ ] Atalho de busca rápida (padrão `Ctrl/Cmd+K`) abre o Command Dialog.
- [ ] Buscar por título encontra o documento certo.
- [ ] Buscar por um trecho do conteúdo (não só título) encontra o documento, com o excerto mostrando onde bateu.
- [ ] Resultado vazio mostra o estado vazio ("Nenhum documento encontrado"), não uma lista em branco.
- [ ] Selecionar um resultado navega pro documento certo.

## 4. Abertura pelo tray

- [ ] Ícone na bandeja do sistema mostra a lista de documentos recentes (por `updatedAt`, não por posição de criação).
- [ ] Clicar num documento no menu do tray abre a janela (se minimizada) e navega pro documento certo.
- [ ] Clicar em "Novo documento" no menu do tray cria e abre um documento novo.
- [ ] A lista do tray atualiza depois de criar/editar/excluir um documento, sem precisar reiniciar o app.

## 5. Exclusão com confirmação

- [ ] Excluir um documento pede confirmação (diálogo com o título do documento).
- [ ] Confirmar move o documento pra lixeira (soft-delete) e mostra o toast "Desfazer".
- [ ] Clicar em "Desfazer" dentro da janela do toast restaura o documento.
- [ ] Deixar o toast expirar sem clicar mantém o documento excluído (fora da lista principal).
- [ ] Um documento excluído não aparece mais na busca nem no tray.

## 6. Exportar / Importar Markdown

- [ ] Exportar como `.html`, `.md`, `.txt` e `.pdf` funciona a partir do documento aberto e de um item da Sidebar.
- [ ] O `.html` exportado abre corretamente num navegador; o `.pdf` abre num leitor de PDF, sem janela extra visível durante a geração.
- [ ] Cancelar o diálogo de salvar não deixa arquivo nem erro.
- [ ] Importar um `.md` com `# Título` na primeira linha usa esse título; sem heading, usa o nome do arquivo.
- [ ] Formatação (negrito, itálico, código, citação, lista, divisor) do `.md` importado aparece certa no editor.
- [ ] Cancelar o diálogo de abrir arquivo não cria documento nenhum.

## 7. Atalhos configuráveis

- [ ] Abrir o diálogo de atalhos (ícone de teclado na Sidebar, ou pela tela de Configurações) mostra os atalhos atuais.
- [ ] Gravar um atalho novo exige pelo menos um modificador (Ctrl/Cmd/Alt).
- [ ] Os dois atalhos não podem ficar iguais entre si (mensagem de erro).
- [ ] Depois de salvar, o atalho novo funciona de verdade (ex. novo `Ctrl+2` pra "Novo documento").

## 8. Tema claro/escuro

- [ ] Alternar o tema (ícone sol/lua na Sidebar) muda a aparência imediatamente, sem precisar recarregar.
- [ ] O tema escolhido persiste depois de fechar e reabrir o app.

## 9. Configurações (`/settings`)

- [ ] Editar "Nome do workspace" e salvar reflete no breadcrumb de um documento aberto.
- [ ] "Pasta de dados" mostra um caminho real; "Abrir pasta de dados" abre essa pasta no explorador de arquivos do SO.
- [ ] Desligar/ligar "Autosave com debounce" afeta o comportamento real do editor (ver seção 2).
- [ ] Desligar/ligar "Verificação ortográfica" liga/desliga o sublinhado nativo do corretor no editor.
- [ ] "Limpar dados locais" exige digitar `LIMPAR` pra habilitar o botão; confirmar apaga todos os documentos (inclusive os da lixeira) e a Sidebar mostra a tela vazia.
- [ ] Navegação interna da sidebar de Configurações (Geral/Editor/Atalhos/Dados locais) rola até a seção certa.

## 10. Perfil e trava local (`/profile`)

- [ ] Sem senha local configurada, o app abre direto nos documentos.
- [ ] Definir uma senha local no Perfil e reiniciar o app mostra a tela de bloqueio antes de qualquer outra coisa.
- [ ] Senha errada na tela de bloqueio mostra erro e não desbloqueia; senha certa desbloqueia.
- [ ] "Bloquear workspace" no Perfil volta pra tela de bloqueio sem fechar o app, sem perder uma edição em andamento.
- [ ] Remover a senha local exige a senha atual; depois disso o app para de bloquear ao abrir.
- [ ] As estatísticas do Perfil (documentos, palavras, último salvamento) batem com os dados reais.
- [ ] Criar, renomear, excluir, restaurar e duplicar um documento aparece no feed de "Atividade recente".

## Registro De Execução

| Data | Quem | Resultado |
|---|---|---|
| | | |
