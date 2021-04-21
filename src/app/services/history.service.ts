import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IndexSummaryModel} from '../model/representation/summary.model';
import {environment} from '../constants/environment';

@Injectable({providedIn: 'root'})
export class HistoryService {
  constructor(private http: HttpClient) {
  }

  getSummaryList(username: string): Observable<IndexSummaryModel[]> {
    return this.http.get<IndexSummaryModel[]>(`${environment.url}/history/${username}`);
  }
}
