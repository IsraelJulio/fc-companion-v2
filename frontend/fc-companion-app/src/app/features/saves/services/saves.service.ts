import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveDto } from '../../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class SavesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<SaveDto[]> {
    return this.http.get<SaveDto[]>('/saves');
  }

  create(request: { name: string; firstSeasonName: string }): Observable<SaveDto> {
    return this.http.post<SaveDto>('/saves', request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/saves/${id}`);
  }
}
