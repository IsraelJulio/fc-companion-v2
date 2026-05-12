import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CloseSeasonRequest, CloseSeasonResponse } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private readonly http = inject(HttpClient);

  closeSeason(saveId: string, request: CloseSeasonRequest): Observable<CloseSeasonResponse> {
    return this.http.post<CloseSeasonResponse>(`/saves/${saveId}/seasons/close`, request);
  }
}
