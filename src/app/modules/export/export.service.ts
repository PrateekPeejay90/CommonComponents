import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Rx";

@Injectable()
export class ExportService {
    jwtToken:string;
    apikey:string;
    headers:any;
    options:any;
    exportServiceUrl: string;
    constructor(private http: Http){}

    getTemplateList(moduleName, exportType, exportTemplateUrl,apiKey,jwttoken): Promise<any[]> {
        this.exportServiceUrl = exportTemplateUrl;
        this.jwtToken=jwttoken;
        this.apikey=apiKey;
         this.headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.jwtToken });
         this.options = new RequestOptions({ headers: this.headers});
        return this.http
            .get(this.getTemplateData(moduleName,exportType), this.options)
            .toPromise()
            .then(res => {
                if (res.json()) {
                    return res.json() as any[]
                } else {
                    return null;
                }
            }).catch(this.handleError)
    }
    getTemplateData(moduleName,exportType){
        return this.exportServiceUrl + "/v1/" + this.apikey + "/templateservice/getTemplateDetailsByType?"+"modulename="+ moduleName+"&exporttype="+exportType;
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}