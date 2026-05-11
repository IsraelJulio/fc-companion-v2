# FC Companion — Backend

## Pre-requisitos
- .NET 8 SDK
- PostgreSQL 16

## Setup

```bash
# 1. Criar o banco
createdb fc_companion

# 2. Restaurar dependencias
cd backend
dotnet restore

# 3. Aplicar migrations
dotnet ef database update \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API

# 4. Iniciar a API
dotnet run --project FcCompanion.API
```

API disponivel em: http://localhost:5000
Swagger em: http://localhost:5000/swagger
Health check: GET http://localhost:5000/api/v1/health

## Criar nova migration
```bash
dotnet ef migrations add NomeDaMigration \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API \
  --output-dir Persistence/Migrations
```
