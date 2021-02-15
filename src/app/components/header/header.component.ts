import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  basicHeader = true;
  headerSubscription: Subscription;

  constructor(private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.headerSubscription = this.headerService.getHeaderEvent().subscribe((status: boolean) => {
      this.basicHeader = status;
    });
  }

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  ngOnDestroy(): void {
    this.headerSubscription.unsubscribe();
  }
}
