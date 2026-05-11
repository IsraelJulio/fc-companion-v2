# Database Schema — FC Companion

> Atualizado a cada migration. Nao edite manualmente.

## Convencoes
- Tabelas: snake_case plural
- PKs: UUID
- Timestamps: created_at, updated_at em todas as tabelas
- FKs: {tabela_referenciada}_id

## saves
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| name | VARCHAR(100) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## seasons
| Coluna | Tipo | Descricao |
|---|---|---|
| id | UUID PK | |
| save_id | UUID FK saves | |
| name | VARCHAR(20) | Ex: 2025/26 |
| status | VARCHAR(20) | active ou closed |
| started_at | DATE | |
| ended_at | DATE | null se ativa |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## clubs (criado em F03)
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| save_id | UUID FK saves |
| external_id | INTEGER |
| name | VARCHAR(100) |
| short_name | VARCHAR(20) |
| league | VARCHAR(50) |
| country | VARCHAR(50) |
| logo_url | VARCHAR(500) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## players (criado em F03)
| Coluna | Tipo | Descricao |
|---|---|---|
| id | UUID PK | |
| save_id | UUID FK saves | |
| external_id | INTEGER | null se criado manualmente |
| current_club_id | UUID FK clubs | |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| nationality | VARCHAR(50) | |
| date_of_birth | DATE | |
| position | VARCHAR(20) | GK CB LB RB CDM CM CAM LW RW ST |
| preferred_foot | VARCHAR(10) | right left both |
| overall | INTEGER | editavel |
| overall_base | INTEGER | FUTDB imutavel |
| photo_url | VARCHAR(500) | |
| market_value | BIGINT | euros |
| is_custom | BOOLEAN | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## player_season_stats (criado em F04)
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| player_id | UUID FK players |
| season_id | UUID FK seasons |
| club_id | UUID FK clubs |
| goals | INTEGER default 0 |
| assists | INTEGER default 0 |
| appearances | INTEGER default 0 |
| minutes_played | INTEGER default 0 |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## player_overall_history (criado em F03)
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| player_id | UUID FK players |
| season_id | UUID FK seasons |
| overall | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## transfers (criado em F06)
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| player_id | UUID FK players |
| season_id | UUID FK seasons |
| from_club_id | UUID FK clubs |
| to_club_id | UUID FK clubs |
| transfer_date | DATE |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## titles (criado em F03)
| Coluna | Tipo | Descricao |
|---|---|---|
| id | UUID PK | |
| club_id | UUID FK clubs | |
| season_id | UUID FK seasons | null para historicos |
| competition | VARCHAR(100) | |
| year | INTEGER | |
| source | VARCHAR(10) | real ou save |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## standings (criado em F07)
| Coluna | Tipo |
|---|---|
| id | UUID PK |
| club_id | UUID FK clubs |
| season_id | UUID FK seasons |
| league | VARCHAR(50) |
| position | INTEGER |
| points | INTEGER |
| wins | INTEGER |
| draws | INTEGER |
| losses | INTEGER |
| goals_for | INTEGER |
| goals_against | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## Indices recomendados
```sql
CREATE INDEX idx_clubs_save_id ON clubs(save_id);
CREATE INDEX idx_players_save_id ON players(save_id);
CREATE INDEX idx_players_current_club ON players(current_club_id);
CREATE INDEX idx_pss_player ON player_season_stats(player_id);
CREATE INDEX idx_pss_season ON player_season_stats(season_id);
CREATE INDEX idx_standings_season ON standings(season_id);
CREATE INDEX idx_titles_club ON titles(club_id);
```
