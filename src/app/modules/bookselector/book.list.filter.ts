import { BOOK_CONSTANTS } from './constants/book.constants';

export const BOOK_LIST_FILTERS = {
  COMMON: {
    displayLabelsAfterMax: true,
    isMandatory: false,
    maxSelected: 0,
    disabled: false,
    dataType: 'multiselect',
    frequent: true
  },

  SPECIFIC: {
    DATASTREAM: {
      displayName: 'Rating Stream',
      attributeName: BOOK_CONSTANTS.RATING_STREAMS,
      fetchCallback: 'fetchDataStreams',
      maxSelected: 1,
      sortOrder: 1,
      frequent: true,
      optionMeta: {
        value: 'value',
        label: 'displayName'
      }
    },
    BOOK_TYPE: {
      displayName: 'Book Type',
      attributeName: BOOK_CONSTANTS.BOOK_TYPES,
      fetchCallback: 'fetchBookTypes',
      maxSelected: 0,
      frequent: true,
      sortOrder: 1,
      optionMeta: {
        value: 'value',
        label: 'label'
      }
    },
    DATE_RANGE: {
      displayName: 'Date Range',
      attributeName: 'dateRange',
      dataType: 'bcdaterange',
      frequent: true,
      isSingleSelect: true
    },
    SOURCE: {
      displayName: 'Source',
      attributeName: BOOK_CONSTANTS.SOURCE,
      fetchCallback: 'fetchSources',
      maxSelected: 0,
      sortOrder: 1,
      optionMeta: {
        value: 'value',
        label: 'label'
      }
    },
    MARKET: {
      displayName: 'Market',
      attributeName: BOOK_CONSTANTS.MARKET_ID,
      fetchCallback: 'fetchMarkets',
      maxSelected: 0,
      sortOrder: 1,
      optionMeta: {
        value: 'id',
        label: 'name'
      }
    },
    STATION: {
      displayName: 'Station',
      attributeName: BOOK_CONSTANTS.STATION_ID,
      fetchCallback: 'fetchStations',
      maxSelected: 0,
      sortOrder: 1,
      optionMeta: {
        value: 'id',
        label: 'name'
      }
    },
    STATUS: {
      displayName: 'Status',
      attributeName: BOOK_CONSTANTS.STATUS_ID,
      fetchCallback: 'fetchStatuses',
      optionMeta: {
        value: 'value',
        label: 'label'
      }
    }
  }
}

export const BOOK_TYPES_FILTER = [
  { label: "PAV", value: "PAV" },
  { label: "PJ", value: "PJ" },
  { label: "TP", value: "TP" },
  { label: "OVN", value: "OVN" },
];

export const SOURCE_FILTER = [
  { label: "Nielsen", value: "nielsen" },
  { label: "comScore", value: "comscore" }
];

export const STATUS_FILTER = [
  { label: 'Draft', value: 'draft'},
  { label: 'Published', value: 'published'}
];
