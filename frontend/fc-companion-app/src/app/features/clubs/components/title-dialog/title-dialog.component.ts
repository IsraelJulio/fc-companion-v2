import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, map, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ClubsService } from '../../services/clubs.service';
import { SeasonsService } from '../../../saves/services/seasons.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { CreateTitleRequest } from '../../../../shared/models/api.models';

interface SeasonOption {
  label: string;
  value: string | null;
}

@Component({
  standalone: true,
  selector: 'app-title-dialog',
  templateUrl: './title-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ToastModule
  ]
})
export class TitleDialogComponent implements OnChanges {
  private readonly clubsService = inject(ClubsService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly saveContext = inject(SaveContextService);
  private readonly messageService = inject(MessageService);

  @Input() visible = false;
  @Input() clubId: string | null = null;
  @Input() clubName: string | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<void>();

  readonly saving = signal(false);
  readonly form = signal<CreateTitleRequest>({
    competition: '',
    year: new Date().getFullYear(),
    seasonId: null
  });

  private readonly loadSeasonsTrigger$ = new Subject<string>();
  private readonly createTrigger$ = new Subject<CreateTitleRequest>();

  readonly seasonOptions = toSignal(
    this.loadSeasonsTrigger$.pipe(
      switchMap(saveId =>
        this.seasonsService.getAll(saveId).pipe(
          map(seasons => [
            { label: 'Sem temporada vinculada', value: null },
            ...seasons.map<SeasonOption>(season => ({
              label: `${season.name}${season.status === 'active' ? ' · ativa' : ''}`,
              value: season.id
            }))
          ]),
          catchError(() => of<SeasonOption[]>([{ label: 'Sem temporada vinculada', value: null }]))
        )
      )
    ),
    { initialValue: [{ label: 'Sem temporada vinculada', value: null }] as SeasonOption[] }
  );

  private readonly createResult = toSignal(
    this.createTrigger$.pipe(
      switchMap(form => {
        const saveId = this.saveContext.activeSaveId();
        const clubId = this.clubId;
        if (!saveId || !clubId) return EMPTY;

        return this.clubsService.createTitle(saveId, clubId, form).pipe(
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar título' });
            this.saving.set(false);
            return EMPTY;
          })
        );
      })
    )
  );

  private readonly afterCreateEffect = effect(() => {
    const result = this.createResult();
    if (!result) return;

    this.saving.set(false);
    this.visibleChange.emit(false);
    this.messageService.add({ severity: 'success', summary: 'Título registrado', detail: `${result.competition} adicionado` });
    this.created.emit();
  }, { allowSignalWrites: true });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      const saveId = this.saveContext.activeSaveId();
      if (!saveId) return;

      this.form.set({
        competition: '',
        year: new Date().getFullYear(),
        seasonId: this.saveContext.activeSeasonId()
      });

      this.loadSeasonsTrigger$.next(saveId);
    }
  }

  updateForm<K extends keyof CreateTitleRequest>(key: K, value: CreateTitleRequest[K]): void {
    this.form.update(form => ({ ...form, [key]: value }));
  }

  submit(): void {
    const form = this.form();
    if (!form.competition.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Campo obrigatório', detail: 'Informe a competição' });
      return;
    }

    this.saving.set(true);
    this.createTrigger$.next({
      competition: form.competition.trim(),
      year: form.year,
      seasonId: form.seasonId
    });
  }
}
