import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataIndexModel} from '../../model/form/data-index.model';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';
import {ChartType} from 'chart.js';
import {IndexResultModel} from '../../model/representation/index-result.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {
  private normalValuesGlucose: number[] = [99, 155, 155, 147, 139];
  private insertedGlucose: number[];
  private normalValuesInsulin: number[] = [8, 60, 60, 50, 40, 70];
  private insertedInsulin: number[];
  public indexData: DataIndexModel;
  public indexResultList: { name: string, index: IndexResultModel }[] = [];
  public optionalDataList: { name: string, value: string }[] = [];
  public mandatoryResponse: string;
  public indexResponse: string;
  // subscriptions
  private passDataSubscription: Subscription;
  private passResponseSubscription: Subscription;
  // placeholders
  public glucosePlaceholder;
  public insulinPlaceholder;
  // Loading
  public isLoadingMandatory = true;
  public isLoadingResponse = true;
  // Sort
  public order: string;
  public type: string;
  private nameOrder = 'Ascending';
  private resultOrder = 'Ascending';
  // Charts
  public glucoseData: ChartDataSets[];
  public insulinData: ChartDataSets[];
  public insulinLabel: Label[] = ['Fasting', 'Insulin 30min', 'Insulin 60min', 'Insulin 90min', 'Insulin 120min'];
  public glucoseLabel: Label[] = ['Fasting', 'Glucose 30min', 'Glucose 60min', 'Glucose 90min', 'Glucose 120min'];
  // Chart configs
  public lineChartOptions = {
    responsive: true,
  };
  public colors: Color[] = [
    {
      borderColor: 'green',
      backgroundColor: 'rgba(151,176,8,0.28)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255, 255, 0, 0.28)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(private insulinService: InsulinIndexesService) {
  }

  ngOnInit(): void {
    this.createDataSubscription();
    this.createResponseSubscription();
  }

  updateNameArgs(): void {
    this.type = 'Name';
    this.order = this.nameOrder;
    this.nameOrder = this.nameOrder === 'Ascending' ? 'Descending' : 'Ascending';
    console.log(this.type, this.order);
  }

  updateResultArgs(): void {
    this.type = 'Result';
    this.order = this.resultOrder;
    this.resultOrder = this.resultOrder === 'Ascending' ? 'Descending' : 'Ascending';
    console.log(this.type, this.order);

  }

  private convertGlucose(): void {
    this.normalValuesGlucose = this.normalValuesGlucose
      .map(v => v * 18);
  }

  private convertInsulin(): void {
    this.normalValuesInsulin = this.normalValuesInsulin
      .map(v => v * 6);
  }

  private prepareDataArrays(): void {
    const glucoseData = this.indexData.glucoseMandatory;
    const insulinData = this.indexData.insulinMandatory;

    const glucoseNine = (glucoseData.glucoseSix + glucoseData.glucoseOneTwenty) / 2;
    const insulinNine = (insulinData.insulinSix + insulinData.insulinOneTwenty) / 2;
    this.insertedGlucose = [glucoseData.fastingGlucose, glucoseData.glucoseThree, glucoseData.glucoseSix,
      glucoseNine, glucoseData.glucoseOneTwenty];
    this.insertedInsulin = [insulinData.fastingInsulin, insulinData.insulinThree, insulinData.insulinSix,
      insulinNine, insulinData.insulinOneTwenty];
    this.populateCharts();
  }

  private populateCharts(): void {
    this.glucoseData = [
      {data: this.normalValuesGlucose, label: 'Normal Values'},
      {data: this.insertedGlucose, label: 'Inserted Values'}
    ];
    this.insulinData = [
      {data: this.normalValuesInsulin, label: 'Normal Values'},
      {data: this.insertedInsulin, label: 'Inserted Values'}
    ];
  }

  private checkPlaceholders(placeholders: { glucosePlaceholder: string, insulinPlaceholder: string }): void {
    this.glucosePlaceholder = placeholders.glucosePlaceholder;
    this.insulinPlaceholder = placeholders.insulinPlaceholder;
    if (this.glucosePlaceholder === 'mmol/L') {
      this.convertGlucose();
    }
    if (this.insulinPlaceholder === 'pmol/L') {
      this.convertInsulin();
    }
  }

  private createDataSubscription(): void {
    this.passDataSubscription = this.insulinService.getDataEvent()
      .subscribe(data => {
        this.indexData = data;
        const glucosePlaceholder = data.glucoseMandatory.glucosePlaceholder;
        const insulinPlaceholder = data.insulinMandatory.insulinPlaceholder;
        this.checkPlaceholders({glucosePlaceholder, insulinPlaceholder});
        this.prepareDataArrays();
        this.prepareOptionalList();
        this.isLoadingMandatory = false;
      });
  }

  private createResponseSubscription(): void {
    this.passResponseSubscription = this.insulinService.getResponseEvent()
      .subscribe(response => {
        this.getMessageResponse(response.result);
        for (const index in response.results) {
          if (response.results.hasOwnProperty(index)) {
            const data = response.results[index];
            this.indexResultList.push({name: index, index: data});
          }
        }
        this.isLoadingResponse = false;
      });
  }

  private getMessageResponse(response: string): void {
    const responseArray = response.split('|');
    this.mandatoryResponse = responseArray[0];
    this.indexResponse = responseArray[1];
  }

  private prepareOptionalList(): void {
    const optionalDataNames = ['weight', 'height', 'nefa', 'thyroglobulin', 'triglyceride', 'hdl'];
    const optionalData = this.indexData.optionalInformation;
    for (const val of optionalDataNames) {
      let result = '-';
      if (optionalData.hasOwnProperty(val) && optionalData[val]) {
        result = optionalData[val];
      }
      this.optionalDataList.push({name: val, value: result});
    }
  }

  ngOnDestroy(): void {
    this.passDataSubscription.unsubscribe();
    this.passResponseSubscription.unsubscribe();
  }

}
