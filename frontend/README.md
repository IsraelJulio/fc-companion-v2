# FC Companion — Frontend

## Pre-requisitos
- Node.js 18+
- Angular CLI 18

## Setup

```bash
cd frontend/fc-companion-app

# Instalar dependencias
npm install

# Iniciar em modo desenvolvimento
ng serve
```

Aplicacao disponivel em: http://localhost:4200

## Convencoes
- Todos os componentes sao standalone
- Estado reativo com Signals
- OnPush em todos os componentes
- Lazy loading em todas as features
- Nunca usar subscribe() diretamente em componentes
