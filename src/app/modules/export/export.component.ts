import {Observable} from 'rxjs/Rx';
import {SelectItem, ConfirmationService, Message} from 'primeng/primeng';
import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import {FieldsetModule} from 'primeng/fieldset';
import {ExportService} from './export.service';

@Component({
    selector: 'export-component',
    templateUrl: './export.view.html',
    styleUrls: ['./export.component.css'],
    providers: [ExportService]
})

export class ExportComponent implements OnInit {
   // @Input() tenantId: string;
    @Input() moduleName: string;
    @Input() exportTemplateUrl: string;
    @Input() apiKey:string;
    @Input() jwtToken:string;
    selectedModuleProperty: string;
    exportSelectedOption: string;
    generateSeperateFileFlag: boolean = false;
    templateList: any[];
    showTemplateList: boolean = false;
    exportType:string;
    selTempList = [];
    @Output() generateFileFlag:EventEmitter<any>=new EventEmitter();
    @Output() export:EventEmitter<any> = new EventEmitter();
    @Output() cancelExport:EventEmitter <any> =new EventEmitter();
    selectedTemplate: string;    
    constructor(private exportService: ExportService){}
    ngOnInit(){
    }

    getTemplateList(){
        this.exportType=this.exportSelectedOption;
        this.selectedTemplate = "";
        this.exportService.getTemplateList(this.moduleName, this.exportType, this.exportTemplateUrl,this.apiKey,this.jwtToken).then(res => {
            this.showTemplateList = true;
            this.templateList = res;
            for(let i=0; i < this.templateList.length; i++){
                this.templateList[i]["selectedTemplate"] = false;                
            }
        }).catch(err => {
            this.handleError(err);
        })
        
    }
    public handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    selectOneTemplate(event, market, id){
        if(event){
            let selValue = this.selectedTemplate;
            this.templateList.forEach(function(value, index){
                if (value.templateID === selValue){
                    value.selectedTemplate = false;
                }
            });
            this.selectedTemplate = id;
            this.selTempList=[];
            this.selTempList.push(market);
        }else{
            this.selectedTemplate="";
        }
    }
    public checkFlag(){
         this.generateFileFlag.emit(this.generateSeperateFileFlag);
    }
    public onCancel(){
        this.exportSelectedOption="";
        this.generateSeperateFileFlag=false;
        this.showTemplateList = false;
        this.cancelExport.emit("cancel the selection");
    }
    public exportData() {
        this.export.emit({"templateList" : this.selTempList});
        this.exportSelectedOption="";
        this.generateSeperateFileFlag=false;
        this.showTemplateList = false;
    }

}
