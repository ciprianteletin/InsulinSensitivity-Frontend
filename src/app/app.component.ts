import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from './constants/environment';
import {CacheService} from './services/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private cacheService: CacheService) {
  }

  ngOnInit(): void {
  }

  /**
   * When the app is 'destroyed', meaning that the page was refreshed or the
   * browser was closed, we want to get rid of localStorage data that is no longer
   * needed.
   */
  ngOnDestroy(): void {
    this.cacheService.clearCache();
    localStorage.removeItem(environment.tokenHeader);
  }
}
