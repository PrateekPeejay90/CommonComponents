import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, Renderer2,ViewEncapsulation} from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    selector: 'app-index-field',
    template: `  
        <div class="container" pTooltip="Enter index value" [tooltipDisabled]="!!indexInput.value">
            <p-selectButton #inputSwitch [(ngModel)]="selectedBtn" styleClass="indexCls" [options]="types" (onChange)="handleChange()"></p-selectButton>
            <input type="text" pInputText #indexInput (keypress)="validate($event)" [placeholder]=placeholder [(ngModel)]="inputValue" 
            (blur)="handleChange()"
            (paste)="validate($event)"            
            />
            <span class="fa fa-fw fa-times remove-icon" [pTooltip]="Clear" *ngIf="indexInput.value"
            (click)="clearAll();">
        </span>                     
        </div>          
    `,
    styleUrls: ['./index-filter.component.css'],
    encapsulation : ViewEncapsulation.None
  })
  export class IndexFilterComponent implements OnInit {    
         
    @Input() attribute:any;
    @Input() placeholder:string;
    @Output() onIndexInputChange:EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('inputSwitch') inputSwitchEl:any;
    @ViewChild('indexInput') indexInputEl: ElementRef;
    inputValue:string = "";   
    selectedBtn:any;     
    subscription: Subscription;    
    types = [];
    options: any;
    constructor(private el:ElementRef,private sharedService:SharedService, private renderer: Renderer2){    console.log("init"); 
        this.subscription = sharedService.clearFilters$.subscribe( event => {
            this.initialize();    
        }); 
    }

    ngOnInit() {
        this.types.push({label: '>', value: 'greaterThan'});
        this.types.push({label: '<', value: 'lessThan'});
        this.selectedBtn = "lessThan";    
    }

    handleChange(){ 
        let options = {
            operator : this.selectedBtn==="lessThan" ? "<": ">",
            operatorString : this.selectedBtn,
            value:this.inputValue
        }           
        this.attribute.hasSelection = (this.inputValue === '')? false: true; 
        this.changeInputBackground(this.inputValue);       
        this.onIndexInputChange.emit(options);        
    }

    validate(event) {         
        let inputV, validKey, valid;    
        let regex = /^\d*(\.\d{0,2})?$/; 
        if(event.type == "keypress"){
            validKey = (event.charCode >= 48 && event.charCode <= 57) ||  (event.charCode == 46) ? true : false;
            if(validKey){
                inputV = this.inputValue + event.key;
                valid = regex.test(inputV);
            }else{                
                return false;
            }       
        }else if(event.type == "paste"){
            let  clipboardData = event.clipboardData;
            let pastedData = clipboardData.getData('Text');
            inputV = this.inputValue + pastedData.trim(); 
            valid = regex.test(inputV); 
            if(valid){
                this.changeInputBackground(inputV);
            }         
        }else{
            valid =  regex.test(event);
        }      
        
        return valid ? true : false;     
    }

    changeInputBackground(inputValue) {     
      let bgColor =  inputValue.trim() != "" ? 'aliceblue' : '#ffffff';
      this.renderer.setStyle(this.indexInputEl.nativeElement,'background-color',bgColor);
    }
    initialize(){
        this.attribute.hasSelection = false;
        this.inputValue = ""; 
        this.selectedBtn = "lessThan";  
        this.changeInputBackground(this.inputValue); 
        this.options = {
            operator : "<",
            operatorString : this.selectedBtn,
            value:this.inputValue
        };   
    }
    clearAll(){
        this.initialize();
        this.onIndexInputChange.emit(this.options); 
      }

} 