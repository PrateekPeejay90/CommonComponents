export class DateRangeModel {
  startDate: string;
  endDate: string;
}

export class AvailabilityRangeModel {
  firstTelecastDate: string;
  lastTelecastDate: string;
}

export class DayPartModel {
  id: number;
  name: string;
  shortName: string;
}

export class DayTimeModel {
  dayAndTime: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  order: any;
}

export class StationBroadcastModel {
  firstDayOfWeek: string;
  timeZone: string;
  trafficEndTime: string;
  trafficStartTime: string;
}

export class StationModel {
  id: string;
  name: string;
  code: string;
  timeZone: string;
  affiliation : string;
}

export class GenreModel {
  id: string;
  name: string;
}

export class InventoryCategorizationModel {
  id: string;
  name: string;
}

export class ProductModel {
  constructor(
    public productId: string,
    public productLineId: string,
    public productLineName: string,
    public productName: string,
    public station: StationModel,
    public timeShifts: string,
    public display_telecastdate: string,
    public timeShift: string,
    public inventoryCategorization: InventoryCategorizationModel,
    public telecastDate: AvailabilityRangeModel,
    public hiatusDates: DateRangeModel[],
    public daysAndTimes: DayTimeModel[],
    public dayParts: DayPartModel[],
    public genres: GenreModel[],
    public status: string,
    public productComment: string,
    public lastUpdatedDate: string,
    public lastPublishedDate: string,
    public primaryDayPart: DayPartModel
  ) { }
}

export class ProductGridModel {
  constructor(
    public productId: string,
    public productLineId: string,
    public productLineName: string,
    public productName: string,
    public product: ProductModel,
    public changedFields: string[],
    public display_name: string,
    public display_status: string,
    public display_station: string,
    public display_station_affiliation: string,
    public display_dayParts: string,
    public display_daysAndTimes: string,
    public display_timeShift: string,
    public display_telecastdate: string,
    public display_firsttelecastdate: string,
    public display_lasttelecastdate: string,
    public display_hiatusDates: string,
    public display_lastUpdatedDate: string,
    public display_lastPublishedDate: string,
    public display_inventoryCategorization: string,
    public display_genreNames : string
  ) { }
}

export class ProductTreeModel {
  constructor(
    public productId: string,
    public productLineId: string,
    public productLineName: string,
    public productName: string,
    public product: ProductModel,
    public changedFields: string[],
    public display_name: string,
    public display_status: string,
    public display_station: string,
    public display_station_affiliation: string,
    public display_dayParts: string,
    public display_daysAndTimes: string,
    public display_timeShift: string,
    public display_telecastdate: string,
    public display_firsttelecastdate: string,
    public display_lasttelecastdate: string,
    public display_hiatusDates: string,
    public display_lastUpdatedDate: string,
    public display_lastPublishedDate: string,
    public display_inventoryCategorization: string,
    public display_genreNames : string,
    public isProductLine: boolean,
    public productIds: string[],
    public leaf: boolean,
    public productlineMetadata: any,
    public children: any[]
  ) { }
}

export class NewProductLineModel {
  productLineId: string;
  productLineName: string;
  productLines: any[];
  stations: StationModel[];
  genres: GenreModel[];
  inventoryCategorizations: InventoryCategorizationModel;
  timeShift: string;
  telecastDate: AvailabilityRangeModel;
  hiatusDates: DateRangeModel[];
  daysAndTimes: DayTimeModel;
  dayParts: DayPartModel[];
  oto: boolean;
  tfn: boolean;
  status: string;
  dayPartRadio: boolean;
  isDayPartIndexVisible: boolean;
  isNoDayPartCommon: boolean;
}

export class ProductLineDropDown {
  constructor(
   public id: string,
   public value: string,
   public name: string,
   public label: string
 ) {  }
}

export class InventoryCategorizationsDropDown {
  constructor(
    public id: string,
    public value: string,
    public name: string,
    public label: string
 ) {  }
}

export class StationModelDropDown {
  constructor(
   public code: string,
   public id: string,
   public value: string,
   public name: string,
   public label: string,
   public timeZone: string,
   public broadcast: StationBroadcastModel,
   public affiliation : string
 ) {  }
}

export class DayPartDropDownModel {
  constructor(
    public code: string,
    public dayPartName: string,
    public daysOfWeek: string,
    public startTime: string,
    public endTime: string,
    public value: string,
    public label: string,
    public order: number
  ) {  }
}

export class GenresDropDownModel {
  constructor(
    public id: string,
    public name: string,
    public value: string,
    public label: string
  ) {  }
}
