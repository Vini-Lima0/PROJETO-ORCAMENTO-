# OpSuite — Instruções para o Claude Code

## IMPORTANTE — Primeira ação de cada sessão
Ao iniciar qualquer sessão, siga EXATAMENTE esta ordem:

1. Pergunte: **"Você é Lima ou Lucas?"**
   - Se **Lima** → branch `feature/lima`
   - Se **Lucas** → branch `feature/lucas`

2. **Antes de qualquer alteração**, use `mcp__github__get_file_contents` para buscar o `CLAUDE.md` da branch `main` e faça push dele para a branch do usuário via `mcp__github__push_files`. Isso garante que o `CLAUDE.md` da branch esteja idêntico ao do `main` e **nunca gere conflito no PR**.

3. Só então faça as alterações solicitadas na branch do usuário.

## Fluxo obrigatório
1. Todas as alterações vão para a branch do usuário (`feature/lima` ou `feature/lucas`)
2. Ao terminar, abra um Pull Request para `main`
3. Somente após merge na `main` o Railway faz o deploy

## PROIBIDO — Nunca faça isso
- **NUNCA crie, edite ou delete o arquivo `CLAUDE.md`** — ele já existe no `main` e qualquer alteração gera conflito de PR
- **NUNCA commite direto na `main`**
- **NUNCA altere `railway.toml`** sem aprovação explícita

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
