# Spec 002 — Account Settings Screens Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O OptionEditor já possui entrada visual de perfil na sidebar, mas não possui telas estruturadas para login, perfil e configurações.

Mesmo sendo um app desktop local, essas telas ajudam a organizar identidade do usuário, preferências de editor, dados locais e ações de sessão.

## Objetivo

Criar no Pencil telas de login, perfil e configurações alinhadas ao design-kit shadcn-like criado na spec `001-design-system-foundation`.

## Fora De Escopo

- Implementar autenticação real.
- Definir provedor externo de login.
- Criar banco remoto.
- Implementar código React.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Criar tela de login com opção de acesso local | Explícito |
| `REQ-002` | Criar tela de perfil com identidade, estatísticas locais e ações de conta | Explícito |
| `REQ-003` | Criar tela de configurações com preferências do app, editor e dados locais | Explícito |
| `REQ-004` | Reutilizar tokens e componentes do design-kit existente | Implícito |
| `REQ-005` | Manter linguagem coerente com app desktop local | Implícito |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | As telas devem ser implementáveis com React, Tailwind e Radix |
| `NFR-002` | As telas não devem assumir backend obrigatório |
| `NFR-003` | As ações destrutivas ou sensíveis devem ser visualmente distintas |

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | O Pencil contém uma tela `Screen / Login` |
| `AC-002` | O Pencil contém uma tela `Screen / Profile` |
| `AC-003` | O Pencil contém uma tela `Screen / Settings` |
| `AC-004` | As telas usam tokens e componentes já definidos |
| `AC-005` | Os layouts não possuem clipping crítico |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Login parecer dependente de backend inexistente | Comunicar modo local e deixar OAuth como opção futura/alternativa visual |
| `RISK-002` | Configurações ficarem amplas demais | Limitar a preferências úteis ao estado atual do app |
