import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {InsulinConverter} from '../../converters/insulin.converter';
import {Observable, Subscription} from 'rxjs';
import {MlService} from '../../services/ml.service';
import {ActivatedRoute} from '@angular/router';
import {ModalManagerService} from '../../services/modal-manager.service';
import {UtilsService} from '../../services/utils.service';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {CanLeave} from '../../guards/utils/can.leave';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-predict-evolution',
  templateUrl: './predict-evolution.component.html',
  styleUrls: ['./predict-evolution.component.css',
    '../../../assets/styles/predict.css',
    '../../../assets/styles/utils.css',
    '../../../assets/styles/forms.css']
})
export class PredictEvolutionComponent implements OnInit, OnDestroy, CanLeave {
  @ViewChild('evol') evolutionForm: NgForm;
  placeholderGlucose = 'mg/dL';
  alternatePlaceholderGlucose = 'mmol/L';
  resultText = '';
  numericResult: number;
  age: number = undefined;
  gender = 'M';
  category: number;
  userModel: DetailedUserModel;

  private isSubmitted = false;
  private insulinConverter: InsulinConverter;
  private regressionSubscription: Subscription = new Subscription();

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
      ...this.evolutionForm.value
    };

    this.mlService.sendToRegression(json)
      .subscribe((response) => {
        this.numericResult = +response.result;
        this.category = +response.category;

        switch (this.category) {
          case 0:
            this.resultText = ' - Well done! The disease is under control!';
            break;
          case 1:
            this.resultText = ' - Pay attention to your diet and way of life!';
            break;
          case 2:
            this.resultText = ' - Please consult a doctor as fast as possible!';
            break;
          default:
            this.resultText = '';
            break;
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
    (this.evolutionForm.value.glucose, this.placeholderGlucose);
    const cholesterol = this.insulinConverter.checkEmptyConvertCholesterol
    (this.evolutionForm.value.cholesterol, this.placeholderGlucose);
    const hdl = this.insulinConverter.checkEmptyConvertCholesterol
    (this.evolutionForm.value.hdl, this.placeholderGlucose);
    const ldl = this.insulinConverter.checkEmptyConvertCholesterol
    (this.evolutionForm.value.ldl, this.placeholderGlucose);
    const ltg = this.insulinConverter.checkEmptyConvertTriglycerides
    (this.evolutionForm.value.ltg, this.placeholderGlucose);

    this.evolutionForm.control.patchValue({
      glucose,
      cholesterol,
      hdl,
      ldl,
      ltg
    });
  }

  private isFormEmpty(): boolean {
    if (this.isSubmitted) {
      return true;
    }
    let flag = true;
    for (const key in this.evolutionForm.value) {
      if (this.evolutionForm.value.hasOwnProperty(key) && this.checkKey(key) && this.evolutionForm.value[key]) {
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
        'Are you sure you want to leave the diabetes evolution predictor?',
        'All data will be lost!');
      return this.modalManager.getConfirmResult();
    }
    return true;
  }

  ngOnDestroy(): void {
    this.regressionSubscription.unsubscribe();
  }
}
