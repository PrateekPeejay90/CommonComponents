import {Injectable,Renderer2} from '@angular/core';
import { Observable } from 'rxjs';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharedService {

	private clearAllFilters = new Subject<any>();
	clearFilters$ = this.clearAllFilters.asObservable();
	private loadMSOptions = new Subject<any>();
	loadData$ = this.loadMSOptions.asObservable();

	private closeOnOutsideClick = new Subject<any>();
	closeOnOutside$ = this.closeOnOutsideClick.asObservable();
	
	renderer:Renderer2;

  constructor(){}
  
  onInput(event){
	let color = '#ffffff';
	if(event.currentTarget.value !== ''){
		color = 'aliceblue';
	}
	this.renderer.setStyle(event.currentTarget,'background-color',color);
	this.showClear(event,event.currentTarget.value);
  }
	
  showClear(fld,val){
	let visible = val !== '' ? 'visible' : 'hidden';
	fld.currentTarget.nextElementSibling.style.visibility = visible;
  }
  
  onClearClick(event,evt,field){
    this.renderer.setStyle(event.target,'visibility','hidden');
    event.target.previousElementSibling.value = '';
    this.renderer.setStyle(event.target.previousElementSibling,'background-color','#ffffff');
    evt.emit({originalEvent:event,value: event.target.previousElementSibling.value, attribute: field});
  }

  clearFilters(event:any){
  	this.clearAllFilters.next(event);
  }
  
  loadData(attribute,data){
  	this.loadMSOptions.next({attribute:attribute, data:data});
	}
	
	dropdownClose(data) {
		this.closeOnOutsideClick.next(data);
	}
} 
