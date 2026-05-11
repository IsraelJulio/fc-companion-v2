import { Injectable, computed, signal } from '@angular/core';
import { SaveDto } from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class SaveContextService {
  private readonly _activeSave = signal<SaveDto | null>(null);
  readonly activeSave = this._activeSave.asReadonly();
  readonly activeSaveId = computed(() => this._activeSave()?.id ?? null);
  readonly activeSeasonId = computed(() => this._activeSave()?.currentSeason?.id ?? null);
  readonly activeSeasonName = computed(() => this._activeSave()?.currentSeason?.name ?? '—');
  readonly hasSave = computed(() => this._activeSave() !== null);
  setActiveSave(save: SaveDto): void { this._activeSave.set(save); }
  clear(): void { this._activeSave.set(null); }
}
