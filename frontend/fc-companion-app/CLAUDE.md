# FC Companion — Frontend

## Contexto
Angular 18 standalone com Signals, PrimeNG 17 e Chart.js 4.
Leia o CLAUDE.md raiz antes de qualquer implementação.

## Comandos
```bash
# Executar em desenvolvimento (a partir desta pasta)
ng serve
# → http://localhost:4200

# Instalar dependências
npm install

# Build de produção
ng build --configuration production

# Gerar componente
ng generate component features/{feature}/components/{nome} --standalone

# Gerar service
ng generate service features/{feature}/services/{nome}
```

## Estrutura
```
src/app/
├── app.config.ts          ← providers globais (router, httpClient, animations)
├── app.routes.ts          ← rotas raiz com lazy loading
├── app.component.ts       ← layout: sidebar + header + router-outlet
│
├── core/
│   ├── services/
│   │   └── save-context.service.ts   ← save ativo global (signal)
│   ├── interceptors/
│   │   └── api.interceptor.ts        ← adiciona base URL http://localhost:5000/api/v1
│   └── guards/
│
├── shared/
│   ├── models/
│   │   └── api.models.ts             ← interfaces TypeScript de todos os DTOs
│   ├── components/
│   │   ├── header/                   ← exibe save ativo e temporada
│   │   ├── sidebar/                  ← menu de navegação (PrimeNG p-menu)
│   │   ├── overall-badge/            ← badge colorida por faixa de overall
│   │   └── player-avatar/            ← foto do jogador com fallback
│   ├── pipes/
│   └── directives/
│
└── features/
    ├── saves/          ← F02
    ├── players/        ← F04
    ├── clubs/          ← F05
    ├── transfers/      ← F06
    ├── leagues/        ← F07
    └── dashboard/      ← F10
```

## Estrutura de uma feature
```
{feature}/
├── {feature}.routes.ts              ← exporta {FEATURE}_ROUTES
├── models/
│   └── {feature}.model.ts           ← interfaces específicas da feature
├── services/
│   └── {feature}.service.ts         ← chamadas HTTP
└── components/
    ├── {feature}-list/              ← listagem principal
    │   ├── {feature}-list.component.ts
    │   ├── {feature}-list.component.html
    │   └── {feature}-list.component.scss
    └── {feature}-detail/            ← detalhe / formulário
        ├── {feature}-detail.component.ts
        ├── {feature}-detail.component.html
        └── {feature}-detail.component.scss
```

## Template de componente
```typescript
@Component({
  standalone: true,
  selector: 'app-{nome}',
  templateUrl: './{nome}.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, /* PrimeNG modules */]
})
export class {Nome}Component {
  private readonly {feature}Service = inject({Feature}Service);
  private readonly saveContext = inject(SaveContextService);

  readonly items = signal<{Dto}[]>([]);
  readonly loading = signal(false);
}
```

## Template de service
```typescript
@Injectable({ providedIn: 'root' })
export class {Feature}Service {
  private readonly http = inject(HttpClient);

  getAll(saveId: string): Observable<{Dto}[]> {
    return this.http.get<{Dto}[]>(`/{recurso}?saveId=${saveId}`);
  }

  getById(id: string): Observable<{DetailDto}> {
    return this.http.get<{DetailDto}>(`/{recurso}/${id}`);
  }

  create(request: Create{Dto}Request): Observable<{Dto}> {
    return this.http.post<{Dto}>('/{recurso}', request);
  }
}
```

## PrimeNG — componentes por caso de uso
| Caso de uso | Componente PrimeNG |
|---|---|
| Listagem com filtros | `p-table` |
| Classificação editável inline | `p-table` com `p-cellEditor` |
| Evolução de overall | `p-chart` (line) |
| Ranking de jogadores | `p-chart` (bar) |
| Histórico de títulos | `p-timeline` |
| Edição rápida | `p-dialog` + `p-inplace` |
| Badge de overall | `p-tag` |
| Virada de temporada | `p-steps` + `p-dialog` |
| Menu lateral | `p-menu` |
| Seleção de save | `p-dropdown` no header |

## Regras obrigatórias
- Nunca `subscribe()` em componentes — usar `AsyncPipe` ou `toSignal()`
- Nunca `HttpClient` diretamente no componente — sempre via service
- Nunca `any` no TypeScript
- Nunca `new ComponentName()` — sempre `inject()`
- Nunca acessar `saveId` diretamente — sempre via `SaveContextService`
- Toda rota de feature usa lazy loading com `loadChildren`
- Todo componente usa `OnPush` e `standalone: true`

## Interceptor de API
O `api.interceptor.ts` adiciona automaticamente o base URL `http://localhost:5000/api/v1`
a qualquer URL relativa. Use sempre URLs relativas nos services:
```typescript
// correto
this.http.get<SaveDto[]>('/saves')

// errado
this.http.get<SaveDto[]>('http://localhost:5000/api/v1/saves')
```

## SaveContextService
Mantém o save ativo globalmente. Acesse em qualquer componente via `inject()`:
```typescript
private readonly saveContext = inject(SaveContextService);

// Leitura
this.saveContext.activeSaveId()    // string | null
this.saveContext.activeSeasonId()  // string | null
this.saveContext.hasSave()         // boolean

// Escrita
this.saveContext.setActiveSave(save);
```
