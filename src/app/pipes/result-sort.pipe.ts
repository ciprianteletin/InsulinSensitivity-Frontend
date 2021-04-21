import {Pipe, PipeTransform} from '@angular/core';
import {IndexResultModel} from '../model/representation/index-result.model';

@Pipe({
  name: 'sortResult'
})
export class ResultSortPipe implements PipeTransform {
  transform(value: { name: string, index: IndexResultModel }[], type: string, order: string):
    { name: string, index: IndexResultModel }[] {
    if (type === 'Name') {
      if (order === 'Ascending') {
        value.sort((first, second) => {
          return first.name.localeCompare(second.name);
        });
      } else {
        value.reverse();
      }
    } else {
      if (order === 'Ascending') {
        value.sort((first, second) => {
          return first.index.result - second.index.result;
        });
      } else {
        value.reverse();
      }
    }
    return value;
  }
}
