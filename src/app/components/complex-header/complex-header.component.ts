import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-complex-header',
  templateUrl: './complex-header.component.html',
  styleUrls: ['./complex-header.component.css']
})
export class ComplexHeaderComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService) {
  }

  ngOnInit(): void {
  }

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  ngOnDestroy(): void {
  }
}
