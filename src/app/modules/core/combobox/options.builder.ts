import { OptionMetaModel } from '../models/option.meta.model';
import * as _ from 'lodash';

export class OptionsBuilder {

  constructor(private resp: any, private optionMeta: OptionMetaModel,
    private virtualScroll: boolean, private selectedObjects: any) {
  }

  toJson() {
    if (this.resp.json) {
      this.resp = this.resp.json();
    }
    return this;
  }

  enrichForPagination() {
    if (_.isArray(this.resp)) {
      this.resp = {
        data: this.resp,
        totalItems: this.resp.length
      };
    }else{
      this.resp = {
        data: this.resp[this.optionMeta.data],
        totalItems: this.resp[this.optionMeta.counts]
      };
    }
    return this;
  }

  enrichForOption() {
    this.resp.data = _.map(this.resp.data, (item: any) => {
     item.label = item[this.optionMeta.label];
     item.value = item[this.optionMeta.value];
     return item;
    });
    return this;
  }

  addGroupOptions(options: Array<any>) {
    const groupOptions = _.filter(options, { isGroup: true });
    if (groupOptions.length) {
      groupOptions[groupOptions.length - 1].isLastGroupOption = true;
      this.resp.data = _.chain(groupOptions).
        concat(this.resp.data)
        .uniqBy('value')
        .value();
    }
    return this;
  }

  enrichForVirtualScroll(options: Array<any>, isAllCheck: boolean) {
    if (this.virtualScroll) {
      const selectedIds = _.map(this.selectedObjects, 'value');
      this.resp.data = _.chain(options)
        .concat(this.resp.data)
        .uniqBy('value')
        .map((option) => {
          option.selected = isAllCheck || _.includes(selectedIds, option.value);
          return option;
        })
        .value();
    }
    return this;
  }

  build() {
    return this.resp;
  }

}
