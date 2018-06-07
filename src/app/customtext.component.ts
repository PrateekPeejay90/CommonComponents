import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-input',
  template: `
    <div>
        <input [(ngModel)]=customValue (keyup)="onKeyUp($event)" (change)="onChange($event)" /> 
    </div>
    <div>{{counterValue}}</div>
  `,
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomtextComponent),
      multi: true
    }
  ]
})
export class CustomtextComponent implements ControlValueAccessor {

    customValue: string = "";
  @Input() counterValue = 0;
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  writeValue(value: any) {
    if (value) {
        this.customValue = value;
    }
  }

  onKeyUp(event) {
    this.counterValue = event.target.value.length;
  }

  onChange(event) {
    this.customValue = event.target.value;
    this.propagateChange(this.customValue);
  }
}