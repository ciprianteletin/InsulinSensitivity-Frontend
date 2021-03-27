import {NgbDateParserFormatter, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';

function padNumber(value: number | null): string {
  if (!isNaN(value) && value !== null) {
    return `0${value}`.slice(-2);
  }
  return '';
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${padNumber(date.day)}/${padNumber(date.month)}/${date.year || ''}` :
      '';
  }

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      const dateObj: NgbDateStruct = {day: null, month: null, year: null};
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || null;
      });
      return dateObj;
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}
