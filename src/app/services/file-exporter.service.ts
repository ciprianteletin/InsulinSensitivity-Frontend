import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {DataIndexModel} from '../model/form/data-index.model';
import {Observable} from 'rxjs';
import {environment} from '../constants/environment';
import {Pair} from '../model/representation/pair.model';
import {saveAs} from 'file-saver';
import {NotificationType} from '../constants/notification-type.enum';
import {NotificationService} from './notification.service';

@Injectable({providedIn: 'root'})
export class FileExporterService {
  constructor(private http: HttpClient,
              private notificationService: NotificationService) {
  }

  public exportExcelResult(mandatory: DataIndexModel, result: any): Observable<HttpResponse<Blob>> {
    return this.http.post(`${environment.url}/excel/result`, new Pair(mandatory, result),
      {headers: this.fileHeaders, responseType: 'blob', observe: 'response'});
  }

  public exportExcelHistory(indexId: number[]): Observable<HttpResponse<Blob>> {
    return this.http.post(`${environment.url}/excel/history`, indexId,
      {headers: this.fileHeaders, responseType: 'blob', observe: 'response'});
  }

  public downloadFile(data: Blob): void {
    const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, 'insulin.xlsx');
    this.notificationService.notify(NotificationType.SUCCESS, 'Your file was downloaded with success!');
  }

  public get fileHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    });
  }
}
