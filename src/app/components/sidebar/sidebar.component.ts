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
  isLoggedUser: boolean;

  private mainSubscription = new Subscription();
  private sidebarSubscription: Subscription;
  private userSubscription: Subscription;
  private calculateIndexSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService,
              private settingsService: SettingsService,
              private router: Router,
              private renderer: Renderer2,
              private insulinService: InsulinIndexesService) {
  }

  ngOnInit(): void {
    this.createSubscriptions();
    this.addSubscriptions();
  }

  /**
   * In order to avoid cases where selected indexes remain selected, even when we leave the page,
   * we want to clear the list and reset the css classes. In case if we are on the calculator,
   * we don't want to get rid of the selected indexes, so we check the route before doing any
   * kind of modification.
   */
  ngAfterViewInit(): void {
    this.indexList = Array.from(this.indexParent.nativeElement.children);
    if (!this.router.url.includes('calculator')) {
      this.resetClasses();
      this.insulinService.clearList();
    } else {
      this.activateClickedIndexes();
    }
  }

  onClickSettingsEvent(id: string): void {
    this.settingsService.emitActiveElement(id);
    this.navigateToSettings();
  }

  onPredictDiabetes(): void {
    this.router.navigate(['/predict/diabetes'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    });
  }

  onPredictEvolution(): void {
    this.router.navigate(['/predict/evolution'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    });
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

  private resetClasses(): void {
    const activeList = this.insulinService.getIndexList();
    activeList.forEach(index => {
      const item = this.getIndexFromList(index).children[0];
      this.renderer.removeClass(item, 'active-link');
    });
  }

  private navigateToSettings(): void {
    this.router.navigate(['/settings'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    }).then();
  }

  public navigateToContactUs(): void {
    if (this.username) {
      this.router.navigate(['/contact-us'], {
        queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
      }).then();
      return;
    }
    this.router.navigate(['/contact-us']).then();
  }

  private createSubscriptions(): void {
    this.userSubscription = this.authService.user
      .subscribe(user => {
        if (user !== null) {
          this.isLoggedUser = true;
          this.username = user.username;
        } else {
          this.isLoggedUser = false;
        }
      });

    this.sidebarSubscription = this.headerService.getSidebarEvent()
      .subscribe(() => this.active = !this.active);

    this.calculateIndexSubscription = this.headerService.getCalculateIndexEvent()
      .subscribe(() => this.activateClickedIndexes());
  }

  private addSubscriptions(): void {
    this.mainSubscription.add(this.userSubscription);
    this.mainSubscription.add(this.sidebarSubscription);
    this.mainSubscription.add(this.calculateIndexSubscription);
  }

  ngOnDestroy(): void {
    this.mainSubscription.unsubscribe();
  }
}
