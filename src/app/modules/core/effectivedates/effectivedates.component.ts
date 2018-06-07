import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-effectivedates',
  templateUrl: './effectivedates.view.html'
})

export class EffectiveDatesComponent implements OnInit {
	
	@Input() attribute:any;
	@Input() display:boolean = false;
	
	@Output() onPanelHide:EventEmitter<any> = new EventEmitter<any>();
	
	closable:boolean = true;
	fromDate:Date;
	toDate:Date;
	
	ngOnInit(){
		this.fromDate = this.attribute.fromDate || '';
		this.toDate = this.attribute.toDate || '';
	}
	
	onDialogHide(){
		this.display = false;
		this.onPanelHide.emit({fromDate:this.fromDate,toDate:this.toDate,attributeName:this.attribute.attributeName});
	}
	
	onFromDateChange(event){
		this.fromDate = event.value;
		this.attribute.fromDate = this.fromDate;
	}
	
	onToDateChange(event){
		this.toDate = event.value;
		this.attribute.toDate = this.toDate;
	}
}