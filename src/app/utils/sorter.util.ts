import {IndexSummaryModel} from '../model/representation/summary.model';

export class SorterUtil {
  private static statusMap = {
    Healthy: 'Healthy',
    'I.R.': 'Insulin Resistance',
    'P.D.': 'Prediabetes',
    Diabetes: 'Diabetes',
    'DM-IFG': 'Diabetes with Impaired Fasting Glucose',
    'DM-IGT': 'Diabetes with Impaired Glucose Tolerance',
    'DM-NFG': 'Diabetes with Normal Fasting Glucose',
    'DM-NPPG': 'Diabetes with Normal 2 hour Post-Glucose',
    IFG: 'Impaired Fasting Glucose: Prediabetes',
    IGT: 'Impaired Glucose Tolerance: Prediabetes',
    'IFG+IGT': 'Impaired Fasting Glucose and Impaired Glucose Tolerance: Prediabetes',
    IR30: 'Insulin Resistance - 30 min glucose',
    IR60: 'Insulin Resistance - 60 min glucose',
    IR3060: 'Insulin Resistance - 30 and 60 min glucose'
  };

  public static sortByDate(indexSummary: IndexSummaryModel[], restriction: string): IndexSummaryModel[] {
    if (restriction === 'All') {
      return indexSummary;
    }
    const date: Date = this.returnActualDate(restriction);
    return indexSummary.filter(summary => {
      const summaryCreation = summary.creationDate.split('/');
      const summaryDate = new Date(+summaryCreation[2], +summaryCreation[1] - 1, +summaryCreation[0]);
      return date.getTime() <= summaryDate.getTime();
    });
  }

  public static sortByStatus(indexSummary: IndexSummaryModel[], status: { item_id: number, item_text: string }[]): IndexSummaryModel[] {
    if (status.length === 14 || status.length === 0) {
      return indexSummary;
    }
    const tempArr: IndexSummaryModel[] = [];
    for (const st of status) {
      const stats = this.statusMap[st.item_text];
      tempArr.push(...indexSummary.filter(summary => summary.chartsResult === stats || summary.indexResult === stats));
    }
    return tempArr;
  }

  public static sortByIndex(indexSummary: IndexSummaryModel[], index: { item_id: number, item_text: string }[]): IndexSummaryModel[] {
    if (index.length === 12 || index.length === 0) {
      return indexSummary;
    }
    const tempArr: IndexSummaryModel[] = [];
    for (const st of index) {
      tempArr.push(...indexSummary.filter(summary => summary.indexNames.includes(st.item_text.toLowerCase())));
    }
    return tempArr;
  }

  private static returnActualDate(restriction: string): Date {
    let date: Date = new Date(Date.now());
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    switch (restriction) {
      case 'Today':
        break; // nothing to do
      case 'Last 7 days':
        date = new Date(year, month, day - 7);
        break;
      case 'Last Month':
        date = new Date(year, month - 1, 1);
        break;
      case 'Last Year':
        date = new Date(year - 1, month, day);
        break;
      default: // won't be reached
        break;
    }
    return date;
  }
}
