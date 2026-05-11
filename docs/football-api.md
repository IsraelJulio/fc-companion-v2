# Guia de Integracao — API-Football e FUTDB

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

## FUTDB
Base URL: https://futdb.app/api
Header: X-AUTH-TOKEN: SUA_CHAVE
Limite gratuito: 100 req/hora

### Endpoints usados
GET /players?name={playerName}
GET /players/{eaPlayerId}
Retorna: overall, pace, shooting, passing, dribbling, defending, physical

### Estrategia de cruzamento no seed
1. Para cada jogador da API-Football, buscar no FUTDB pelo nome
2. Se encontrar exatamente 1 resultado: usar o overall
3. Se nao encontrar: overall_base = null, overall = 75 (default)
4. Usuario edita manualmente via F04

## Ordem no SeedSaveUseCase
Para cada liga selecionada:
  1. GET /teams?league={id}&season=2024  -> salvar clubs
  2. GET /players/squads?team={id}       -> salvar players
  3. GET /trophies?team={id}             -> salvar titles (source=real)
Para cada jogador (batches de 50 com delay):
  4. GET futdb /players?name={nome}      -> atualizar overall_base

ESTIMATIVA para 6 ligas: ~850 chamadas total
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
  },
  "FutDb": {
    "Key": "SUA_CHAVE_AQUI",
    "BaseUrl": "https://futdb.app/api"
  }
}
```
