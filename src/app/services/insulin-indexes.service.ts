import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DataIndexModel} from '../model/form/data-index.model';
import {environment} from '../constants/environment';

/**
 * State manager for insulin indexes, keeping a list of used indexes.
 * The list is managed only in this service, every other component will
 * get a copy of the array.
 *
 * Also, used for different http request passed to the back-end.
 */
@Injectable({providedIn: 'root'})
export class InsulinIndexesService {
  private addSubject = new Subject<string>();
  private removeSubject = new Subject<string>();

  private indexList: string[];
  private completeIndexesList = [
    'cederholm', 'gutt', 'avingon', 'matsuda',
    'ogis', 'belfiore', 'stumvoll', 'homa',
    'quicki', 'revised', 'mcauley', 'spise'
  ];

  constructor(private http: HttpClient) {
    this.indexList = [];
  }

  populateWithCompleteIndexes(): void {
    this.indexList = this.completeIndexesList.slice();
  }

  addIndex(index: string): void {
    this.indexList.push(index);
    this.addSubject.next(index);
  }

  removeIndex(index: string): void {
    const position = this.indexList
      .findIndex(value => value === index);
    this.indexList.splice(position, 1);
    this.removeSubject.next(index);
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

  buildDataModel(model: any, username: string, glucosePlaceholder: string, insulinPlaceholder: string): DataIndexModel {
    return {
      username,
      age: model.age,
      fullName: model.fullName,
      gender: model.gender,
      glucoseMandatory:
        {
          fastingGlucose: model.fastingGlucose,
          glucoseOneTwenty: model.glucoseOneTwenty,
          glucoseSix: model.glucoseSix,
          glucoseThree: model.glucoseThree
        },
      insulinMandatory:
        {
          fastingInsulin: model.fastingInsulin,
          insulinOneTwenty: model.insulinOneTwenty,
          insulinSix: model.insulinSix,
          insulinThree: model.insulinThree
        },
      optionalInformation: {
        nefa: model.nefa,
        hdl: model.hdl,
        height: model.height,
        weight: model.weight,
        triglyceride: model.triglyceride,
        thyroglobulin: model.thyroglobulin
      },
      placeholders: {
        glucosePlaceholder,
        insulinPlaceholder
      },
      selectedIndexes: this.indexList,
    };
  }

  sendDataIndexes(data: DataIndexModel): Observable<any> {
    return this.http.post(`${environment.url}/index`, data);
  }
}
