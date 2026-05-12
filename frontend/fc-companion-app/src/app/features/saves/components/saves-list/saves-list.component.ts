import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, merge, of, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SavesService } from '../../services/saves.service';
import { SaveContextService } from '../../../../core/services/save-context.service';
import { SaveDto } from '../../../../shared/models/api.models';

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
    TagModule,
    ToastModule,
  ],
})
export class SavesListComponent {
  private readonly savesService = inject(SavesService);
  private readonly saveContext = inject(SaveContextService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly refresh$ = new Subject<void>();

  readonly saves = toSignal(
    merge(of(null), this.refresh$).pipe(
      switchMap(() => this.savesService.getAll())
    ),
    { initialValue: [] as SaveDto[] }
  );

  readonly activeSave = this.saveContext.activeSave;
  readonly showDialog = signal(false);
  readonly newName = signal('');
  readonly newSeason = signal('2025/26');
  readonly creating = signal(false);
  readonly deleting = signal<string | null>(null);

  openDialog(): void {
    this.newName.set('');
    this.newSeason.set('2025/26');
    this.showDialog.set(true);
  }

  async createSave(): Promise<void> {
    const name = this.newName().trim();
    const season = this.newSeason().trim();
    if (!name || !season) return;

    this.creating.set(true);
    try {
      const save = await firstValueFrom(
        this.savesService.create({ name, firstSeasonName: season })
      );
      this.refresh$.next();
      this.showDialog.set(false);
      this.messageService.add({ severity: 'success', summary: 'Save criado', detail: save.name });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar save' });
    } finally {
      this.creating.set(false);
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
