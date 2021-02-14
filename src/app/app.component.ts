import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';
import {HeaderConstants} from './constants/header.constants';
import {HeaderService} from './services/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
              private headerConstants: HeaderConstants,
              private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
        const currentUrl = this.router.routerState.snapshot.url;
        this.headerService.changeHeaderState(this.headerConstants.basicHeader.indexOf(currentUrl) !== -1);
      });
  }
}
