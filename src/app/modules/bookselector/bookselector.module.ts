import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule}    from '@angular/http';
import { BookSelectorComponent } from './bookselector.component';
import { BookSelectorDialogComponent } from './bookselector.dialog.component';
import {DialogModule} from 'primeng/dialog';
import {TreeTableModule} from 'primeng/treetable';
import {MultiSelectModule} from 'primeng/multiselect';
import { FilterPanelModule } from '../filterpanel/filterpanel.module';
import { CustomTreeModule } from '../core/treetable/customtree.module';
import {ButtonModule} from 'primeng/button';
import { BookSelectorService } from './bookselector.service';

@NgModule({
  imports: [
  	BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DialogModule,
    TreeTableModule,
    MultiSelectModule,
    FilterPanelModule,
    CustomTreeModule,
    ButtonModule
  ],
  declarations: [
    BookSelectorComponent,
    BookSelectorDialogComponent,
  ],
  exports: [BookSelectorComponent,BookSelectorDialogComponent],
  providers: [BookSelectorService]
})
export class BookSelectorModule { }
