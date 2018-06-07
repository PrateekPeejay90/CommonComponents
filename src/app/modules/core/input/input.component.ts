import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, Renderer2} from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-input',
  template: `
  	<input type="text" pInputText (input)="sharedService.onInput($event)" (change)="onChange($event,attribute.attributeName)" placeholder="{{attribute.displayName}}"/>
	<div #img [style.visibility]="'hidden'" (click)="sharedService.onClearClick($event,onTextChange,attribute.attributeName);handleClearAllFilter($event, attribute.attributeName);" class="item-close"></div>`,
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
	
		subscription: Subscription;
		@Input() attribute:any;
		@Output() onTextChange:EventEmitter<any> = new EventEmitter<any>();
		@ViewChild('img') clearImg:any;
		clearAll: boolean = false;
	
		ngOnInit(){}
		
		constructor(private el:ElementRef,public sharedService:SharedService, private renderer:Renderer2){
			sharedService.renderer = renderer;
			this.subscription = sharedService.clearFilters$.subscribe( event => {
			this.attribute.hasSelection = false;
			this.el.nativeElement.firstElementChild.value='';
			this.renderer.setStyle(this.clearImg.nativeElement,'visibility','hidden');
			this.renderer.setStyle( this.el.nativeElement.firstElementChild,'background-color','#ffffff');
		   });
		}
		
		onChange(event,field){
			this.handleClearAllFilter(event, field);
		}
		  
		handleClearAllFilter(event,field){
			this.attribute.hasSelection =( (this.el.nativeElement.firstElementChild.value).length > 0) ? true : false;
			this.onTextChange.emit({originalEvent:event,value: this.el.nativeElement.firstElementChild.value, attribute: field});
		}
	}