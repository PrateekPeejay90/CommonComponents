import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentspopupComponent } from './commentspopup.component';
import {TabViewModule,DialogModule} from 'primeng/primeng'
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/primeng';
import { CommentspopupService } from './commentspopup.service';
// import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CommentspopupComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    TabViewModule,
    DialogModule,
    InputTextareaModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule
   ],
  exports: [CommentspopupComponent]
})
export class CommentsPopupModule { }
