// Aplica o tema salvo (ou o do SO, na primeira vez) antes do primeiro paint,
// pra não piscar o tema errado. Precisa rodar como script síncrono no <head>
// (não inline — a Content-Security-Policy só permite script-src 'self'),
// com a mesma lógica de fallback do ThemeContext (src/renderer/src/contexts/ThemeContext.tsx).
;(function () {
  const stored = localStorage.getItem('option-editor:theme')
  const theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

  document.documentElement.dataset.theme = theme
})()
