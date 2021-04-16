import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataIndexModel} from '../../model/form/data-index.model';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';
import {ChartType} from 'chart.js';

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
  private passDataSubscription: Subscription;
  private indexData: DataIndexModel;
  // placeholders
  public glucosePlaceholder;
  public insulinPlaceholder;
  // Loading
  public isLoading = true;
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
    this.passDataSubscription = this.insulinService.getDataEvent()
      .subscribe(data => {
        this.indexData = data;
        const glucosePlaceholder = data.glucoseMandatory.glucosePlaceholder;
        const insulinPlaceholder = data.insulinMandatory.insulinPlaceholder;
        this.checkPlaceholders({glucosePlaceholder, insulinPlaceholder});
        this.prepareDataArrays();
        this.isLoading = false;
      });
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

  ngOnDestroy(): void {
    this.passDataSubscription.unsubscribe();
  }

}
