# Comando /new-entity

Entidade: $ARGUMENTS

Antes de gerar:
1. Leia CLAUDE.md
2. Leia docs/database-schema.md — se ja existe, pare e avise
3. Leia docs/api-contracts.md
4. Leia docs/backlog.md — confirme que pertence a feature ativa

Se nao existir, gere nesta ordem:
1. Domain/Entities/{Entity}.cs herdando BaseEntity
2. DbSet no AppDbContext
3. Application/Interfaces/I{Entity}Repository.cs
4. Infrastructure/Persistence/Repositories/{Entity}Repository.cs
5. Application/DTOs/ (Request e Response)
6. Application/UseCases/ (GetAll, GetById, Create, Update, Delete)
7. API/Controllers/{Entity}sController.cs
8. Angular service em features/.../services/
9. Interface TypeScript em features/.../models/

Ao final mostre o comando de migration e atualize os docs.
