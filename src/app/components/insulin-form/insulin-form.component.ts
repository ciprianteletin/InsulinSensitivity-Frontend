import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-insulin-form',
  templateUrl: './insulin-form.component.html',
  styleUrls: ['./insulin-form.component.css', '../../../assets/styles/utils.css']
})
export class InsulinFormComponent implements OnInit {
  @ViewChild('convert') convertButton: ElementRef;

  constructor() {
  }

  ngOnInit(): void {

  }

}
