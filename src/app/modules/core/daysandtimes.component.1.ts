// import { Component, OnInit, Input, ElementRef, 
//   Renderer2, EventEmitter, Output, forwardRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
// import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
// import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
// import {DaysAndTimesConst, DefinedDaysConst, DefinedTimeConst} from './daysandtimes.constants';
// import {SelectItem, ToggleButtonModule} from 'primeng/primeng';
// import {Observable} from 'rxjs';
// import { AbstractControl, ValidatorFn, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';
// import { DayTimeModel } from './models/product.model';
// import { AbstractComboboxComponent } from './combobox/abstract.combobox.component';
// import { DaysComboboxComponent } from './days-combox/days.combobox.component';
// import { TimePickerComponent } from './timepicker.component';
// import { ErrorDialogComponent } from '../../modules/common/error-dialog';

// import {MessagesModule} from 'primeng/messages';
// import {MessageModule} from 'primeng/message';
// import { SharedService } from './shared.service';
// import { Subscription }   from 'rxjs/Subscription';

// import * as _ from 'lodash';


// //validation function
// function validateDaysAndTimes(): ValidatorFn {
//   return (c: AbstractControl) => {
//     let isDateValid = false;

//     if ( c !== null && c.value !== null ) {
//       isDateValid = ( c.value.daysOfWeek !== undefined && c.value.daysOfWeek !== null && c.value.daysOfWeek !== '');
//     }

//     if (isDateValid) {
//       return null;
//     } else {
//       return {
//         required: true
//       };
//     }
//   };
// }

// const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => DaysandtimesLayoutComponent),
//   multi: true
// };

// const CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR = {
//   provide: NG_VALIDATORS,
//   useExisting: forwardRef(() => DaysandtimesLayoutComponent),
//   multi: true
// };

// const noop = () => {
// };

// @Component({
// 	selector: 'app-daysandtimes-layout',
//   styleUrls: ['./daysandtimes.component.css'],
//   templateUrl: './daysandtimesLayout.component.html',
//   providers: [FormControlDirective, FormGroupDirective, CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
// })
// export class DaysandtimesLayoutComponent implements ControlValueAccessor{
  
//   // Placeholders for the callbacks which are later providesd
//   // by the Control Value Accessor
//   validator: ValidatorFn;
//   private onTouchedCallback: () => void = noop;
//   private onChangeCallback: (_: any) => void = noop;
//   propagateChange: any = () => { };

//   inputvalue: any = [];
//   previousValue: any = [];
//   daysValue: any = [];
//   startTimeValue: any = [];
//   endTimeValue: any = [];
//   previousFilterAttribute: any;
//   errorJSON = [{
//     'sameStartAndEndTime': false 
//   }];

//   @Input() filterAttribute: any;
//   @Input() mandatory: boolean = false;
//   @Input() multiSelect: boolean = false;

//   @Output() addclick: EventEmitter<any> = new EventEmitter<any>();
//   @Output() removeclick: EventEmitter<any> = new EventEmitter<any>();
//   @Output() clearclick: EventEmitter<any> = new EventEmitter<any>();
//   @Output() optionChanged: EventEmitter<any> = new EventEmitter<any>();

// 	constructor() {}
  
//   ngOnInit() {
//     const me = this;
//     me.mandatory = (me.mandatory === true) ? true : false;
//     me.multiSelect = (me.multiSelect === true) ? true : false;

//     me.createComponents();
//   }
  
//   get value() {
//     return this.value;
//   }

//   // Function to override
//   writeValue(value: any) {
//     this.propagateChange(value);
//   }

//   reset() {
//     this.daysValue.length = 0;
//     this.startTimeValue.length = 0;
//     this.endTimeValue.length = 0;
//   }

//   // From ControlValueAccessor interface
//   registerOnChange(fn) {
//     this.propagateChange = fn;
//   }

//   onChange(event) {
//     this.propagateChange(event.value);
//   }
//   // From ControlValueAccessor interface
//   registerOnTouched(fn: any) {
//     this.onTouchedCallback = fn;
//   }

//   validate(c: FormControl) {
//     if( this.mandatory ) {
//       return this.validator(c);
//     } else {
//       return true;
//     }
//   }

//   createComponents() {
//     const me = this;
//     for (let index = 0; index < me.filterAttribute.length; index++) {
//       const item = me.filterAttribute[index];
      
//       const dayAttributeName = item.daysAttribute.attributeName;
//       const startTimeAttributeName = item.startTimeAttribute.attributeName;
//       const endTimeAttributeName = item.endTimeAttribute.attributeName;

//       me.inputvalue[index] = {};
//       me.inputvalue[index][dayAttributeName] = Array.isArray(item.daysAttribute.value) ? item.daysAttribute.value : [];
//       me.inputvalue[index][startTimeAttributeName] = (item.startTimeAttribute.value && typeof(item.startTimeAttribute.value) === 'object' ) ? (item.startTimeAttribute.value.text) ? item.startTimeAttribute.value.text : '' : '';
//       me.inputvalue[index][endTimeAttributeName] = (item.endTimeAttribute.value && typeof(item.endTimeAttribute.value) === 'object' ) ? (item.endTimeAttribute.value.text) ? item.endTimeAttribute.value.text : '' : '';

//       me.previousValue[index] = {};
//       me.previousValue[index][dayAttributeName] = [];
//       me.previousValue[index][startTimeAttributeName] = '';
//       me.previousValue[index][endTimeAttributeName] = '';

//       me.daysValue[index] = me.inputvalue[index][dayAttributeName];
//       me.startTimeValue[index] = {
//         'text': me.inputvalue[index][startTimeAttributeName],
//         'value': me.inputvalue[index][startTimeAttributeName]
//       };
//       me.endTimeValue[index] = {
//         'text': me.inputvalue[index][endTimeAttributeName],
//         'value': me.inputvalue[index][endTimeAttributeName]
//       };
//     }
//   }
  
//   _getValue() {
//     return this.inputvalue;
//   }

//   removeEmptyRotations() {
//     const me = this;
//     let removeIndexs = [];
//     let value = me._getValue();
//     if( value.length > 1 ) {
//       //Here means there are more than one rotations
//       for (let index = 0; index < value.length; index++) {
//         //checking if any of the value is selected in rotation
//         if(!me.isValueSelected(value[index])) {
//           removeIndexs.push(index);
//         }
//       }
//       if( removeIndexs.length > 0 ) {
//         for (let index = 0; index < removeIndexs.length; index++) {
//           me.filterAttribute.splice(removeIndexs[index],1);
//           me.inputvalue.splice(removeIndexs[index],1);
//         }    
//         me.createComponents();
//       }
//     }
//   }

//   private isValueSelected(value) {
//     let result = false;
//     if(!value) {
//       return result;
//     }
//     if( Array.isArray(value.days) && value.days.length > 0 ) {
//       return true;
//     } 
//     if(value.startTime) {
//       return true;
//     }    
//     if(value.endTime) {
//       return true;
//     }

//     return result;
//   }

//   getConcatenatedValue() {
//     const me = this;
//     let selValue = [];
//     let returnVal: Array<string> = [];

//     for (let index = 0; index < me.inputvalue.length; index++) {
//       const val = this.inputvalue[index];

//       if( Array.isArray(val.days) && val.days.length > 0 ) {
//         selValue.splice(0,0,val.days.join(","));
//       } 
//       if(val.startTime) {
//         selValue.splice(1,0,val.startTime);
//       }    
//       if(val.endTime) {
//         selValue.splice(2,0,val.endTime);
//       }
//       if(selValue.length === 3){
//         returnVal.push(selValue[0] + " " + selValue[1] + "-" + selValue[2]);
//       }else{
//         returnVal.push(selValue.join(" "));
//       }
//     }
//     return returnVal.join("| ");
//   }
  
//   isValid(item, itemIdx) {
//     const me = this;
//     let result = true;
//     me.errorJSON[itemIdx].sameStartAndEndTime = false;
//     if(item.startTime && item.endTime) {      
//       if(item.startTime === item.endTime) {
//         result = false;
//         me.errorJSON[itemIdx].sameStartAndEndTime = true;
//       }
//     } 

//     return result;
//   }

//   private compareWithOldValue() {
// 		const me = this;
//     let result = false;
    
//     for (let index = 0; index < me.inputvalue.length; index++) {
//       const val = me.inputvalue[index];
//       const previousVal = me.previousValue[index];
//       const item = me.filterAttribute[index];
  
//       if( previousVal[item.daysAttribute.attributeName].toString() !== val[item.daysAttribute.attributeName].toString() ) {
//         result = true;
//         break;
//       }
//       if( previousVal[item.startTimeAttribute.attributeName] !== val[item.startTimeAttribute.attributeName] ) {
//         result = true;
//         break;
//       }
//       if( previousVal[item.endTimeAttribute.attributeName] !== val[item.endTimeAttribute.attributeName] ) {
//         result = true;
//         break;
//       }      
//     }
    
// 		return result; 
//   }

//   private compareWithOldValueChanged(value, itemIdx) {
// 		const me = this;
// 		let result = false;
//     const val = value;
//     const previousVal = me.previousValue[itemIdx];
//     const item = me.filterAttribute[itemIdx];

//     if( previousVal[item.daysAttribute.attributeName].toString() !== val[item.daysAttribute.attributeName].toString() ) {
//       return true;
//     }
//     if( previousVal[item.startTimeAttribute.attributeName] !== val[item.startTimeAttribute.attributeName] ) {
//       return true;
//     }
//     if( previousVal[item.endTimeAttribute.attributeName] !== val[item.endTimeAttribute.attributeName] ) {
//       return true;
//     }
// 		return result; 
//   }
  
//   onAddItemClick(itemIdx) {
//     const me = this;
//     const item = {
//       daysAttribute: {
//           displayName: "Days",
//           attributeName: 'days'
//       },
//       startTimeAttribute: {
//           displayName: "Start Time",
//           attributeName: 'startTime'
//       },
//       endTimeAttribute: {
//           displayName: "End Time",
//           attributeName: 'endTime'
//       }
//     };

//     //Add UI component 
//     me.filterAttribute.splice(itemIdx+1,0,item);
//     me.errorJSON.splice(itemIdx+1,0,{
//       'sameStartAndEndTime': false 
//     });
//     me.createComponents();
//     me.addclick.emit(itemIdx);
//   }

//   onRemoveItemClick(itemIdx) {
//     const me = this;
//     //Remove UI component 
//     me.filterAttribute.splice(itemIdx,1);
//     me.errorJSON.splice(itemIdx,1);
//     me.inputvalue.splice(itemIdx,1);
//     me.createComponents();
//     me.removeclick.emit(itemIdx);
//   }

//   onClearClick(itemIdx) {
//     const me = this;
//     //Remove UI component 
//     const item = me.filterAttribute[itemIdx];
//     let values = me.inputvalue[itemIdx];

//     const dayAttributeName = item.daysAttribute.attributeName;
//     const startTimeAttributeName = item.startTimeAttribute.attributeName;
//     const endTimeAttributeName = item.endTimeAttribute.attributeName;

//     values[dayAttributeName] = [];
//     values[startTimeAttributeName] = {
//       'text': '',
//       'value': ''
//     };
//     values[endTimeAttributeName] = {
//       'text': '',
//       'value': ''
//     };

//     me.daysValue[itemIdx] = me.inputvalue[itemIdx][dayAttributeName];
//     me.startTimeValue[itemIdx] = me.inputvalue[itemIdx][startTimeAttributeName];
//     me.endTimeValue[itemIdx] = me.inputvalue[itemIdx][endTimeAttributeName];

//     me.clearclick.emit(itemIdx);
//   }

//   clearAll() {
//     const me = this;
    
//     me.daysValue = {};
//     me.startTimeValue = [];
//     me.endTimeValue = [];
//     me.inputvalue.length = 0;
    
//     //Remove UI component 
//     me.filterAttribute = [{
//       daysAttribute: {
//           displayName: "Days",
//           attributeName: 'days'
//       },
//       startTimeAttribute: {
//           displayName: "Start Time",
//           attributeName: 'startTime'
//       },
//       endTimeAttribute: {
//           displayName: "End Time",
//           attributeName: 'endTime'
//       }
//     }];

//     me.createComponents();
//   }

//   onTimeSelect(event, itemIdx) {
//     const me = this;
//     if(!me.inputvalue[itemIdx] ) {
//       me.inputvalue[itemIdx] = {};
//     }
//     me.inputvalue[itemIdx][event.attribute] = event.val;
//     me.inputvalue[itemIdx][event.attribute+"Object"] = event.valObject;
//     me.isValid(me.inputvalue[itemIdx], itemIdx);
//     me.optionChanged.emit({
//       event:event, 
//       val: me.inputvalue[itemIdx],
//       index:itemIdx
//     });
//   }

//   onDaysOptionChanged(event, itemIdx) {
//     const me = this;
//     if(!me.inputvalue[itemIdx] ) {
//       me.inputvalue[itemIdx] = {};
//     }
//     me.inputvalue[itemIdx][event.attribute] = event.val;
//     me.optionChanged.emit({
//       event:event, 
//       val: me.inputvalue[itemIdx],
//       index:itemIdx
//     });
//   }
  
//   isDirty(item, itemIdx) {
// 		const me = this;
// 		return me.compareWithOldValue();
//   }
// }


// @Component({
//   selector: 'app-daysandtimes',
//   templateUrl: './daysandtimes.component.html',
//   styleUrls: ['./daysandtimes.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class DaysandtimesComponent implements OnInit, ControlValueAccessor {

//   // Placeholders for the callbacks which are later providesd
//   // by the Control Value Accessor
//   validator: ValidatorFn;
//   private onTouchedCallback: () => void = noop;
//   private onChangeCallback: (_: any) => void = noop;
//   propagateChange: any = () => { };
//   subscription: Subscription;

//   @Input() id: string = '';
//   @Input() mandatory: boolean = false;
//   @Input() disabled: boolean = false;
//   @Input() attributeName: string;  
//   @Input() displayName: string;
//   @Input() showTooltip: boolean = true;
//   @Input() filterAttribute: any;
//   @Input() multiSelect: boolean = false;
//   @Output() optionChanged: EventEmitter<any> = new EventEmitter<any>();

//   @ViewChild('dropmenu') private menuSection;
//   @ViewChild('searchbox') searchbox: ElementRef;

//   @ViewChild('daysandtimesLayoutComponent') daysandtimesLayoutComponent: DaysandtimesLayoutComponent;

//   protected placeholder: string = '';
//   protected ref: ElementRef;
//   protected renderer: Renderer2;
//   dialogWidth: number;
//   closable:boolean = true;
//   showDialog: boolean = false;
//   isDirty: boolean = false;
//   tooltip: string;
  
//   btnLabelConst = DaysAndTimesConst;
//   btnNotPressedCss: string = 'ui-button-secondary';

//   inputvalue: any = [];
//   previousValue: any = [];
//   previousFilterAttribute: any;

//   constructor(ref: ElementRef, renderer: Renderer2,private sharedService:SharedService) {
//     this.ref = ref;
//     this.renderer = renderer;
//     this.dialogWidth = this.vhTOpxWidth(100); 
//     this.subscription = sharedService.clearFilters$.subscribe( event => {
//       this.filterAttribute.hasSelection = false;
//       this.daysandtimesLayoutComponent.clearAll();
//    });
//   }

//   vhTOpxWidth(value) {
//     var w = window,
//       d = document,
//       e = d.documentElement,
//       g = d.getElementsByTagName('body')[0],
//       x = w.innerWidth || e.clientWidth || g.clientWidth;

//     var result = (x*value)/100;
//     return result;
//   }

//   ngOnInit() {}
  
//   onSearchboxFocus(isFocus: boolean) {
//     this.showDialog = true;
//   }

//   onDoneClick() {
//     const me = this;
//     let isValid = true;

//     me.daysandtimesLayoutComponent.removeEmptyRotations();

//     let value = me.daysandtimesLayoutComponent._getValue();
//     for (let index = 0; index < value.length; index++) {
//       const val = value[index];
//       if(!me.daysandtimesLayoutComponent.isValid(val, index)) {
//         isValid = false;
//         break;
//       }
//     }

//     if(me.isDirty && isValid) {
//       me.updatePlaceholder();
//       this.filterAttribute.hasSelection=true;
//       me.optionChanged.emit({val:value,attribute:me.attributeName});
//       me.showDialog = false;
//     }
//   }

//   onDialogHide() {
//     const me = this;
//     me.filterAttribute = _.cloneDeep(me.previousFilterAttribute);
//     me.inputvalue = _.cloneDeep(me.previousValue);
//     me.daysandtimesLayoutComponent.createComponents();
//   }
  
//   onDialogShow() {
//     const me = this;
//     setTimeout(function(){
//       me.isDirty = false;
//       me.previousFilterAttribute = _.cloneDeep(me.filterAttribute);
//       me.previousValue = _.cloneDeep(me.inputvalue);
//     }, 10);
//   }


  
//   protected updatePlaceholder() {
//     let valSelected: string = this.daysandtimesLayoutComponent.getConcatenatedValue();
//   	this.placeholder = valSelected !== "" ? (this.displayName + ":" + valSelected) : this.displayName;
//     this.changeBkground(valSelected !== "");
//   }

//   protected changeBkground(isSelected: boolean = false) {
//   	let bgColor = isSelected ? 'aliceblue' : this.disabled ? '#eeeeee': '#ffffff';
//     this.renderer.setStyle(this.searchbox.nativeElement,'background-color',bgColor);
//   }

//   onAddItemClick(itemIdx) {
//   }

//   onRemoveItemClick(itemIdx) {
//   }

//   onClearClick(itemIdx) {
//   }

//   onDaysAndTimesLayoutOptionChanged(event) {
//     const me = this;

//     me.isDirty = me.daysandtimesLayoutComponent.isDirty();
//   }
// }
