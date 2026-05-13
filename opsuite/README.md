# OpSuite — Sistema Operacional e de Orçamentos

Sistema completo para gerenciamento de orçamentos, clientes, produtos, agenda e tarefas.

## Como rodar localmente

### Pré-requisitos
- Node.js 16+ instalado (https://nodejs.org)

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npm start
# Abre automaticamente em http://localhost:3000

# 3. Gerar versão de produção
npm run build
# Arquivos prontos na pasta /build
```

## Login (Demo)
- **E-mail:** qualquer e-mail
- **Senha:** qualquer senha com 4+ caracteres
- Admin: `admin@empresa.com` | Operacional: `operacional@empresa.com`

## Funcionalidades
- ✅ Dashboard com KPIs e gráficos
- ✅ Orçamentos com CRUD completo
- ✅ Geração de PDF profissional
- ✅ Cálculo automático com desconto e impostos
- ✅ Cadastro de clientes
- ✅ Catálogo de produtos e serviços
- ✅ Agenda semanal interativa
- ✅ Controle de tarefas com prioridades
- ✅ Persistência em localStorage
- ✅ Totalmente responsivo (mobile + desktop)

## Tech Stack
- React 18 + TypeScript
- recharts (gráficos)
- jsPDF + jspdf-autotable (geração de PDF)
- date-fns (datas)

## Próximos passos para produção
1. Backend: Node.js + Express ou Next.js API Routes
2. Banco: PostgreSQL com Prisma
3. Auth: JWT ou Supabase Auth
4. Deploy: Vercel (frontend) + Railway ou Supabase (backend)
