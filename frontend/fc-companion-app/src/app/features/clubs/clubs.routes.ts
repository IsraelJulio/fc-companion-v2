import { Routes } from '@angular/router';
import { ClubListComponent } from './components/club-list/club-list.component';
import { ClubDetailComponent } from './components/club-detail/club-detail.component';

export const CLUBS_ROUTES: Routes = [
  { path: '', component: ClubListComponent },
  { path: ':id', component: ClubDetailComponent }
];
