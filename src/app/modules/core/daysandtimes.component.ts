import { Component, OnInit, Input, ElementRef,ChangeDetectorRef, 
  Renderer2, EventEmitter, Output, forwardRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DaysAndTimesConst, DefinedDaysConst, DefinedTimeConst} from './daysandtimes.constants';
import {SelectItem, ToggleButtonModule} from 'primeng/primeng';
import {Observable} from 'rxjs';
import { AbstractControl, ValidatorFn, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';
import { DayTimeModel } from './models/product.model';
import { AbstractComboboxComponent } from './combobox/abstract.combobox.component';
import { DaysComboboxComponent } from './days-combox/days.combobox.component';
import { TimePickerComponent } from './timepicker.component';
import { ErrorDialogComponent } from '../../modules/common/error-dialog';

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { SharedService } from './shared.service';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DaysandtimesComponent),
  multi: true
};

const CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DaysandtimesComponent),
  multi: true
};

const noop = () => {
};

//validation function
function validateDaysAndTimes(): ValidatorFn {
  return (c: AbstractControl) => {
    let isDateValid = false;

    if ( c !== null && c.value !== null ) {
      isDateValid = ( c.value.daysOfWeek !== undefined && c.value.daysOfWeek !== null && c.value.daysOfWeek !== '');
    }

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
  selector: 'app-daysandtimes',
  templateUrl: './daysandtimes.component.html',
  styleUrls: ['./daysandtimes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormControlDirective, FormGroupDirective, CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DaysandtimesComponent implements OnInit, ControlValueAccessor {

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  validator: ValidatorFn;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  propagateChange: any = () => { };
  subscription: Subscription;

  @Input() id: string = '';
  @Input() mandatory: boolean = false;
  @Input() disabled: boolean = false;
  @Input() tabindex: number = 0;
  @Input() attributeName: string;  
  @Input() displayName: string;
  @Input() showTooltip: boolean = false;
  @Input() filterAttribute: any;
  @Input() multiSelect: boolean = false;
  @Input() canErase: boolean = true;  
  @Input() showSelectedBgColor: boolean = true;
  @Output() optionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('dropmenu') private menuSection;
  @ViewChild('searchbox') searchbox: ElementRef;

  // @ViewChild('daysField') daysField: DaysComboboxComponent;
  // @ViewChild('startTimeField') startTimeField: TimePickerComponent;
  // @ViewChild('endTimeField') endTimeField: TimePickerComponent;

  protected placeholder: string = '';
  protected ref: ElementRef;
  protected renderer: Renderer2;
  openMenu: boolean = false;
  dialogWidth: number;
  closable:boolean = true;
  showDialog: boolean = false;
  isDirty: boolean = false;
  isValidData: boolean = false;
  tooltip: string = '';
  initializeObj: any = {};
  doneReset: boolean = false;
  
  btnLabelConst = DaysAndTimesConst;
  btnNotPressedCss: string = 'ui-button-secondary';
  startTimeArray = DefinedTimeConst;
  endTimeArray = DefinedTimeConst;
  minEndTime: Date = new Date();
  errorMessage: string = 'This field is required';

  itemsLoading: boolean = false;
  keyword: string;
  inputValue: any;
  inputvalue: any = [];
  previousValue: any = [];
  daysValue: any = [];
  startTimeValue: any = [];
  endTimeValue: any = [];
  previousFilterAttribute: any;
  errorJSON = [{
    'empty': false,
    'sameStartAndEndTime': false 
  }];

  constructor(ref: ElementRef, renderer: Renderer2,private sharedService:SharedService,private changeRef:ChangeDetectorRef) {
    this.ref = ref;
    this.renderer = renderer;
    this.dialogWidth = this.vhTOpxWidth(45);
    this.validator = validateDaysAndTimes();  
    this.subscription = sharedService.clearFilters$.subscribe( event => {
      this.clearAll(false);
      this.changeRef.detectChanges();
   });
  }

  vhTOpxWidth(value) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth;

    var result = (x*value)/100;
    return result;
  }

  ngOnInit() {
    const me = this;
    me.disabled = (me.disabled === true) ? true : false;
    me.showSelectedBgColor = (me.showSelectedBgColor === false) ? false : true;
    me.multiSelect = (me.multiSelect === true) ? true : false;
    me.canErase = (me.canErase === false) ? false : true;

    me.createComponents();
    me.updatePlaceholder();

    if (this.filterAttribute.items && this.filterAttribute.items.length>0){
      this.initializeObj = JSON.parse(JSON.stringify(this.filterAttribute.items[0]));
      this.initializeObj.daysAttribute.value = [];
      this.initializeObj.startTimeAttribute.value = null;
      this.initializeObj.endTimeAttribute.value = null;
      me.onDoneClick(false);
    }
  }

  refreshDropdown(attibuteName,dataArray){
    this.filterAttribute.items.forEach(element => {
      element[attibuteName].dataArray = dataArray;
    });

    this.initializeObj = JSON.parse(JSON.stringify(this.filterAttribute.items[0]));
    this.initializeObj.daysAttribute.value = [];
    this.initializeObj.startTimeAttribute.value = null;
    this.initializeObj.endTimeAttribute.value = null;
    this.onDoneClick(false);
    
  }

  createComponents() {
    const me = this;
    if(me.filterAttribute) {
      for (let index = 0; index < me.filterAttribute.items.length; index++) {
        const item = me.filterAttribute.items[index];
        
        const dayAttributeName = item.daysAttribute.attributeName;
        const startTimeAttributeName = item.startTimeAttribute.attributeName;
        const endTimeAttributeName = item.endTimeAttribute.attributeName;
  
        me.inputvalue[index] = {};
        me.inputvalue[index][dayAttributeName] = Array.isArray(item.daysAttribute.value) ? item.daysAttribute.value : [];
        me.inputvalue[index][startTimeAttributeName] = (item.startTimeAttribute.value && typeof(item.startTimeAttribute.value) === 'object' ) ? (item.startTimeAttribute.value.text) ? item.startTimeAttribute.value.text : '' : '';
        me.inputvalue[index][endTimeAttributeName] = (item.endTimeAttribute.value && typeof(item.endTimeAttribute.value) === 'object' ) ? (item.endTimeAttribute.value.text) ? item.endTimeAttribute.value.text : '' : '';
  
        me.previousValue[index] = {};
        me.previousValue[index][dayAttributeName] = [];
        me.previousValue[index][startTimeAttributeName] = '';
        me.previousValue[index][endTimeAttributeName] = '';
  
        me.errorJSON[index] = {
          'empty': false,
          'sameStartAndEndTime': false
        };
  
        me.daysValue[index] = me.inputvalue[index][dayAttributeName];
        me.startTimeValue[index] = {
          'text': me.inputvalue[index][startTimeAttributeName],
          'value': me.inputvalue[index][startTimeAttributeName]
        };
        me.endTimeValue[index] = {
          'text': me.inputvalue[index][endTimeAttributeName],
          'value': me.inputvalue[index][endTimeAttributeName]
        };
      }
    }
  }

  get value() {
    return this.value;
  }

  // Function to override
  writeValue(value: any) {
    this.propagateChange(value);
    this.updatePlaceholder();
  }

  reset() {
    this.daysValue.length = 0;
    this.startTimeValue.length = 0;
    this.endTimeValue.length = 0;
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

  onDirty(item, itemIdx) {
		const me = this;
    me.isDirty = me.compareWithOldValueChanged(item, itemIdx);
	}

  convertBooleanDaysToString() {
    const result = [];
    let variablename = '';
    return result.toString();
  }

  onSearchboxFocus(isFocus: boolean) {
    this.showDialog = true;
  }

  onDoneClick(emit: boolean = true) {
    const me = this;
    let isValid = true;

    this.doneReset = false;
    me.removeRotations(false);

    let value = me._getValue();
    for (let index = 0; index < value.length; index++) {
      const val = value[index];
      if(!me.isValid(val, index)) {
        isValid = false;
        break;
      }
    }

    if((me.isDirty || me.doneReset)  && isValid) {
      if(this.doneReset){
        this.filterAttribute.hasSelection = false;
        this.updatePlaceholder();
        this.changeBkground(false);
        if(emit){
          me.optionChanged.emit({val:[],attribute:me.attributeName,comp:this});
        }
      }else{
        this.filterAttribute.hasSelection = true;
        this.updatePlaceholder();
        if(emit){
          me.optionChanged.emit({val:value,attribute:me.attributeName,comp:this});
        }
      }
      me.showDialog = false;
    }else if(isValid){
      this.filterAttribute.hasSelection = true;
    }
  }

  clearAll(emit: boolean = true){
    this.removeRotations(true);
    this.filterAttribute.hasSelection = false;
    this.daysValue = {};
    this.startTimeValue = [{
      text: "",
      value: ""
    }];
    this.endTimeValue = [{
      text: "",
      value: ""
    }];
    this.inputvalue = [];
    this.updatePlaceholder();
    if(emit){
      this.optionChanged.emit({val:this.inputvalue,attribute:this.attributeName,comp:this});
    }
  }

  onDialogHide() {
    const me = this;
    me.filterAttribute = _.cloneDeep(me.previousFilterAttribute);
    me.inputvalue = _.cloneDeep(me.previousValue);
    me.createComponents();
    this.onCancel.emit({val:this.inputvalue,attribute:this.attributeName,comp:this});
  }
  
  onDialogShow() {
    const me = this;
    setTimeout(function() {
      me.isDirty = false;
      me.changeRef.detectChanges();
      me.previousFilterAttribute = _.cloneDeep(me.filterAttribute);
      me.previousValue = _.cloneDeep(me.inputvalue);
    }, 10);
  }
  
  removeRotations(clearAll:boolean) {
    const me = this;
    let removeIndexs = [];
    let value = me._getValue();
    if( value.length > 0 ) {
      //Here means there are more than one rotations
      for (let index = 0; index < value.length; index++) {
        //checking if any of the value is selected in rotation
        if(clearAll || !me.isValueSelected(value[index])) {
          removeIndexs.push(index);
        }
      }

      if( removeIndexs.length > 0 ) {

        let tempArr = [];
        for(let i=0;i<value.length; i++){
          if(removeIndexs.indexOf(i)==-1){
            tempArr.push(me.filterAttribute.items[i]);
          }
        }
        
        if(tempArr.length==0){
          tempArr.push(JSON.parse(JSON.stringify(this.initializeObj)));
          this.doneReset = true;
        }

        this.inputvalue = [];
        this.previousValue = [];
        me.filterAttribute.items = tempArr;
        me.createComponents();
        
      }
    }
  }

  _getValue() {
    return this.inputvalue;
  }

  private compareWithOldValueChanged(value, itemIdx) {
		const me = this;
		let result = false;
    const val = value;
    const previousVal = me.previousValue[itemIdx];
    const item = me.filterAttribute.items[itemIdx];
    if (!_.isEqual(me.inputvalue, me.previousValue)) {
      result = true;
    } else {
      result = false;
    }
		return result;
	}

  onTimeSelect(event, itemIdx) {
    const me = this;
    if(!me.inputvalue[itemIdx] ) {
      me.inputvalue[itemIdx] = {};
    }
    me.inputvalue[itemIdx][event.attribute] = event.val;
    me.inputvalue[itemIdx][event.attribute+"Object"] = event.valObject;
    me.isValid(me.inputvalue[itemIdx], itemIdx);
    me.onDirty(me.inputvalue[itemIdx], itemIdx);
  }

  onDaysOptionChanged(event, itemIdx) {
    const me = this;
    if(!me.inputvalue[itemIdx] ) {
      me.inputvalue[itemIdx] = {};
    }
    const item = me.filterAttribute.items[itemIdx];
      item.daysAttribute.value = event.val;
    me.inputvalue[itemIdx][event.attribute] = event.val;
    me.isValid(me.inputvalue[itemIdx], itemIdx);
    me.onDirty(me.inputvalue[itemIdx], itemIdx);
  }

  protected updatePlaceholder() {
    let len = this.inputvalue.length;
    let valSelected: string;
    if (this.displayName) {
      valSelected = len === 0 ? this.displayName : len > 1 ? this.displayName + " (" + len + ")" : this.displayName + ":" + this.getConcatenatedValue();
    } else {
      valSelected = this.getConcatenatedValue();
    }
    this.placeholder = valSelected;
    this.changeBkground(len > 0);
    if(len > 1){
      this.tooltip = '';
      this.tooltip = this.getConcatenatedValue();
      this.showTooltip = true;
    }
    else{
      this.tooltip = "";
    }
  }

  protected changeBkground(isSelected: boolean = false) {
    if (this.showSelectedBgColor) {
      let bgColor = isSelected ? 'aliceblue' : this.disabled ? '#eeeeee': '#ffffff';
      this.renderer.setStyle(this.searchbox.nativeElement,'background-color',bgColor);
    } else {
      let bgColor = this.disabled ? '#eeeeee' : '#ffffff';
      this.renderer.setStyle(this.searchbox.nativeElement,'background-color',bgColor);
    }
  }

  private isValueSelected(value) {
    let result = false;
    if(!value) {
      return result;
    }
    if( Array.isArray(value.days) && value.days.length > 0 ) {
      return true;
    } 
    if(value.startTime) {
      return true;
    }    
    if(value.endTime) {
      return true;
    }

    return result;
  }

  private getConcatenatedValue() {
    const me = this;
    let returnVal: Array<string> = [];
    let len = me.inputvalue.length;
    if(len > 0) {
      for(let index = 0; index < len; index++) {
        let selValue = [];
        const val = me.inputvalue[index];
        const item = me.filterAttribute.items[index];
    
        const dayAttributeName = item.daysAttribute.attributeName;
        const startTimeAttributeName = item.startTimeAttribute.attributeName;
        const endTimeAttributeName = item.endTimeAttribute.attributeName;
  
        if( Array.isArray(val[dayAttributeName]) && val[dayAttributeName].length > 0 ) {
          selValue.splice(0,0,val[dayAttributeName].join(","));
        } 
        if(val[startTimeAttributeName]) {
          selValue.splice(1,0,val[startTimeAttributeName]);
        }    
        if(val[endTimeAttributeName]) {
          selValue.splice(2,0,val[endTimeAttributeName]);
        }
        if(selValue.length === 3){
          returnVal.push(selValue[0] + " " + selValue[1] + "-" + selValue[2]);
        }else{
          returnVal.push(selValue.join(" "));
        }
      }
    }
    return me.inputvalue.length > 1 ? returnVal.join(" | ") : returnVal.toString();
  }
  
  isValid(item, itemIdx) {
    const me = this;
    let result = true;
    me.errorJSON[itemIdx].sameStartAndEndTime = false;
    if (item.startTime && item.endTime) {
      if (item.startTime === item.endTime) {
        result = false;
        me.errorJSON[itemIdx].sameStartAndEndTime = true;
      }
    }

    me.errorJSON[itemIdx].empty = false;
    if (me.mandatory) {
      if ((item.days && item.days.length < 1) || !item.startTime || !item.endTime) {
        result = false;
        me.errorJSON[itemIdx].empty = true;
      }
    }

    me.isValidData = result;
    return result;
  }

  onAddItemClick(itemIdx) {
    const me = this;

    const item = me.filterAttribute.items[itemIdx];

    const dayAttributeName = item.daysAttribute.attributeName;
    const startTimeAttributeName = item.startTimeAttribute.attributeName;
    const endTimeAttributeName = item.endTimeAttribute.attributeName;

    const dayDisplayName = item.daysAttribute.displayName;
    const startDisplayName = item.startTimeAttribute.displayName;
    const endDisplayName = item.endTimeAttribute.displayName;

    const dayDataArray = item.daysAttribute.dataArray ? item.daysAttribute.dataArray.map(x => Object.assign({}, x)) : null;
    const startDataArray = item.startTimeAttribute.dataArray;
    const endDataArray = item.endTimeAttribute.dataArray;
    
    
    const itemObj = {
      daysAttribute: {
          displayName: dayDisplayName,
          attributeName: dayAttributeName,
          dataArray: dayDataArray,
      },
      startTimeAttribute: {
          displayName: startDisplayName,
          attributeName: startTimeAttributeName,
          dataArray: startDataArray,
      },
      endTimeAttribute: {
          displayName: endDisplayName,
          attributeName: endTimeAttributeName,
          dataArray: endDataArray,
      }
    };


    //Add UI component 
    me.filterAttribute.items.splice(itemIdx+1,0,itemObj);
    me.errorJSON.splice(itemIdx+1,0,{
      'empty': false,
      'sameStartAndEndTime': false 
    });
    me.createComponents();
  }

  onRemoveItemClick(itemIdx) {
    const me = this;
    //Remove UI component 
    me.filterAttribute.items.splice(itemIdx,1);
    me.errorJSON.splice(itemIdx,1);
    me.inputvalue.splice(itemIdx,1);
    me.createComponents();
  }

  onClearClick(itemIdx) {
    const me = this;
    //Remove UI component 
    const item = me.filterAttribute.items[itemIdx];
    let values = me.inputvalue[itemIdx];

    const dayAttributeName = item.daysAttribute.attributeName;
    const startTimeAttributeName = item.startTimeAttribute.attributeName;
    const endTimeAttributeName = item.endTimeAttribute.attributeName;

    values[dayAttributeName] = [];
    values[startTimeAttributeName] = {
      'text': '',
      'value': ''
    };
    values[endTimeAttributeName] = {
      'text': '',
      'value': ''
    };

    me.daysValue[itemIdx] = me.inputvalue[itemIdx][dayAttributeName];
    me.startTimeValue[itemIdx] = me.inputvalue[itemIdx][startTimeAttributeName];
    me.endTimeValue[itemIdx] = me.inputvalue[itemIdx][endTimeAttributeName];

  }

  protected toTooltipFormat() {
    return _.chain(this.inputvalue)
      .map('label')
      .join(', ')
      .value(); 
      
  }
}
