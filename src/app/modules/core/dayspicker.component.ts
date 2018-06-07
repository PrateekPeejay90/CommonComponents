import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DaysAndTimesConst, DefinedDaysConst} from './daysandtimes.constants';
import {SelectItem, ToggleButtonModule, AutoCompleteModule} from 'primeng/primeng';
import {Observable} from 'rxjs';
import { AbstractControl, ValidatorFn, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DaysPickerComponent),
  multi: true
};

const CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DaysPickerComponent),
  multi: true
};

const noop = () => {
};

@Component({
  selector: 'app-dayspicker',
  templateUrl: './dayspicker.view.html',
  styles: [],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DaysPickerComponent implements OnInit {

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  validator: ValidatorFn;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  propagateChange: any = () => { };

  checkedDays;
  definedBtnTypes: SelectItem[] = DefinedDaysConst;
  selectedDefinedDateType: string;
  btnLabelConst = DaysAndTimesConst;
  btnNotPressedCss: string = 'ui-button-secondary';
  onlyDays: boolean = false;
  daysOfWeek: string = '';
  startTime: string = "";
  endTime: string = "";
  minEndTime: Date = new Date();
  data: any[] = [];
  _value = '';
  errorMessage: string = 'This field is required';
  filteredDaysMultipleTotal: any[] = [{"name":"M-F","value":"M-F"},{"name":"Sa-Su","value":"Sa-Su"},{"name":"M-Su","value":"M-Su"},{"name":"Monday","value":"M"},{"name":"Tuesday","value":"Tu"},{"name":"Wednesday","value":"W"},{"name":"Thursday","value":"Th"},{"name":"Friday","value":"F"},{"name":"Saturday","value":"Sa"},{"name":"Sunday","value":"Su"}];
  filteredDaysMultiple: any[] = [];
  selectedDays: any[]
  selectedCheckBoxDays: string[] = [];
  @Output() onSelectEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  get value() {
    return this._value;
  }

  filterDaysMultiple(event) {
    let lfilteredDaysMultiple = this.filteredDaysMultipleTotal;
    this.filteredDaysMultiple = lfilteredDaysMultiple.filter( x => x.name.search(event.query,"ig") !== -1 );
  }

  selectedDay(selectedDayData) {
    let temp: string[] = [];
    this.selectedDays.forEach(days => temp.push(days.value));
    this.selectedCheckBoxDays = temp;
  }

  repopCheckBox(event) {
    let index = this.selectedCheckBoxDays.indexOf(event.value);
    if(index > -1) {
      this.selectedCheckBoxDays.splice(index,1);
    }
  }

  onCheckBoxChange(event) {
    
  }
  // Function to override
  writeValue(value: any) {
    if (value) {
      this.data = value;
    }
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
    return this.validator(c);
  }

}
