import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {DataIndexModel} from '../model/form/data-index.model';
import {Observable} from 'rxjs';
import {environment} from '../constants/environment';
import {Pair} from '../model/representation/pair.model';
import {saveAs} from 'file-saver';
import {NotificationType} from '../constants/notification-type.enum';
import {NotificationService} from './notification.service';

/**
 * Service created for exporting different kinds of documents (excel or pdf)
 */
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

  public downloadExcel(data: Blob): void {
    const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, 'insulin.xlsx');
    this.notificationService.notify(NotificationType.SUCCESS, 'Your file was downloaded with success!');
  }

  public downloadPDF(data: Blob): void {
    const blob = new Blob([data], {type: 'application/pdf'});
    saveAs(blob, 'insulin.pdf');
    this.notificationService.notify(NotificationType.SUCCESS, 'Your file was downloaded with success!');
  }

  public exportPDF(glucoseImg: string, insulinImg: string, originalResponse: any, data: DataIndexModel): Observable<HttpResponse<Blob>> {
    return this.http.post(`${environment.url}/index/pdf`, new Pair(originalResponse, data), {
      params: {
        glucoseImg,
        insulinImg
      },
      headers: this.fileHeaders, responseType: 'blob', observe: 'response'
    });
  }

  public get fileHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'text/html,application/xhtml+xml,application/pdf,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    });
  }
}
