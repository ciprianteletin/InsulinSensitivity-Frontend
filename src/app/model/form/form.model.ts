import {FormlyFieldConfig} from '@ngx-formly/core';
import {DetailedUserModel} from '../representation/detailed-user.model';
import {UtilsService} from '../../services/utils.service';

export class FormModel {
  userInformation: FormlyFieldConfig;
  glucoseInformation: FormlyFieldConfig;
  insulinInformation: FormlyFieldConfig;
  optionalInformation: FormlyFieldConfig;
  private placeholderGlucose = 'mg/dL'; // alternative mmol/L
  private placeholderInsulin = 'μIU/mL'; // alternative pmol/L
  private placeholderThyroglobulin = 'ng/mL or μg/L';

  constructor(private utilsService: UtilsService) {
    this.buildGlucose();
    this.buildInsulin();
    this.resetOptions();
  }

  updateGlucosePlaceholder(): void {
    this.placeholderGlucose = this.placeholderGlucose === 'mg/dL' ? 'mmol/L' : 'mg/dL';
  }

  updateInsulinPlaceholder(): void {
    this.placeholderInsulin = this.placeholderInsulin === 'μIU/mL' ? 'pmol/L' : 'μIU/mL';
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
          placeholder: 'kg',
          required: true
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
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
          placeholder: 'cm',
          required: true
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
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
          required: true,
          placeholder: this.placeholderGlucose
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
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
          required: true,
          placeholder: this.placeholderThyroglobulin
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
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
          required: true,
          placeholder: this.placeholderGlucose
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
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
          required: true,
          placeholder: this.placeholderGlucose
        },
        validators: {
          validation: ['onlyNumber', 'isPositive']
        }
      };
    this.optionalInformation.fieldGroup.push(triglyceride);
  }

  removeOptionalField(key: string): void {
    const index = this.optionalInformation.fieldGroup
      .findIndex(field => field.key === key);
    this.optionalInformation.fieldGroup.splice(index, 1);
  }

  resetOptions(): void {
    this.optionalInformation = {
      fieldGroupClassName: 'row',
      fieldGroup: []
    };
  }

  private buildUserInformation(userModel: DetailedUserModel): void {
    let fullName = '';
    let age: number;
    let gender = 'M';

    if (userModel) {
      fullName = userModel.details.firstName + ' ' + userModel.details.lastName;
      age = this.utilsService.convertBirthDayToAge(userModel.details.birthDay);
      gender = userModel.details.gender;
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
            placeholder: 'John Doe',
            required: true
          },
        },
        {
          className: 'col-md-4 text-info',
          type: 'input',
          key: 'age',
          defaultValue: age,
          templateOptions: {
            label: 'Age',
            placeholder: '23',
            required: true
          },
          validators: {
            validation: ['onlyNumber', 'isPositive']
          }
        },
        {
          className: 'col-md-4 text-info',
          type: 'select',
          key: 'gender',
          defaultValue: gender,
          templateOptions: {
            label: 'Gender',
            required: true,
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
              placeholder: this.placeholderGlucose,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseThree',
            templateOptions: {
              label: '30 min glucose',
              placeholder: this.placeholderGlucose,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseSix',
            templateOptions: {
              label: '60 min glucose',
              placeholder: this.placeholderGlucose,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'glucoseOneTwenty',
            templateOptions: {
              label: '120 min glucose',
              placeholder: this.placeholderGlucose,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
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
              placeholder: this.placeholderInsulin,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinThree',
            templateOptions: {
              label: '30 min insulin',
              placeholder: this.placeholderInsulin,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinSix',
            templateOptions: {
              label: '60 min insulin',
              placeholder: this.placeholderInsulin,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          },
          {
            className: 'col-md-3 text-info',
            type: 'input',
            key: 'insulinOneTwenty',
            templateOptions: {
              label: '120 min insulin',
              placeholder: this.placeholderInsulin,
              required: true
            },
            validators: {
              validation: ['onlyNumber', 'isPositive']
            }
          }
        ]
      };
  }
}
