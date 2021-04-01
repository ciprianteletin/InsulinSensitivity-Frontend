import {UtilsService} from '../services/utils.service';
import {CustomFormMap} from '../model/representation/custom-form-map.model';
import {Injectable} from '@angular/core';

/**
 * Utility class used only by settings component. This is where methods that are not suited to be
 * created in the component/service are defined and used. Observe that this is not Injectable in root,
 * so that it can be defined as a 'singleton' instance only for Settings component.
 */
@Injectable()
export class SettingUtils {
  constructor(private utilService: UtilsService) {
  }

  public resetFormOrElse(property: string, formMap: CustomFormMap): void {
    if (formMap.hasOwnProperty(property)) {
      formMap[property].resetForm();
      return;
    }
    this.utilService.onResetDate();
  }

  public checkValidForm(property: string, formMap: CustomFormMap): boolean {
    if (formMap.hasOwnProperty(property)) {
      return formMap[property].valid;
    }
    return true;
  }
}
