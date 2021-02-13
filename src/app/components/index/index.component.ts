import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  onCloseModal(): void {
    this.renderer.addClass(this.modal.nativeElement, 'hidden');
    this.renderer.addClass(this.overlay.nativeElement, 'hidden');
  }

  onActivateModal(): void {
    this.renderer.removeClass(this.modal.nativeElement, 'hidden');
    this.renderer.removeClass(this.overlay.nativeElement, 'hidden');
  }

}
