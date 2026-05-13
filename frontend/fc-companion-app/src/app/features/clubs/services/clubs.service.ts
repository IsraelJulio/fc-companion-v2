import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClubSummaryDto, ClubDetailDto } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class ClubsService {
  private readonly http = inject(HttpClient);

  getAll(saveId: string, league?: string): Observable<ClubSummaryDto[]> {
    let params = new HttpParams();
    if (league) params = params.set('league', league);
    return this.http.get<ClubSummaryDto[]>(`/saves/${saveId}/clubs`, { params });
  }

  getById(saveId: string, id: string): Observable<ClubDetailDto> {
    return this.http.get<ClubDetailDto>(`/saves/${saveId}/clubs/${id}`);
  }
}
