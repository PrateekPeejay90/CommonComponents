import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Rx";

@Injectable()
export class BookSelectorService {
    jwtToken:string;
    apikey:string;
    headers:any;
    options:any;
    mrdServiceUrl: string;
    constructor(private http: Http){}

    getRatingStreams(mrdServiceUrl,apiKey,jwttoken): Promise<any[]> {
        this.jwtToken=jwttoken;
        this.apikey=apiKey;
        this.headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.jwtToken });
        this.options = new RequestOptions({ headers: this.headers});
        return this.http
            .get(this.generateUrl(mrdServiceUrl), this.options)
            .toPromise()
            .then(res => {
                if (res.json()) {
                    return res.json() as any[];
                } else {
                    return null;
                }
            }).catch(this.handleError)
    }

    generateUrl(serviceUrl){
        return serviceUrl + "/v1/" + this.apikey + "/datastreams";
    }
    // pageno: number, pagesize: number, bookListRequest: any[] ,
    getBooks( mrdServiceUrl, apiKey, jwttoken): Promise<any[]> {
        this.jwtToken = jwttoken;
        this.apikey = apiKey;
        this.headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.jwtToken });
        this.options = new RequestOptions({ headers: this.headers});
        return this.http
        // .post(this.getBooksList(mrdServiceUrl), bookListRequest , this.options)
        .get('./assets/bookselector.json' , this.options).map(
            res => {
                if (res.json()) {
                    return res.json() as any[]
                } else {
                    return null;
                }
            }
        )
        .toPromise();
      }


     getBooksList(serviceUrl) {
        return serviceUrl + '/v1/' + this.apikey +'/book/list';
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
