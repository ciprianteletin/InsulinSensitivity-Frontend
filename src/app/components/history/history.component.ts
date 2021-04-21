import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexSummaryModel} from '../../model/representation/summary.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public indexSummary: IndexSummaryModel[];
  // Sort
  public order: string;
  public type: string;
  private numberOrder = 'Ascending';
  private dateOrder = 'Ascending';

  constructor(private route: ActivatedRoute) {
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

  ngOnInit(): void {
    this.getRouteData();
  }

  getRouteData(): void {
    this.route.data.subscribe((data: { summary: IndexSummaryModel[] }) => {
      this.indexSummary = data.summary;
    });
  }

}
