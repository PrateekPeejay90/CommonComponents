import {
  OnInit, AfterViewInit, EventEmitter, OnChanges, ChangeDetectionStrategy, forwardRef,
  Input, Output, ElementRef, Component, ViewChild, Renderer2, HostListener
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import * as _ from 'lodash';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { AbstractControl, ValidatorFn, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

import { SharedService } from '../shared.service';
import { AbstractComboboxComponent } from '../combobox/abstract.combobox.component';
import {DaysAndTimesConst, DefinedDaysConst, DefinedTimeConst} from '../daysandtimes.constants';

const noop = () => {
};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DaysComboboxComponent),
  multi: true
};

const CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DaysComboboxComponent),
  multi: true
};

const KEYS: any = {
  ESC: 27
};

//validation function
function validateDays(): ValidatorFn {
  return (c: AbstractControl) => {
    let isDateValid = false;

    if (isDateValid) {
      return null;
    } else {
      return {
        required: true
      };
    }
  };
}

@Component({
  selector: 'app-days-combobox',
  templateUrl: './days.combobox.component.html',
  styleUrls: ['./days.combobox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class DaysComboboxComponent extends AbstractComboboxComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  
  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  validator: ValidatorFn;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  propagateChange: any = () => { };
  itemsLoading: boolean = false;
  customSelection = {};
  options: Array<any> = [{
    label: DaysAndTimesConst.M_F,
    value: DaysAndTimesConst.M_F,
    selected: false
  },{
    label: DaysAndTimesConst.Sa_Su,
    value: DaysAndTimesConst.Sa_Su,
    selected: false
  },{
    label: DaysAndTimesConst.M_Su,
    value: DaysAndTimesConst.M_Su,
    selected: false,
    isLastGroupOption: true
  },{
    label: 'Monday',
    value: DaysAndTimesConst.M,
    selected: false
  },{
    label: 'Tuesday',
    value: DaysAndTimesConst.Tu,
    selected: false
  },{
    label: 'Wednesday',
    value: DaysAndTimesConst.W,
    selected: false
  },{
    label: 'Thursday',
    value: DaysAndTimesConst.Th,
    selected: false
  },{
    label: 'Friday',
    value: DaysAndTimesConst.F,
    selected: false
  },{
    label: 'Saturday',
    value: DaysAndTimesConst.Sa,
    selected: false
  },{
    label: 'Sunday',
    value: DaysAndTimesConst.Su,
    selected: false
  }];

  @Input() inputValue = [];
  

  constructor(ref: ElementRef,
    renderer: Renderer2,
    private sharedService: SharedService) {
    super(ref,renderer);
    sharedService.clearFilters$.subscribe( event => {
      this.filterAttribute.hasSelection = false;
      this.placeholder = "";
      this.unselectAll();
      this.changeBkground();
    });
    this.validator = validateDays();
  }

  ngOnInit() {
    this.tabindex = (this.tabindex) ? this.tabindex : 0;
    this.showTooltip = (this.showTooltip === false) ? false : true;
    this.filterAttribute.hasSelection = false;


    if(this.filterAttribute.dataArray){

      if(this.filterAttribute.value){
        for(let i=0; i<this.filterAttribute.dataArray.length;i++){
          this.filterAttribute.dataArray[i]['selected'] = false;
        }
      }
      
      this.options = this.filterAttribute.dataArray;
      this.updateSelections();
    }

    if(this.filterAttribute.value){
      this.filterAttribute.value.forEach(val => {
        this.setOption(val,true);
      });
      this.updateSelections();
    }

  }
  
  private findOption(value) {
    return this.options.find(item=>item.value===value);
  }

  private setOption(itemkey, value) {
    return this.findOption(itemkey).selected = value;
  }

  get value() {
    return this.inputValue;
  }

  // Function to override
  writeValue(value: any) {
      this._setValue(value||[]);
  }

  // From ControlValueAccessor interface
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  onChange(event) {
    this.propagateChange(event.value);
  }
  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  validate(c: FormControl) {
    if( this.mandatory ) {
      return this.validator(c);
    } else {
      return true;
    }
  }

  onOptionSelect(selectedOption) {
    const ctx = this;
    let action = false;
    action = selectedOption.selected;
    this.filterAttribute.hasSelection = (action) ? true : false;
    ctx.updateSelections();
    switch (selectedOption.value) {
      case DaysAndTimesConst.M_Su:
        ctx.setOption(DaysAndTimesConst.M_Su, action);
        ctx.setOption(DaysAndTimesConst.Sa_Su, false);
        ctx.setOption(DaysAndTimesConst.M_F, false);
        ctx.setOption(DaysAndTimesConst.M, action);
        ctx.setOption(DaysAndTimesConst.Tu, action);
        ctx.setOption(DaysAndTimesConst.W, action);
        ctx.setOption(DaysAndTimesConst.Th,action);
        ctx.setOption(DaysAndTimesConst.F, action);
        ctx.setOption(DaysAndTimesConst.Sa, action);
        ctx.setOption(DaysAndTimesConst.Su, action);
      break;
      case DaysAndTimesConst.M_F:
        ctx.setOption(DaysAndTimesConst.M_Su, false);
        ctx.setOption(DaysAndTimesConst.Sa_Su, false);
        ctx.setOption(DaysAndTimesConst.M_F, action);
        ctx.setOption(DaysAndTimesConst.M, action);
        ctx.setOption(DaysAndTimesConst.Tu, action);
        ctx.setOption(DaysAndTimesConst.W, action);
        ctx.setOption(DaysAndTimesConst.Th, action);
        ctx.setOption(DaysAndTimesConst.F, action);
        ctx.setOption(DaysAndTimesConst.Sa, false);
        ctx.setOption(DaysAndTimesConst.Su, false);
      break;
      case DaysAndTimesConst.Sa_Su:
        ctx.setOption(DaysAndTimesConst.M_Su, false);
        ctx.setOption(DaysAndTimesConst.Sa_Su, action);
        ctx.setOption(DaysAndTimesConst.M_F, false);
        ctx.setOption(DaysAndTimesConst.M, false);
        ctx.setOption(DaysAndTimesConst.Tu, false);
        ctx.setOption(DaysAndTimesConst.W, false);
        ctx.setOption(DaysAndTimesConst.Th, false);
        ctx.setOption(DaysAndTimesConst.F, false);
        ctx.setOption(DaysAndTimesConst.Sa, action);
        ctx.setOption(DaysAndTimesConst.Su, action);
      break;

      case DaysAndTimesConst.M:
      case DaysAndTimesConst.Tu:
      case DaysAndTimesConst.W:
      case DaysAndTimesConst.Th:
      case DaysAndTimesConst.F:
      case DaysAndTimesConst.Sa:
      case DaysAndTimesConst.Su:
        ctx.updateChangeOfDays(selectedOption);
      break;
    }
    ctx.updateSelections();
    ctx.propagateChange(ctx._getValue());
    
    ctx.optionChanged.emit({val:ctx._getValue(),attribute:ctx.filterAttribute?ctx.filterAttribute.attributeName:''});
  }

  updateChangeOfDays(selectedOption) {
    const ctx = this;
    const cd = ctx.getCheckedDays();
    const isWholeWeekSelected = cd.M && cd.Tu && cd.W && cd.Th && cd.F && cd.Sa && cd.Su;
    const isWeekendSelected = !cd.M && !cd.Tu && !cd.W && !cd.Th && !cd.F && cd.Sa && cd.Su;
    const isWeekdaysSelected = cd.M && cd.Tu && cd.W && cd.Th && cd.F && !cd.Sa && !cd.Su;
    if (isWholeWeekSelected) {
      ctx.setOption(DaysAndTimesConst.M_Su, true);
    } else if (isWeekdaysSelected) {
      ctx.setOption(DaysAndTimesConst.M_F, true);
    } else if (isWeekendSelected) {
      ctx.setOption(DaysAndTimesConst.Sa_Su, true);
    } else {
      ctx.setOption(DaysAndTimesConst.M_Su, false);
      ctx.setOption(DaysAndTimesConst.M_F, false);
      ctx.setOption(DaysAndTimesConst.Sa_Su, false);
    }
  }

  getCheckedDays() {
    const ctx = this;
    let checkedDays = {
      M : false,
      Tu: false,
      W: false,
      Th: false,
      F: false,
      Sa: false,
      Su: false
    };

    ctx.selectedObjects.forEach(item => {
      if(item.selected) {
        checkedDays[item.value] = true;
      }
    })

    return checkedDays;
  }

  onSearchboxFocus(isFocus: boolean) {
    this.openMenu = true;
    //this.inputValue = [];
    this.placeholder = this.searchboxPlaceholder.replace('{attributeName}',this.filterAttribute.displayName);
    
    if (isFocus) {
      this.searchbox.nativeElement.focus();
    }
    this.sharedService.dropdownClose(this.filterAttribute);
  }

  disableComponent(isDisable: boolean) {
    this.disabled = isDisable;
  }

  protected toTooltipFormat() {
    let msg = '';
    let valArr = [];
    this.selectedObjects.forEach(obj => {
      switch(obj.value) {
        case DaysAndTimesConst.M_F:
        case DaysAndTimesConst.Sa_Su:
        case DaysAndTimesConst.M_Su:
        break;

        default: 
          valArr.push(obj.label);
        break;
      }
    });
    msg += valArr.join(", ");
    return msg;
  }

  private _getValue() {
    let valArr = [];
    this.selectedObjects.every(obj => {
      if( obj.value === DaysAndTimesConst.M_F || 
        obj.value === DaysAndTimesConst.Sa_Su ||
        obj.value === DaysAndTimesConst.M_Su ) {
          valArr[0] = obj.value;
          return false;
        } else {
          valArr.push(obj.value);
          return true;
        }
    });
    
    this.filterAttribute.value = valArr;
    return valArr;
  }

  
  private _setValue(value) {
    const me = this;
    if(value && Array.isArray(value)) {
      if( value.length === 0 ) {
        this.options.forEach(obj => {
            obj.selected = false;
        });
        this.updateSelections();
      } else {
        value.forEach(obj => {
          var selectedOption = me.findOption(obj);
          if(selectedOption) {
            selectedOption.selected = true;
            this.onOptionSelect(selectedOption);
          }
        });
      }
    }
  }
  
  protected parseMessage() {
    let msg = this.dropdownPlaceholder + ' ';
    let valArr = this._getValue();
    msg += valArr.join(",");
    return msg;
  }

  unselectAll() {
    const ctx = this;
    _.map(this.options, (options) => {
      options.selected = false;
      return options;
    });
    this.filterAttribute.hasSelection = false;
    this.isAllCheck = false;
    this.selectedObjects = [];
    this.selectedCount = 0;
    this.tooltip = '';
    this.updateSelections();
    this.propagateChange(ctx._getValue());
    ctx.optionChanged.emit({val:ctx._getValue(),attribute:ctx.filterAttribute?ctx.filterAttribute.attributeName:''});
  }

  closeMenu() {
    this.closeDropdown();
  }

  protected updatePlaceholder(emit: boolean = false) {
  	this.placeholder = this.selectedCount ? this.parseMessage() : this.dropdownPlaceholder;
    this.changeBkground();
    if(!this.clearAll && emit){
    	this.dropdownMenuBlur.emit({val:this._getValue(),attribute:this.filterAttribute.attributeName});
    }
  }
  
  protected changeBkground() {
  	let bgColor = this.selectedCount ? 'aliceblue' : this.disabled ? '#eeeeee': '#ffffff';
    this.renderer.setStyle(this.searchbox.nativeElement,'background-color',bgColor);
  }

  scrollOption(event, option: any, isLast: boolean) {
    const target = event.currentTarget;
    if (!target) {
      return;
    }
    switch (event.keyCode) {
      case 38: // this is the ascii of arrow up
        let previousSibling = target.previousSibling.firstElementChild;

        if(!previousSibling){
          previousSibling = target.closest('.days-combobox').querySelector('li:last-child');
        }

        if (previousSibling != undefined){
          setTimeout(() => previousSibling.focus(), 0); 
        }
      break;
      case 9: // this is the ascii of tabbing
      
      let nextElement = target.closest('form').querySelector('app-timepicker input');
      if (nextElement != undefined){
        this.closeDropdown();
        setTimeout(() => nextElement.focus(), 0);
      }
      
      break;
      case 40: // this is the ascii of arrow down
        let nextSibling = target.nextSibling.firstElementChild;

        if(!nextSibling){
          nextSibling = target.closest('.days-combobox').querySelector('li:first-child');
        }

        if (nextSibling != undefined){
          setTimeout(() => nextSibling.focus(), 0);
        }
        break;
      case 13: // this is the ascii of Enter Key down
        option.selected = !option.selected;
        this.onOptionSelect(option)
        break;

        default: 
          this.openMenu = true;
          break;
    }
    // This was disabling the type ahead functionality.
    // event.preventDefault();
  }

  moveFocus(target, isNext) {
    if (isNext && _.isFunction(target.nextSibling.focus)) {
      target.nextSibling.focus();
    } else if (!isNext && _.isFunction(target.previousSibling.focus)) {
      target.previousSibling.focus();
    }
  }

  subscribeToEvents() {
    this.sharedService.closeOnOutside$.subscribe((data) => {
      if(data.attributeName !== this.filterAttribute.attributeName) {
        this.closeMenu();
      }
    });
  }
}
