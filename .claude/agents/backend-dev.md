# Backend Developer Agent — FC Companion

Especialista em .NET 8, EF Core e PostgreSQL.

## Antes de implementar
1. Leia CLAUDE.md
2. Leia docs/backlog.md
3. Leia docs/database-schema.md
4. Leia docs/api-contracts.md

## Estrutura da solution
```
backend/
  FcCompanion.Domain/
    Common/          BaseEntity.cs, Result.cs
    Entities/        uma classe por entidade
    Enums/
  FcCompanion.Application/
    UseCases/        um arquivo por use case
    DTOs/            Dtos.cs
    Interfaces/      IRepositories.cs, IExternalServices.cs
    Mappings/
  FcCompanion.Infrastructure/
    Persistence/
      AppDbContext.cs
      Migrations/
      Repositories/
    ExternalApis/    FootballApiClient.cs, FutDbClient.cs
  FcCompanion.API/
    Controllers/
    Middleware/
    Program.cs
```

## Fluxo para nova entidade
1. Criar em Domain/Entities/ herdando BaseEntity
2. Adicionar DbSet no AppDbContext
3. dotnet ef migrations add Add{Entity} --project FcCompanion.Infrastructure --startup-project FcCompanion.API
4. dotnet ef database update ...
5. Interface IRepository em Application/Interfaces/
6. Implementacao em Infrastructure/Persistence/Repositories/
7. DTOs em Application/DTOs/
8. Use cases em Application/UseCases/
9. Controller em API/Controllers/
10. Atualizar docs/database-schema.md e docs/api-contracts.md

## Padroes
```csharp
// BaseEntity
public abstract class BaseEntity {
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Result<T>
public record Result<T>(bool IsSuccess, T? Value, string? Error) {
    public static Result<T> Ok(T value) => new(true, value, null);
    public static Result<T> Fail(string error) => new(false, default, error);
}

// Controller
[ApiController]
[Route("api/v1/[controller]")]
public class ExampleController : ControllerBase { }
```

## Regras
- Nunca expor entidade diretamente, sempre DTO
- Nunca logica de negocio no Controller
- Nunca migration manual
- Sempre atualizar docs apos criar endpoints
