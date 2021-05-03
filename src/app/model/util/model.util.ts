import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from '../representation/register-basic.model';
import {CompleteUserModel} from '../representation/complete-user.model';

export class ModelUtil {
  static buildUserFromFormValues(form: NgForm, basicUser: RegisterBasicModel): CompleteUserModel {
    const birthDay = this.buildBirthDay(form);
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

  private static buildBirthDay(form: NgForm): string {
    let birthday: string;
    if (form.value.birthDay.day <= 9) {
      birthday = `0${form.value.birthDay.day}/`;
    } else {
      birthday = `${form.value.birthDay.day}/`;
    }

    if (form.value.birthDay.month <= 9) {
      birthday += `0${form.value.birthDay.month}/`;
    } else {
      birthday += `${form.value.birthDay.month}/`;
    }

    birthday += `${form.value.birthDay.year}`;
    return birthday;
  }
}
