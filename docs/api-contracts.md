# API Contracts — FC Companion

> Base URL: http://localhost:5000/api/v1
> Atualizado a cada novo endpoint criado.

## Convencoes
- Respostas em JSON
- Datas em ISO 8601
- IDs em UUID string
- Erros: { "error": "mensagem" }
- Paginacao: ?page=1&pageSize=20

## Health (F01)
GET /health
Response 200: { "status": "healthy", "timestamp": "..." }

## Saves (F02)
GET    /saves
POST   /saves          body: { name, firstSeasonName }
DELETE /saves/{id}

## Seed (F03)
POST /saves/{saveId}/seed    body: { leagueIds: [39,140,135,78,61,2] }
Response 200: { clubsImported, playersImported, titlesImported }
Response 400: { error } — se API indisponivel, retorna save vazio com aviso

## Players (F04)
GET  /saves/{saveId}/players          ?clubId=&league=&position=&search=&page=&pageSize=
GET  /saves/{saveId}/players/{id}
POST /saves/{saveId}/players
PUT  /saves/{saveId}/players/{id}
GET  /saves/{saveId}/players/{id}/season-stats
PUT  /saves/{saveId}/players/{id}/season-stats/{seasonId}

## Clubs (F05)
GET /saves/{saveId}/clubs          ?league=
GET /saves/{saveId}/clubs/{id}

## Transfers (F06)
GET  /saves/{saveId}/transfers     ?playerId=&clubId=&seasonId=
POST /saves/{saveId}/transfers     body: { playerId, toClubId, transferDate }

## Standings (F07)
GET /saves/{saveId}/standings      ?league=&seasonId=
PUT /saves/{saveId}/standings/{id}
GET /saves/{saveId}/leagues/rankings/top-scorers   ?league=&seasonId=&limit=10
GET /saves/{saveId}/leagues/rankings/top-assists   ?league=&seasonId=&limit=10
GET /saves/{saveId}/leagues/champions-history      ?competition=
GET /saves/{saveId}/seasons

## Titles (F08)
GET    /saves/{saveId}/clubs/{clubId}/titles
POST   /saves/{saveId}/clubs/{clubId}/titles   body: { competition, year, seasonId }
DELETE /saves/{saveId}/clubs/{clubId}/titles/{id}

## Seasons (F09)
POST /saves/{saveId}/seasons/close   body: { nextSeasonName }

## Dashboard (F10)
GET /saves/{saveId}/dashboard/summary
GET /saves/{saveId}/players/{id}/overall-history
GET /saves/{saveId}/dashboard/top-scorers   ?seasonId=&limit=10
GET /saves/{saveId}/dashboard/title-history
