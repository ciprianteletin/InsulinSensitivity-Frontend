import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {SettingsService} from '../../services/settings.service';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import {Router} from '@angular/router';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../../assets/styles/utils.css']
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('indexList') indexParent: ElementRef;
  indexList: any[] = [];
  active = false;
  username: string;
  sidebarSubscription: Subscription;
  userSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService,
              private settingsService: SettingsService,
              private router: Router,
              private renderer: Renderer2,
              private insulinService: InsulinIndexesService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user
      .subscribe(user => {
        if (user !== null) {
          this.username = user.username;
        }
      });

    this.sidebarSubscription = this.headerService.getSidebarEvent()
      .subscribe(() => this.active = !this.active);
  }

  ngAfterViewInit(): void {
    this.indexList = Array.from(this.indexParent.nativeElement.children);
    this.activateClickedIndexes();
  }

  onClickSettingsEvent(id: string): void {
    this.settingsService.emitActiveElement(id);
    this.navigateToSettings();
  }

  navigateToHistory(): void {
    this.router.navigate(['/history'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    }).then();
  }

  onClickIndex(id: string): void {
    const clickedIndex = this.getIndexFromList(id);
    if (!clickedIndex) {
      return;
    }
    this.addOrRemoveIndex(clickedIndex, id);
  }

  calculateIndexes(): void {
    this.headerService.navigateInsulinCalculator(this.username);
  }

  private getIndexFromList(id: string): HTMLElement {
    return this.indexList.find(item => {
      const index = item.children[0];
      return index.id === id;
    });
  }

  private addOrRemoveIndex(clickedIndex: HTMLElement, id: string): void {
    if (this.insulinService.containsIndex(id)) {
      this.insulinService.removeIndex(id);
      this.renderer.removeClass(clickedIndex.children[0], 'active-link');
    } else {
      this.insulinService.addIndex(id);
      this.renderer.addClass(clickedIndex.children[0], 'active-link');
    }
  }

  private activateClickedIndexes(): void {
    const activeList = this.insulinService.getIndexList();
    activeList.forEach(index => {
      const item = this.getIndexFromList(index).children[0];
      this.renderer.addClass(item, 'active-link');
    });
  }

  private navigateToSettings(): void {
    this.router.navigate(['/settings'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    }).then();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.sidebarSubscription.unsubscribe();
  }
}
