import {
  Input, ViewChild, HostListener, OnInit,Renderer2,
  ElementRef, AfterViewInit, Output,EventEmitter,
  PipeTransform} from '@angular/core';
import { OptionMetaModel } from '../models/option.meta.model';
import * as _ from 'lodash';

const KEYS: any = {
  ESC: 27
};
export abstract class AbstractComboboxComponent implements OnInit,AfterViewInit {
  @ViewChild('dropmenu') private menuSection;
  @ViewChild('searchbox') searchbox: ElementRef;

  @Input() id: string = '';
  @Input() options: Array<any> = [];
  @Input() totalOptions: number = 0;
  @Input() dropdownCountPlaceholder: string = 'Selected {count}';
  @Input() searchboxPlaceholder: string = 'Search';
  @Input() dropdownPlaceholder: string = 'Select from list';
  @Input() mandatory: boolean = false;
  @Input() showTooltip: boolean = true;  
  @Input() disabled: boolean = false;
  @Input() tabindex: number = 0;
  @Input() virtualScroll: boolean = false;
  @Input() manualLoad: boolean = false;
  @Input() filterAttribute: any;
  @Input() attributeName: string;  
  @Input() displayName: string;  
  @Input() optionMeta: OptionMetaModel = {
    value: 'value',
    label: 'label',
    counts: 'totalItems',
    data: 'data'
  };
  
  @Output() loadComplete: EventEmitter<any> = new EventEmitter<any>();
  @Output() optionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() dropdownMenuBlur: EventEmitter<any> = new EventEmitter<any>();

  protected placeholder: string = '';
  protected ref: ElementRef;
  protected renderer: Renderer2;
  public openMenu: boolean = false;
  public keyword: string = '';
  public selectedCount: number = 0;
  protected originalPlaceholder: string;
  protected inpuContainer: any;
  protected dropdownWidth: number = 0;
  protected selectedObjects: Array<any> = [];
  protected isAllCheck: boolean = false;
  protected clearAll: boolean = false;
  protected optionRefresh:boolean = false;
  protected optionRefreshAllCheck:boolean = false;
  public tooltip: string = '';

  constructor(ref: ElementRef,renderer: Renderer2) {
    this.ref = ref;
    this.renderer = renderer;
  }

  ngAfterViewInit() {
    this.inpuContainer = this.ref.nativeElement.querySelector('.input-container');
    setTimeout(this.delayedInitialisation.bind(this));
  }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if (!this.ref.nativeElement.contains(event.target) && !this.focussedOnMenu(event.target) && this.openMenu) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Close menu on ESC
    if (event.keyCode === KEYS.ESC) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResizeWindow() {
  	if(this.openMenu){
    	this.closeDropdown();
    }
    this.setDropdownWidth();
  }

  private delayedInitialisation() {

    // if(this.selectedCount == 1) {
    //   this.placeholder = this.dropdownPlaceholder + ': ' + this.selectedObjects[0].label;
    // } else {
    //   this.placeholder = this.selectedCount ? this.parseMessage() : this.dropdownPlaceholder;
    // }
  
    this.updatePlaceholder();
    this.setDropdownWidth(); 
  }
  
  protected changeBkground() {
  	let bgColor = this.disabled ? '#eeeeee' : this.selectedCount ? 'aliceblue' : '#ffffff';
    this.renderer.setStyle(this.searchbox.nativeElement,'background-color',bgColor);
  }

  protected hasAllOptionsChecked(): boolean {
    if (this.virtualScroll) {
      return this.selectedCount && this.isAllCheck ? this.selectedCount === this.totalOptions : false;
    }
    this.updatePlaceholder(false);
    
    return !!(this.selectedCount && this.selectedCount === this.options.length);
  }

  protected updateSelections() {
    this.selectedObjects = this.getSelectedItems();
    this.selectedCount = this.getActualCount();
    this.isAllCheck = this.hasAllOptionsChecked();
    this.tooltip = this.toTooltipFormat();
  }

  protected updateFieldName(name:string) {
  	this.dropdownPlaceholder = this.dropdownPlaceholder.replace('{attributeName}', name);
  }

  protected removeByValue(items, value) {
    _.remove(items, function(item: any) {
      return item === value;
    });
  }

  protected parseMessage() {
    let msg = this.dropdownPlaceholder + ' ';
    /*if(this.selectedCount <= this.filterAttribute.maxSelected){
    	let valArr = [];
    	this.selectedObjects.forEach(obj => {
    		valArr.push(obj.label);
    	});
    	msg += valArr.join(",");
    }else{*/
    //	msg += this.dropdownCountPlaceholder.replace('{count}', this.selectedCount.toString());
    /*if(this.selectedCount == 1) {
    msg += this.selectedCount ? this.parseMessage() :this.dropdownPlaceholder;
    }
    else{*/
      msg += this.dropdownCountPlaceholder.replace('{count}', this.selectedCount.toString());
    //}
   // }
    return msg;
  }

  protected closeDropdown() {
    this.openMenu = false;
    this.keyword = '';
    this.updatePlaceholder(true);
  }

  protected updatePlaceholder(emit: boolean = false) {
    
    this.placeholder = this.dropdownPlaceholder + ': ';
    if(this.selectedCount ===1) {
      this.placeholder += this.selectedObjects[0].label;
      if(this.placeholder.length > 15 || this.dropdownPlaceholder.length > 15){
        this.showTooltip = true;
        
      }
     
    } else {
      this.placeholder = this.selectedCount ? this.parseMessage() :this.dropdownPlaceholder;
      this.showTooltip = false;
    }
     
    this.changeBkground();
    if(!this.clearAll && emit){
    	this.dropdownMenuBlur.emit({val:this.selectedObjects,attribute:this.filterAttribute.attributeName});
    }
  }

  protected setDropdownWidth() {
    this.dropdownWidth = this.inpuContainer.offsetWidth;
    if(this.dropdownWidth && this.selectedCount === 1)
    {
      this.showTooltip = true;
      
    }
    else{
      this.showTooltip = false;
    }
  }
  protected focussedOnMenu(target) {
    if (!target) {
      return false;
    }
    while (target) {
      if (target === this.menuSection || target.getAttribute('styleClass') === 'checkbox') {
        return true;
      }
      target = target.parentElement;
    }
    return false;
  }

  protected enrichOptions() {
    _.chain(this.options)
      .filter(function(item) {
        return !_.has(item, 'selected');
      })
      .map(function(item) {
        item.selected = false;
        return item;
      })
      .value();
  }

  protected getSelectedItems(): Array<any> {

    if(this.virtualScroll) {

      if(this.optionRefresh){
        if(this.optionRefreshAllCheck){
          this.isAllCheck = true;
          this.options.forEach(obj => {
            obj.selected = true;
          });
          return this.options;
        }else{
          return _.chain(this.options)
          .filter({ selected: true })
          .uniqBy('value')
          .filter({ selected: true })
          .value();
        }

      }else{
        return _.chain(this.options)
        .filter({ selected: true })
        .concat(this.selectedObjects)
        .uniqBy('value')
        .filter({ selected: true })
        .value();
      }

    } else {
      return _.filter(this.options, function(item: any) {
        return item.selected;
      });
    }
  }

  protected resetOptions(isSelected) {
    this.isAllCheck = false;
    this.selectedCount = 0;
    this.selectedObjects = [];
    _.map(this.options, function(item: any) {
      item.selected = isSelected;
      return item;
    });
  }

  protected isJSON(data) {
    try {
      JSON.parse(data);
    } catch (error) {
      return false;
    }
    return true;
  }

  protected toTooltipFormat() {
    return _.chain(this.selectedObjects)
      .map('label')
      .join(', ')
      .value();
  }

  private getActualCount(): number {
    if (this.virtualScroll && this.isAllCheck &&  this.options.length &&
      this.selectedObjects.length === this.options.length) {
      return this.totalOptions;
    }
    return this.selectedObjects.length;
  }

  focus() {
    this.searchbox.nativeElement.focus();
  }

  arrangeChecked() {
    let checkedOptions = this.options.filter((item) => { return item.selected; });
    let uncheckedOptions = this.options.filter((item) => { return !item.selected; });
    this.options = _.concat([],checkedOptions,uncheckedOptions);
  }
}
