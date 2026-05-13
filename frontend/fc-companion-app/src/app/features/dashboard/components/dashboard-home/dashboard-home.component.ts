import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, switchMap, catchError } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SaveContextService } from '../../../../core/services/save-context.service';
import {
  DashboardSummaryDto,
  LeaguePlayerRankingDto,
  OverallHistoryDto,
  PlayerListItemDto,
  SeasonDto,
  TitleHistoryEntryDto
} from '../../../../shared/models/api.models';
import { PlayersService } from '../../../players/services/players.service';
import { SeasonsService } from '../../../saves/services/seasons.service';
import { DashboardService } from '../../services/dashboard.service';

interface DashboardData {
  summary: DashboardSummaryDto | null;
  topScorers: LeaguePlayerRankingDto[];
  titleHistory: TitleHistoryEntryDto[];
  seasons: SeasonDto[];
  players: PlayerListItemDto[];
}

const EMPTY_DATA: DashboardData = {
  summary: null,
  topScorers: [],
  titleHistory: [],
  seasons: [],
  players: []
};

@Component({
  standalone: true,
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    DropdownModule,
    ProgressSpinnerModule,
    TagModule,
    ButtonModule,
    ToastModule
  ]
})
export class DashboardHomeComponent {
  private readonly saveContext = inject(SaveContextService);
  private readonly dashboardService = inject(DashboardService);
  private readonly playersService = inject(PlayersService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly selectedSeasonId = signal<string | null>(null);
  readonly selectedPlayerId = signal<string | null>(null);
  readonly selectedComparePlayerId = signal<string | null>(null);

  private readonly data$ = combineLatest([
    toObservable(this.saveContext.activeSaveId),
    toObservable(this.selectedSeasonId)
  ]).pipe(
    switchMap(([saveId, seasonId]) => {
      if (!saveId) return of({ loading: false, data: EMPTY_DATA });

      return combineLatest([
        this.dashboardService.getSummary(saveId),
        this.dashboardService.getTopScorers(saveId, seasonId, 10),
        this.dashboardService.getTitleHistory(saveId),
        this.seasonsService.getAll(saveId),
        this.playersService.getAll(saveId, { search: '', position: '', clubId: null, league: '' }, 1, 200)
      ]).pipe(
        map(([summary, topScorers, titleHistory, seasons, players]) => ({
          loading: false,
          data: {
            summary,
            topScorers,
            titleHistory,
            seasons,
            players: players.items
          }
        })),
        catchError(() => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dashboard' });
          return of({ loading: false, data: EMPTY_DATA });
        })
      );
    })
  );

  readonly dashboardState = toSignal(this.data$, {
    initialValue: { loading: true, data: EMPTY_DATA }
  });

  readonly loading = computed(() => this.dashboardState().loading);
  readonly summary = computed(() => this.dashboardState().data.summary);
  readonly topScorers = computed(() => this.dashboardState().data.topScorers);
  readonly titleHistory = computed(() => this.dashboardState().data.titleHistory.slice(0, 12));
  readonly seasons = computed(() => this.dashboardState().data.seasons);
  readonly players = computed(() => this.dashboardState().data.players);

  readonly seasonOptions = computed(() =>
    this.seasons().map(season => ({
      label: `${season.name}${season.status === 'active' ? ' · ativa' : ''}`,
      value: season.id
    }))
  );

  readonly playerOptions = computed(() =>
    this.players().map(player => ({
      label: `${player.fullName} · ${player.currentClub?.name ?? 'Sem clube'}`,
      value: player.id
    }))
  );

  private readonly history$ = combineLatest([
    toObservable(this.saveContext.activeSaveId),
    toObservable(this.selectedPlayerId)
  ]).pipe(
    switchMap(([saveId, playerId]) => {
      if (!saveId || !playerId) return of<OverallHistoryDto[]>([]);
      return this.playersService.getOverallHistory(saveId, playerId).pipe(
        catchError(() => of<OverallHistoryDto[]>([]))
      );
    })
  );

  readonly overallHistory = toSignal(this.history$, { initialValue: [] as OverallHistoryDto[] });

  private readonly compareHistory$ = combineLatest([
    toObservable(this.saveContext.activeSaveId),
    toObservable(this.selectedComparePlayerId)
  ]).pipe(
    switchMap(([saveId, playerId]) => {
      if (!saveId || !playerId) return of<OverallHistoryDto[]>([]);
      return this.playersService.getOverallHistory(saveId, playerId).pipe(
        catchError(() => of<OverallHistoryDto[]>([]))
      );
    })
  );

  readonly compareOverallHistory = toSignal(this.compareHistory$, { initialValue: [] as OverallHistoryDto[] });

  private readonly defaultsEffect = effect(() => {
    const seasons = this.seasons();
    const players = this.players();
    const activeSeasonId = this.saveContext.activeSeasonId();

    if (!this.selectedSeasonId() && seasons.length > 0) {
      this.selectedSeasonId.set(activeSeasonId && seasons.some(season => season.id === activeSeasonId)
        ? activeSeasonId
        : seasons[0].id);
    }

    if (!this.selectedPlayerId() && players.length > 0) {
      const preferred = this.summary()?.highestOverall?.id ?? players[0].id;
      this.selectedPlayerId.set(preferred);
    }

    if (!this.selectedComparePlayerId() && players.length > 1) {
      const primary = this.selectedPlayerId();
      const secondary = players.find(player => player.id !== primary)?.id ?? players[0].id;
      this.selectedComparePlayerId.set(secondary);
    }
  }, { allowSignalWrites: true });

  readonly overallChartData = computed(() => ({
    labels: this.overallHistory().map(item => item.seasonName),
    datasets: [
      {
        label: 'Overall',
        data: this.overallHistory().map(item => item.overall),
        fill: true,
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.16)',
        tension: 0.35,
        pointRadius: 4,
      }
    ]
  }));

  readonly overallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#334155'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.18)' }
      },
      y: {
        min: 0,
        max: 99,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.18)' }
      }
    }
  };

  readonly topScorersBarData = computed(() => ({
    labels: this.topScorers().map(item => item.playerName),
    datasets: [
      {
        label: 'Gols',
        data: this.topScorers().map(item => item.value),
        backgroundColor: ['#0f766e', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#3b82f6', '#84cc16', '#ec4899'],
        borderRadius: 8,
      }
    ]
  }));

  readonly topScorersBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        labels: {
          color: '#334155'
        }
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.18)' }
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      }
    }
  };

  readonly comparisonChartData = computed(() => {
    const primary = this.overallHistory();
    const secondary = this.compareOverallHistory();
    const labels = Array.from(new Set([
      ...primary.map(item => item.seasonName),
      ...secondary.map(item => item.seasonName)
    ]));

    return {
      labels,
      datasets: [
        {
          label: this.players().find(player => player.id === this.selectedPlayerId())?.fullName ?? 'Jogador 1',
          data: labels.map(label => primary.find(item => item.seasonName === label)?.overall ?? null),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.12)',
          tension: 0.35,
          pointRadius: 4,
        },
        {
          label: this.players().find(player => player.id === this.selectedComparePlayerId())?.fullName ?? 'Jogador 2',
          data: labels.map(label => secondary.find(item => item.seasonName === label)?.overall ?? null),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          tension: 0.35,
          pointRadius: 4,
        }
      ]
    };
  });

  chooseSeason(value: string | null): void {
    this.selectedSeasonId.set(value);
  }

  choosePlayer(value: string | null): void {
    this.selectedPlayerId.set(value);
  }

  chooseComparePlayer(value: string | null): void {
    this.selectedComparePlayerId.set(value);
  }

  openPlayer(playerId: string): void {
    this.router.navigate(['/players', playerId]);
  }

  sourceSeverity(source: 'real' | 'save'): 'secondary' | 'success' {
    return source === 'save' ? 'success' : 'secondary';
  }
}
