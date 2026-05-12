# Guia de Integracao — API-Football

## API-Football (RapidAPI)
Base URL: https://v3.football.api-sports.io
Header: x-rapidapi-key: SUA_CHAVE
Limite gratuito: 100 req/dia

### IDs das ligas
| Liga | ID |
|---|---|
| Premier League | 39 |
| La Liga | 140 |
| Serie A | 135 |
| Bundesliga | 78 |
| Ligue 1 | 61 |
| Champions League | 2 |

### Endpoints usados no seed
GET /teams?league={leagueId}&season=2024
GET /players/squads?team={teamId}
GET /trophies?team={teamId}

### Mapeamento de posicoes
| API | Sistema |
|---|---|
| G | GK |
| D | CB |
| M | CM |
| F | ST |

## Ordem no SeedSaveUseCase
Para cada liga selecionada:
  1. GET /teams?league={id}&season=2024  -> salvar clubs
  2. GET /players/squads?team={id}       -> salvar players (overall = 75 default)
  3. GET /trophies?team={id}             -> salvar titles (source=real)

Overall e editado manualmente pelo usuario via F04.
ESTIMATIVA para 6 ligas: ~750 chamadas total
SOLUCAO: seed por liga separado para plano gratuito

## Configuracao (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=fc_companion;Username=postgres;Password=postgres"
  },
  "ApiFootball": {
    "Key": "SUA_CHAVE_AQUI",
    "BaseUrl": "https://v3.football.api-sports.io"
  }
}
```
