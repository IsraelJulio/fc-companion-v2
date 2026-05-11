# FC Companion — Script de Inicialização para Claude Code
#
# USO: abra o terminal na pasta fc-companion/ e rode:
#   claude "$(cat START.md)"

Você é o assistente de desenvolvimento do projeto FC Companion.

Leia os seguintes arquivos na ordem antes de fazer qualquer coisa:
1. CLAUDE.md
2. docs/architecture.md
3. docs/backlog.md
4. docs/database-schema.md
5. docs/api-contracts.md
6. docs/football-api.md
7. .claude/agents/po.md
8. .claude/agents/backend-dev.md
9. .claude/agents/frontend-dev.md

Após ler tudo, execute as tarefas abaixo em ordem.

## Tarefa 1 — Confirme o entendimento

Responda com um resumo de 5 linhas:
- O que o sistema faz
- Stack utilizada
- Quantas features existem e qual é a primeira
- Agentes disponíveis e seus papéis

## Tarefa 2 — Valide a estrutura existente

Liste quais destes arquivos já existem e quais estão faltando:

Backend:
- backend/FcCompanion.sln
- backend/FcCompanion.Domain/Common/BaseEntity.cs
- backend/FcCompanion.Domain/Common/Result.cs
- backend/FcCompanion.Domain/Entities/Save.cs
- backend/FcCompanion.Domain/Entities/Season.cs
- backend/FcCompanion.Domain/Entities/Club.cs
- backend/FcCompanion.Domain/Entities/Player.cs
- backend/FcCompanion.Domain/Entities/PlayerSeasonStats.cs
- backend/FcCompanion.Domain/Entities/OtherEntities.cs
- backend/FcCompanion.Application/DTOs/Dtos.cs
- backend/FcCompanion.Application/Interfaces/IRepositories.cs
- backend/FcCompanion.Infrastructure/Persistence/AppDbContext.cs
- backend/FcCompanion.API/Program.cs

Frontend:
- frontend/fc-companion-app/package.json
- frontend/fc-companion-app/src/main.ts
- frontend/fc-companion-app/src/app/app.config.ts
- frontend/fc-companion-app/src/app/app.routes.ts
- frontend/fc-companion-app/src/app/app.component.ts
- frontend/fc-companion-app/src/app/core/interceptors/api.interceptor.ts
- frontend/fc-companion-app/src/app/core/services/save-context.service.ts
- frontend/fc-companion-app/src/app/shared/models/api.models.ts

## Tarefa 3 — Implemente a Feature F01 completa

Conforme definido em docs/backlog.md, implemente a F01 nesta ordem:

### 3a. Corrigir o FcCompanion.sln

O arquivo .sln precisa referenciar corretamente os 4 projetos.
Verifique e corrija se necessário para que `dotnet build` funcione.

### 3b. Corrigir referências entre projetos .csproj

- FcCompanion.Infrastructure.csproj deve referenciar Domain e Application
- FcCompanion.API.csproj deve referenciar Application e Infrastructure
- FcCompanion.Application.csproj deve referenciar Domain

### 3c. Completar o Program.cs

Garanta que o Program.cs tem:
- DbContext com PostgreSQL (Npgsql)
- CORS para http://localhost:4200
- Swagger
- GET /api/v1/health retornando 200

### 3d. Criar backend/README.md com:
- Pré-requisitos (dotnet 8 SDK, PostgreSQL 16)
- createdb fc_companion
- dotnet restore
- dotnet ef database update --project FcCompanion.Infrastructure --startup-project FcCompanion.API
- dotnet run --project FcCompanion.API

### 3e. Criar angular.json

Crie o angular.json padrão do Angular 18 para o projeto fc-companion-app.

### 3f. Criar tsconfig.json e tsconfig.app.json

Na pasta frontend/fc-companion-app/ com strict: true.

### 3g. Criar src/index.html

HTML base do Angular.

### 3h. Criar src/styles.scss

Importando os temas do PrimeNG:
- primeng/resources/themes/lara-dark-blue/theme.css
- primeng/resources/primeng.css
- primeicons/primeicons.css

### 3i. Criar o Sidebar component

Em frontend/fc-companion-app/src/app/shared/components/sidebar/
Com links para: Saves, Jogadores, Clubes, Ligas, Transferências, Dashboard.
Standalone, OnPush, usando PrimeNG p-menu ou p-panelMenu.

### 3j. Criar o Header component

Em frontend/fc-companion-app/src/app/shared/components/header/
Mostra o nome do save ativo e a temporada atual lidos do SaveContextService.
Standalone, OnPush.

### 3k. Criar rotas faltantes

Criar os arquivos de rota para as features que ainda não têm:
- features/clubs/clubs.routes.ts
- features/leagues/leagues.routes.ts
- features/transfers/transfers.routes.ts
- features/dashboard/dashboard.routes.ts

### 3l. Criar frontend/README.md com:
- Pré-requisitos (Node 18+)
- npm install
- ng serve

### 3m. Atualizar o backlog

Altere o status da F01 em docs/backlog.md de `todo` para `in-progress`.

## Tarefa 4 — Resumo final

Ao terminar, liste:
1. Todos os arquivos criados ou modificados
2. Comandos que o desenvolvedor deve rodar no terminal para subir o projeto
3. Qual feature iniciar em seguida (resposta como PO)

---

Contexto: este projeto é desenvolvido por um único desenvolvedor que joga
EA FC 26 e quer manter um tracking paralelo com dados reais de futebol.
Os agentes PO, backend-dev e frontend-dev estão em .claude/agents/ e devem
ser seguidos à risca em todas as sessões futuras.
