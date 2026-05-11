import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'saves', pathMatch: 'full' },
  {
    path: 'saves',
    loadChildren: () => import('./features/saves/saves.routes').then(m => m.SAVES_ROUTES)
  },
  {
    path: 'players',
    loadChildren: () => import('./features/players/players.routes').then(m => m.PLAYERS_ROUTES)
  },
  {
    path: 'clubs',
    loadChildren: () => import('./features/clubs/clubs.routes').then(m => m.CLUBS_ROUTES)
  },
  {
    path: 'leagues',
    loadChildren: () => import('./features/leagues/leagues.routes').then(m => m.LEAGUES_ROUTES)
  },
  {
    path: 'transfers',
    loadChildren: () => import('./features/transfers/transfers.routes').then(m => m.TRANSFERS_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  { path: '**', redirectTo: 'saves' }
];
