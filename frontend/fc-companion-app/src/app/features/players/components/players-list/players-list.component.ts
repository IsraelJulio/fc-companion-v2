import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, catchError, map, merge, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PlayersService } from '../../services/players.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { PlayerListItemDto, ClubSummaryDto, PagedResult } from '../../../../shared/models/api.models';
import { PlayerFilters, UpdateStatsForm, CreatePlayerForm, POSITIONS, LEAGUES } from '../../models/players.model';

const EMPTY_PAGE: PagedResult<PlayerListItemDto> = { items: [], total: 0, page: 1, pageSize: 20 };
const DEFAULT_CREATE: CreatePlayerForm = {
  firstName: '', lastName: '', position: 'ST', currentClubId: '',
  overall: 75, nationality: null, preferredFoot: 'right'
};

interface ListState {
  loading: boolean;
  data: PagedResult<PlayerListItemDto>;
}

@Component({
  standalone: true,
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule,
    DialogModule, InputNumberModule, TagModule, ToastModule,
    AvatarModule, ProgressSpinnerModule
  ]
})
export class PlayersListComponent {
  private readonly playersService = inject(PlayersService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly pageSize = 20;
  readonly positionOptions = [{ label: 'Todas', value: '' }, ...POSITIONS.map(p => ({ label: p, value: p }))];
  readonly leagueOptions = [{ label: 'Todas', value: '' }, ...LEAGUES.map(l => ({ label: l.label, value: l.value }))];
  readonly footOptions = [
    { label: 'Direito', value: 'right' },
    { label: 'Esquerdo', value: 'left' },
    { label: 'Ambos', value: 'both' }
  ];

  readonly filters = signal<PlayerFilters>({ search: '', position: '', clubId: null, league: '' });
  readonly page = signal(1);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly listState$ = toObservable(this.saveContext.activeSaveId).pipe(
    switchMap(saveId => {
      if (!saveId) return of<ListState>({ loading: false, data: EMPTY_PAGE });
      return this.refresh$.pipe(
        switchMap(() => merge(
          of<ListState>({ loading: true, data: EMPTY_PAGE }),
          this.playersService.getAll(saveId, this.filters(), this.page(), this.pageSize).pipe(
            map(data => <ListState>{ loading: false, data }),
            catchError(() => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar jogadores' });
              return of<ListState>({ loading: false, data: EMPTY_PAGE });
            })
          )
        ))
      );
    })
  );

  private readonly listState = toSignal(this.listState$, { initialValue: <ListState>{ loading: false, data: EMPTY_PAGE } });

  readonly loading = computed(() => this.listState().loading);
  readonly players = computed(() => this.listState().data.items);
  readonly total = computed(() => this.listState().data.total);

  // Clubs for create form
  private readonly clubs$ = toObservable(this.saveContext.activeSaveId).pipe(
    switchMap(saveId => {
      if (!saveId) return of<ClubSummaryDto[]>([]);
      return this.playersService.getClubs(saveId).pipe(
        catchError(() => of<ClubSummaryDto[]>([]))
      );
    })
  );

  readonly clubOptions = toSignal(
    this.clubs$.pipe(map(clubs => clubs.map(c => ({ label: c.name, value: c.id })))),
    { initialValue: [] as { label: string; value: string }[] }
  );

  // --- Stats dialog state ---
  readonly showStatsDialog = signal(false);
  readonly selectedPlayerName = signal('');
  readonly savingStats = signal(false);
  readonly editingStats = signal<UpdateStatsForm>({ goals: 0, assists: 0, appearances: 0, minutesPlayed: 0 });
  readonly loadingDetail = signal(false);
  readonly editingSeasonId = signal<string | null>(null);

  private editingPlayerId: string | null = null;

  private readonly detailTrigger$ = new Subject<string>();

  private readonly playerDetail = toSignal(
    this.detailTrigger$.pipe(
      switchMap(id => {
        const saveId = this.saveContext.activeSaveId();
        if (!saveId) return of(null);
        return this.playersService.getById(saveId, id).pipe(
          catchError(() => of(null))
        );
      })
    )
  );

  private readonly syncDetailEffect = effect(() => {
    const detail = this.playerDetail();
    // undefined = signal never emitted yet (component just rendered); skip
    if (detail === undefined) return;

    const seasonId = this.saveContext.activeSeasonId();
    // null detail = HTTP error; still stop the loading spinner
    if (!detail || !seasonId) {
      this.loadingDetail.set(false);
      return;
    }
    const stats = detail.seasonHistory.find(s => s.seasonId === seasonId);
    if (stats) {
      this.editingSeasonId.set(stats.seasonId);
      this.editingStats.set({
        goals: stats.goals,
        assists: stats.assists,
        appearances: stats.appearances,
        minutesPlayed: stats.minutesPlayed
      });
    }
    this.loadingDetail.set(false);
  }, { allowSignalWrites: true });

  private readonly saveTrigger$ = new Subject<UpdateStatsForm>();

  private readonly saveResult = toSignal(
    this.saveTrigger$.pipe(
      switchMap(stats => {
        const saveId = this.saveContext.activeSaveId();
        const seasonId = this.editingSeasonId();
        if (!saveId || !this.editingPlayerId || !seasonId) return EMPTY;
        return this.playersService.updateSeasonStats(saveId, this.editingPlayerId, seasonId, stats).pipe(
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar stats' });
            this.savingStats.set(false);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterSaveEffect = effect(() => {
    const result = this.saveResult();
    if (!result) return;
    this.savingStats.set(false);
    this.showStatsDialog.set(false);
    this.messageService.add({ severity: 'success', summary: 'Stats salvas', detail: `${this.selectedPlayerName()} atualizado` });
    this.refresh$.next();
  }, { allowSignalWrites: true });

  // --- Create dialog state ---
  readonly showCreateDialog = signal(false);
  readonly createForm = signal<CreatePlayerForm>({ ...DEFAULT_CREATE });
  readonly savingCreate = signal(false);

  private readonly createTrigger$ = new Subject<CreatePlayerForm>();

  private readonly createResult = toSignal(
    this.createTrigger$.pipe(
      switchMap(req => {
        const saveId = this.saveContext.activeSaveId();
        if (!saveId) return EMPTY;
        return this.playersService.create(saveId, req).pipe(
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar jogador' });
            this.savingCreate.set(false);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterCreateEffect = effect(() => {
    const result = this.createResult();
    if (!result) return;
    this.savingCreate.set(false);
    this.showCreateDialog.set(false);
    this.messageService.add({ severity: 'success', summary: 'Criado', detail: `${result.fullName} adicionado` });
    this.refresh$.next();
  }, { allowSignalWrites: true });

  // --- Public methods ---

  onSearch(): void {
    this.page.set(1);
    this.refresh$.next();
  }

  onFilterChange(): void {
    this.page.set(1);
    this.refresh$.next();
  }

  onPageChange(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.pageSize;
    this.page.set(Math.floor(first / rows) + 1);
    this.refresh$.next();
  }

  openEditDialog(player: PlayerListItemDto): void {
    const seasonId = this.saveContext.activeSeasonId();
    if (!seasonId) {
      this.messageService.add({ severity: 'warn', summary: 'Sem temporada', detail: 'Selecione um save com temporada ativa' });
      return;
    }
    this.editingPlayerId = player.id;
    this.editingSeasonId.set(null);
    this.selectedPlayerName.set(player.fullName);
    this.loadingDetail.set(true);
    this.showStatsDialog.set(true);
    this.detailTrigger$.next(player.id);
  }

  submitStats(): void {
    if (!this.editingSeasonId()) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Jogador sem stats na temporada ativa' });
      return;
    }
    this.savingStats.set(true);
    this.saveTrigger$.next(this.editingStats());
  }

  closeDialog(): void {
    this.showStatsDialog.set(false);
    this.editingPlayerId = null;
    this.editingSeasonId.set(null);
  }

  updateSearch(value: string): void {
    this.filters.update(f => ({ ...f, search: value }));
    this.onSearch();
  }

  updatePosition(value: string): void {
    this.filters.update(f => ({ ...f, position: value }));
    this.onFilterChange();
  }

  updateLeague(value: string): void {
    this.filters.update(f => ({ ...f, league: value }));
    this.onFilterChange();
  }

  updateStat(key: keyof UpdateStatsForm, value: number): void {
    this.editingStats.update(s => ({ ...s, [key]: value ?? 0 }));
  }

  openCreateDialog(): void {
    this.createForm.set({ ...DEFAULT_CREATE });
    this.showCreateDialog.set(true);
  }

  closeCreateDialog(): void {
    this.showCreateDialog.set(false);
  }

  updateCreate<K extends keyof CreatePlayerForm>(key: K, value: CreatePlayerForm[K]): void {
    this.createForm.update(f => ({ ...f, [key]: value }));
  }

  submitCreate(): void {
    const form = this.createForm();
    if (!form.firstName || !form.lastName || !form.currentClubId) {
      this.messageService.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Preencha nome e clube' });
      return;
    }
    this.savingCreate.set(true);
    this.createTrigger$.next(form);
  }

  viewPlayer(player: PlayerListItemDto): void {
    this.router.navigate(['/players', player.id]);
  }

  overallSeverity(overall: number): 'success' | 'info' | 'warning' | 'danger' {
    if (overall >= 90) return 'success';
    if (overall >= 80) return 'info';
    if (overall >= 70) return 'warning';
    return 'danger';
  }
}
