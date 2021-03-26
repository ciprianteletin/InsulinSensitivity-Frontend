import {ElementRef, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DetailedUserModel} from '../model/detailed-user.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';

/**
 * Service where utility methods are created and used. This service is not specific to a single
 * component, but this is the place where methods with general purpose are defined.
 */
@Injectable({providedIn: 'root'})
export class UtilsService {
  resetDate = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  public getActiveElementId(list: ElementRef[]): string {
    const elem = list.find(el => el.nativeElement.classList.contains('active'));
    if (elem) {
      return elem.nativeElement.id;
    }
    return undefined;
  }

  onResetDate(): void {
    this.resetDate.next();
  }

  getDetailedUser(username: string): Observable<DetailedUserModel> {
    return this.http.get<DetailedUserModel>(`${environment.url}/user/username/${username}`);
  }
}
