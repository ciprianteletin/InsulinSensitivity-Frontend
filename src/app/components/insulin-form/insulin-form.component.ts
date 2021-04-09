import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {JsonFormBuilder} from '../../builders/json-form.builder';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Subscription} from 'rxjs';
import {InsulinConverter} from '../../converters/insulin.converter';

@Component({
  selector: 'app-insulin-form',
  templateUrl: './insulin-form.component.html',
  styleUrls: ['./insulin-form.component.css', '../../../assets/styles/utils.css']
})
export class InsulinFormComponent implements OnInit, OnDestroy {
  @ViewChild('convert') convertButton: ElementRef;

  userModel: DetailedUserModel;
  // form related items
  form = new FormGroup({});
  model: any = {sex: 'Male'};
  options: FormlyFormOptions = {};
  // subscriptions
  private addSubscription: Subscription;
  private removeSubscription: Subscription;
  private resetFormSubscription: Subscription;
  // placeholders
  placeholderGlucose = 'mg/dL'; // alternative mmol/L
  placeholderInsulin = 'μIU/mL'; // alternative pmol/L
  alternatePlaceholderGlucose = 'mmol/L';
  alternatePlaceholderInsulin = 'pmol/L';
  // converter
  private insulinConverter: InsulinConverter;

  fields: FormlyFieldConfig[];

  constructor(private route: ActivatedRoute,
              private formBuilder: JsonFormBuilder,
              private insulinService: InsulinIndexesService) {
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

  onConvertPmouUI(): void {
    this.formBuilder.updateInsulinPlaceholder();
    this.updateInsulinPlaceholder();
    this.model = this.insulinConverter.convertUiAndPmol(this.model, this.alternatePlaceholderInsulin);
  }

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

  private createSubscriptions(): void {
    this.addSubscription = this.insulinService.getAddEvent()
      .subscribe(index => this.formBuilder.addIndexIfNotExistent(index));
    this.removeSubscription = this.insulinService.getRemoveEvent()
      .subscribe(index => this.formBuilder.removeFieldsIfNeeded(index));
    this.resetFormSubscription = this.formBuilder.getRefreshObject()
      .subscribe(fields => this.fields = fields);
  }

  /**
   * Once the component is destroyed (we go to another page),
   * we clear the list of indices, by resetting it.
   */
  ngOnDestroy(): void {
    this.insulinService.clearList();
    this.addSubscription.unsubscribe();
    this.removeSubscription.unsubscribe();
    this.resetFormSubscription.unsubscribe();
    this.formBuilder.clearData();
  }

}
