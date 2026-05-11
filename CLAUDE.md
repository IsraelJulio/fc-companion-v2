# FC Companion — Contexto do Projeto

## O que é
Sistema de tracking para saves do EA FC 26. Permite gerenciar jogadores, clubes,
ligas e temporadas espelhando dados da vida real, com estatísticas editáveis
conforme o usuário joga.

## Stack
- **Frontend**: Angular 18, PrimeNG, Chart.js (via p-chart)
- **Backend**: .NET 8 Web API, Entity Framework Core, Clean Architecture
- **Banco**: PostgreSQL 16 (local)
- **APIs externas**: API-Football (RapidAPI), FUTDB (overalls)

## Estrutura do repositório
```
fc-companion/
├── CLAUDE.md
├── START.md                         ← script de inicialização para Claude Code
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-contracts.md
│   ├── football-api.md
│   └── backlog.md
├── backend/                         ← .NET 8 Web API
└── frontend/                        ← Angular 18
```

## Conceitos centrais
| Conceito | Descrição |
|---|---|
| **Save** | Unidade raiz. Todos os dados pertencem a um save específico |
| **Season** | Temporada dentro de um save (ex: 2025/26). Status: active ou closed |
| **PlayerSeasonStats** | Estatísticas de um jogador por temporada + clube dentro de um save |
| **Transfer** | Movimentação de jogador entre clubes dentro do mesmo save |
| **Title** | Título com source real (histórico) ou save (conquistado no jogo) |

## Regras de negócio críticas
- Um jogador pertence a exatamente 1 clube por vez dentro de um save
- Ao criar um save, dados reais são importados via API e clonados no banco
- Virada de temporada: zera stats da temporada atual, preserva histórico
- Overall tem valor base importado do FUTDB + pode ser editado manualmente
- Títulos source real são importados uma vez e nunca alterados

## Ligas cobertas
Premier League · La Liga · Serie A · Bundesliga · Ligue 1 · Champions League

## Padrões obrigatórios — Backend
- Clean Architecture: Domain → Application → Infrastructure → API
- Repository pattern com interfaces no Application
- DTOs separados de entidades de domínio
- Migrations via EF Core CLI
- Endpoints RESTful: /api/v1/{resource}
- Use cases retornam Result<T>
- Tabelas em snake_case plural

## Padrões obrigatórios — Frontend
- Standalone components
- Signals para estado local
- inject() para dependências
- AsyncPipe no template, nunca subscribe()
- Lazy loading em todas as rotas de feature
- OnPush ChangeDetectionStrategy
- SaveContextService mantém o save ativo globalmente

## Antes de gerar qualquer código
1. Ler docs/backlog.md para ver a feature ativa
2. Ler docs/database-schema.md para verificar entidades existentes
3. Ler docs/api-contracts.md para verificar endpoints existentes

## Agentes disponíveis
- .claude/agents/po.md — Product Owner
- .claude/agents/backend-dev.md — Backend Developer
- .claude/agents/frontend-dev.md — Frontend Developer

## Slash commands
| Comando | Uso |
|---|---|
| /po [pergunta] | Consultar o PO |
| /new-entity [Nome] | Gera entidade completa |
| /new-feature [nome] | Scaffolding Angular |
| /db-migrate [Nome] | Cria e aplica migration |
| /feature-status | Status do backlog |
