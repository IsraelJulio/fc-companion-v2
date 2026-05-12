# Comando /code-review

Execute uma revisão do código alterado antes de abrir PR.

## 1. Levante os arquivos alterados
```bash
git diff --name-only
git diff --staged --name-only
```

## 2. Para cada arquivo backend (.cs), verifique:

**Entidades (Domain/Entities/)**
- [ ] Herda `BaseEntity`
- [ ] Sem lógica de negócio — apenas propriedades e navegação
- [ ] Sem referência a Application, Infrastructure ou API

**DTOs (Application/DTOs/)**
- [ ] São `record`, não `class`
- [ ] Nenhuma entidade de domínio exposta diretamente

**Use cases (Application/UseCases/)**
- [ ] Retornam `Result<T>` ou `Result`
- [ ] Sem acesso direto ao DbContext — apenas via interface de repositório
- [ ] Sem lógica de apresentação (formatação, serialização)

**Repositórios (Infrastructure/Persistence/Repositories/)**
- [ ] Implementam a interface correspondente do Application
- [ ] Sem regra de negócio — apenas acesso a dados

**Controllers (API/Controllers/)**
- [ ] Sem lógica de negócio
- [ ] Mapeiam `Result` para `ActionResult` corretamente
- [ ] Rota no formato `api/v1/{recurso}`
- [ ] Sem entidade de domínio no retorno — sempre DTO

**Geral backend**
- [ ] Nenhuma credencial ou connection string hardcoded
- [ ] Nenhuma migration sem revisar o Up() antes de aplicar
- [ ] docs/api-contracts.md e docs/database-schema.md atualizados se houve mudança

## 3. Para cada arquivo frontend (.ts, .html, .scss), verifique:

**Componentes**
- [ ] `standalone: true`
- [ ] `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Dependências via `inject()`, nunca via construtor com parâmetro
- [ ] Sem `subscribe()` no componente — usar `AsyncPipe` ou `toSignal()`
- [ ] Sem `any` no TypeScript
- [ ] Sem `HttpClient` injetado diretamente no componente

**Services**
- [ ] `providedIn: 'root'` ou providedIn no módulo correto
- [ ] Retornam `Observable<T>`, nunca `Promise`
- [ ] URL relativa (o interceptor cuida do base URL)

**Rotas**
- [ ] Lazy loading via `loadChildren`
- [ ] Exportadas como `{FEATURE}_ROUTES`

**Geral frontend**
- [ ] Sem lógica de negócio no template
- [ ] Nenhum dado de save acessado fora do `SaveContextService`

## 4. Resultado da revisão

Apresente no formato:
```
REVISÃO DE CÓDIGO

ARQUIVOS ANALISADOS
[lista]

PROBLEMAS ENCONTRADOS
[✗] arquivo.ts:linha — descrição do problema

ITENS OK
[✓] descrição

DOCS ATUALIZADOS
[✓/✗] api-contracts.md
[✓/✗] database-schema.md
```
