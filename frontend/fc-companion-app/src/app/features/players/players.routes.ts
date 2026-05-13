import { Routes } from '@angular/router';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';

export const PLAYERS_ROUTES: Routes = [
  { path: '', component: PlayersListComponent },
  { path: ':id', component: PlayerDetailComponent }
];
