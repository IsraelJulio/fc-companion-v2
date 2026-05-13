import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
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
    TransferDialogComponent
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

  private readonly loadedEffect = effect(() => {
    if (this.club() !== null) this.loaded.set(true);
  }, { allowSignalWrites: true });

  readonly realTitles = computed(() =>
    (this.club()?.titles ?? []).filter((t: TitleDto) => t.source === 'real')
  );

  readonly saveTitles = computed(() =>
    (this.club()?.titles ?? []).filter((t: TitleDto) => t.source === 'save')
  );

  openTransferDialog(): void {
    if (!this.club()) return;
    this.showTransferDialog.set(true);
  }

  onTransferred(): void {
    this.refresh$.next();
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
}
