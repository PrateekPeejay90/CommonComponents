export const RATINGSTREAMS = [
  { label: 'Select', value: '' },
  { label: 'Live', value: 'Live' },
  { label: 'Live_same_day', value: 'Live_same_day' },
  { label: 'Live+1', value: 'Live+1' },
  { label: 'Live+3', value: 'Live+3' },
  { label: 'Live+7', value: 'Live+7' }
];

export const SOURCE_TYPES = [
  { label: 'Nielsen', value: 'nielsen' },
  { label: 'comScore', value: 'comScore' }
];

export const BOOK_TYPES_CREATE = [
  { label: 'Select', value: '' },
  { label: 'Projection (PJ)', value: 'PJ' },
];

export const BOOK_CONSTANTS = {
    MARKET_ID: 'marketId',
    STATION_ID: 'stationId',
    BOOK_TYPES: 'bookType',
    BOOK_TYPE_PJ: 'PJ',
    SOURCE: 'source',
    RATING_STREAMS: 'ratingStreams',
    STATUS_ID: 'statusId'
  }

  export const COOKIE_CONSTANTS = {
    JWT_TOKEN: 'jwtToken',
    API_KEY: 'apiKey'
  }

  export const BOOK_PERMISSIONS = {
    AccessBooksModule: 'AccessBooksModule',
    CreateBooks: 'CreateBooks',
    ReadBooks: 'ReadBooks'
  }



