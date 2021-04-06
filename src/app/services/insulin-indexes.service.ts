import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * State manager for insulin indexes, keeping a list of used indexes.
 * The list is managed only in this service, every other component will
 * get a copy of the array.
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

  constructor() {
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
}
