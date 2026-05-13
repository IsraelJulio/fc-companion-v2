import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeaguePlayerRankingDto,
  StandingDto,
  TitleHistoryEntryDto
} from '../../../shared/models/api.models';
import { StandingEditForm } from '../models/leagues.model';

@Injectable({ providedIn: 'root' })
export class LeaguesService {
  private readonly http = inject(HttpClient);

  getStandings(saveId: string, seasonId: string | null, league: string): Observable<StandingDto[]> {
    let params = new HttpParams();
    if (seasonId) params = params.set('seasonId', seasonId);
    if (league) params = params.set('league', league);
    return this.http.get<StandingDto[]>(`/saves/${saveId}/standings`, { params });
  }

  updateStanding(saveId: string, id: string, request: StandingEditForm): Observable<StandingDto> {
    return this.http.put<StandingDto>(`/saves/${saveId}/standings/${id}`, request);
  }

  getTopScorers(saveId: string, seasonId: string | null, league: string, limit = 10): Observable<LeaguePlayerRankingDto[]> {
    let params = new HttpParams().set('limit', limit);
    if (seasonId) params = params.set('seasonId', seasonId);
    if (league) params = params.set('league', league);
    return this.http.get<LeaguePlayerRankingDto[]>(`/saves/${saveId}/leagues/rankings/top-scorers`, { params });
  }

  getTopAssists(saveId: string, seasonId: string | null, league: string, limit = 10): Observable<LeaguePlayerRankingDto[]> {
    let params = new HttpParams().set('limit', limit);
    if (seasonId) params = params.set('seasonId', seasonId);
    if (league) params = params.set('league', league);
    return this.http.get<LeaguePlayerRankingDto[]>(`/saves/${saveId}/leagues/rankings/top-assists`, { params });
  }

  getChampionsHistory(saveId: string, competition: string): Observable<TitleHistoryEntryDto[]> {
    let params = new HttpParams();
    if (competition) params = params.set('competition', competition);
    return this.http.get<TitleHistoryEntryDto[]>(`/saves/${saveId}/leagues/champions-history`, { params });
  }
}
