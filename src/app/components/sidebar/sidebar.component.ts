import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../../assets/styles/utils.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  active = false;
  sidebarSubscription: Subscription;

  constructor(private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.sidebarSubscription = this.headerService.getSidebarEvent()
      .subscribe(() => this.active = !this.active);
  }

  ngOnDestroy(): void {
    this.sidebarSubscription.unsubscribe();
  }

}
