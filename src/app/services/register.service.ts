import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from '../model/register-basic.model';
import {CompleteUserModel} from '../model/complete-user.model';

@Injectable({providedIn: 'root'})
export class RegisterService {
  buildUserFromFormValues(form: NgForm, basicUser: RegisterBasicModel): CompleteUserModel {
    return {
      username: basicUser.username,
      password: basicUser.password,
      email: basicUser.email,
      role: form.value.medic ? 'medic' : 'patient',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      gender: form.value.gender,
      age: +form.value.age
    };
  }
}
