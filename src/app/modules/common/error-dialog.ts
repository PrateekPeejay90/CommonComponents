import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector : 'common-error-dialog',
    template : `<p-dialog header="Error" [closable]="false" [modal]="true" [draggable]="false" [(visible)]="showErrorDialog">
                  <div class="alert  error-message" *ngIf="errorJSON && errorJSON.length>0">
                   <ul style="padding:0px;" *ngFor="let error of errorJSON">
                      <li style="list-style: none;">{{error}}</li>
                   </ul>
                  </div>
                 <p-footer>
                  <button type="button" pButton icon="fa-check" (click)="hide($event)" label="OK"></button>
                </p-footer>
             </p-dialog>`
})

export class ErrorDialogComponent {

  @Input() showErrorDialog : boolean;

  @Output() private onHide = new EventEmitter<any>() ;

  @Input() errorJSON : any;

  hide($event) {
      this.showErrorDialog = false;
      this.onHide.emit({"visible" : this.showErrorDialog});
  }
}
