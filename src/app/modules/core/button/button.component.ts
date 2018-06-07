import { Component,Input, Output, EventEmitter} from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-button',
  template: `
  <button style="width:100%;" pButton type="button"  label="{{attribute.displayName}}" (click)="handleButtonClick($event)"></button>`
})
export class ButtonComponent {
	subscription: Subscription;
    @Input() attribute:any;
    @Input() id: string = '';
	@Output() buttonClick:EventEmitter<any> = new EventEmitter<any>();
 
    constructor(private sharedService:SharedService){
		this.subscription = sharedService.clearFilters$.subscribe( event => {			 
			  this.attribute.hasSelection = false;
	  	});
    }    
       
    handleButtonClick(event){
        this.buttonClick.emit(event);
    }
} 