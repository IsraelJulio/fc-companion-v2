import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, merge, of, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SavesService } from '../../services/saves.service';
import { SeedService } from '../../services/seed.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { SaveDto } from '../../../../shared/models/api.models';
import { LeagueOption } from '../../models/saves.model';

const ALL_LEAGUE_IDS = [39, 140, 135, 78, 61, 2];

const LEAGUES: LeagueOption[] = [
  { id: 39,  name: 'Premier League',   country: 'Inglaterra', abbr: 'PL'  },
  { id: 140, name: 'La Liga',          country: 'Espanha',    abbr: 'LL'  },
  { id: 135, name: 'Serie A',          country: 'Itália',     abbr: 'SA'  },
  { id: 78,  name: 'Bundesliga',       country: 'Alemanha',   abbr: 'BL'  },
  { id: 61,  name: 'Ligue 1',          country: 'França',     abbr: 'L1'  },
  { id: 2,   name: 'Champions League', country: 'Europa',     abbr: 'UCL' },
];

@Component({
  standalone: true,
  selector: 'app-saves-list',
  templateUrl: './saves-list.component.html',
  styleUrl: './saves-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ProgressBarModule,
    TagModule,
    ToastModule,
  ],
})
export class SavesListComponent {
  private readonly savesService = inject(SavesService);
  private readonly seedService   = inject(SeedService);
  private readonly saveContext   = inject(SaveContextService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService      = inject(MessageService);

  private readonly refresh$ = new Subject<void>();

  readonly saves = toSignal(
    merge(of(null), this.refresh$).pipe(
      switchMap(() => this.savesService.getAll())
    ),
    { initialValue: [] as SaveDto[] }
  );

  readonly activeSave = this.saveContext.activeSave;

  readonly showDialog      = signal(false);
  readonly dialogStep      = signal<0 | 1 | 2>(0);
  readonly newName         = signal('');
  readonly newSeason       = signal('2025/26');
  readonly selectedLeagueIds = signal<number[]>([...ALL_LEAGUE_IDS]);
  readonly creating        = signal(false);
  readonly seeding         = signal(false);
  readonly deleting        = signal<string | null>(null);

  readonly LEAGUES = LEAGUES;

  readonly dialogHeader = computed(() => {
    switch (this.dialogStep()) {
      case 1:  return 'Selecionar Ligas';
      case 2:  return 'Importando dados...';
      default: return 'Novo Save';
    }
  });

  readonly dialogWidth = computed(() =>
    this.dialogStep() === 1 ? '40rem' : '28rem'
  );

  readonly step0Valid = computed(() =>
    this.newName().trim().length > 0 && this.newSeason().trim().length > 0
  );

  openDialog(): void {
    this.newName.set('');
    this.newSeason.set('2025/26');
    this.selectedLeagueIds.set([...ALL_LEAGUE_IDS]);
    this.dialogStep.set(0);
    this.showDialog.set(true);
  }

  nextStep(): void {
    this.dialogStep.set(1);
  }

  prevStep(): void {
    this.dialogStep.set(0);
  }

  toggleLeague(id: number): void {
    const current = this.selectedLeagueIds();
    this.selectedLeagueIds.set(
      current.includes(id) ? current.filter(l => l !== id) : [...current, id]
    );
  }

  isLeagueSelected(id: number): boolean {
    return this.selectedLeagueIds().includes(id);
  }

  async createSave(): Promise<void> {
    const name   = this.newName().trim();
    const season = this.newSeason().trim();
    if (!name || !season) return;

    this.creating.set(true);
    let save: SaveDto;
    try {
      save = await firstValueFrom(
        this.savesService.create({ name, firstSeasonName: season })
      );
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar save' });
      this.creating.set(false);
      return;
    }
    this.creating.set(false);

    const leagueIds = this.selectedLeagueIds();
    if (leagueIds.length === 0) {
      this.showDialog.set(false);
      this.refresh$.next();
      this.messageService.add({ severity: 'success', summary: 'Save criado', detail: save.name });
      return;
    }

    this.dialogStep.set(2);
    this.seeding.set(true);

    try {
      const result = await firstValueFrom(this.seedService.seed(save.id, leagueIds));
      this.messageService.add({
        severity: 'success',
        summary: 'Save criado com sucesso',
        detail: `${result.playersImported} jogadores e ${result.clubsImported} clubes importados`,
        life: 6000,
      });
    } catch {
      this.messageService.add({
        severity: 'warn',
        summary: 'Save criado com aviso',
        detail: 'API indisponível. O save foi criado sem dados importados.',
        life: 8000,
      });
    } finally {
      this.seeding.set(false);
      this.showDialog.set(false);
      this.refresh$.next();
    }
  }

  selectSave(save: SaveDto): void {
    this.saveContext.setActiveSave(save);
    this.messageService.add({ severity: 'info', summary: 'Save ativo', detail: save.name });
  }

  isActive(id: string): boolean {
    return this.saveContext.activeSaveId() === id;
  }

  confirmDelete(save: SaveDto): void {
    this.confirmationService.confirm({
      message: `Excluir "${save.name}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => void this.deleteSave(save.id),
    });
  }

  private async deleteSave(id: string): Promise<void> {
    this.deleting.set(id);
    try {
      await firstValueFrom(this.savesService.delete(id));
      if (this.saveContext.activeSaveId() === id) this.saveContext.clear();
      this.refresh$.next();
      this.messageService.add({ severity: 'success', summary: 'Save excluído' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir save' });
    } finally {
      this.deleting.set(null);
    }
  }
}
