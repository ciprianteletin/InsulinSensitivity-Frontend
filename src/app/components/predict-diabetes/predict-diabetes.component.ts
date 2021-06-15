import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {InsulinConverter} from '../../converters/insulin.converter';
import {Observable, Subscription} from 'rxjs';
import {MlService} from '../../services/ml.service';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {CanLeave} from '../../guards/utils/can.leave';
import {ModalManagerService} from '../../services/modal-manager.service';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-predict-diabetes',
  templateUrl: './predict-diabetes.component.html',
  styleUrls: ['./predict-diabetes.component.css',
    '../../../assets/styles/predict.css',
    '../../../assets/styles/utils.css',
    '../../../assets/styles/forms.css']
})
export class PredictDiabetesComponent implements OnInit, OnDestroy, CanLeave {

  @ViewChild('classif') classifForm: NgForm;
  placeholderGlucose = 'mg/dL';
  alternatePlaceholderGlucose = 'mmol/L';
  resultText = '';
  userModel: DetailedUserModel;
  gender = 'M';
  age: number = undefined;
  numericResult: number;
  percentage: number;

  private insulinConverter: InsulinConverter;
  private isSubmitted = false;
  private classifierSubscription: Subscription = new Subscription();

  constructor(private mlService: MlService,
              private route: ActivatedRoute,
              private modalManager: ModalManagerService,
              private utilsService: UtilsService) {
    this.insulinConverter = new InsulinConverter();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { detailedUser: DetailedUserModel }) => {
      this.userModel = data.detailedUser;
      this.age = this.utilsService.convertBirthDayToAge(this.userModel.details.birthDay);
      this.gender = this.userModel.details.gender;
    });
  }

  onSubmitClassification(): void {
    const json = {
      placeholder: this.placeholderGlucose,
      ...this.classifForm.value
    };
    this.classifierSubscription = this.mlService.sendToClassification(json)
      .subscribe((response) => {
        this.isSubmitted = true;
        this.numericResult = +response.result;

        if (this.numericResult === 1) {
          this.resultText = `You have a probability of ${response.probability} to be diabetic!`;
        } else {
          this.resultText = 'The model predicted that you are healthy!';
        }
      });
  }

  onConvertMgMmol(): void {
    this.convertFormValues();
    if (this.placeholderGlucose === 'mg/dL') {
      this.placeholderGlucose = 'mmol/L';
      this.alternatePlaceholderGlucose = 'mg/dL';
    } else {
      this.placeholderGlucose = 'mg/dL';
      this.alternatePlaceholderGlucose = 'mmol/L';
    }
  }

  private convertFormValues(): void {
    const glucose = this.insulinConverter.checkEmptyConvertGlucose
    (this.classifForm.value.glucose, this.placeholderGlucose);
    const cholesterol = this.insulinConverter.checkEmptyConvertCholesterol
    (this.classifForm.value.cholesterol, this.placeholderGlucose);
    const hdl = this.insulinConverter.checkEmptyConvertCholesterol
    (this.classifForm.value.hdl, this.placeholderGlucose);

    this.classifForm.control.patchValue({
      glucose,
      cholesterol,
      hdl
    });
  }

  private isFormEmpty(): boolean {
    if (this.isSubmitted) {
      return true;
    }
    let flag = true;
    for (const key in this.classifForm.value) {
      if (this.classifForm.value.hasOwnProperty(key) && this.checkKey(key) && this.classifForm.value[key]) {
        flag = false;
      }
    }
    return flag;
  }

  private checkKey(key: string): boolean {
    if (this.userModel === null) {
      return key !== 'gender';
    }
    return key !== 'gender' && key !== 'age';
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isFormEmpty() && !this.isSubmitted) {
      this.modalManager.openConfirmModal(ConfirmModalComponent,
        'Are you sure you want to leave the diabetes predictor?',
        'All data will be lost!');
      return this.modalManager.getConfirmResult();
    }
    return true;
  }

  ngOnDestroy(): void {
    this.classifierSubscription.unsubscribe();
  }
}
