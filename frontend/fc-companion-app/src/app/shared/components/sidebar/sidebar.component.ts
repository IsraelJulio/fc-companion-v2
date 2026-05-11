import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuModule, RouterModule],
  template: `
    <div class="sidebar-container">
      <div class="sidebar-brand">FC Companion</div>
      <p-menu [model]="items" styleClass="sidebar-menu" />
    </div>
  `,
  styles: [`
    .sidebar-container {
      padding: 1rem;
      height: 100%;
      background: #1a1a2e;
    }
    .sidebar-brand {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      padding: 0.5rem 0.5rem 1.5rem;
      letter-spacing: 0.5px;
    }
    :host ::ng-deep .sidebar-menu {
      background: transparent;
      border: none;
      width: 100%;
      padding: 0;
    }
    :host ::ng-deep .sidebar-menu .p-menuitem-link {
      color: #adb5bd;
      border-radius: 6px;
      padding: 0.65rem 0.75rem;
    }
    :host ::ng-deep .sidebar-menu .p-menuitem-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    :host ::ng-deep .sidebar-menu .p-menuitem-link.p-menuitem-link-active {
      background: rgba(21, 101, 192, 0.4);
      color: #fff;
    }
  `]
})
export class SidebarComponent {
  readonly items: MenuItem[] = [
    { label: 'Saves', icon: 'pi pi-save', routerLink: ['/saves'] },
    { label: 'Jogadores', icon: 'pi pi-users', routerLink: ['/players'] },
    { label: 'Clubes', icon: 'pi pi-flag', routerLink: ['/clubs'] },
    { label: 'Ligas', icon: 'pi pi-trophy', routerLink: ['/leagues'] },
    { label: 'Transferências', icon: 'pi pi-arrow-right-arrow-left', routerLink: ['/transfers'] },
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/dashboard'] },
  ];
}
