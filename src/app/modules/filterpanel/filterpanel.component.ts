import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import * as _ from 'lodash';
import { SharedService } from '../core/shared.service';

@Component({
  selector: 'app-filterpanel',
  templateUrl: './filterpanel.view.html',
  styleUrls: ['./filterpanel.component.css']
})
export class FilterPanelComponent implements OnInit {

	display: boolean = true;
	groupedFilterAttributes: any[] = [];
	attributeGroups:any[] = [];
	visibleAttributes:any[] = [] ;
	searchedAttribute:string = "";
	selDate: Date;
    selDates: Date[];
    bcDaterange: any;
    hasSelectedVal:number = 1;
    showDaysTimesPanel:boolean = false;
    showDateRangePanel:boolean = false;
    msOptionMap:any;
    
    @Input() filterAttributes:any;
    @Input() showSearchFilter:boolean;
    @Input() panelId: string = new Date().getTime().toString();
	
	@Output() textChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() dateChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() multiChange:EventEmitter<any> = new EventEmitter<any>();
    @Output() multiBlur:EventEmitter<any> = new EventEmitter<any>();
    @Output() selChange:EventEmitter<any> = new EventEmitter<any>();
    @Output() bcDaterangeChange:EventEmitter<any> = new EventEmitter<any>();
    @Output() daterangeChange:EventEmitter<any> = new EventEmitter<any>();
    @Output() chkBoxChange:EventEmitter<any> = new EventEmitter<any>();
    @Output() clearAllFilters:EventEmitter<any> = new EventEmitter<any>();
    @Output() btnClicked:EventEmitter<any> = new EventEmitter<any>();
    @Output() msOptionChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() daysAndTimeChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() daysChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() timeChanged:EventEmitter<any> = new EventEmitter<any>();
    @Output() indexInputChanged:EventEmitter<any> = new EventEmitter<any>();    
    
    @ViewChild('daterangebtn') dtRangeBtn:any;
    @ViewChildren('combobox') combos: QueryList<any>;
    @ViewChildren('button') buttons: QueryList<any>;
    @ViewChildren('daysandtimescombo') daysandtimescombo: QueryList<any>;
	
	ngOnInit(){
		let groups = _.groupBy(this.filterAttributes,function(attr){
			return attr.groupName;
        });
		this.groupedFilterAttributes = Object.keys(groups).map(key => groups[key]);
        this.attributeGroups = Object.keys(groups);
	}
	
	constructor(private renderer:Renderer2, private sharedService:SharedService){}
	
	trackByFn(index,item){
		return index;
	}
	
	onFilter(event) {
        this.searchedAttribute = event.target.value.trim().toLowerCase();
        this.visibleAttributes = [];
        for(let i = 0; i < this.groupedFilterAttributes.length; i++) {
            let option = this.groupedFilterAttributes[i];
            for(let j=0;j<option.length;j++){
	            if(option[j].attributeName.toLowerCase().indexOf(this.searchedAttribute) > -1) {
	                this.visibleAttributes.push(option[j]);
	            }
            }
        }
    }

    getComponentByAttributeName(id: string, dataType:string): any {
        if (!id) {
            return null;
        }   
        switch(dataType){
           case 'button': 
                return this.buttons.toArray()
                    .find((button: any) => {          
                    return this.panelId + '_' + id === button.id;
                });                        
           default: 
                return this.combos.toArray()
                    .find((combo: any) => {
                    return this.panelId + '_' + id === combo.id;
                });            
        }     
    }
    
    isItemVisible(option): boolean {
        if(this.searchedAttribute && this.searchedAttribute.trim().length) {
            for(let i = 0; i < this.visibleAttributes.length; i++) {
                if(this.visibleAttributes[i].attributeName == option.attributeName) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
	
	onTextChange(event){
	  	this.textChanged.emit(event);
  	}
  
    onDateSelect(event,selectionMode,field){
	  	let evt = {originalEvent: event,attribute: field};
	  	if(selectionMode === 'single'){
	  		evt["value"] = this.selDate;
	  	}else{
	  		evt["value"] = this.selDates;
	  	}
	  	this.dateChanged.emit(evt);
	}
  
    onMultiSelectChange(event,fieldName){
	    /*if(fieldName === 'Markets'){
	    	this.stationSelParentData = event.value;
	    }else{
	    	this.marketSelParentData = event.value;
	    }*/
    }
  
    onMultiBlur(event){
	  	this.multiBlur.emit(event);
    }
  
    onSingleSelectChange(event,field){
  		event.attribute = field;
  		this.selChange.emit(event);
    }
  
    onBCDaterangeChange(event,fieldName){
    	let val = event.value ? event.value : event.currentTarget ? event.currentTarget.firstElementChild.firstElementChild.value : '';
  	    this.bcDaterangeChange.emit({value: val, attribute:fieldName});
    }
    
    onCheckBoxChange(event){
    	this.chkBoxChange.emit(event);
    }
    
    onDaysAndTimeSelect(event){}
    
    public showCloseAll() {
    	return this.searchedAttribute !== '' ? 'visible' : 'hidden';
    }

  	public onCloseAllClick(event) {
	    this.searchedAttribute = '';
	    event.currentTarget.previousElementSibling.value = this.searchedAttribute;
    }
    
    showGroup(grp){
    	let grpAttrs = [];
    	if(this.searchedAttribute && this.searchedAttribute.trim().length) {
    		grpAttrs = this.visibleAttributes.filter(attr => (!attr.groupName && grp === 'undefined') || attr.groupName === grp);
    	}
    	return grpAttrs.length > 0;
    }
    
    clearAll(event,emitEvt:boolean = true){
        this.sharedService.clearFilters({clearAll:true});
        if(emitEvt){
            this.clearAllFilters.emit();
        }
    }
    
    onDateRangePanelHide(event,displayName){
    	this.showDateRangePanel = false;
    	if(event.fromDate || event.toDate){
	    	this.daterangeChange.emit(event);
	    }
    }  
    
    onBtnClick(event, attributeName){ 
        let obj = {
          event : event,
          attributeName: attributeName
        }    
        this.btnClicked.emit(obj);        
    }

    onOptionChanged(event){
        this.msOptionChanged.emit(event);
    }

    onDaysAndTimesOptionChanged(event){
        this.daysAndTimeChanged.emit(event);
    }
  
    onDaysOptionChanged(event){
        this.daysChanged.emit(event);
    }
  
    onTimeOptionChanged(event){
        this.timeChanged.emit(event);
    }  

    onIndexInputChange(event){          
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
        }
    }

    
}