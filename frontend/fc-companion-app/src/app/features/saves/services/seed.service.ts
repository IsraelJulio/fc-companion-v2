import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeedResponseDto } from '../models/saves.model';

@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly http = inject(HttpClient);

  seed(saveId: string, leagueIds: number[]): Observable<SeedResponseDto> {
    return this.http.post<SeedResponseDto>(`/saves/${saveId}/seed`, { leagueIds });
  }
}
