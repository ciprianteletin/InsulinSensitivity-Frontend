import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from './register-basic.model';
import {CompleteUserModel} from './complete-user.model';

export class ModelUtil {
  static buildUserFromFormValues(form: NgForm, basicUser: RegisterBasicModel): CompleteUserModel {
    return {
      username: basicUser.username,
      password: basicUser.password,
      email: basicUser.email,
      role: form.value.medic ? 'medic' : 'patient',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNr: form.value.phone,
      gender: form.value.gender,
      age: +form.value.age
    };
  }
}