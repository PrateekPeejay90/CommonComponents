import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ButtonModule, TreeNode } from 'primeng/primeng';
@Component({
    selector: 'op-bookselector-dialog',
    template: `

        <p-dialog header="Book Selection" [(visible)]="showErrorDialog" (onHide)="hide($event)"  [modal]="true" [responsive]="true" styleClass="BselectHeader" [width]="900">
            <op-bookselector  (onSelected)="showBtnPanel($event)" [statusColumn]="statusColumn"></op-bookselector>
            <p-footer *ngIf = "rowSelected">
            <div class="btnPanel">
           <p-button  label="Cancel" (click)="hide($event)"></p-button>
           <p-button  label="Select" (click)="select($event)"></p-button>
            </div> 
           </p-footer>
        </p-dialog>
      
    `
})

export class BookSelectorDialogComponent implements OnInit {
    @Input()
    showErrorDialog: boolean = true;
    @Input()
    selectedBookArray: Array<any> = [];
    @Input()
    statusColumn: boolean ;
    @Output()
    private onHide = new EventEmitter<any>();
    @Output()
    private selectedData = new EventEmitter<any>();
    rowSelected: boolean = false;
    
    hide($event) {
        this.onHide.emit(this.showErrorDialog);
    }
    showBtnPanel($event) {
        if ($event.node['data']['bookName'])
        this.rowSelected = $event.selectedCount;
        this.selectedBookArray = $event.selectedData;
    }
    select($event) { 
        this.selectedData.emit(this.selectedBookArray);
        this.hide(event);
    }
    ngOnInit() { }
}