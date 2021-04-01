import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from '../representation/register-basic.model';
import {CompleteUserModel} from '../representation/complete-user.model';

export class ModelUtil {
  static buildUserFromFormValues(form: NgForm, basicUser: RegisterBasicModel): CompleteUserModel {
    const birthDay = `${form.value.birthDay.day}/${form.value.birthDay.month}/${form.value.birthDay.year}`;
    return {
      username: basicUser.username,
      password: basicUser.password,
      email: basicUser.email,
      role: form.value.medic ? 'medic' : 'patient',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNr: form.value.phone,
      gender: form.value.gender,
      birthDay
    };
  }
}
