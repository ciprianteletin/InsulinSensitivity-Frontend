import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {InsulinConverter} from '../../converters/insulin.converter';
import {Subscription} from 'rxjs';
import {MlService} from '../../services/ml.service';

@Component({
  selector: 'app-predict-diabetes',
  templateUrl: './predict-diabetes.component.html',
  styleUrls: ['./predict-diabetes.component.css',
    '../../../assets/styles/utils.css',
    '../../../assets/styles/forms.css']
})
export class PredictDiabetesComponent implements OnInit, OnDestroy {

  @ViewChild('classif') classifForm: NgForm;
  placeholderGlucose = 'mg/dL';
  alternatePlaceholderGlucose = 'mmol/L';
  insulinConverter: InsulinConverter;
  resultText = '';
  numericResult: number;
  percentage: number;
  classifierSubscription: Subscription = new Subscription();

  constructor(private mlService: MlService) {
    this.insulinConverter = new InsulinConverter();
  }

  ngOnInit(): void {
  }

  onSubmitClassification(): void {
    const json = {
      placeholder: this.placeholderGlucose,
      ...this.classifForm.value
    };
    this.classifierSubscription = this.mlService.sendToClassification(json)
      .subscribe((response) => {
        this.numericResult = Number(response.result);

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
    const cholesterol = this.insulinConverter.checkEmptyConvertGlucose
    (this.classifForm.value.cholesterol, this.placeholderGlucose);
    const HDL = this.insulinConverter.checkEmptyConvertGlucose
    (this.classifForm.value.HDL, this.placeholderGlucose);

    this.classifForm.control.patchValue({
      glucose,
      cholesterol,
      HDL
    });
  }

  ngOnDestroy(): void {
    this.classifierSubscription.unsubscribe();
  }
}
