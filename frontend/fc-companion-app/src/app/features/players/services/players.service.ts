import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PagedResult,
  PlayerDetailDto,
  PlayerListItemDto,
  PlayerSeasonStatsDto
} from '../../../shared/models/api.models';
import { CreatePlayerForm, PlayerFilters, UpdatePlayerForm, UpdateStatsForm } from '../models/players.model';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly http = inject(HttpClient);

  getAll(saveId: string, filters: PlayerFilters, page: number, pageSize: number): Observable<PagedResult<PlayerListItemDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.position) params = params.set('position', filters.position);
    if (filters.clubId) params = params.set('clubId', filters.clubId);
    if (filters.league) params = params.set('league', filters.league);
    return this.http.get<PagedResult<PlayerListItemDto>>(`/saves/${saveId}/players`, { params });
  }

  getById(saveId: string, playerId: string): Observable<PlayerDetailDto> {
    return this.http.get<PlayerDetailDto>(`/saves/${saveId}/players/${playerId}`);
  }

  create(saveId: string, request: CreatePlayerForm): Observable<PlayerDetailDto> {
    return this.http.post<PlayerDetailDto>(`/saves/${saveId}/players`, request);
  }

  update(saveId: string, playerId: string, request: UpdatePlayerForm): Observable<PlayerDetailDto> {
    return this.http.put<PlayerDetailDto>(`/saves/${saveId}/players/${playerId}`, request);
  }

  updateSeasonStats(saveId: string, playerId: string, seasonId: string, request: UpdateStatsForm): Observable<PlayerSeasonStatsDto> {
    return this.http.put<PlayerSeasonStatsDto>(
      `/saves/${saveId}/players/${playerId}/season-stats/${seasonId}`,
      request
    );
  }
}
