import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ModuleWithProviders, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { BookSelectorDialogComponent } from './bookselector.dialog.component';
import { BookSelectorComponent } from './bookselector.component';
import { By } from '@angular/platform-browser';


describe('BookSelector Test Cases', () => {
  let bsDialog: BookSelectorDialogComponent;
  let bsTemplate: BookSelectorComponent;
  let fixture: ComponentFixture<BookSelectorDialogComponent>;
  let el: DebugElement;
  beforeEach(async(() => {
    bsDialog = new BookSelectorDialogComponent();
    TestBed.configureTestingModule({
      declarations: [
        BookSelectorDialogComponent
      ],
    schemas: [ NO_ERRORS_SCHEMA  , CUSTOM_ELEMENTS_SCHEMA]
    }) 
    fixture = TestBed.createComponent(BookSelectorDialogComponent);
    bsDialog = fixture.componentInstance;
    el = fixture.debugElement.query(By.css('p-dialog'));
  }));

  it('Initializing BookSelectorDialogComponent', () => {
    expect(BookSelectorDialogComponent).toBeTruthy();
  });

  it('Initializing BookSelectorComponent', () => {
    expect(BookSelectorComponent).toBeTruthy();
  });
 
  it('Setting showErrorDialog to false hides the dialog box', () => {
    expect(el.nativeElement.textContent.trim()).toBe('');
    bsDialog.showErrorDialog = false;
    fixture.detectChanges();
    expect(el.nativeElement.visible).toBeFalsy();
});
 
});