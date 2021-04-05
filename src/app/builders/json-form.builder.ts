import {Injectable} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {UtilsService} from '../services/utils.service';
import {FormModel} from '../model/form/form.model';
import {DetailedUserModel} from '../model/representation/detailed-user.model';

export function isNumber(control: FormControl): ValidationErrors {
  return control.value && /^\d+$/.test(control.value) ? null : {onlyNumber: true};
}

export function numberMessage(err, field: FormlyFieldConfig): string {
  return field.formControl.value === '' ? 'empty field not allowed!' :
    `${field.formControl.value} is not a number!`;
}

/**
 * Service to build the form based on what indices the user picks. Append only the needed input,
 * so that the user is not confused about what he has to input.
 */
@Injectable({providedIn: 'root'})
export class JsonFormBuilder {
  fields: FormlyFieldConfig[] = [];
  currentIndexes: string[];
  formModule: FormModel;
  existentFields = new Set();
  indexMap = {
    cederholm: ['weight'],
    gutt: ['weight'],
    revisedQuicki: ['nefa'],
    spise: ['thyroglobulin', 'hdl'],
    mcAuley: ['triglyceride'],
    ogis: ['weight', 'height']
  };
  functionMap: any;

  constructor(private utilsService: UtilsService) {
    this.formModule = new FormModel(utilsService);
    this.buildFunctionMap();
  }

  getFields(userDetails: DetailedUserModel, indexes: string[]): FormlyFieldConfig[] {
    this.fields = this.formModule.getMandatoryFields(userDetails);
    this.buildOptionalFields(indexes);
    this.fields.push(this.formModule.getOptionalFields());
    return this.fields;
  }

  private buildFunctionMap(): void {
    this.functionMap = {
      weight: this.formModule.addMass,
      height: this.formModule.addHeight,
      nefa: this.formModule.addNefa,
      thyroglobulin: this.formModule.addThyroglobulin,
      hdl: this.formModule.addHdl,
      triglyceride: this.formModule.addTriglyceride
    };
  }

  private buildOptionalFields(indexes: string[]): void {
    indexes.map(index => this.indexMap[index])
      .flat()
      .forEach(field => {
        if (!this.existentFields.has(field)) {
          this.existentFields.add(field);
          this.functionMap[field]();
        }
      });
  }
}
