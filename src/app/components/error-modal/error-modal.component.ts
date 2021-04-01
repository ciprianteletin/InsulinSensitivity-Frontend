import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GenericResponseModel} from '../../model/representation/generic-response.model';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css', '../../../assets/styles/modal.css']
})
export class ErrorModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;
  errorResponse = this.errorService.buildPlaceholderResponse();

  constructor(private renderer: Renderer2,
              private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.initErrorData();
  }

  onCloseModal(): void {
    this.renderer.addClass(this.modal.nativeElement, 'hidden');
    this.renderer.addClass(this.overlay.nativeElement, 'hidden');
  }

  displayModal(): void {
    this.renderer.removeClass(this.modal.nativeElement, 'hidden');
    this.renderer.removeClass(this.overlay.nativeElement, 'hidden');
  }

  private initErrorData(): void {
    this.errorService.getErrorSubject().subscribe((genericResponse: GenericResponseModel) => {
      this.errorResponse = genericResponse;
      this.displayModal();
    });
  }

  ngOnDestroy(): void {
    this.errorService.getErrorSubject().unsubscribe();
  }
}
