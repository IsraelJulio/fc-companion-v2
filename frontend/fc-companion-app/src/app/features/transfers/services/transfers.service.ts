import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransferDto, ClubSummaryDto, PlayerListItemDto, PagedResult } from '../../../shared/models/api.models';
import { CreateTransferForm } from '../models/transfers.model';

@Injectable({ providedIn: 'root' })
export class TransfersService {
  private readonly http = inject(HttpClient);

  getAll(saveId: string, clubId?: string | null): Observable<TransferDto[]> {
    let params = new HttpParams();
    if (clubId) params = params.set('clubId', clubId);
    return this.http.get<TransferDto[]>(`/saves/${saveId}/transfers`, { params });
  }

  create(saveId: string, req: CreateTransferForm): Observable<TransferDto> {
    return this.http.post<TransferDto>(`/saves/${saveId}/transfers`, req);
  }

  getClubs(saveId: string): Observable<ClubSummaryDto[]> {
    return this.http.get<ClubSummaryDto[]>(`/saves/${saveId}/clubs`);
  }

  getPlayers(saveId: string): Observable<PlayerListItemDto[]> {
    const params = new HttpParams().set('page', '1').set('pageSize', '500');
    return this.http.get<PagedResult<PlayerListItemDto>>(`/saves/${saveId}/players`, { params }).pipe(
      map(r => r.items)
    );
  }
}
