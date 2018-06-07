import {
  AfterViewInit, EventEmitter, OnChanges, ChangeDetectionStrategy,
  Input, Output, ElementRef, Component, ViewChild, Renderer2
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { OptionMetaModel } from '../models/option.meta.model';
import { OptionsBuilder } from './options.builder';
import { AbstractComboboxComponent } from './abstract.combobox.component';
import { FilterModel } from '../virtual-scroll/filter.model';
import { SharedService } from '../shared.service';

// tslint:disable-next-line:no-inferrable-types
const PAGE_SIZE: number = 10;
// tslint:disable-next-line:no-inferrable-types
const SEARCH_DEALAY: number = 1000;

@Component({
  selector: 'ra-combobox',
  templateUrl: './msedit.combobox.component.html',
  styleUrls: ['./msedit.combobox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MSEditComboboxComponent extends AbstractComboboxComponent
  implements AfterViewInit {

  @Input() fetchCallback: Function;
  @Input() allowNewOptions: boolean = true;
  @Input() refreshOnSearch: boolean = true;

  @ViewChild('allCheckbox') allCheckbox: ElementRef;
  @ViewChild('valueCheckboxes') valueCheckboxes: ElementRef;

  searchSelectedCount: number;
  public itemsLoading: boolean = false;
  private innerShadow: boolean = false;
  private error: any = null;
  private pageSize: number = PAGE_SIZE;
  private subscription: Subscription;
  private displayMarketDialog: boolean = false;
  private stationsListToRemove: any[] = [];
  private reselectMarket: any[] = [];
  public searchResult: any[] = [];

  isAllFocused: boolean = false;

  constructor(ref: ElementRef, private sharedService: SharedService, renderer: Renderer2) {
    super(ref, renderer);
    sharedService.clearFilters$.subscribe(event => {
      this.filterAttribute.hasSelection = false;
      this.placeholder = "";
      this.unselectAll();
      this.changeBkground();
    });
    sharedService.loadData$.subscribe(options => {
      if (this.filterAttribute.attributeName === options.attribute) {
        this.options = options.data;
      }
    });


  }

  ngOnInit() {

    if (this.filterAttribute) {
      this.updateFieldName(this.filterAttribute.displayName);
      if (this.filterAttribute.fetchCallback) {
        this.fetchCallback = this.filterAttribute.fetchCallback.bind(this.filterAttribute.scope);
      }
    }

    if (!this.virtualScroll && !!this.options) {
      if (this.options.length === 1) {
        this.options[0].selected = true;
        this.filterAttribute.hasSelection = true;
        this.optionChanged.emit({ val: this.selectedObjects, attribute: this.filterAttribute ? this.filterAttribute.attributeName : '' });
      }
    }
    this.updateSelections();
    this.onSearchChange();
    this.updatePlaceholder(this.selectedCount > 0);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.virtualScroll) {
      this.registerKeyEvent(this.searchbox, 'keyup', this.searchByKeyword);
    }
  }

  onOptionSelect(isNotify: boolean = true) {
    const ctx = this;
    setTimeout(function () {
      ctx.updateSelections();
      ctx.filterAttribute.hasSelection = ctx.selectedCount > 0 ? true : false;
      ctx.updateSearchSelectedCount();

      if (isNotify) {
        ctx.emitOnChangeEvent();
      }
    }, 0);
  }

  emitOnChangeEvent() {
    const ctx = this;
    ctx.optionChanged.emit({ val: ctx.selectedObjects, attribute: ctx.filterAttribute ? ctx.filterAttribute.attributeName : '' });
  }

  onSearchChange() {
    var value = this.keyword;
    value = value.toLowerCase();
    this.searchResult = this.options.filter(function (item) {
      return item.label.toLowerCase().indexOf(value) > -1;
    });
    this.updateSearchSelectedCount();
  }

  updateSearchSelectedCount = function () {
    this.searchSelectedCount = this.searchResult.filter(function (item) {
      return item.selected;
    }).length;

    if (this.searchSelectedCount > 0 && this.searchSelectedCount == this.searchResult.length) {
      this.isAllCheck = true;
    } else {
      this.isAllCheck = false;
    }
  }

  onAllOptionSelect() {
    _.forEach(this.searchResult, (option: any, index: number) => {
      option.selected = this.isAllCheck;
      this.filterAttribute.hasSelection = true;
    });
    this.filterAttribute.hasSelection = (this.isAllCheck === true) ? true : false;

    this.updateSelections();
    this.updateSearchSelectedCount();
    this.emitOnChangeEvent();
  }

  onSearchboxFocus(isFocus: boolean, isMenuOpen: boolean = true) {
    this.arrangeChecked();

    this.openMenu = isMenuOpen;

    this.keyword = '';
    this.placeholder = this.searchboxPlaceholder.replace('{attributeName}', this.filterAttribute.displayName);
    this.error = null;
    if ((!this.manualLoad && !this.options.length) ||
      (this.virtualScroll && this.options.length < this.totalOptions)) {
      this.fetchOptions();
    }

    if (isFocus) {
      this.searchbox.nativeElement.focus();
    }

    this.onSearchChange();
    this.sharedService.dropdownClose(this.filterAttribute);
  }

  refreshOptions() {
    this.options = [];
    this.optionRefresh = true;
    this.optionRefreshAllCheck = this.isAllCheck;
    this.filterAttribute.hasSelection = false;
    this.onSearchboxFocus(false, false);
  }

  onScroll(event: FilterModel) {
    event.search = this.keyword;
    this.fetchOptions(event);
  }

  closeMenu() {
    this.closeDropdown();
  }

  sync(option: any, isSelected: boolean, isClear: boolean = false) {
    const ctx = this;
    this.filterAttribute.hasSelection = isSelected;
    if (isClear) {
      this.options.length = 0;
      this.selectedObjects.length = 0;
      this.updateSelections();
      this.onSearchChange();
      this.updatePlaceholder();
      this.emitOnChangeEvent();
      return;
    }
    if (!option) {
      this.resetOptions(isSelected);

    } else {
      option.selected = isSelected;
    }



    setTimeout(function () {
      ctx.updateSelections();
      ctx.onSearchChange();
      ctx.updatePlaceholder();
      ctx.emitOnChangeEvent();
    }, 0);
  }

  syncGroup(groupOptions: Array<any>, isMenuOpen: boolean = false, isFetchOptions: boolean = true) {
    this.options = groupOptions;
    this.openMenu = isMenuOpen;
    this.selectedObjects = [];
    this.updateSelections();
    if (isFetchOptions) {
      this.fetchOptions();
    }
    this.updatePlaceholder();
  }

  addGroupOptions(groupOptions: Array<any>) {
    let removedoptions = _.remove(this.options, (option) => {
      return !!_.find(groupOptions, { value: option.value });
    });
    removedoptions = _.map(removedoptions, (option) => {
      option.isGroup = true;
      return option;
    });
    this.options = _.isEmpty(removedoptions) ? groupOptions.concat(this.options) :
      removedoptions.concat(this.options);
    this.selectedObjects = [];
    this.updateSelections();
    this.updatePlaceholder();
  }

  selectOptions(options: Array<any>) {
    _.map(options, (option) => {
      option.selected = true;
      return options;
    });
    this.isAllCheck = false;
    this.selectedObjects = [];
    this.selectedCount = 0;
    this.tooltip = '';
    this.updateSelections();
    this.onOptionSelect();
  }

  unselectAll() {
    _.map(this.options, (options) => {
      options.selected = false;
      return options;
    });
    this.isAllCheck = false;
    this.selectedObjects = [];
    this.selectedCount = 0;
    this.tooltip = '';
    this.updateSelections();
    this.onOptionSelect();
  }

  isAllSelected() {
    return this.isAllCheck;
  }

  disableComponent(isDisable: boolean) {
    this.disabled = isDisable;
  }

  topScrollOption(event) {
    const target = event.currentTarget;
    this.isAllFocused = false;
    if (!target) {
      return;
    }
    switch (event.keyCode) {

      case 9: // this is the ascii of tabbing
        this.closeMenu();
        break;
      case 40: // this is the ascii of arrow down
        this.allCheckbox.nativeElement.focus();
        this.isAllFocused = true;
        break;
    }
  }

  allScrollOption(event, option: any, isLast: boolean) {
    const target = event.currentTarget;
    this.isAllFocused = false;
    if (!target) {
      return;
    }
    switch (event.keyCode) {

      case 9: // this is the ascii of tabbing
        this.closeMenu();
        break;
      case 40: // this is the ascii of arrow down
        this.isAllFocused = false;
        // console.log(this.valueCheckboxes.nativeElement.firstElementChild , this.valueCheckboxes.nativeElement.firstElementChild.focus());
        const firstValueCheckbox = this.valueCheckboxes.nativeElement.firstElementChild;
        setTimeout(() => firstValueCheckbox.focus(), 0);
        break;
      case 13: // this is the ascii of EnterKey
        if (this.isAllCheck) {
          this.unselectAll();
        }
        else {
          this.isAllCheck = true;
          this.onAllOptionSelect();
        }
        break;
    }
  }

  scrollOption(event, option: any, isLast: boolean) {

    const target = event.currentTarget;
    this.isAllFocused = false;
    if (!target) {
      return;
    }
    switch (event.keyCode) {
      case 38: // this is the ascii of arrow up
        const previousSibling = target.previousSibling.firstElementChild;
        if (previousSibling != undefined)
          setTimeout(() => previousSibling.focus(), 0);
        else {
          this.allCheckbox.nativeElement.focus();
          this.isAllFocused = true;
        }
        break;
      case 9:
        this.moveFocus(target, !event.shiftKey);
        break;
      case 40: // this is the ascii of arrow down
        const nextSibling = target.nextSibling.firstElementChild;
        if (nextSibling != undefined)
          setTimeout(() => nextSibling.focus(), 0);
        else {
          this.allCheckbox.nativeElement.focus();
          this.isAllFocused = true;
        }
        break;
      case 13: // this is the ascii of Enter Key down
        option.selected = !option.selected;
        this.sync(option, option.selected);
        break;
    }
    event.preventDefault();
  }

  chooseNewOptions() {

  }

  moveFocus(target, isNext) {
    if (isNext && _.isFunction(target.nextSibling.focus)) {
      target.nextSibling.focus();
    } else if (!isNext && _.isFunction(target.previousSibling.focus)) {
      target.previousSibling.focus();
    } else {
      this.allCheckbox.nativeElement.focus();
      this.isAllFocused = true;
    }
  }

  private transformResponse(response) {
    const builder = new OptionsBuilder(response, this.optionMeta, this.virtualScroll, this.selectedObjects);
    response = builder
      .toJson()
      .enrichForPagination()
      .enrichForOption()
      .addGroupOptions(this.options)
      .enrichForVirtualScroll(this.options, this.isAllCheck)
      .build();
    return response;
  }

  private fetchOptions(event: FilterModel =
    {
      pageNumber: 1, pageSize: PAGE_SIZE, search: this.keyword
    }) {
    const ctx = this;
    ctx.itemsLoading = true;
    this.fetchCallback(event)
      .then(ctx.transformResponse.bind(this))
      .then(response => {
        ctx.options = _.isArray(response) ? response : response.data;
        ctx.filterAttribute.dataArray = ctx.options;
        ctx.totalOptions = response.totalItems;
        ctx.enrichOptions();

        ctx.updateSelections();
        ctx.onSearchChange();
        ctx.updatePlaceholder();

        ctx.optionRefresh = false;
        ctx.itemsLoading = false;
        ctx.loadComplete.emit({ status: 'SUCCESS' });
        return response;
      })
      .catch(function (error) {
        ctx.itemsLoading = false;
        ctx.error = ctx.isJSON(error._body) ? JSON.parse(error._body) : error.statusText;
        ctx.loadComplete.emit({ status: 'ERROR' });
      });
  }

  subscribeLoadComplete(notifyTo: Function) {
    this.loadComplete.subscribe(notifyTo);
  }

  private registerKeyEvent(element: ElementRef, event: string, subscribedBy: Function) {
    const eventStream = Observable.fromEvent(element.nativeElement, event)
      .map(() => this.keyword)
      .debounceTime(SEARCH_DEALAY)
      .distinctUntilChanged();

    eventStream.subscribe(subscribedBy.bind(this));
  }

  private searchByKeyword(value) {
    this.options = [];
    this.fetchOptions({
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      search: value
    });
  }

  private scrollLoadingMessage() {
    const hasEndReched = this.options.length && this.options.length === this.totalOptions;
    return hasEndReched ? 'Reached end' : 'Fetching records';
  }
}
