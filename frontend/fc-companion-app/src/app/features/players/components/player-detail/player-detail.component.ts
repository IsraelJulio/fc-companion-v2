import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, catchError, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PlayersService } from '../../services/players.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { PlayerDetailDto } from '../../../../shared/models/api.models';
import { UpdatePlayerForm } from '../../models/players.model';
import { TransferDialogComponent } from '../../../transfers/components/transfer-dialog/transfer-dialog.component';

@Component({
  standalone: true,
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    CardModule, TagModule, AvatarModule, ButtonModule, TableModule,
    DialogModule, InputNumberModule, DropdownModule, ToastModule, ProgressSpinnerModule,
    TransferDialogComponent
  ]
})
export class PlayerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playersService = inject(PlayersService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);

  readonly footOptions = [
    { label: 'Direito', value: 'right' },
    { label: 'Esquerdo', value: 'left' },
    { label: 'Ambos', value: 'both' }
  ];

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly player$ = this.refresh$.pipe(
    switchMap(() => {
      const id = this.route.snapshot.paramMap.get('id');
      const saveId = this.saveContext.activeSaveId();
      if (!id || !saveId) return of(null);
      return this.playersService.getById(saveId, id).pipe(
        catchError(() => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Jogador não encontrado' });
          return of(null);
        })
      );
    })
  );

  readonly player = toSignal(this.player$, { initialValue: null as PlayerDetailDto | null });
  readonly loaded = signal(false);

  readonly showEditDialog = signal(false);
  readonly showTransferDialog = signal(false);
  readonly editForm = signal<UpdatePlayerForm>({ overall: 0, marketValue: null, preferredFoot: 'right' });
  readonly saving = signal(false);

  private readonly saveTrigger$ = new Subject<UpdatePlayerForm>();

  private readonly saveResult$ = this.saveTrigger$.pipe(
    switchMap(form => {
      const saveId = this.saveContext.activeSaveId();
      const id = this.route.snapshot.paramMap.get('id');
      if (!saveId || !id) return EMPTY;
      return this.playersService.update(saveId, id, form).pipe(
        catchError(() => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar' });
          this.saving.set(false);
          return EMPTY;
        })
      );
    })
  );

  private readonly saveResult = toSignal(this.saveResult$);

  private readonly playerLoadedEffect = effect(() => {
    const p = this.player();
    if (p !== null) this.loaded.set(true);
  }, { allowSignalWrites: true });

  private readonly afterSaveEffect = effect(() => {
    const result = this.saveResult();
    if (!result) return;
    this.saving.set(false);
    this.showEditDialog.set(false);
    this.messageService.add({ severity: 'success', summary: 'Salvo', detail: 'Jogador atualizado' });
    this.refresh$.next();
  }, { allowSignalWrites: true });

  openEdit(): void {
    const p = this.player();
    if (!p) return;
    this.editForm.set({ overall: p.overall, marketValue: p.marketValue, preferredFoot: p.preferredFoot });
    this.showEditDialog.set(true);
  }

  openTransferDialog(): void {
    if (!this.player()) return;
    this.showTransferDialog.set(true);
  }

  onTransferred(): void {
    this.refresh$.next();
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
  }

  submitEdit(): void {
    this.saving.set(true);
    this.saveTrigger$.next(this.editForm());
  }

  updateForm<K extends keyof UpdatePlayerForm>(key: K, value: UpdatePlayerForm[K]): void {
    this.editForm.update(f => ({ ...f, [key]: value }));
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }

  footLabel(foot: string): string {
    const map: Record<string, string> = { right: 'Direito', left: 'Esquerdo', both: 'Ambos' };
    return map[foot] ?? foot;
  }

  overallSeverity(overall: number): 'success' | 'info' | 'warning' | 'danger' {
    if (overall >= 90) return 'success';
    if (overall >= 80) return 'info';
    if (overall >= 70) return 'warning';
    return 'danger';
  }
}
