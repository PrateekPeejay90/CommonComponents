import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule,DialogModule,ConfirmDialogModule, CheckboxModule, DataTableModule,
  SelectButtonModule,FieldsetModule, RadioButtonModule} from 'primeng/primeng';
import { SharedService } from '../core/shared.service';
import { ExportComponent } from './export.component';
import {ExportService} from './export.service';
import {HttpModule}    from '@angular/http';

@NgModule({
  imports: [
  	BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    SelectButtonModule,
    FieldsetModule,
    CheckboxModule,
    HttpModule,
    DataTableModule
  ],
  declarations: [
    ExportComponent
  ],
  exports: [ExportComponent],
  providers: [SharedService, ExportService]
})
export class ExportModule { }
