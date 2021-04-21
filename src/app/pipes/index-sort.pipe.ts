import {Pipe, PipeTransform} from '@angular/core';
import {IndexSummaryModel} from '../model/representation/summary.model';

@Pipe({
  name: 'sortIndex'
})
export class IndexSortPipe implements PipeTransform {
  transform(value: IndexSummaryModel[], type: string, order: string):
    IndexSummaryModel[] {
    if (type === 'Number') {
      if (order === 'Ascending') {
        value.sort((first, second) => {
          return first.indexNames.length - second.indexNames.length;
        });
      } else {
        value.reverse();
      }
    } else {
      if (order === 'Ascending') {
        value.sort((first, second) => {
          const firstCreation = first.creationDate.split('/');
          const secondCreation = second.creationDate.split('/');

          const firstDate = new Date(+firstCreation[2], +firstCreation[1] - 1, +firstCreation[0]);
          const secondDate = new Date(+secondCreation[2], +secondCreation[1] - 1, +secondCreation[0]);
          return firstDate.getTime() - secondDate.getTime();
        });
      } else {
        value.reverse();
      }
    }
    return value;
  }
}
