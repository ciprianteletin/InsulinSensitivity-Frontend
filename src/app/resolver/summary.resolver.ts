import {Injectable} from '@angular/core';
import {IndexSummaryModel} from '../model/representation/summary.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HistoryService} from '../services/history.service';
import {AES} from 'crypto-js';
import {environment} from '../constants/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({providedIn: 'root'})
export class SummaryResolver implements Resolve<IndexSummaryModel[]> {
  constructor(private historyService: HistoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<IndexSummaryModel[]> | Promise<IndexSummaryModel[]> | IndexSummaryModel[] {
    const username = route.queryParams.username;
    if (!username) {
      return null;
    }
    const decryptedUsername = AES.decrypt(username, environment.secretKey).toString(CryptoJS.enc.Utf8);
    return this.historyService.getSummaryList(decryptedUsername);
  }
}
