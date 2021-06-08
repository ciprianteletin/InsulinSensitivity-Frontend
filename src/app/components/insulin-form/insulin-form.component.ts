import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {JsonFormBuilder} from '../../builders/json-form.builder';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Observable, Subscription} from 'rxjs';
import {InsulinConverter} from '../../converters/insulin.converter';
import {DataIndexModel} from '../../model/form/data-index.model';
import {CanLeave} from '../../guards/utils/can.leave';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ModalManagerService} from '../../services/modal-manager.service';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../../constants/notification-type.enum';
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-insulin-form',
  templateUrl: './insulin-form.component.html',
  styleUrls: ['./insulin-form.component.css', '../../../assets/styles/utils.css']
})
export class InsulinFormComponent implements OnInit, OnDestroy, CanLeave {
  userModel: DetailedUserModel;
  // form related items
  form = new FormGroup({});
  model: any = {gender: 'M'};
  options: FormlyFormOptions = {};
  // subscriptions
  private mainSubscription = new Subscription();
  private addSubscription: Subscription;
  private removeSubscription: Subscription;
  private resetFormSubscription: Subscription;
  private calculateIndexSubscription: Subscription;
  // placeholders
  placeholderGlucose = 'mg/dL'; // alternative mmol/L
  placeholderInsulin = 'μIU/mL'; // alternative pmol/L
  alternatePlaceholderGlucose = 'mmol/L';
  alternatePlaceholderInsulin = 'pmol/L';
  // converter
  private insulinConverter: InsulinConverter;
  // submitted
  private isSubmitted = false;

  fields: FormlyFieldConfig[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private headerService: HeaderService,
              private formBuilder: JsonFormBuilder,
              private insulinService: InsulinIndexesService,
              private modalManager: ModalManagerService,
              private notificationService: NotificationService) {
    this.insulinConverter = new InsulinConverter();
  }

  ngOnInit(): void {
    this.extractRouteData();
    this.fields = this.formBuilder.getFields(this.userModel, this.insulinService.getIndexList());
    this.createSubscriptions();
  }

  private extractRouteData(): void {
    this.route.data.subscribe((data: { detailedUser: DetailedUserModel }) => {
      this.userModel = data.detailedUser;
    });
  }

  onConvertMgMmol(): void {
    this.formBuilder.updateGlucosePlaceholder(); // update for new fields
    this.updateGlucosePlaceholder();
    this.model = this.insulinConverter.convertMgAndMmol(this.model, this.alternatePlaceholderGlucose);
  }

  onConvertPmoluUI(): void {
    this.formBuilder.updateInsulinPlaceholder(); // update for new fields
    this.updateInsulinPlaceholder();
    this.model = this.insulinConverter.convertUiAndPmol(this.model, this.alternatePlaceholderInsulin);
  }

  onSubmitData(): void {
    if (!this.form.valid) {
      this.notificationService.notify(NotificationType.ERROR, 'Form invalid! Please fill all fields!');
      return;
    }
    if (this.insulinService.isEmptyList()) {
      this.notificationService.notify(NotificationType.WARNING, 'Select at least one index!');
      return;
    }
    this.isSubmitted = true;
    this.checkForAdditionalIndex();
    const username: string = this.userModel !== null ? this.userModel.username : null;
    const data: DataIndexModel = this.insulinService
      .buildDataModel(this.model, this.placeholderGlucose, this.placeholderInsulin);
    this.insulinService.sendDataIndexes(data, username)
      .subscribe((response) => {
        this.insulinService.emitResponse(response);
        this.router.navigate(['results']);
      });
    this.insulinService.emitNewData(data);
  }

  /**
   * Method used for updating the glucose placeholder. It's purely searching
   * for the same placeholder in the input list and converts it to the selected
   * format.
   */
  private updateGlucosePlaceholder(): void {
    this.alternatePlaceholderGlucose = this.placeholderGlucose;
    this.placeholderGlucose = this.placeholderGlucose === 'mg/dL' ? 'mmol/L' : 'mg/dL';
    for (const fieldConfig of this.fields) {
      fieldConfig.fieldGroup
        .filter(field => {
          const placeholder = field.templateOptions.placeholder;
          return placeholder === 'mg/dL' || placeholder === 'mmol/L';
        })
        .forEach(field => {
          field.templateOptions.placeholder = this.placeholderGlucose;
        });
    }
  }

  /**
   * Method used for updating the insulin placeholder. It's purely searching
   * for the same placeholder in the input list and converts it to the selected
   * format.
   */
  private updateInsulinPlaceholder(): void {
    this.alternatePlaceholderInsulin = this.placeholderInsulin;
    this.placeholderInsulin = this.placeholderInsulin === 'μIU/mL' ? 'pmol/L' : 'μIU/mL';
    for (const fieldConfig of this.fields) {
      fieldConfig.fieldGroup
        .filter(field => {
          const placeholder = field.templateOptions.placeholder;
          return placeholder === 'μIU/mL' || placeholder === 'pmol/L';
        })
        .forEach(field => {
          field.templateOptions.placeholder = this.placeholderInsulin;
        });
    }
  }

  /**
   * Method where all subscriptions are created, giving an easy way for
   * maintaining all of them.
   */
  private createSubscriptions(): void {
    this.addSubscription = this.insulinService.getAddEvent()
      .subscribe(index => this.formBuilder.addIndexIfNotExistent(index));
    this.removeSubscription = this.insulinService.getRemoveEvent()
      .subscribe(index => this.formBuilder.removeFieldsIfNeeded(index));
    this.resetFormSubscription = this.formBuilder.getRefreshObject()
      .subscribe(fields => this.fields = fields);
    this.calculateIndexSubscription = this.headerService.getCalculateIndexEvent()
      .subscribe(() => this.fields = this.formBuilder.getFields(this.userModel, this.insulinService.getIndexList()));
    this.addSubscriptions();
  }

  /**
   * Method to add all variations of HOMA and Stumvoll, as both of them have multiple variation.
   * If the index was not selected, no variation will be added.
   */
  private checkForAdditionalIndex(): void {
    this.insulinService.checkStumvoll();
    this.insulinService.checkHoma();
  }

  private addSubscriptions(): void {
    this.mainSubscription.add(this.addSubscription);
    this.mainSubscription.add(this.removeSubscription);
    this.mainSubscription.add(this.resetFormSubscription);
    this.mainSubscription.add(this.calculateIndexSubscription);
  }

  private isFormEmpty(): boolean {
    if (this.isSubmitted) {
      return true;
    }
    let flag = true;
    for (const key in this.form.value) {
      if (this.form.value.hasOwnProperty(key) && this.checkKey(key) && this.form.value[key]) {
        flag = false;
      }
    }
    return flag;
  }

  private checkKey(key: string): boolean {
    if (this.userModel === null) {
      return key !== 'gender';
    }
    return key !== 'gender' && key !== 'fullName' && key !== 'age';
  }

  /**
   * Once the component is destroyed (we go to another page),
   * we clear the list of indices, by resetting it.
   */
  ngOnDestroy(): void {
    this.insulinService.clearList();
    this.mainSubscription.unsubscribe();
    this.formBuilder.clearData();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isFormEmpty() && !this.isSubmitted) {
      this.modalManager.openConfirmModal(ConfirmModalComponent,
        'Are you sure you want to leave the index calculator?',
        'All data will be lost!');
      return this.modalManager.getConfirmResult();
    }
    return true;
  }
}
