import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, catchError, combineLatest, map, merge, of, startWith, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SaveContextService } from '../../../../core/services/save-context.service';
import {
  LeaguePlayerRankingDto,
  SeasonDto,
  StandingDto,
  TitleHistoryEntryDto
} from '../../../../shared/models/api.models';
import { LEAGUES } from '../../../players/models/players.model';
import { SeasonsService } from '../../../saves/services/seasons.service';
import { LeagueFilters, StandingEditForm } from '../../models/leagues.model';
import { LeaguesService } from '../../services/leagues.service';

interface LeaguePageData {
  standings: StandingDto[];
  topScorers: LeaguePlayerRankingDto[];
  topAssists: LeaguePlayerRankingDto[];
  champions: TitleHistoryEntryDto[];
}

interface LeagueState {
  loading: boolean;
  data: LeaguePageData;
}

interface EditableStandingRow extends StandingDto {
  draft: StandingEditForm;
}

const EMPTY_DATA: LeaguePageData = {
  standings: [],
  topScorers: [],
  topAssists: [],
  champions: []
};

@Component({
  standalone: true,
  selector: 'app-leagues-list',
  templateUrl: './leagues-list.component.html',
  styleUrl: './leagues-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    CardModule,
    InputNumberModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule
  ]
})
export class LeaguesListComponent {
  private readonly saveContext = inject(SaveContextService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly leaguesService = inject(LeaguesService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly leagueOptions = [{ label: 'Todas as ligas', value: '' }, ...LEAGUES.map(l => ({ label: l.label, value: l.value }))];
  readonly competitionOptions = computed(() => [
    { label: 'Todas as competições', value: '' },
    ...Array.from(new Set(this.champions().map(item => item.competition))).map(name => ({ label: name, value: name }))
  ]);

  readonly filters = signal<LeagueFilters>({
    league: '',
    seasonId: null,
    competition: ''
  });

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly seasons = toSignal(
    toObservable(this.saveContext.activeSaveId).pipe(
      switchMap(saveId => {
        if (!saveId) return of<SeasonDto[]>([]);
        return this.seasonsService.getAll(saveId).pipe(catchError(() => of<SeasonDto[]>([])));
      })
    ),
    { initialValue: [] as SeasonDto[] }
  );

  readonly seasonOptions = computed(() =>
    this.seasons().map(season => ({
      label: `${season.name}${season.status === 'active' ? ' · ativa' : ''}`,
      value: season.id
    }))
  );

  private readonly state$ = combineLatest([
    toObservable(this.saveContext.activeSaveId),
    toObservable(this.filters),
    this.refresh$.pipe(startWith(undefined))
  ]).pipe(
    switchMap(([saveId, filters]) => {
      if (!saveId) return of<LeagueState>({ loading: false, data: EMPTY_DATA });

      return merge(
        of<LeagueState>({ loading: true, data: EMPTY_DATA }),
        combineLatest([
          this.leaguesService.getStandings(saveId, filters.seasonId, filters.league),
          this.leaguesService.getTopScorers(saveId, filters.seasonId, filters.league),
          this.leaguesService.getTopAssists(saveId, filters.seasonId, filters.league),
          this.leaguesService.getChampionsHistory(saveId, filters.competition)
        ]).pipe(
          map(([standings, topScorers, topAssists, champions]) => ({
            loading: false,
            data: { standings, topScorers, topAssists, champions }
          })),
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados das ligas' });
            return of<LeagueState>({ loading: false, data: EMPTY_DATA });
          })
        )
      );
    })
  );

  private readonly state = toSignal(this.state$, {
    initialValue: { loading: false, data: EMPTY_DATA }
  });

  readonly loading = computed(() => this.state().loading);
  readonly standings = signal<EditableStandingRow[]>([]);
  readonly topScorers = computed(() => this.state().data.topScorers);
  readonly topAssists = computed(() => this.state().data.topAssists);
  readonly champions = computed(() => this.state().data.champions);
  readonly savingRowId = signal<string | null>(null);
  private readonly saveStandingTrigger$ = new Subject<EditableStandingRow>();

  private readonly syncStandingsEffect = effect(() => {
    const standings = this.state().data.standings;
    this.standings.set(standings.map(item => ({
      ...item,
      draft: {
        position: item.position,
        points: item.points,
        wins: item.wins,
        draws: item.draws,
        losses: item.losses,
        goalsFor: item.goalsFor,
        goalsAgainst: item.goalsAgainst
      }
    })));
  }, { allowSignalWrites: true });

  private readonly seasonDefaultEffect = effect(() => {
    const currentSeasonId = this.saveContext.activeSeasonId();
    const seasons = this.seasons();
    const currentValue = this.filters().seasonId;

    if (currentValue) {
      const stillExists = seasons.some(season => season.id === currentValue);
      if (stillExists) return;
    }

    if (currentSeasonId && seasons.some(season => season.id === currentSeasonId)) {
      this.filters.update(filters => ({ ...filters, seasonId: currentSeasonId }));
      return;
    }

    const firstSeason = seasons[0]?.id ?? null;
    this.filters.update(filters => ({ ...filters, seasonId: firstSeason }));
  }, { allowSignalWrites: true });

  private readonly saveStandingResult = toSignal(
    this.saveStandingTrigger$.pipe(
      switchMap(row => {
        const saveId = this.saveContext.activeSaveId();
        if (!saveId) return EMPTY;

        this.savingRowId.set(row.id);
        return this.leaguesService.updateStanding(saveId, row.id, row.draft).pipe(
          map(updated => ({ updated, rowId: row.id })),
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar classificação' });
            this.savingRowId.set(null);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterSaveStandingEffect = effect(() => {
    const result = this.saveStandingResult();
    if (!result) return;

    this.savingRowId.set(null);
    this.messageService.add({ severity: 'success', summary: 'Classificação salva', detail: result.updated.club.name });
    this.refresh$.next();
  }, { allowSignalWrites: true });

  changeLeague(league: string): void {
    this.filters.update(filters => ({ ...filters, league }));
  }

  changeSeason(seasonId: string | null): void {
    this.filters.update(filters => ({ ...filters, seasonId }));
  }

  changeCompetition(competition: string): void {
    this.filters.update(filters => ({ ...filters, competition }));
  }

  updateStanding(rowId: string, key: keyof StandingEditForm, value: number): void {
    this.standings.update(rows => rows.map(row =>
      row.id === rowId
        ? { ...row, draft: { ...row.draft, [key]: value ?? 0 } }
        : row
    ));
  }

  saveStanding(row: EditableStandingRow): void {
    this.saveStandingTrigger$.next(row);
  }

  openPlayer(playerId: string): void {
    this.router.navigate(['/players', playerId]);
  }

  goalDifference(row: EditableStandingRow): number {
    return row.draft.goalsFor - row.draft.goalsAgainst;
  }

  sourceSeverity(source: 'real' | 'save'): 'secondary' | 'success' {
    return source === 'save' ? 'success' : 'secondary';
  }
}
