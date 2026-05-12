# FC Companion — Backend

## Contexto
.NET 8 Web API com Clean Architecture, EF Core 8 e PostgreSQL 16.
Leia o CLAUDE.md raiz antes de qualquer implementação.

## Comandos
```bash
# Executar API (a partir desta pasta)
dotnet run --project FcCompanion.API
# → http://localhost:5000/swagger

# Restaurar dependências
dotnet restore

# Build
dotnet build -c Release

# Nova migration
dotnet ef migrations add <NomePascalCase> \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API \
  --output-dir Persistence/Migrations

# Aplicar migrations pendentes
dotnet ef database update \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API

# Reverter última migration
dotnet ef migrations remove \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API
```

## Estrutura da solution
```
FcCompanion.sln
├── FcCompanion.Domain/
│   ├── Common/
│   │   ├── BaseEntity.cs          ← Guid Id, CreatedAt, UpdatedAt
│   │   └── Result.cs              ← Result<T> e Result sem valor
│   ├── Entities/                  ← uma classe por entidade
│   └── Enums/
│       └── SeasonStatus.cs        ← Active, Closed
│
├── FcCompanion.Application/
│   ├── DTOs/
│   │   └── Dtos.cs                ← todos os records de DTO aqui
│   ├── Interfaces/
│   │   ├── IRepositories.cs       ← IRepository<T> + interfaces específicas
│   │   └── IExternalServices.cs   ← IFootballApiService, IFutDbService, ISeedService
│   ├── Mappings/                  ← perfis AutoMapper
│   └── UseCases/                  ← um arquivo por operação
│
├── FcCompanion.Infrastructure/
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── Migrations/
│   │   └── Repositories/
│   │       └── Repository.cs      ← implementação base genérica
│   └── ExternalApis/
│       ├── FootballApiClient.cs
│       └── FutDbClient.cs
│
└── FcCompanion.API/
    ├── Controllers/               ← um controller por entidade raiz
    ├── Middleware/
    ├── Program.cs                 ← DI, CORS, Swagger, middleware
    └── appsettings.Development.json ← connection string e API keys (não versionado)
```

## Fluxo obrigatório para novo endpoint

1. **DTO** em `Application/DTOs/Dtos.cs` — record, nunca class
2. **Use case** em `Application/UseCases/{Entidade}/` — retorna `Result<T>`
3. **Interface** em `Application/Interfaces/IRepositories.cs` — se precisar de query nova
4. **Repositório** em `Infrastructure/Persistence/Repositories/` — implementa a interface
5. **Controller** em `API/Controllers/` — mapeia Result para ActionResult
6. **Registro** em `Program.cs` — `builder.Services.AddScoped<IRepo, Repo>()`
7. **Docs** — atualizar `docs/api-contracts.md`

## Regras de dependência entre camadas
- Domain → sem dependências
- Application → só Domain
- Infrastructure → Domain + Application + pacotes externos
- API → Application + Infrastructure

Violação de dependência = erro de arquitetura. Consulte o agente architect.

## Convenções
| Elemento | Padrão | Exemplo |
|---|---|---|
| Entidades | PascalCase singular | `PlayerSeasonStats` |
| Tabelas | snake_case plural | `player_season_stats` |
| DTOs leitura | sufixo `Dto` | `PlayerDetailDto` |
| DTOs escrita | prefixo `Create/Update` + `Request` | `CreateSaveRequest` |
| Interfaces repositório | `I{Entidade}Repository` | `ISaveRepository` |
| Use cases | `{Verbo}{Entidade}UseCase` | `CreateSaveUseCase` |
| Migrations | PascalCase descritivo | `AddStandingIndexes` |

## Pacotes instalados
| Projeto | Pacote | Versão |
|---|---|---|
| Application | AutoMapper | 12.0.1 |
| Infrastructure | Microsoft.EntityFrameworkCore | 8.0.0 |
| Infrastructure | Npgsql.EntityFrameworkCore.PostgreSQL | 8.0.0 |
| Infrastructure | EF Core Design/Tools | 8.0.0 |
| API | Swashbuckle.AspNetCore | 6.5.0 |

## Banco de dados
- **Nome**: `fc_companion`
- **Usuário**: `postgres`
- **Porta**: 5432
- **Connection string**: em `appsettings.Development.json` (não versionado)
- **9 tabelas**: saves, seasons, clubs, players, player_season_stats,
  player_overall_history, transfers, titles, standings
