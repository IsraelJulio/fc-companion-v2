# Comando /db-migrate

Migration: $ARGUMENTS

Execute:
```bash
dotnet ef migrations add $ARGUMENTS \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API

# Mostre o conteudo do Up() para revisao antes de aplicar

dotnet ef database update \
  --project FcCompanion.Infrastructure \
  --startup-project FcCompanion.API
```

Apos aplicar, atualize docs/database-schema.md.
Se houver erro, mostre a mensagem completa e a causa.
