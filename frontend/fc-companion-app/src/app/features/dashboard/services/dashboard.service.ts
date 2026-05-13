import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardSummaryDto,
  LeaguePlayerRankingDto,
  TitleHistoryEntryDto
} from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(saveId: string): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`/saves/${saveId}/dashboard/summary`);
  }

  getTopScorers(saveId: string, seasonId: string | null, limit = 10): Observable<LeaguePlayerRankingDto[]> {
    let params = new HttpParams().set('limit', limit);
    if (seasonId) params = params.set('seasonId', seasonId);
    return this.http.get<LeaguePlayerRankingDto[]>(`/saves/${saveId}/dashboard/top-scorers`, { params });
  }

  getTitleHistory(saveId: string): Observable<TitleHistoryEntryDto[]> {
    return this.http.get<TitleHistoryEntryDto[]>(`/saves/${saveId}/dashboard/title-history`);
  }
}
