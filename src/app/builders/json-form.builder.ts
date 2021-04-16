import {Injectable} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {UtilsService} from '../services/utils.service';
import {FormModel} from '../model/form/form.model';
import {DetailedUserModel} from '../model/representation/detailed-user.model';
import {Subject} from 'rxjs';

/**
 * Service to build the form based on what indices the user picks. Append only the needed input,
 * so that the user is not confused about what he has to input.
 */
@Injectable({providedIn: 'root'})
export class JsonFormBuilder {
  private refreshFormEvent = new Subject<FormlyFieldConfig[]>();
  fields: FormlyFieldConfig[] = [];
  currentIndexes: string[];
  formModule: FormModel;
  existentFields = new Set();
  indexMap = {
    cederholm: ['weight'],
    gutt: ['weight'],
    revised: ['nefa'],
    spise: ['thyroglobulin', 'hdl'],
    stumvoll: ['weight', 'height'],
    mcauley: ['triglyceride'],
    ogis: ['weight', 'height']
  };
  functionMap: any;

  constructor(private utilsService: UtilsService) {
    this.formModule = new FormModel(utilsService);
    this.buildFunctionMap();
  }

  /**
   * Deep copy of the object so that the original form does not crash when
   * trying to modify the object dynamically.
   */
  getFields(userDetails: DetailedUserModel, indexes: string[]): FormlyFieldConfig[] {
    this.fields = this.formModule.getMandatoryFields(userDetails);
    this.currentIndexes = indexes;
    this.buildOptionalFields(indexes);
    this.fields.push(this.formModule.getOptionalFields());
    return JSON.parse(JSON.stringify(this.fields));
  }

  getRefreshObject(): Subject<FormlyFieldConfig[]> {
    return this.refreshFormEvent;
  }

  /**
   * Clear all optional information when leaving the component, so that it can be build dynamically next time
   * when we visit the page.
   */
  clearData(): void {
    this.existentFields.clear();
    this.currentIndexes = [];
    const optionals = this.formModule.getOptionalFields();
    const index = this.fields.findIndex(fieldConfig => fieldConfig === optionals);
    this.fields.splice(index, 1);
    this.formModule.resetOptions();
  }

  addIndexIfNotExistent(index: string): void {
    this.currentIndexes.push(index);
    const fields = this.indexMap[index];
    if (fields) {
      fields.forEach(field => this.checkField(field));
      this.refreshFormEvent.next(JSON.parse(JSON.stringify(this.fields)));
    }
  }

  removeFieldsIfNeeded(index: string): void {
    const poz = this.currentIndexes.findIndex(item => item === index);
    this.currentIndexes.splice(poz, 1);
    if (!this.indexMap[index]) {
      return;
    }
    const flattenedFields = this.currentIndexes
      .map(ind => this.indexMap[ind])
      .flat();
    for (const ind of this.indexMap[index]) {
      if (!flattenedFields.includes(ind)) {
        this.formModule.removeOptionalField(ind);
        this.existentFields.delete(ind);
      }
    }
    this.refreshFormEvent.next(JSON.parse(JSON.stringify(this.fields)));
  }

  updateGlucosePlaceholder(): void {
    this.formModule.updateGlucosePlaceholder();
  }

  updateInsulinPlaceholder(): void {
    this.formModule.updateInsulinPlaceholder();
  }

  private buildFunctionMap(): void {
    this.functionMap = {
      weight: this.formModule.addMass.bind(this.formModule),
      height: this.formModule.addHeight.bind(this.formModule),
      nefa: this.formModule.addNefa.bind(this.formModule),
      thyroglobulin: this.formModule.addThyroglobulin.bind(this.formModule),
      hdl: this.formModule.addHdl.bind(this.formModule),
      triglyceride: this.formModule.addTriglyceride.bind(this.formModule)
    };
  }

  private buildOptionalFields(indexes: string[]): void {
    indexes.map(index => this.indexMap[index])
      .flat()
      .filter(index => index !== undefined)
      .forEach(field => this.checkField(field));
  }

  private checkField(field: string): void {
    if (!this.existentFields.has(field)) {
      this.existentFields.add(field);
      this.functionMap[field]();
    }
  }
}
