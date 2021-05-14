import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DetailedUserModel} from '../../model/representation/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../constants/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  @ViewChild('contact') contactForm: NgForm;
  @ViewChild('sendMessage1') message1: ElementRef;
  @ViewChild('sendMessage2') message2: ElementRef;

  userModel: DetailedUserModel;
  fullName = '';
  email = '';
  phone = '';

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.extractRouteData();
  }

  onSubmitForm(): void {
    this.http.post(`${environment.url}/contact`, this.contactForm.value)
      .subscribe(() => {
        this.renderer.removeClass(this.message1.nativeElement, 'hidden');
        this.renderer.removeClass(this.message2.nativeElement, 'hidden');
      });
  }

  private extractRouteData(): void {
    this.route.data.subscribe((data: { detailedUser: DetailedUserModel }) => {
      if (data.detailedUser) {
        this.userModel = data.detailedUser;
        this.fullName = this.userModel.details.firstName + ' ' + this.userModel.details.lastName;
        this.email = this.userModel.details.email;
        this.phone = this.userModel.details.phoneNr;
      }
    });
  }
}
