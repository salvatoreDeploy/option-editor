# Spec 010f — Theme Toggle — Design

## Estado

`done`

## Resumo Técnico

Um bloco `:root[data-theme="light"] { ... }` em `global.css` sobrescreve os mesmos tokens já usados pelo tema escuro (que continua sendo o `:root` base, sem atributo). Um `ThemeContext` no renderer controla o atributo `data-theme` no `<html>`, persiste em `localStorage`, e um script inline no `<head>` do `index.html` aplica o atributo antes do primeiro paint pra evitar FOUC.

## Arquivos Afetados

- `src/renderer/src/styles/global.css` (bloco de tema claro)
- `src/renderer/index.html` (script inline anti-FOUC)
- Novo: `src/renderer/src/contexts/ThemeContext.tsx`
- `src/renderer/src/pages/layout/default.tsx` (provider)
- `src/renderer/src/components/Sidebar/index.tsx` (botão de alternância)
- `src/renderer/src/components/Editor/index.tsx` (`prose`/`prose-invert` condicional)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Paleta clara = valores canônicos do tema `zinc` claro do shadcn/ui (`background #FFFFFF`, `foreground #09090B` — que é literalmente o `background` do tema escuro atual, mesma simetria pros demais tokens) | Não existe referência de design pro claro (`RISK-001`); usar o padrão público que o próprio kit já cita como inspiração é mais defensável que inventar cores |
| `DEC-002` | Preferência em `localStorage` (chave `option-editor:theme`), não `electron-store`/IPC | Só o renderer precisa saber o tema; IPC seria assíncrono e causaria FOUC (a página já pintaria uma vez com o tema errado antes da resposta chegar) |
| `DEC-003` | Script síncrono no `<head>` do `index.html`, antes de qualquer CSS/JS do bundle, lê `localStorage` (mesma chave e mesma lógica de fallback pro `prefers-color-scheme` que o `ThemeContext` usa) e seta `data-theme` no `<html>` | É o único jeito de aplicar o tema antes do primeiro paint neste setup (React só monta depois do bundle carregar) — mesmo princípio usado por qualquer app com tema persistente e sem flash. **Ajustado na execução**: não pode ser inline — a CSP do app (`script-src 'self'`) bloquearia; virou um arquivo estático `src/renderer/public/theme-init.js`, servido por `self` e copiado pro build pelo próprio Vite (convenção de `publicDir`) |
| `DEC-004` | `Editor/index.tsx` recebe o tema atual (via `useTheme()`) e monta a classe `prose-invert` só quando `theme === 'dark'` | `prose-invert` do `@tailwindcss/typography` é uma classe, não uma CSS var — não tem como resolver isso só trocando tokens |
| `DEC-005` | Sem terceiro modo "sistema" — só claro/escuro, com detecção do SO usada uma única vez como valor inicial quando não há preferência salva | Reduz a superfície da spec (`Fora De Escopo`); virar "seguir o sistema" depois é aditivo, não uma mudança que quebra o que for feito agora |

## Contratos

Nenhuma mudança de contrato IPC — tema é 100% renderer.

```ts
// ThemeContext.tsx
type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}
```

## Alternativas Consideradas

- `prefers-color-scheme` via media query CSS, sem toggle manual: descartado — o pedido é explicitamente "tema claro/escuro" (alternável), não só respeitar o SO.
- Guardar a preferência no `electron-store` via IPC: descartado pelo `DEC-002`/`RISK` de FOUC.

## Research Hooks

Nenhum — sizing `Medium`, sem incerteza técnica relevante (o próprio `DEC-001` da spec `007` já previu essa migração ser "só trocar CSS vars").

## Impactos

- Renderer: novo Context, CSS, `index.html`, `Editor`, `Sidebar`.
- Nenhum impacto em main/preload/persistência (IPC).

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: alternar tema e conferir Sidebar/Header/Editor/diálogos; fechar e reabrir o app com tema claro escolhido; testar com o SO em modo claro e escuro sem preferência salva (limpar `localStorage`); observar se há flash ao abrir.
