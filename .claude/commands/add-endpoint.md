# Comando /add-endpoint

Verbo e recurso: $ARGUMENTS
(ex: /add-endpoint GET /saves/{id}/seasons)

Antes de gerar:
1. Leia CLAUDE.md
2. Leia docs/api-contracts.md — se o endpoint já existe, pare e avise
3. Leia docs/database-schema.md — confirme que as entidades envolvidas existem
4. Leia docs/backlog.md — confirme que pertence à feature ativa

Se não existir, gere nesta ordem:

### Backend

1. DTO em `Application/DTOs/Dtos.cs`
   - Request (se POST/PUT): record com propriedades e tipos corretos
   - Response: record com sufixo `Dto`

2. Use case em `Application/UseCases/{Entidade}/{Verbo}{Entidade}UseCase.cs`
   - Injetar interface de repositório via construtor
   - Retornar `Result<T>` ou `Result`
   - Nunca lançar exceção para fluxos controlados

3. Endpoint no controller existente em `API/Controllers/{Entidade}sController.cs`
   - Se o controller não existir, criá-lo com `[ApiController]` e `[Route("api/v1/[controller]")]`
   - Mapear Result<T> para ActionResult:
     - `IsSuccess = false` → `BadRequest(result.Error)` ou `NotFound()`
     - `IsSuccess = true` → `Ok(result.Value)`

4. Registrar o repositório em `Program.cs` se ainda não estiver registrado

### Frontend (se solicitado)

5. Método no service Angular em `features/{feature}/services/{feature}.service.ts`
   - Usar `HttpClient` via `inject()`
   - Retornar `Observable<T>`, nunca `Promise`
   - URL relativa (o interceptor adiciona o base URL)

Ao final:
- Atualize docs/api-contracts.md com o novo endpoint
- Mostre o exemplo de chamada curl
