import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {JsonFormBuilder} from '../../builders/json-form.builder';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Subscription} from 'rxjs';

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

  fields: FormlyFieldConfig[];

  constructor(private route: ActivatedRoute,
              private formBuilder: JsonFormBuilder,
              private insulinService: InsulinIndexesService) {
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
