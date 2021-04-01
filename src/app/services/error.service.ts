import {Injectable} from '@angular/core';
import {GenericResponseModel} from '../model/representation/generic-response.model';
import {Subject} from 'rxjs';

/**
 * Service responsible to store errorSubject variable and other related error methods.
 */
@Injectable({providedIn: 'root'})
export class ErrorService {
  errorSubject = new Subject<GenericResponseModel>();

  emitValue(response: GenericResponseModel): void {
    this.errorSubject.next(response);
  }

  getErrorSubject(): Subject<GenericResponseModel> {
    return this.errorSubject;
  }

  buildPlaceholderResponse(): GenericResponseModel {
    return {
      httpStatusCode: 500,
      httpStatus: 'Placeholder',
      reason: 'The actual error message is loading... wait for the response',
      message: 'Fill in until the info is ready',
      timeStamp: '2021',
    };
  }
}
