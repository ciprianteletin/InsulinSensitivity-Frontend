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
  return `${field.formControl.value} is not a number!`;
}

/**
 * Service to build the form based on what indices the user picks. Append only the needed input,
 * so that the user is not confused about what he has to input.
 */
@Injectable({providedIn: 'root'})
export class JsonFormBuilder {
  fields: FormlyFieldConfig[] = [];
  formModule: FormModel;

  constructor(private utilsService: UtilsService) {
    this.formModule = new FormModel(utilsService);
  }

  getFields(userDetails: DetailedUserModel): FormlyFieldConfig[] {
    return this.formModule.getMandatoryFields(userDetails);
  }
}
