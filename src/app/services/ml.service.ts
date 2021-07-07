import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';
import {Observable} from 'rxjs';

/**
 * Service to call Machine Learning models for classification or regression
 */
@Injectable({providedIn: 'root'})
export class MlService {
  constructor(private http: HttpClient) {

  }

  public sendToClassification(data: string): Observable<any> {
    return this.http.post(`${environment.url}/classification/predict`, data);
  }

  public sendToRegression(data: string): Observable<any> {
    return this.http.post(`${environment.url}/classification/evolution`, data);
  }
}
