import { NgModule } from '@angular/core';
import { ConfirmPopupComponent } from './confirmpopup.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    ConfirmPopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ConfirmPopupComponent]
})
export class ConfirmPopupModule { }
