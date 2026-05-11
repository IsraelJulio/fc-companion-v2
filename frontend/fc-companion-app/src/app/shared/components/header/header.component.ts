import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SaveContextService } from '../../../core/services/save-context.service';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="header-container">
      @if (saveContext.hasSave()) {
        <span class="save-name">{{ saveContext.activeSave()?.name }}</span>
        <span class="season-badge">{{ saveContext.activeSeasonName() }}</span>
      } @else {
        <span class="no-save">Nenhum save ativo</span>
      }
    </div>
  `,
  styles: [`
    .header-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      background: #16213e;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      min-height: 52px;
    }
    .save-name {
      font-weight: 600;
      color: #fff;
      font-size: 1rem;
    }
    .season-badge {
      padding: 0.2rem 0.65rem;
      background: #1565c0;
      color: #fff;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .no-save {
      color: #6c757d;
      font-style: italic;
      font-size: 0.9rem;
    }
  `]
})
export class HeaderComponent {
  protected readonly saveContext = inject(SaveContextService);
}
