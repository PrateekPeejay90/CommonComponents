import { NgModule, OnChanges, AfterViewInit,ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dropdown, SelectItem } from 'primeng/primeng';
import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, forwardRef, ElementRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-singleselect',
  providers: [FormControlDirective, FormGroupDirective, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SingleselectComponent)
  }],
  templateUrl: './singleselect.view.html',
  styleUrls: ['./singleselect.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SingleselectComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() filterAttribute: any;
  @Output() selChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() defaultLabel: string = 'Select';
  maxSelected: number;
  filterPlaceHolder: string = 'Search';
  selectedItem: SelectItem;
  isCount: boolean;
  @Input() panelStyle = null;
  @Input() appendTo = null;
  _value = '';
  lastGroupValue: any;
  @ViewChild('singleSelectItem') dd: Dropdown;
  propagateChange: any = () => { };
  subscription: Subscription;
  clearAll: boolean = false;
  valSelected:boolean = false;

  constructor(private el: ElementRef, private sharedService: SharedService) {
  	this.subscription = sharedService.clearFilters$.subscribe( event => {
      this.clearAll = event.clearAll;
      this.filterAttribute.hasSelection = false;
  		this.onCloseAllClick();
  	});
  }

  ngAfterViewInit() {
    const filterBox = this.el.nativeElement.querySelector('.ui-inputtext');
    filterBox.setAttribute('placeholder', this.filterAttribute.displayName || this.filterPlaceHolder);
  }
  
  ngOnChanges() {}

  public ngOnInit(): void {}

  get value() {
    return this._value;
  }

  writeValue(value: any) {
    if (value) {
      this.selectedItem = value;
    }
  }
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  
  onChange(event) {
    this.propagateChange(event.value);
  }
  
  registerOnTouched(fn: () => void): void { }

  onSingleSelectBlur(event) {
    this.propagateChange(this.selectedItem);
  }

  showToolTip() {
    if (this.selectedItem && this.filterAttribute.dataArray) {
      let tmp = "";
      for (let val of this.filterAttribute.dataArray) {
        if (this.selectedItem===val.value) {
          tmp= val.label;
        }
      }
      return tmp;
    }
  }

  public triggerClickEvent(itemId) {
    let event = this.createNewEvent('clickEvent');
    this.dd.onItemClick(event, itemId);
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

  public onSingleselectChange(evt) {
    this.valSelected = evt.value;
    this.filterAttribute.hasSelection = (evt.value) ? true : false;
    this.selChange.emit({ originalEvent: evt.originalEvent, value: evt.value });
  }

  public showCloseAll() {
    return this.selectedItem ? 'visible' : 'hidden';
  }

  public onCloseAllClick() {
    this.selectedItem = null;
    this.propagateChange({});
    if(!this.clearAll){
    	this.selChange.emit({ value: {} });
    }
  }

}
