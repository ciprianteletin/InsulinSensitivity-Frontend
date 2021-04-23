import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IndexSummaryModel} from '../model/representation/summary.model';
import {environment} from '../constants/environment';
import {DataIndexModel} from '../model/form/data-index.model';
import {Pair} from '../model/representation/pair.model';

@Injectable({providedIn: 'root'})
export class HistoryService {
  constructor(private http: HttpClient) {
  }

  getSummaryList(username: string): Observable<IndexSummaryModel[]> {
    return this.http.get<IndexSummaryModel[]>(`${environment.url}/history/${username}`);
  }

  getMandatoryAndSummaryPair(historyId: number): Observable<Pair<DataIndexModel, any>> {
    return this.http.get<Pair<DataIndexModel, any>>(`${environment.url}/history/result/${historyId}`);
  }
}
