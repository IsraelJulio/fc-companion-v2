# FC Companion — Backlog de Features

> Gerenciado pelo PO Agent. Use /po para atualizar.

## Status das features

| # | Feature | Status | Prioridade |
|---|---|---|---|
| F01 | Setup inicial e infraestrutura | done | critica |
| F02 | Gerenciamento de saves | done | critica |
| F03 | Seed via API-Football | done | critica |
| F04 | Modulo de jogadores | done | alta |
| F05 | Modulo de clubes | done | alta |
| F06 | Transferencias | done | alta |
| F07 | Ligas e classificacao | done | media |
| F08 | Titulos e conquistas | todo | media |
| F09 | Virada de temporada | todo | alta |
| F10 | Dashboards e graficos | todo | media |

---

## F01 — Setup inicial e infraestrutura
**Status**: done
**Prioridade**: critica

### Escopo DENTRO
- Solution .NET 8 com 4 projetos (Domain, Application, Infrastructure, API)
- BaseEntity, Result<T>, AppDbContext configurados
- PostgreSQL local conectado e migration inicial aplicada
- Angular 18 com PrimeNG instalado e layout shell (sidebar + header)
- SaveContextService criado
- Interceptor HTTP com base URL configurado
- Health check GET /api/v1/health
- CORS configurado para Angular dev server

### Escopo FORA
- Qualquer entidade alem de Save e Season basicos
- Integracao com APIs externas
- Features de UI alem do shell

### Criterios de aceite
- [x] dotnet build sem erros
- [x] ng build sem erros
- [x] GET /api/v1/health retorna 200
- [x] Angular faz chamada ao backend e recebe resposta
- [x] Sidebar com links de navegacao
- [x] Migration InitialCreate aplicada no PostgreSQL

---

## F02 — Gerenciamento de saves
**Status**: done
**Prioridade**: critica

### Escopo DENTRO
- CRUD de saves (criar, listar, renomear, deletar)
- Selecao de save ativo via SaveContextService
- Criacao automatica da primeira Season ao criar save
- Pagina de selecao de save (tela inicial)
- Indicador visual do save ativo no header

### Escopo FORA
- Importacao de dados via API (F03)
- Configuracao de ligas ao criar save (F03)

### Criterios de aceite
- [x] Criar save com nome e temporada inicial
- [x] Lista de saves na tela inicial
- [x] Selecionar save atualiza contexto global
- [x] Header mostra nome do save e temporada
- [x] Deletar save com confirmacao
- [x] Endpoints: POST /saves, GET /saves, DELETE /saves/{id}

---

## F03 — Seed via API-Football
**Status**: done
**Prioridade**: critica

### Escopo DENTRO
- Tela de selecao de ligas ao criar save
- FootballApiClient consumindo API-Football
- SeedSaveUseCase orquestrando importacao
- Entidades: Club, Player, PlayerOverallHistory, Title (source real)
- Feedback de progresso durante seed
- Titulos historicos importados por clube
- Overall inicial = 75 (padrao), usuario edita via F04

### Escopo FORA
- Atualizacao de dados apos criacao do save
- Criacao manual de jogadores (F04)

### Criterios de aceite
- [ ] Usuario seleciona ligas antes de criar save
- [ ] Seed popula clubs, players, player_overall_history, titles
- [ ] Jogadores importados com overall = 75 (editavel via F04)
- [ ] Titulos historicos com source real
- [ ] Feedback visual de progresso
- [ ] Se API indisponivel, save criado vazio com aviso

---

## F04 — Modulo de jogadores
**Status**: done
**Prioridade**: alta

### Escopo DENTRO
- Listagem com filtros (clube, liga, posicao, nome)
- Perfil do jogador completo
- Edicao de stats da temporada ativa (gols, assistencias, valor de mercado)
- Edicao manual do overall
- Historico de temporadas (read-only)
- Historico de clubes
- Criacao manual de jogador
- Entidade: PlayerSeasonStats

### Escopo FORA
- Transferencias (F06)
- Grafico de evolucao (F10)

### Criterios de aceite
- [ ] Listagem com busca e filtros
- [ ] Perfil completo do jogador
- [ ] Editar gols, assistencias, valor de mercado
- [ ] Editar overall com confirmacao
- [ ] Criar jogador manualmente
- [ ] Historico de temporadas no perfil
- [ ] Endpoints CRUD em /api/v1/saves/{saveId}/players

---

## F05 — Modulo de clubes
**Status**: done
**Prioridade**: alta

### Escopo DENTRO
- Listagem com filtro por liga
- Pagina do clube: nome, escudo, liga
- Elenco atual com overall e posicao
- Historico de titulos (reais + save)
- Top 5 artilheiros historicos
- Historico de temporadas

### Criterios de aceite
- [ ] Listagem filtrada por liga
- [ ] Pagina com elenco, titulos e historico
- [ ] Titulos separados por source (real/save)
- [ ] Top 5 artilheiros do clube

---

## F06 — Transferencias
**Status**: done
**Prioridade**: alta

### Escopo DENTRO
- Interface para transferir jogador entre clubes
- Registro com temporada e data
- Historico filtravel
- Validacao: jogador nao pode estar em dois clubes
- Atualizacao do clube atual do jogador

### Criterios de aceite
- [x] Transferir jogador entre clubes
- [x] Historico filtravel
- [x] Perfil atualizado apos transferencia
- [x] Validacao de clube duplicado

---

## F07 — Ligas e classificacao
**Status**: done
**Prioridade**: media

### Escopo DENTRO
- Tabela de classificacao editavel por liga e temporada
- Ranking de artilheiros por liga/temporada
- Ranking de assistentes
- Historico de campeoes por competicao

### Criterios de aceite
- [x] Tabela editavel por liga e temporada
- [x] Rankings calculados automaticamente
- [x] Historico de campeoes

---

## F08 — Titulos e conquistas
**Status**: todo
**Prioridade**: media

### Escopo DENTRO
- Adicionar titulo para um clube (competicao, temporada)
- Visualizacao por source (real/save)
- Contador total por competicao

### Criterios de aceite
- [ ] Adicionar titulo para qualquer clube
- [ ] Diferenciacao visual real/save
- [ ] Contador por competicao no perfil do clube

---

## F09 — Virada de temporada
**Status**: todo
**Prioridade**: alta

### Escopo DENTRO
- Fluxo guiado com p-steps
- Preview do que sera zerado vs preservado
- Confirmacao antes de executar
- Nova Season criada com status active
- Reset de PlayerSeasonStats
- Snapshot de overall ao encerrar

### Criterios de aceite
- [ ] Fluxo em etapas com preview claro
- [ ] Temporada anterior fica closed
- [ ] Nova temporada criada active
- [ ] Overall snapshot salvo
- [ ] Stats zeradas na nova temporada
- [ ] Header atualizado

---

## F10 — Dashboards e graficos
**Status**: todo
**Prioridade**: media

### Escopo DENTRO
- Grafico de evolucao de overall por jogador (line chart)
- Ranking de artilheiros historicos (bar chart)
- Historico de titulos por clube
- Comparacao de overall entre dois jogadores
- Dashboard da temporada ativa

### Criterios de aceite
- [ ] Grafico de evolucao funcional
- [ ] Ranking em bar chart
- [ ] Dashboard com 3 KPIs da temporada
- [ ] Comparacao entre dois jogadores
- [ ] Tooltips em todos os graficos
