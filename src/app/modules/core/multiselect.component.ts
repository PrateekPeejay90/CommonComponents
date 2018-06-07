import { NgModule, OnChanges, AfterViewInit,AfterContentInit,Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, forwardRef, ElementRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import { SharedService } from './shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-multiselect',
  providers: [FormControlDirective, FormGroupDirective, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiselectComponent),
    multi: true
  }],
  templateUrl: './multiselect.view.html',
  styles: []
})
export class MultiselectComponent implements OnInit, OnChanges, AfterViewInit,AfterContentInit {
  @Input() filterAttribute: any;
  @Output() multiChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiBlur: EventEmitter<any> = new EventEmitter<any>();
  @Input() defaultLabel: string = 'Select';
  maxSelected: number;
  filterPlaceHolder: string = 'Search';
  selectedItems: any[] = [];
  isCount: boolean;
  @Input() panelStyle = null;
  @Input() appendTo = null;
  _value = '';
  lastGroupValue: any;
  @ViewChild('multiSelectItem') multi: MultiSelect;
  propagateChange: any = () => { };
  subscription: Subscription;

  constructor(private el: ElementRef,renderer:Renderer2, private sharedService: SharedService) {
  	this.subscription = sharedService.clearFilters$.subscribe( event => {
  		this.onCloseAllClick();
  	});
  }

  ngAfterViewInit() {
    const filterBox = this.el.nativeElement.querySelector('.ui-inputtext');
    if(filterBox){
    	filterBox.setAttribute('placeholder', this.filterAttribute.attributeName || this.filterPlaceHolder);
    }
  }
  
  ngOnChanges(){}
  
  ngAfterContentInit() {}
  
  public ngOnInit(): void {
    
    this.maxSelected = this.filterAttribute.maxSelected ? this.filterAttribute.maxSelected : this.multi.maxSelectedLabels;
    if (this.filterAttribute.displayLabelsAfterMax === true) {
      this.multi.updateLabel = function() {
        this.isCount = true;
        if (this.value && this.options && this.value.length && this.displaySelectedLabel) {
          let label = '';
          for (let i = 0; i < this.value.length; i++) {
            if (this.isCount) {
              label = this.defaultLabel + ' : ' + this.value.length + ' Selected';
            } else {
              const itemLabel = this.findLabelByValue(this.value[i]);
              if (itemLabel) {
                if (label.length > 0) {
                  label = label + ', ';
                }
                label = label + itemLabel;
              }
            }
          }

          if (this.value.length <= this.maxSelectedLabels) {
            this.valuesAsString = label;
          } else {
            this.valuesAsString = label + '';
          }
          this.renderer.setStyle(this.container,'background-color','aliceblue');
        } else {
          this.valuesAsString = this.defaultLabel;
          if(this.container){
          	this.renderer.setStyle(this.container,'background-color','#ffffff');
          }
        }
        
      };
    }

  }

  get value() {
    return this._value;
  }

  writeValue(value: any) {
    if (value) {
      this.selectedItems = value;
    }
  }
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  
  onChange(event) {
    this.propagateChange(event.value);
  }
  
  registerOnTouched(fn: () => void): void { }

  onMultiSelectBlur(msField) {
    this.multiBlur.emit({value: this.selectedItems,comp: msField});
  }

  showToolTip() {
    if (this.selectedItems && this.filterAttribute.dataArray) {
      let tmp = [];
      for (let val of this.filterAttribute.dataArray) {
        if (this.selectedItems.indexOf(val.value) >= 0) {
          tmp.push(val.label + ' ');
        }
      }
      return tmp.toString();
    }
  }

  public triggerClickEvent(itemId) {
    let event = this.createNewEvent('clickEvent');
    this.multi.onItemClick(event, itemId);
  }

  public createNewEvent(eventName) {
    let event;
    if (typeof (Event) === 'function') {
      event = new Event(eventName);
    } else {
      event = document.createEvent('Event');
      event.initEvent(eventName, true, true);
    }
    return event;
  }

  public onMultiselectChange(evt) {
    this.multiChange.emit({ originalEvent: evt, value: evt.value });
  }

  public showCloseAll() {
    return this.selectedItems.length > 0 ? 'visible' : 'hidden';
  }

  public onCloseAllClick() {
    this.selectedItems = [];
    this.propagateChange([]);
    this.multiBlur.emit({ value: [] });
  }

}
