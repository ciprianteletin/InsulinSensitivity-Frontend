import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  active = false;

  constructor(private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.headerService.getSidebarEvent().subscribe(() => this.active = !this.active);
  }

  ngOnDestroy(): void {
    this.headerService.getSidebarEvent().unsubscribe();
  }

}
