import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'confirm-popup',
    templateUrl: './confirmpopup.component.html',
    styleUrls: ['./confirmpopup.component.css']
})
export class ConfirmPopupComponent {
    
    logoutUrl: string;

    constructor() {}
    public confirmPopupData: any = {};

    public ngOnInit() {
        
    }

    show(options){
        this.confirmPopupData.title = "Are you sure?";
        this.confirmPopupData.desc = "Do you want to process?";
        this.confirmPopupData.yesButtonLabel = "Yes";
        this.confirmPopupData.noButtonLabel = "No";
        this.confirmPopupData.success = null;
        this.confirmPopupData.fail = null;
        this.confirmPopupData.show = true;

        if(options.title){
            this.confirmPopupData.title = options.title;
        }

        if(options.desc){
            this.confirmPopupData.desc = options.desc;
        }

        if(options.yesButtonLabel){
            this.confirmPopupData.yesButtonLabel = options.yesButtonLabel;
        }

        if(options.noButtonLabel){
            this.confirmPopupData.noButtonLabel = options.noButtonLabel;
        }

        if(options.success){
            this.confirmPopupData.success = options.success;
        }

        if(options.fail){
            this.confirmPopupData.fail = options.fail;
        }

    }

    yesClick(){
        this.confirmPopupData.show = false;
        if(this.confirmPopupData.success){
            this.confirmPopupData.success();
        }
    }

    noClick(){
        this.confirmPopupData.show = false;
        if(this.confirmPopupData.fail){
            this.confirmPopupData.fail();
        }
    }



}
