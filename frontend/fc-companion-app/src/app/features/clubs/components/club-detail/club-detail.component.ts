import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, catchError, map, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { ClubsService } from '../../services/clubs.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { ClubDetailDto, TitleDto } from '../../../../shared/models/api.models';
import { TransferDialogComponent } from '../../../transfers/components/transfer-dialog/transfer-dialog.component';
import { TitleDialogComponent } from '../title-dialog/title-dialog.component';

interface TitleCountItem {
  competition: string;
  count: number;
  realCount: number;
  saveCount: number;
}

@Component({
  standalone: true,
  selector: 'app-club-detail',
  templateUrl: './club-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule,
    CardModule, TagModule, AvatarModule, ButtonModule, TableModule,
    ToastModule, ProgressSpinnerModule, DividerModule,
    TransferDialogComponent,
    TitleDialogComponent
  ]
})
export class ClubDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clubsService = inject(ClubsService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly club$ = this.refresh$.pipe(
    switchMap(() => {
      const id = this.route.snapshot.paramMap.get('id');
      const saveId = this.saveContext.activeSaveId();
      if (!id || !saveId) return of(null);
      return this.clubsService.getById(saveId, id).pipe(
        catchError(() => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Clube não encontrado' });
          return of(null);
        })
      );
    })
  );

  readonly club = toSignal(this.club$, { initialValue: null as ClubDetailDto | null });
  readonly loaded = signal(false);
  readonly showTransferDialog = signal(false);
  readonly showTitleDialog = signal(false);
  readonly deletingTitleId = signal<string | null>(null);
  private readonly deleteTitleTrigger$ = new Subject<string>();

  private readonly loadedEffect = effect(() => {
    if (this.club() !== null) this.loaded.set(true);
  }, { allowSignalWrites: true });

  readonly realTitles = computed(() =>
    (this.club()?.titles ?? []).filter((t: TitleDto) => t.source === 'real')
  );

  readonly saveTitles = computed(() =>
    (this.club()?.titles ?? []).filter((t: TitleDto) => t.source === 'save')
  );

  readonly titleCounts = computed<TitleCountItem[]>(() => {
    const titles = this.club()?.titles ?? [];

    return Object.values(
      titles.reduce<Record<string, TitleCountItem>>((acc, title) => {
        const current = acc[title.competition] ?? {
          competition: title.competition,
          count: 0,
          realCount: 0,
          saveCount: 0
        };

        current.count += 1;
        if (title.source === 'real') current.realCount += 1;
        if (title.source === 'save') current.saveCount += 1;

        acc[title.competition] = current;
        return acc;
      }, {})
    ).sort((a, b) => b.count - a.count || a.competition.localeCompare(b.competition));
  });

  private readonly deleteTitleResult = toSignal(
    this.deleteTitleTrigger$.pipe(
      switchMap(titleId => {
        const saveId = this.saveContext.activeSaveId();
        const clubId = this.club()?.id;
        if (!saveId || !clubId) return EMPTY;

        this.deletingTitleId.set(titleId);
        return this.clubsService.deleteTitle(saveId, clubId, titleId).pipe(
          map(() => true),
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover título' });
            this.deletingTitleId.set(null);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterDeleteTitleEffect = effect(() => {
    const result = this.deleteTitleResult();
    if (result === undefined) return;

    this.deletingTitleId.set(null);
    this.messageService.add({ severity: 'success', summary: 'Título removido', detail: 'Registro excluído com sucesso' });
    this.refresh$.next();
  }, { allowSignalWrites: true });

  openTransferDialog(): void {
    if (!this.club()) return;
    this.showTransferDialog.set(true);
  }

  openTitleDialog(): void {
    if (!this.club()) return;
    this.showTitleDialog.set(true);
  }

  onTransferred(): void {
    this.refresh$.next();
  }

  onTitleCreated(): void {
    this.refresh$.next();
  }

  removeTitle(titleId: string): void {
    this.deleteTitleTrigger$.next(titleId);
  }

  goBack(): void {
    this.router.navigate(['/clubs']);
  }

  viewPlayer(playerId: string): void {
    this.router.navigate(['/players', playerId]);
  }

  overallSeverity(overall: number): 'success' | 'info' | 'warning' | 'danger' {
    if (overall >= 90) return 'success';
    if (overall >= 80) return 'info';
    if (overall >= 70) return 'warning';
    return 'danger';
  }

  sourceSeverity(source: 'real' | 'save'): 'secondary' | 'success' {
    return source === 'save' ? 'success' : 'secondary';
  }
}
