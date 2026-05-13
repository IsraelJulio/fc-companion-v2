import {
  Component, ChangeDetectionStrategy, inject, signal, effect,
  Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPTY, Subject, catchError, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TransfersService } from '../../services/transfers.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { CreateTransferForm } from '../../models/transfers.model';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    DialogModule, ButtonModule, DropdownModule, InputTextModule, ToastModule
  ]
})
export class TransferDialogComponent implements OnChanges {
  private readonly transfersService = inject(TransfersService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);

  @Input() visible = false;
  @Input() prefilledPlayerId: string | null = null;
  @Input() prefilledPlayerName: string | null = null;
  @Input() prefilledToClubId: string | null = null;
  @Input() prefilledToClubName: string | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() transferred = new EventEmitter<void>();

  readonly saving = signal(false);
  readonly form = signal<CreateTransferForm>({
    playerId: '',
    toClubId: '',
    transferDate: new Date().toISOString().split('T')[0]
  });

  private readonly loadClubsTrigger$ = new Subject<string>();
  private readonly loadPlayersTrigger$ = new Subject<string>();

  readonly clubOptions = toSignal(
    this.loadClubsTrigger$.pipe(
      switchMap(saveId =>
        this.transfersService.getClubs(saveId).pipe(
          map(clubs => clubs.map<SelectOption>(c => ({ label: c.name, value: c.id }))),
          catchError(() => of<SelectOption[]>([]))
        )
      )
    ),
    { initialValue: [] as SelectOption[] }
  );

  readonly playerOptions = toSignal(
    this.loadPlayersTrigger$.pipe(
      switchMap(saveId =>
        this.transfersService.getPlayers(saveId).pipe(
          map(players => players.map<SelectOption>(p => ({ label: p.fullName, value: p.id }))),
          catchError(() => of<SelectOption[]>([]))
        )
      )
    ),
    { initialValue: [] as SelectOption[] }
  );

  private readonly submitTrigger$ = new Subject<CreateTransferForm>();

  private readonly submitResult = toSignal(
    this.submitTrigger$.pipe(
      switchMap(form => {
        const saveId = this.saveContext.activeSaveId();
        if (!saveId) return EMPTY;
        return this.transfersService.create(saveId, form).pipe(
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao registrar transferência' });
            this.saving.set(false);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterSubmitEffect = effect(() => {
    const result = this.submitResult();
    if (!result) return;
    this.saving.set(false);
    this.visibleChange.emit(false);
    this.messageService.add({ severity: 'success', summary: 'Transferência registrada', detail: `${result.playerName} transferido com sucesso` });
    this.transferred.emit();
  }, { allowSignalWrites: true });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      const saveId = this.saveContext.activeSaveId();
      if (!saveId) return;

      this.form.set({
        playerId: this.prefilledPlayerId ?? '',
        toClubId: this.prefilledToClubId ?? '',
        transferDate: new Date().toISOString().split('T')[0]
      });

      if (!this.prefilledToClubId) this.loadClubsTrigger$.next(saveId);
      if (!this.prefilledPlayerId) this.loadPlayersTrigger$.next(saveId);
    }
  }

  updateForm<K extends keyof CreateTransferForm>(key: K, value: CreateTransferForm[K]): void {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  submit(): void {
    const f = this.form();
    if (!f.playerId || !f.toClubId || !f.transferDate) {
      this.messageService.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Selecione jogador, clube e data' });
      return;
    }
    this.saving.set(true);
    this.submitTrigger$.next(f);
  }
}
