import {FormlyFieldConfig} from '@ngx-formly/core';
import {DetailedUserModel} from '../representation/detailed-user.model';
import {UtilsService} from '../../services/utils.service';

export class FormModel {
  userInformation: FormlyFieldConfig;
  glucoseInformation: FormlyFieldConfig;
  insulinInformation: FormlyFieldConfig;
  optionalInformation: FormlyFieldConfig;
  placeholderGlucose = 'mg/dl';

  constructor(private utilsService: UtilsService) {
    this.buildGlucose();
    this.buildInsulin();
    this.buildOptional();
  }

  getMandatoryFields(userDetails: DetailedUserModel): FormlyFieldConfig[] {
    this.buildUserInformation(userDetails);
    return [this.userInformation, this.glucoseInformation, this.insulinInformation];
  }

  getOptionalFields(): FormlyFieldConfig {
    return this.optionalInformation;
  }

  addMass(): void {
    const mass: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'weight',
        templateOptions: {
          label: 'Weight',
          placeholder: 'kg'
        },
      };
    this.optionalInformation.fieldGroup.push(mass);
  }

  addHeight(): void {
    const height: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'height',
        templateOptions: {
          label: 'Height',
          placeholder: 'cm'
        },
      };
    this.optionalInformation.fieldGroup.push(height);
  }

  addNefa(): void {
    const nefa: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'nefa',
        templateOptions: {
          label: 'NEFA',
          placeholder: this.placeholderGlucose
        },
      };
    this.optionalInformation.fieldGroup.push(nefa);
  }

  addThyroglobulin(): void {
    const thyroglobulin: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'thyroglobulin',
        templateOptions: {
          label: 'Thyroglobulin',
          placeholder: this.placeholderGlucose
        },
      };
    this.optionalInformation.fieldGroup.push(thyroglobulin);
  }

  addHdl(): void {
    const hdl: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'hdl',
        templateOptions: {
          label: 'HDL',
          placeholder: this.placeholderGlucose
        },
      };
    this.optionalInformation.fieldGroup.push(hdl);
  }

  addTriglyceride(): void {
    const triglyceride: FormlyFieldConfig =
      {
        className: 'col-md-3 text-info',
        type: 'input',
        key: 'triglyceride',
        templateOptions: {
          label: 'Triglyceride',
          placeholder: this.placeholderGlucose
        },
      };
    this.optionalInformation.fieldGroup.push(triglyceride);
  }

  removeOptionalField(key: string): void {
    const index = this.optionalInformation.fieldGroup
      .findIndex(field => field.key === key);
    this.optionalInformation.fieldGroup.splice(index, 1);
  }

  private buildUserInformation(userModel: DetailedUserModel): void {
    let fullName = '';
    let age: number;
    let sex = 'M';

    if (userModel) {
      fullName = userModel.details.firstName + ' ' + userModel.details.lastName;
      age = this.utilsService.convertBirthDayToAge(userModel.details.birthDay);
      sex = userModel.details.gender;
    }

    this.userInformation = {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-md-4 text-info',
          type: 'input',
          key: 'fullName',
          defaultValue: fullName,
          templateOptions: {
            label: 'Full Name',
            placeholder: 'John Doe'
          },
        },
        {
          className: 'col-md-4 text-info',
          type: 'input',
          key: 'age',
          defaultValue: age,
          templateOptions: {
            label: 'Age',
            placeholder: '23'
          },
          validators: {
            validation: ['onlyNumber']
          }
        },
        {
          className: 'col-md-4 text-info',
          type: 'select',
          key: 'gender',
          defaultValue: sex,
          templateOptions: {
            label: 'Gender',
            options: [
              {label: 'Male', value: 'M'},
              {label: 'Female', value: 'F'}
            ]
          }
        }
      ]
    };
  }

  private buildGlucose(): void {
    this.glucoseInformation =
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'fastingGlucose',
            templateOptions: {
              label: 'Fasting Glucose',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseThree',
            templateOptions: {
              label: '30 min glucose',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseSix',
            templateOptions: {
              label: '60 min glucose',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseOneTwenty',
            templateOptions: {
              label: '120 min glucose',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          }
        ]
      };
  }

  private buildInsulin(): void {
    this.insulinInformation =
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'fastingInsulin',
            templateOptions: {
              label: 'Fasting Insulin',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinThree',
            templateOptions: {
              label: '30 min insulin',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinSix',
            templateOptions: {
              label: '60 min insulin',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinOneTwenty',
            templateOptions: {
              label: '120 min insulin',
              placeholder: this.placeholderGlucose
            },
            validators: {
              validation: ['onlyNumber']
            }
          }
        ]
      };
  }

  private buildOptional(): void {
    this.optionalInformation = {
      fieldGroupClassName: 'row',
      fieldGroup: []
    };
  }
}
