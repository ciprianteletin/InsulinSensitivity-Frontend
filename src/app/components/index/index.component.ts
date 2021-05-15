import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [
    './index.component.css',
    '../../../assets/styles/modal.css',
    '../../../assets/styles/utils.css'
  ]
})
export class IndexComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
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
