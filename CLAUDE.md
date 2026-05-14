# Regras de Desenvolvimento

## Branches de trabalho

Este projeto tem dois desenvolvedores com branches dedicadas:

| Desenvolvedor | Branch de trabalho |
|---|---|
| Lucas | `feature/lucas` |
| Lima | `feature/lima` |

## Regra principal

**NUNCA commitar direto na `main`.**

Toda alteração vai para a branch do desenvolvedor correspondente. O merge na `main` é feito via Pull Request após revisão dos dois.

## Instrução para o Claude Code

Ao iniciar uma sessão, identifique quem está trabalhando:

- Se for **Lucas** → trabalhe na branch `feature/lucas`
- Se for **Lima** → trabalhe na branch `feature/lima`

Se não souber quem é, pergunte antes de commitar.

## Fluxo de trabalho

1. Claude faz as alterações na branch do desenvolvedor
2. Push para o GitHub
3. Abrir Pull Request para `main`
4. O outro desenvolvedor revisa e aprova
5. Merge na `main` → deploy automático no site
