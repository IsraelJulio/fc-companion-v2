# FC Companion — Contexto do Projeto

## O que é
Sistema de tracking para saves do EA FC 26. Permite gerenciar jogadores, clubes,
ligas e temporadas espelhando dados da vida real, com estatísticas editáveis
conforme o usuário joga.

## Stack com versões exatas
| Camada | Tecnologia | Versão |
|---|---|---|
| Backend runtime | .NET | 8.0 |
| ORM | Entity Framework Core | 8.0.0 |
| Driver PostgreSQL | Npgsql.EFCore.PostgreSQL | 8.0.0 |
| Mapeamento | AutoMapper | 12.0.1 |
| Documentação API | Swashbuckle.AspNetCore | 6.5.0 |
| Frontend | Angular | 18.0.0 |
| Componentes UI | PrimeNG | 17.0.0 |
| Ícones | PrimeIcons | 7.0.0 |
| Gráficos | Chart.js | 4.4.0 |
| TypeScript | — | ~5.4.0 |
| Banco de dados | PostgreSQL | 16 (local) |
| APIs externas | API-Football (RapidAPI), FUTDB | — |

## Estrutura do repositório
```
fc-companion-v2/
├── CLAUDE.md                            ← você está aqui
├── START.md                             ← script de inicialização Claude Code
├── docs/
│   ├── backlog.md                       ← features F01–F10 e status
│   ├── architecture.md                  ← ADRs e decisões técnicas
│   ├── database-schema.md               ← esquema completo das 9 tabelas
│   ├── api-contracts.md                 ← todos os endpoints por feature
│   └── football-api.md                  ← guia de integração API-Football e FUTDB
├── backend/
│   ├── FcCompanion.sln
│   ├── FcCompanion.Domain/              ← entidades, enums, BaseEntity, Result<T>
│   ├── FcCompanion.Application/         ← DTOs, interfaces, use cases, AutoMapper
│   ├── FcCompanion.Infrastructure/      ← AppDbContext, repositories, ExternalApis
│   └── FcCompanion.API/                 ← controllers, Program.cs, middleware
└── frontend/
    └── fc-companion-app/
        └── src/app/
            ├── core/                    ← SaveContextService, api.interceptor
            ├── shared/                  ← models, sidebar, header, badges
            └── features/                ← saves, players, clubs, leagues, transfers, dashboard
```

## Comandos de execução
```bash
# --- BACKEND ---
cd backend
dotnet restore
dotnet run --project FcCompanion.API
# API:     http://localhost:5000/api/v1/health
# Swagger: http://localhost:5000/swagger

# --- FRONTEND ---
cd frontend/fc-companion-app
npm install
ng serve
# App: http://localhost:4200

# --- MIGRATIONS ---
# Criar migration (sempre a partir de backend/)
dotnet ef migrations add <NomePascalCase> \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API \
  --output-dir Persistence/Migrations

# Aplicar ao banco
dotnet ef database update \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API

# Build de produção
cd backend && dotnet build -c Release
cd frontend/fc-companion-app && ng build --configuration production
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

## Padrões de código — Backend
```csharp
// Toda entidade herda BaseEntity
public abstract class BaseEntity {
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Use cases retornam Result<T> (nunca lançam exceção controlada)
public record Result<T>(bool IsSuccess, T? Value, string? Error) {
    public static Result<T> Ok(T value) => new(true, value, null);
    public static Result<T> Fail(string error) => new(false, default, error);
}

// Controller padrão
[ApiController]
[Route("api/v1/[controller]")]
public class ExampleController : ControllerBase { }
```

**Convenções de nomenclatura — Backend:**
- Entidades: PascalCase singular (`Player`, `PlayerSeasonStats`)
- Tabelas: snake_case plural (`players`, `player_season_stats`)
- DTOs: sufixo `Dto` para leitura, `Request` para escrita (`PlayerDetailDto`, `CreatePlayerRequest`)
- Interfaces de repositório: `I{Entidade}Repository` em `Application/Interfaces/`
- Implementações: `{Entidade}Repository` em `Infrastructure/Persistence/Repositories/`
- Use cases: um arquivo por operação em `Application/UseCases/`
- Não há MediatR — use cases são classes diretas, não handlers

## Padrões de código — Frontend
```typescript
// Componente padrão
@Component({
  standalone: true,
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ExampleComponent {
  private readonly service = inject(ExampleService);
  private readonly saveContext = inject(SaveContextService);
  readonly items = signal<ItemDto[]>([]);
  readonly loading = signal(false);
}

// Service padrão
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly http = inject(HttpClient);
  getAll(): Observable<ItemDto[]> {
    return this.http.get<ItemDto[]>('/example');
  }
}
```

**Convenções de nomenclatura — Frontend:**
- Features: kebab-case (`player-season-stats`)
- Componentes: `{feature}-{papel}.component.ts` (`player-list.component.ts`)
- Services: `{feature}.service.ts`
- Models: `{feature}.model.ts`
- Rotas: exportadas como `{FEATURE}_ROUTES`
- Nunca `any` no TypeScript
- Nunca `subscribe()` em componentes — usar `AsyncPipe` ou `toSignal()`

## Antes de gerar qualquer código
1. Ler `docs/backlog.md` para ver a feature ativa
2. Ler `docs/database-schema.md` para verificar entidades existentes
3. Ler `docs/api-contracts.md` para verificar endpoints existentes

## Agentes disponíveis
- `.claude/agents/po.md` — Product Owner
- `.claude/agents/backend-dev.md` — Backend Developer
- `.claude/agents/frontend-dev.md` — Frontend Developer
- `.claude/agents/architect.md` — Arquiteto (decisões estruturais)

## Slash commands
| Comando | Uso |
|---|---|
| `/po [pergunta]` | Consultar o PO sobre escopo e backlog |
| `/new-entity [Nome]` | Gera entidade completa (Domain → API + Angular service) |
| `/new-feature [nome]` | Scaffolding Angular de feature completa |
| `/db-migrate [Nome]` | Cria e aplica migration EF Core |
| `/feature-status` | Status atual do backlog |
| `/add-endpoint [verbo] [recurso]` | Cria controller + handler + DTO |
| `/code-review` | Checklist de revisão antes de abrir PR |
| `/pr-describe` | Gera descrição de PR com base no diff |
