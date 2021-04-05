import {Injectable} from '@angular/core';

/**
 * State manager for insulin indexes, keeping a list of used indexes.
 * The list is managed only in this service, every other component will
 * get a copy of the array.
 */
@Injectable({providedIn: 'root'})
export class InsulinIndexesService {
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
  }

  removeIndex(index: string): void {
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
}
