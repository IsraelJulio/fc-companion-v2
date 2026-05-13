import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, catchError, map, merge, of, switchMap } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TransfersService } from '../../services/transfers.service';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { TransferDto, ClubSummaryDto } from '../../../../shared/models/api.models';

interface ListState {
  loading: boolean;
  data: TransferDto[];
}

@Component({
  standalone: true,
  selector: 'app-transfers-list',
  templateUrl: './transfers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule,
    ToastModule, ProgressSpinnerModule,
    TransferDialogComponent
  ]
})
export class TransfersListComponent {
  private readonly transfersService = inject(TransfersService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);

  readonly playerSearch = signal('');
  readonly selectedClubId = signal<string | null>(null);
  readonly selectedSeason = signal('');
  readonly showTransferDialog = signal(false);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly listState$ = toObservable(this.saveContext.activeSaveId).pipe(
    switchMap(saveId => {
      if (!saveId) return of<ListState>({ loading: false, data: [] });
      return this.refresh$.pipe(
        switchMap(() => merge(
          of<ListState>({ loading: true, data: [] }),
          this.transfersService.getAll(saveId, this.selectedClubId()).pipe(
            map(data => <ListState>{ loading: false, data }),
            catchError(() => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar transferências' });
              return of<ListState>({ loading: false, data: [] });
            })
          )
        ))
      );
    })
  );

  private readonly listState = toSignal(this.listState$, { initialValue: <ListState>{ loading: false, data: [] } });

  readonly loading = computed(() => this.listState().loading);
  readonly allTransfers = computed(() => this.listState().data);

  readonly filteredTransfers = computed(() => {
    const transfers = this.allTransfers();
    const search = this.playerSearch().toLowerCase();
    const season = this.selectedSeason();
    return transfers.filter(t => {
      const matchesPlayer = !search || t.playerName.toLowerCase().includes(search);
      const matchesSeason = !season || t.seasonName === season;
      return matchesPlayer && matchesSeason;
    });
  });

  readonly seasonOptions = computed(() => {
    const unique = [...new Set(this.allTransfers().map(t => t.seasonName))].sort();
    return [
      { label: 'Todas', value: '' },
      ...unique.map(s => ({ label: s, value: s }))
    ];
  });

  private readonly clubs$ = toObservable(this.saveContext.activeSaveId).pipe(
    switchMap(saveId => {
      if (!saveId) return of<ClubSummaryDto[]>([]);
      return this.transfersService.getClubs(saveId).pipe(catchError(() => of<ClubSummaryDto[]>([])));
    })
  );

  readonly clubFilterOptions = toSignal(
    this.clubs$.pipe(
      map(clubs => [
        { label: 'Todos os clubes', value: '' },
        ...clubs.map(c => ({ label: c.name, value: c.id }))
      ])
    ),
    { initialValue: [] as { label: string; value: string }[] }
  );

  onPlayerSearch(value: string): void {
    this.playerSearch.set(value);
  }

  onClubChange(value: string): void {
    this.selectedClubId.set(value || null);
    this.refresh$.next();
  }

  onSeasonChange(value: string): void {
    this.selectedSeason.set(value);
  }

  openTransferDialog(): void {
    this.showTransferDialog.set(true);
  }

  onTransferred(): void {
    this.refresh$.next();
  }
}
