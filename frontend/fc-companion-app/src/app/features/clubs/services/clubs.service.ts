import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClubSummaryDto, ClubDetailDto, CreateTitleRequest, TitleDto } from '../../../shared/models/api.models';

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

  getTitles(saveId: string, clubId: string): Observable<TitleDto[]> {
    return this.http.get<TitleDto[]>(`/saves/${saveId}/clubs/${clubId}/titles`);
  }

  createTitle(saveId: string, clubId: string, request: CreateTitleRequest): Observable<TitleDto> {
    return this.http.post<TitleDto>(`/saves/${saveId}/clubs/${clubId}/titles`, request);
  }

  deleteTitle(saveId: string, clubId: string, titleId: string): Observable<void> {
    return this.http.delete<void>(`/saves/${saveId}/clubs/${clubId}/titles/${titleId}`);
  }
}
