import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, DataTableModule, TreeTableModule } from 'primeng/primeng';
import { CustomTreeTable,CustomUITreeRow,CustomRowExpand} from './customtree.component';
import { PaginatorModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    PaginatorModule
  ],
  exports: [CustomTreeTable,SharedModule,CustomRowExpand, DataTableModule, TreeTableModule ],
  declarations: [CustomTreeTable,CustomUITreeRow,CustomRowExpand]
})
export class CustomTreeModule { }