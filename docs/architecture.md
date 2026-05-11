# Arquitetura — FC Companion

## Visão geral

```
Angular 18  --HTTP-->  .NET 8 API  -->  PostgreSQL 16
PrimeNG                Clean Arch       (local)
Chart.js               EF Core
                            |
                       APIs Externas (seed apenas)
                       API-Football / FUTDB
```

## Decisões arquiteturais

### ADR-001: Save como unidade de isolamento
Todos os dados de negócio têm save_id como FK raiz.
Permite múltiplos saves independentes sem conflito de dados.

### ADR-002: APIs externas consultadas apenas no seed
Após o seed inicial, o save é independente das APIs.
Dados editados manualmente não são sobrescritos.

### ADR-003: Overall com dois campos
overall_base (imutável, FUTDB) e overall (editável pelo usuário).

### ADR-004: Temporadas como entidade explícita
Season tem status active/closed para controle de virada.

### ADR-005: Angular Signals como estado primário
Sem NgRx. Signals são suficientes para uso pessoal.

## Portas (desenvolvimento local)
- Angular:    http://localhost:4200
- API .NET:   http://localhost:5000
- PostgreSQL: localhost:5432  banco: fc_companion
