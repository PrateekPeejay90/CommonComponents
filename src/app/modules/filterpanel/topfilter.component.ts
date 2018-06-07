import { Component, OnInit, AfterViewInit, Input, Output, ElementRef, EventEmitter, HostListener, Inject, forwardRef,
	Renderer2, ViewEncapsulation, ViewChildren, ViewChild, QueryList, ContentChild } from '@angular/core';
import { SharedService } from '../core/shared.service';

@Component({
	selector: 'op-filterobject',
	templateUrl: './filterobject.view.html',
	styleUrls: ['./filterobject.component.css']
})
export class FilterObjectComponent{

	@Input() attributes: any;
  @Input() panelId: string = new Date().getTime().toString();
  @ViewChildren('combobox') combos: QueryList<any>;
  @ViewChildren('button') buttons: QueryList<any>;
  @ViewChildren('daysandtimescombo') daysandtimescombo: QueryList<any>;

  constructor(@Inject(forwardRef(() => TopfilterComponent)) public topFilter:TopfilterComponent){}
}

@Component({
  selector: 'app-topfilter',
  templateUrl: './topfilter.component.html',
  styleUrls: ['./topfilter.component.css']
})
export class TopfilterComponent implements OnInit, AfterViewInit {
  //showMoreClick: any;

  @Input() panelId: string = new Date().getTime().toString();
  @Input() filterAttributes:any[];
  @Input() canShowApplyButton: boolean = false;
  @Input() canShowClearButton: boolean = false;
  @Input() sortBy: string;
  @Input() showSearchFilter:boolean = true;
  @Input() filterStyle: any;
  @Input() filterStyleClass: string = '';
  
  @Output() textChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() dateChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() multiChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() multiBlur:EventEmitter<any> = new EventEmitter<any>();
  @Output() selChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() bcDaterangeChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() daterangeChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() chkBoxChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() msOptionChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() btnClicked:EventEmitter<any> = new EventEmitter<any>();
  @Output() daysAndTimeChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() daysChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() timeChanged:EventEmitter<any> = new EventEmitter<any>();
  @Output() clearAllFilters:EventEmitter<any> = new EventEmitter<any>();
  @Output() onApplyFilter:EventEmitter<any> = new EventEmitter<any>();
  @Output() showMoreClick:EventEmitter<any> = new EventEmitter<any>();
  @Output() indexInputChanged: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild('freqfilterobjectpanel') frequentAttr: FilterObjectComponent;
  @ViewChild('otherfilterobjectpanel') otherAttr: FilterObjectComponent;
  
  freqAttributes:any[];
  otherAttributes:any[];
  showMoreFiltersPanel: boolean = false;
  showDateRangePanel:boolean = false;
  selectedValue: string= "val1";
  selectedCity: any;
  selDate: Date;
  selDates: Date[];
  bcDaterange: any;
  marketSelParentData: any = [];
  stationSelParentData: any = [];
  topFilterOffset: number;
  clearPanelVisible: boolean;
  clearPanelSticky: boolean;
  filterPanelVisible: boolean = true;
  styleClass = "ui-g-12 topfilter filter-row-2 custom-filter-bar bkgd-secondary  ";
  showMore: boolean = false;
  filterCount:number = 0; 
  dummyDemoProp:any;
  
  ngOnInit() {

    this.canShowApplyButton = (this.canShowApplyButton === true) ? true : false;
   
    this.freqAttributes = this.filterAttributes.filter(attribute => attribute.frequent);
    this.freqAttributes.sort(this.sortBy === 'alphabet' ? this.sortByAlphabets : this.sortByOrder);
    this.otherAttributes = this.filterAttributes.filter(attribute => !attribute.frequent);
    this.otherAttributes.sort(this.sortBy === 'alphabet' ? this.sortByAlphabets : this.sortByOrder);
    this.filterAttributes = this.freqAttributes.concat(this.otherAttributes);
    this.styleClass += this.filterStyleClass;
    this.filterCount = this.otherAttributes.length;
    this.showMore = this.filterAttributes.filter(attr => !attr.frequent && attr.hasSelection).length > 0;
  }
  
  ngAfterViewInit(){
    this.topFilterOffset = this.el.nativeElement.offsetTop;
    this.handleClearAllFilters();
    for(let attr of this.otherAttributes){ 
      if(attr.dataType === 'multiselect' && attr.dataArray.length === 1){
       this.showMore= true;
      }
    }
  }

  constructor(private el: ElementRef, private sharedService: SharedService, private renderer:Renderer2){}
  
  private sortByOrder(a,b) {
  	if (a.sortOrder < b.sortOrder)
	    return -1;
	  if (a.sortOrder > b.sortOrder)
	    return 1;
	  return 0;
  }
  
   private sortByAlphabets(a,b) {
	  if (a.attributeName < b.attributeName)
	    return -1;
	  if (a.attributeName > b.attributeName)
	    return 1;
	  return 0;
  }
  
  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.clearPanelSticky = (window.pageYOffset > this.topFilterOffset) ? true : false;
  }

  clearAll(event,emitEvt:boolean = true){
    this.sharedService.clearFilters({clearAll:true});
    if(emitEvt){
      this.clearAllFilters.emit();
    }
  }

  handleClearAllFilters(){  
    this.clearPanelVisible = false;
    for(let filterAttribute of this.filterAttributes){ 
      if (filterAttribute.hasSelection) {
        this.clearPanelVisible = true;
        break;
      }
    }
  }
  
  getComponentByAttributeName(id: string, dataType:string): any {  
    if (!id) {
      return null;
    }   
    switch(dataType){
      case 'button': {
          let buttons = this.frequentAttr.buttons ? this.frequentAttr.buttons.toArray() : [];
          if(this.otherAttr && this.otherAttr.buttons){
            buttons = buttons.concat(this.otherAttr.buttons.toArray());
          }
          if(!buttons) return;
          return buttons
            .find((button: any) => {          
            return this.panelId + '_' + id === button.id;
          }); 
      }

      case 'daysAndTimes': {
      let daysandtimes = this.frequentAttr.daysandtimescombo ? this.frequentAttr.daysandtimescombo.toArray() : [];
      if(this.otherAttr && this.otherAttr.daysandtimescombo){
        daysandtimes = daysandtimes.concat(this.otherAttr.daysandtimescombo.toArray());
      }
      if(!daysandtimes) return;
      return daysandtimes
          .find((daysandtime: any) => {          
          return this.panelId + '_' + id === daysandtime.id;
      });    
      }

      default: {
        let combos = this.frequentAttr.combos ? this.frequentAttr.combos.toArray() : [];
        if(this.otherAttr && this.otherAttr.combos){
          combos = combos.concat(this.otherAttr.combos.toArray());
        }
        if(!combos) return;
        return combos
            .find((combo: any) => {
            return this.panelId + '_' + id === combo.id;
        });  
      }          
    }     
  }

  onTextChange(event){
    this.handleClearAllFilters();
  	this.textChanged.emit(event);
  }
  
  onDateSelect(event,selectionMode,field){
   	let evt = {originalEvent: event.originalEvent? event.originalEvent : event,attribute: event.attribute ? event.attribute : field};
  	if(selectionMode === 'single'){
  		evt["value"] = event.value ? event.value : this.selDate;
  	}else{
  		evt["value"] = event.value ? event.value : this.selDates;
  	}
  	this.dateChanged.emit(evt);
  } 
  
  onMultiSelectChange(event,fieldName){
    this.handleClearAllFilters();
    if(fieldName === 'Markets'){
    	this.stationSelParentData = event.value;
    }else{
    	this.marketSelParentData = event.value;
    }
  }
  
  onMultiBlur(event){
  	this.multiBlur.emit(event);
  }
  
  onSingleSelectChange(event,field) {
    this.handleClearAllFilters();
  	if(!event.attribute){
  		event.attribute = field;
  	}
  	this.selChange.emit(event);
  }
  
  onBCDaterangeChange(event,fieldName){
    this.handleClearAllFilters();    
  	let val = event.value ? event.value : event.currentTarget ? event.currentTarget.firstElementChild.firstElementChild.value : '';
  	this.bcDaterangeChange.emit({value: val, attribute:event.attribute ? event.attribute : fieldName});
  }
  
  onDateRangePanelHide(event){
  	this.showDateRangePanel = false;
    if(event.fromDate || event.toDate){
      this.daterangeChange.emit(event);
    }
  }
  
  onCheckboxChange(event,fieldName){
    this.handleClearAllFilters();
    this.chkBoxChange.emit({value:event.value,attribute:event.attribute? event.attribute : fieldName});
  }
  
  showAllFilters(){
  	this.showMoreFiltersPanel = true;
  }
  
  onOptionChanged(event){
    this.handleClearAllFilters();
  	this.msOptionChanged.emit(event);
  }

  onDaysAndTimesOptionChanged(event){
    this.handleClearAllFilters();
  	this.daysAndTimeChanged.emit(event);
  }

  onDaysOptionChanged(event){
    this.handleClearAllFilters();
  	this.daysChanged.emit(event);
  }

  onTimeOptionChanged(event){
    this.handleClearAllFilters();
  	this.timeChanged.emit(event);
  }

  onBtnClick(event, attributeName){ 
    let obj = {
      event : event,
      attributeName: attributeName
    }   
    this.btnClicked.emit(obj);  
  }

  onApplyFilterClick(event){
  	this.onApplyFilter.emit(event);
  } 
  
  onShowClick(event, showMore){
  	this.showMoreClick.emit({event:event, showMore: showMore});
  } 

  onIndexInputChange(event){
    this.handleClearAllFilters();   
  	this.indexInputChanged.emit(event);
  }

  changeComponentProperties(attributeName:string, dataType:string, options:any){
    let component =  this.getComponentByAttributeName(attributeName, dataType); 
    if(component === undefined || options === undefined) return;        
    if(dataType == "button"){
       let label = component.attribute.displayName;
       if(options == "selected" && String(label).indexOf('Selected') == -1){              
          component.attribute.displayName = "Selected " +label;
          component.attribute.hasSelection = true;           
       }else if(options == "deselected" && String(label).indexOf('Selected') != -1){
           component.attribute.displayName = label.replace("Selected", "");
           component.attribute.hasSelection = false;
       }else{
            component.attribute.displayName = label;
       }
       this.handleClearAllFilters();  
    }
  }



}
