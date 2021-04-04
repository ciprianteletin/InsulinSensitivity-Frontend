import {FormlyFieldConfig} from '@ngx-formly/core';
import {DetailedUserModel} from '../representation/detailed-user.model';
import {UtilsService} from '../../services/utils.service';

export class FormModel {
  userInformation: FormlyFieldConfig;
  glucoseInformation: FormlyFieldConfig;
  insulinInformation: FormlyFieldConfig;
  placeholder = 'mg/dl';

  constructor(private utilsService: UtilsService) {
    this.buildGlucose();
    this.buildInsulin();
  }

  private buildUserInformation(userModel: DetailedUserModel): void {
    let fullName = '';
    let age: number;
    let sex = 'Male';

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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
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
              placeholder: this.placeholder
            },
            validators: {
              validation: ['onlyNumber']
            }
          }
        ]
      };
  }

  getMandatoryFields(userDetails: DetailedUserModel): FormlyFieldConfig[] {
    this.buildUserInformation(userDetails);
    return [this.userInformation, this.glucoseInformation, this.insulinInformation];
  }
}
