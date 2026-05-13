import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerListItemDto, PlayerDetailDto, PlayerSeasonStatsDto, ClubSummaryDto, PagedResult } from '../../../shared/models/api.models';
import { PlayerFilters, UpdateStatsForm, CreatePlayerForm, UpdatePlayerForm } from '../models/players.model';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly http = inject(HttpClient);

  getAll(saveId: string, filters: PlayerFilters, page: number, pageSize: number): Observable<PagedResult<PlayerListItemDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.position) params = params.set('position', filters.position);
    if (filters.league) params = params.set('league', filters.league);
    if (filters.clubId) params = params.set('clubId', filters.clubId);
    return this.http.get<PagedResult<PlayerListItemDto>>(`/saves/${saveId}/players`, { params });
  }

  getById(saveId: string, id: string): Observable<PlayerDetailDto> {
    return this.http.get<PlayerDetailDto>(`/saves/${saveId}/players/${id}`);
  }

  create(saveId: string, req: CreatePlayerForm): Observable<PlayerDetailDto> {
    return this.http.post<PlayerDetailDto>(`/saves/${saveId}/players`, req);
  }

  update(saveId: string, id: string, req: UpdatePlayerForm): Observable<PlayerDetailDto> {
    return this.http.put<PlayerDetailDto>(`/saves/${saveId}/players/${id}`, req);
  }

  updateSeasonStats(saveId: string, playerId: string, seasonId: string, req: UpdateStatsForm): Observable<PlayerSeasonStatsDto> {
    return this.http.put<PlayerSeasonStatsDto>(
      `/saves/${saveId}/players/${playerId}/season-stats/${seasonId}`, req);
  }

  getClubs(saveId: string): Observable<ClubSummaryDto[]> {
    return this.http.get<ClubSummaryDto[]>(`/saves/${saveId}/clubs`);
  }
}
