import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CloseSeasonPreviewDto,
  CloseSeasonRequest,
  CloseSeasonResponse,
  SeasonDto
} from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private readonly http = inject(HttpClient);

  getAll(saveId: string): Observable<SeasonDto[]> {
    return this.http.get<SeasonDto[]>(`/saves/${saveId}/seasons`);
  }

  getClosePreview(saveId: string): Observable<CloseSeasonPreviewDto> {
    return this.http.get<CloseSeasonPreviewDto>(`/saves/${saveId}/seasons/close-preview`);
  }

  closeSeason(saveId: string, request: CloseSeasonRequest): Observable<CloseSeasonResponse> {
    return this.http.post<CloseSeasonResponse>(`/saves/${saveId}/seasons/close`, request);
  }
}
