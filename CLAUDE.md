# OpSuite — Instruções para o Claude Code

## IMPORTANTE — Primeira ação de cada sessão
Ao iniciar qualquer sessão, pergunte: **"Você é Lima ou Lucas?"**
- Se **Lima** → trabalhe na branch `feature/lima`
- Se **Lucas** → trabalhe na branch `feature/lucas`
- NUNCA desenvolva direto na `main`

## Fluxo obrigatório
1. Todas as alterações vão para a branch do usuário (`feature/lima` ou `feature/lucas`)
2. Ao terminar, abra um Pull Request para `main`
3. Somente após merge na `main` o Railway faz o deploy

## Repositório
- Owner: lucasr8eventos-dotcom
- Repo: PROJETO-ORCAMENTO-

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
