import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IndexFilterComponent } from './index-filter.component';
import {TooltipModule,SelectButtonModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import { SharedService } from '../shared.service';
import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";


describe('IndexFilterComponent', () => {
  let component: IndexFilterComponent;
  let fixture: ComponentFixture<IndexFilterComponent>;
  let sharedService: SharedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, TooltipModule, SelectButtonModule],
      declarations: [ IndexFilterComponent ],
      providers:[SharedService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFilterComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.get(SharedService);
    fixture.detectChanges();
  });

  it('::component should be created', () => {   
    console.log('IndexFilterComponent', component);
    expect(component).toBeTruthy(); 
  });

  it('::placeholder should display the correct input value', () => {   
    component.placeholder = "Enter Index value";   
    let inputEl = fixture.debugElement.query(By.css('input[type=text]'));   
    fixture.detectChanges(); 
    expect(inputEl.nativeElement.placeholder).toEqual('Enter Index value');
  });
 
  it('::validate method is called on paste', fakeAsync( () => {
      fixture.detectChanges();
      spyOn(component, 'validate').and.callThrough();
      let inputEl = fixture.debugElement.query(By.css('input[type=text]'));   
      inputEl.triggerEventHandler('paste', null);
      tick(); 
      fixture.detectChanges();
      expect(component.validate).toHaveBeenCalled();
  }));

  it('::validate method is called on keypress', fakeAsync( () => {
    fixture.detectChanges();
    spyOn(component, 'validate').and.callThrough();
    let inputEl = fixture.debugElement.query(By.css('input[type=text]'));   
    inputEl.triggerEventHandler('keypress', null);
    tick(); 
    fixture.detectChanges();
    expect(component.validate).toHaveBeenCalled();
  }));

  it('::handleChange method is called on keyup', fakeAsync( () => {
    fixture.detectChanges();
    spyOn(component, 'handleChange'); 
    let inputEl = fixture.debugElement.query(By.css('input[type=text]'));   
    inputEl.triggerEventHandler('keyup', null);
    tick(); 
    fixture.detectChanges();
    expect(component.handleChange).toHaveBeenCalled();
  }));

  it('::index input text should be cleared when clearAllFilters event is emitted', fakeAsync( () => {
    component.attribute = {};
    component.inputValue = '123'; 
    component.attribute.hasSelection = true;
    component.selectedBtn = "greaterThan"; 
    sharedService.clearFilters({clearAll:true});
    expect(component.attribute.hasSelection).toBe(false);
    expect(component.inputValue).toBe("");
    expect(component.selectedBtn).toBe('lessThan'); 
  }));
 
  it('::onIndexInputChange is emitted on input text change', () => { 
     component.inputValue = "5";
     component.attribute = {};
     let inputEl = fixture.debugElement.query(By.css('input[type=text]'));     
     let selectedBtn = fixture.componentInstance.selectedBtn;  
     let operator:string = selectedBtn ==="lessThan" ? "<": ">";
     let operatorString:string = selectedBtn
     let value: any = component.inputValue;
     component.onIndexInputChange.subscribe(options =>{
      expect(operator).toContain(options.operator);
      expect(operatorString).toContain(options.operatorString);
      expect(value).toContain(options.value);    
     });
     inputEl.triggerEventHandler('keyup', selectedBtn); 
     expect(component.attribute.hasSelection).toBeTruthy();    
   
  }); 

  it('::onIndexInputChange is emitted on select Button change', () => { 
    component.inputValue = "";
    component.attribute = {};
    let inputSelecthDebugEl = fixture.debugElement.query(By.css('.ui-selectbutton'));     
    let sel = fixture.componentInstance.selectedBtn = "lessThan";
    let operator:string = sel ==="lessThan" ? "<": ">";
    let operatorString:string = sel;
    let value: any = component.inputValue;
    component.onIndexInputChange.subscribe(options =>{     
     expect(operator).toContain(options.operator);
     expect(operatorString).toContain(options.operatorString);
     expect(value).toBe(options.value);    
    });   
    fixture.componentInstance.inputSwitchEl.onChange.emit(sel);   
    expect(component.attribute.hasSelection).toBeFalsy();  
  
 });

  it('::attribute hasSelection has to  false if index value is empty', () => {    
    component.attribute = {};
    component.inputValue = '';
    let inputEl = fixture.debugElement.query(By.css('input[type=text]')); 
    inputEl.triggerEventHandler('keyup', fixture.componentInstance.selectedBtn); 
    expect(component.attribute.hasSelection).toBeFalsy();
 });

  
  it('::input text will only accept numbers', fakeAsync( () => {  
    let input = 124; 
    expect(component.validate(input)).toBeTruthy();
  }));

  it('::input text will only accept numbers upto 2 decimal digits', fakeAsync( () => {  
    let input = 124.456; 
    expect(component.validate(input)).toBeFalsy();
  }));



});  


