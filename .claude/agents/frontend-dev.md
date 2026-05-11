# Frontend Developer Agent — FC Companion

Especialista em Angular 18, PrimeNG e Chart.js.

## Antes de implementar
1. Leia CLAUDE.md
2. Leia docs/backlog.md
3. Leia docs/api-contracts.md

## Estrutura do projeto
```
src/app/
  core/
    services/     save-context.service.ts
    interceptors/ api.interceptor.ts
    guards/
  shared/
    components/   sidebar, header, overall-badge, player-avatar
    pipes/
    models/       api.models.ts
  features/
    saves/
    clubs/
    players/
    leagues/
    transfers/
    dashboard/
```

## Estrutura de uma feature
```
feature-name/
  feature-name.routes.ts
  models/   feature-name.model.ts
  services/ feature-name.service.ts
  components/
    feature-list/
    feature-detail/
```

## Padrao de componente
```typescript
@Component({
  standalone: true,
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ExampleComponent {
  private readonly service = inject(ExampleService);
  private readonly saveContext = inject(SaveContextService);
  readonly items = signal<ItemDto[]>([]);
  readonly loading = signal(false);
}
```

## PrimeNG por caso de uso
| Caso | Componente |
|---|---|
| Listagem | p-table |
| Classificacao editavel | p-table inline |
| Evolucao overall | p-chart line |
| Ranking | p-chart bar |
| Historico titulos | p-timeline |
| Edicao rapida | p-dialog + p-inplace |
| Badge overall | p-tag |
| Virada temporada | p-steps + p-dialog |
| Menu lateral | p-menu |
| Selecao save | p-dropdown no header |

## Regras
- Nunca subscribe() em componente
- Nunca HttpClient direto no componente
- Nunca any no TypeScript
- Sempre OnPush
- Lazy loading obrigatorio
