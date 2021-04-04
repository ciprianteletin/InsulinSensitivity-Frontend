import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {JsonFormBuilder} from '../../builders/json-form.builder';

@Component({
  selector: 'app-insulin-form',
  templateUrl: './insulin-form.component.html',
  styleUrls: ['./insulin-form.component.css', '../../../assets/styles/utils.css']
})
export class InsulinFormComponent implements OnInit {
  @ViewChild('convert') convertButton: ElementRef;

  userModel: DetailedUserModel;
  // form related items
  form = new FormGroup({});
  model: any = {sex: 'Male'};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[];

  constructor(private route: ActivatedRoute,
              private formBuilder: JsonFormBuilder) {
  }

  ngOnInit(): void {
    this.extractRouteData();
    this.fields = this.formBuilder.getFields(this.userModel);
  }

  private extractRouteData(): void {
    this.route.data.subscribe((data: { detailedUser: DetailedUserModel }) => {
      this.userModel = data.detailedUser;
    });
  }

}
