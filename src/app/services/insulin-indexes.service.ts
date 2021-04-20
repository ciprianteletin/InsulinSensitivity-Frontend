import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DataIndexModel} from '../model/form/data-index.model';
import {environment} from '../constants/environment';

/**
 * State manager for insulin indexes, keeping a list of used indexes.
 * The list is managed only in this service, every other component will
 * get a copy of the array.
 *
 * Also, used for different http request passed to the back-end or utility
 * methods for index calculation.
 */
@Injectable({providedIn: 'root'})
export class InsulinIndexesService {
  private addSubject = new Subject<string>();
  private removeSubject = new Subject<string>();
  private passData = new BehaviorSubject<DataIndexModel>(null);
  private passResponse = new BehaviorSubject<any>(null);

  private indexList: string[];
  private completeIndexesList = [
    'cederholm', 'gutt', 'avingon', 'matsuda',
    'ogis', 'belfiore', 'stumvoll', 'homa',
    'quicki', 'revised', 'mcauley', 'spise'
  ];

  constructor(private http: HttpClient) {
    this.indexList = [];
  }

  isEmptyList(): boolean {
    return this.indexList.length === 0;
  }

  populateWithCompleteIndexes(): void {
    this.indexList = this.completeIndexesList.slice();
  }

  addIndex(index: string): void {
    this.addIndexNoEvent(index);
    this.addSubject.next(index);
  }

  addIndexNoEvent(index: string): void {
    this.indexList.push(index);
  }

  removeIndex(index: string): void {
    this.removeIndexNoEvent(index);
    this.removeSubject.next(index);
  }

  removeIndexNoEvent(index: string): void {
    const position = this.indexList
      .findIndex(value => value === index);
    this.indexList.splice(position, 1);
  }

  containsIndex(index: string): boolean {
    return this.indexList.find(value => value === index) !== undefined;
  }

  getIndexList(): string[] {
    return this.indexList.slice();
  }

  clearList(): void {
    this.indexList = [];
  }

  getAddEvent(): Subject<string> {
    return this.addSubject;
  }

  getRemoveEvent(): Subject<string> {
    return this.removeSubject;
  }

  getDataEvent(): BehaviorSubject<DataIndexModel> {
    return this.passData;
  }

  emitNewData(data: DataIndexModel): void {
    this.passData.next(data);
  }

  getResponseEvent(): BehaviorSubject<any> {
    return this.passResponse;
  }

  emitResponse(response: any): void {
    this.passResponse.next(response);
  }

  checkStumvoll(): void {
    if (this.indexList.includes('stumvoll')) {
      this.removeIndexNoEvent('stumvoll');
      this.addIndexNoEvent('stumvoll1');
      this.addIndexNoEvent('stumvoll2');
    }
  }

  checkHoma(): void {
    if (this.indexList.includes('homa') && (!this.indexList.includes('homab') || !this.indexList.includes('loghoma'))) {
      this.addIndexNoEvent('homab');
      this.addIndexNoEvent('loghoma');
    }
  }

  buildDataModel(model: any, glucosePlaceholder: string, insulinPlaceholder: string): DataIndexModel {
    return {
      age: +model.age,
      fullName: model.fullName,
      gender: model.gender,
      glucoseMandatory:
        {
          fastingGlucose: +model.fastingGlucose,
          glucoseOneTwenty: +model.glucoseOneTwenty,
          glucoseSix: +model.glucoseSix,
          glucoseThree: +model.glucoseThree,
          glucosePlaceholder
        },
      insulinMandatory:
        {
          fastingInsulin: +model.fastingInsulin,
          insulinOneTwenty: +model.insulinOneTwenty,
          insulinSix: +model.insulinSix,
          insulinThree: +model.insulinThree,
          insulinPlaceholder
        },
      optionalInformation: {
        nefa: +model.nefa,
        hdl: +model.hdl,
        height: +model.height,
        weight: +model.weight,
        triglyceride: +model.triglyceride,
        thyroglobulin: +model.thyroglobulin
      },
      selectedIndexes: this.indexList,
    };
  }

  sendDataIndexes(data: DataIndexModel, username: string): Observable<any> {
    return this.http.post(`${environment.url}/index/${username}`, data);
  }
}
