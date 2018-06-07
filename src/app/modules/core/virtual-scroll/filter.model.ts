export interface DateRangeModel {
  endDate: string;
  startDate: string;
}

export interface FilterModel {
  pageNumber: number;
  pageSize: number;
  search?: string;
  dateFilters?: Array<DateRangeModel>;
  stationFilters?: Array<any>;
}
