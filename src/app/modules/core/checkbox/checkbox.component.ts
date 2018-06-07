import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';
import { Checkbox } from 'primeng/primeng';

@Component({
  selector: 'app-checkbox',
  template: `
  	<p-checkbox #chkbox label="{{attribute.displayName}}" [disabled]="attribute.disabled" [(ngModel)]="checked" binary="true" (onChange)="onCheckboxChange($event,attribute.attributeName)"></p-checkbox>`
})
export class CheckBoxComponent implements OnInit {

	subscription: Subscription;
	@ViewChild('chkbox') cbox: Checkbox;
	@Input() attribute:any;
	@Input() checked:boolean = false;
	
	@Output() checkBoxChange:EventEmitter<any> = new EventEmitter<any>();

	ngOnInit(){
		this.checked = (this.checked === true) ? true : false;
		this.attribute.disabled = (this.attribute.disabled === true) ? true : false;
	}
	
	constructor(private el:ElementRef,private sharedService:SharedService){
		this.subscription = sharedService.clearFilters$.subscribe( event => {
			  this.cbox.checked = false;
			  this.attribute.hasSelection = false;
	  	});
	}
	
	onCheckboxChange(event,fieldName){
		this.attribute.hasSelection = (event === true) ? true : false;
		this.checkBoxChange.emit({value:event,attribute:fieldName});
	}
} 