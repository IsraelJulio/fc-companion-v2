# Comando /new-feature

Feature Angular: $ARGUMENTS

Antes de gerar:
1. Leia CLAUDE.md
2. Leia docs/backlog.md — confirme feature ativa
3. Leia docs/api-contracts.md

Crie em features/{feature-name}/:
- {feature-name}.routes.ts
- models/{feature-name}.model.ts
- services/{feature-name}.service.ts
- components/{feature-name}-list/ (ts + html + scss)
- components/{feature-name}-detail/ (ts + html + scss)

Padroes: standalone, OnPush, inject(), AsyncPipe/toSignal.
Ao final mostre como adicionar a rota lazy em app.routes.ts.
