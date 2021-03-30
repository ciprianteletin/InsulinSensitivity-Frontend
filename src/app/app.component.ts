import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from './constants/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    localStorage.removeItem(environment.tokenHeader);
  }
}
