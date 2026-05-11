import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout-wrapper">
      <div class="layout-sidebar">
        <app-sidebar />
      </div>
      <div class="layout-main">
        <app-header />
        <main class="layout-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper { display: flex; height: 100vh; }
    .layout-sidebar { width: 240px; flex-shrink: 0; }
    .layout-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .layout-content { flex: 1; overflow-y: auto; padding: 1.5rem; }
  `]
})
export class AppComponent {}
