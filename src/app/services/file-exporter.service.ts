import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataIndexModel} from '../model/form/data-index.model';
import {Observable} from 'rxjs';
import {environment} from '../constants/environment';
import {Pair} from '../model/representation/pair.model';

@Injectable({providedIn: 'root'})
export class FileExporterService {
  constructor(private http: HttpClient) {
  }

  public exportExcelResult(mandatory: DataIndexModel, result: any): Observable<any> {
    return this.http.post(`${environment.url}/excel/result`, new Pair(mandatory, result));
  }
}
