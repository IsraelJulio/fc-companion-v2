import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, merge, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ClubsService } from '../../services/clubs.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { ClubSummaryDto } from '../../../../shared/models/api.models';
import { LEAGUES } from '../../../players/models/players.model';

interface ListState {
  loading: boolean;
  items: ClubSummaryDto[];
}

@Component({
  standalone: true,
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    DropdownModule, TagModule, ToastModule, AvatarModule,
    ProgressSpinnerModule, ButtonModule, CardModule
  ]
})
export class ClubListComponent {
  private readonly clubsService = inject(ClubsService);
  private readonly saveContext = inject(SaveContextService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly leagueOptions = [
    { label: 'Todas as ligas', value: '' },
    ...LEAGUES.map(l => ({ label: l.label, value: l.value }))
  ];
  readonly selectedLeague = signal('');

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly state$ = toObservable(this.saveContext.activeSaveId).pipe(
    switchMap(saveId => {
      if (!saveId) return of<ListState>({ loading: false, items: [] });
      return this.refresh$.pipe(
        switchMap(() => merge(
          of<ListState>({ loading: true, items: [] }),
          this.clubsService.getAll(saveId, this.selectedLeague() || undefined).pipe(
            map(items => <ListState>{ loading: false, items }),
            catchError(() => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar clubes' });
              return of<ListState>({ loading: false, items: [] });
            })
          )
        ))
      );
    })
  );

  private readonly state = toSignal(this.state$, { initialValue: <ListState>{ loading: false, items: [] } });

  readonly loading = computed(() => this.state().loading);
  readonly clubs = computed(() => this.state().items);

  changeLeague(value: string): void {
    this.selectedLeague.set(value);
    this.refresh$.next();
  }

  openDetail(club: ClubSummaryDto): void {
    this.router.navigate(['/clubs', club.id]);
  }
}
