import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexSummaryModel} from '../../model/representation/summary.model';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {SorterUtil} from '../../utils/sorter.util';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private originalSummary: IndexSummaryModel[];
  public indexSummary: IndexSummaryModel[];
  // Sort
  public order: string;
  public type: string;
  private numberOrder = 'Ascending';
  private dateOrder = 'Ascending';
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
    {item_id: 14, item_text: 'IR3060'}
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

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getRouteData();
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

  getRouteData(): void {
    this.route.data.subscribe((data: { summary: IndexSummaryModel[] }) => {
      this.indexSummary = data.summary;
      this.originalSummary = [...data.summary];
    });
  }

}
