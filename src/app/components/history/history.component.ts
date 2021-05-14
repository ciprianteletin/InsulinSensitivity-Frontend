import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IndexSummaryModel} from '../../model/representation/summary.model';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {SorterUtil} from '../../utils/sorter.util';
import {HistoryService} from '../../services/history.service';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';
import {Subscription} from 'rxjs';
import {ModalManagerService} from '../../services/modal-manager.service';
import {DeleteIndexModalComponent} from '../delete-index-modal/delete-index-modal.component';
import {FileExporterService} from '../../services/file-exporter.service';
import {HttpResponse} from '@angular/common/http';
import {NotificationType} from '../../constants/notification-type.enum';
import {NotificationService} from '../../services/notification.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  // Displayed information
  private originalSummary: IndexSummaryModel[];
  public indexSummary: IndexSummaryModel[];
  // Sort
  public order: string;
  public type: string;
  private numberOrder = 'Ascending';
  private dateOrder = 'Ascending';
  // Pagination
  public page = 1;
  public pageSize = 5;
  // Status data
  statusDropdown = [
    {item_id: 1, item_text: 'Healthy'},
    {item_id: 2, item_text: 'I.R.'},
    {item_id: 3, item_text: 'P.D.'},
    {item_id: 4, item_text: 'Diabetes'},
    {item_id: 5, item_text: 'DM-IFG'},
    {item_id: 6, item_text: 'DM-IGT'},
    {item_id: 7, item_text: 'DM-NFG'},
    {item_id: 8, item_text: 'DM-NPPG'},
    {item_id: 9, item_text: 'IFG'},
    {item_id: 10, item_text: 'IGT'},
    {item_id: 11, item_text: 'IFG+IGT'},
    {item_id: 12, item_text: 'IR30'},
    {item_id: 13, item_text: 'IR60'},
    {item_id: 14, item_text: 'IR3060'},
    {item_id: 15, item_text: 'Unknown'}
  ];
  statusSelected = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    itemsShowLimit: 1,
  };
  // Status indexes
  indexSelected = [];
  indexesDropdown = [
    {item_id: 1, item_text: 'Cederholm'},
    {item_id: 2, item_text: 'Gutt'},
    {item_id: 3, item_text: 'HOMA'},
    {item_id: 4, item_text: 'Quicki'},
    {item_id: 5, item_text: 'Revised Quicki'},
    {item_id: 6, item_text: 'Avingon'},
    {item_id: 7, item_text: 'Matsuda'},
    {item_id: 8, item_text: 'Ogis'},
    {item_id: 9, item_text: 'Belfiore'},
    {item_id: 10, item_text: 'Stumvoll'},
    {item_id: 11, item_text: 'McAuley'},
    {item_id: 12, item_text: 'Spise'},
  ];
  // Select Date data
  public selectedValue = 'All';
  public isLoading = false;
  // Subscriptions
  private deleteIndexSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private historyService: HistoryService,
              private insulinService: InsulinIndexesService,
              private router: Router,
              private notificationService: NotificationService,
              private modalManager: ModalManagerService,
              private fileExporter: FileExporterService) {
  }

  ngOnInit(): void {
    this.getRouteData();
  }

  onGoToReports(historyId: number, event: Event): void {
    event.stopPropagation();
    this.isLoading = true;
    this.historyService.getMandatoryAndSummaryPair(historyId)
      .subscribe(pair => {
        const mandatoryInfo = pair.first;
        const sender = pair.second;
        this.insulinService.emitNewData(mandatoryInfo);
        this.insulinService.emitResponse(sender);
        this.isLoading = false;
        this.router.navigate(['results'])
          .then();
      });
  }

  trackById(id: number, history: IndexSummaryModel): number {
    return history.id;
  }

  onDeleteIndexHistory(historyId: number, event: Event): void {
    event.stopPropagation();
    this.modalManager.openDeleteIndexModal(DeleteIndexModalComponent,
      'Are you sure you want to delete the selected history item?',
      'All information related to this index will be deleted!');
    this.deleteIndexSubscription = this.modalManager.deleteIndexModalResult
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          this.historyService.deleteById(historyId)
            .subscribe(() => {
              this.removeFromList(historyId);
              this.isLoading = false;
            }, () => this.isLoading = false);
        }
      });
  }

  onExportExcel(): void {
    if (this.indexSummary.length === 0) {
      this.notificationService.notify(NotificationType.WARNING, 'No history available for export!');
      return;
    }
    this.isLoading = true;
    const indexId: number[] = [];
    this.indexSummary.forEach(index => indexId.push(index.id));
    this.fileExporter.exportExcelHistory(indexId)
      .subscribe((excel: HttpResponse<Blob>) => {
        this.fileExporter.downloadExcel(excel.body);
        this.isLoading = false;
      }, () => {
        this.notificationService.notify(NotificationType.ERROR, 'Excel download failed!');
        this.isLoading = false;
      });
  }

  updateNumberOrder(): void {
    this.type = 'Number';
    this.order = this.numberOrder;
    this.numberOrder = this.numberOrder === 'Ascending' ? 'Descending' : 'Ascending';
  }

  updateDateOrder(): void {
    this.type = 'Date';
    this.order = this.dateOrder;
    this.dateOrder = this.dateOrder === 'Ascending' ? 'Descending' : 'Ascending';
  }

  onClearFilters(): void {
    this.statusSelected = [];
    this.indexSelected = [];
    this.indexSummary = [...this.originalSummary];
    this.selectedValue = 'All';
  }

  onFilterData(): void {
    let temp = SorterUtil.sortByDate(this.indexSummary, this.selectedValue);
    temp = SorterUtil.sortByStatus(temp, this.statusSelected);
    temp = SorterUtil.sortByIndex(temp, this.indexSelected);
    this.indexSummary = temp;
  }

  onShowTooltip(indexNames: string[]): string {
    let indexString = '';
    indexNames.forEach(index => indexString = indexString + index + ' ');
    return indexString;
  }

  calculateCurrentDisplay(): number {
    const display = this.indexSummary.length - this.pageSize * this.page;
    if (display >= 0) {
      return this.pageSize;
    } else {
      return this.pageSize - (this.pageSize * this.page - this.indexSummary.length);
    }
  }

  private removeFromList(historyId: number): void {
    const summaryPoz = this.indexSummary.findIndex(item => item.id === historyId);
    if (summaryPoz !== -1) {
      this.indexSummary.splice(summaryPoz, 1);
      const originalPoz = this.originalSummary.findIndex(item => item.id === historyId);
      this.originalSummary.splice(originalPoz, 1);
    }
  }

  private getRouteData(): void {
    this.route.data.subscribe((data: { summary: IndexSummaryModel[] }) => {
      this.indexSummary = data.summary;
      this.originalSummary = [...data.summary];
    });
  }

  ngOnDestroy(): void {
    if (this.deleteIndexSubscription) {
      this.deleteIndexSubscription.unsubscribe();
    }
  }
}
