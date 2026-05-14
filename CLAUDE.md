# OpSuite — Instruções para o Claude Code

## Repositório
- Owner: lucasr8eventos-dotcom
- Repo: PROJETO-ORCAMENTO-

## Regras de branch
- NUNCA commitar direto na `main`
- Lima trabalha na branch: `feature/lima`
- Lucas trabalha na branch: `feature/lucas`
- Sempre desenvolver na branch do usuário atual e abrir Pull Request para `main`

## Stack
- React 19 + TypeScript
- Fontes: Outfit (títulos) + Inter (corpo)
- Persistência: localStorage (sem backend ainda)
- Deploy: Railway (branch `main`)

## Estrutura
- `src/types.ts` — todos os tipos TypeScript
- `src/data.ts` — dados iniciais e helpers de localStorage
- `src/components/ui.tsx` — componentes reutilizáveis (Btn, Card, Modal, etc.)
- `src/components/` — telas: Dashboard, Orcamentos, Clientes, Produtos, Agenda, Tarefas, Configuracoes
- `src/pdfGenerator.ts` — geração de PDF com jsPDF

## Padrões
- Inline styles em React (sem CSS modules ou Tailwind)
- Variáveis CSS definidas em `src/index.css` (--bg, --surface, --text, --border, etc.)
- IDs gerados com `uuid`
- Datas com `date-fns` e locale `ptBR`
