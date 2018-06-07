import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'searchKeyword'
})
@Injectable()
export class SearchKeywordPipe implements PipeTransform {
  transform(items: any[], field: string, keyword: string): any[] {
    if (!items) {
      return [];
    }
    if (!keyword) {
      return items;
    }
    const searchWith = keyword.toLowerCase();
    return _.filter(items, item => {
      const prop = item[field].toLowerCase();
      return prop.includes(searchWith) || prop.replace('-', '').includes(searchWith);
    });
  }
}
