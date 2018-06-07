import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Rx";

@Injectable()
export class CommentspopupService {

  // mrdServiceUrl: any;
  threadId: any;
  xapikey: any;
  headers:any;
  options:any;
  constructor(private http: Http) { }


getThreads(entityId,threadGetUrl,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
    this.headers = new Headers({ 'Content-Type': 'application/json','x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});


// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
    let url = threadGetUrl + "?externalEntityId=" + entityId;
    return this.http.get(url, this.options)
        .toPromise()
        .then(res => {
            if (res.json()) {
                return res.json() as any[]
            } else {
                return null;
            }
        }).catch(this.handleError)
}



  getCommentsByThreadId(threadGetUrl,threadId,limit,asc,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   this.threadId = threadId;
 
    this.headers = new Headers({ 'Content-Type': 'application/json','x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});


// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
let url = threadGetUrl+"/"+this.threadId+"/note?limit="+limit+"&asc="+asc
return this.http.get(url , this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}


createThread(threadPostUrl,threadName,updatedTime,externalEntityId,read, xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   //this.threadId = threadId;
 
    this.headers = new Headers({ 'x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});
let threadObj = {
notesCount: 0,
threadName: threadName,
updatedTime: updatedTime,
externalEntityId: externalEntityId,
threadId: null,
};
let url = threadPostUrl
// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
return this.http.post(url ,threadObj, this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}



createNotesByThreadId(threadPostUrl,newReply,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   //this.threadId = threadId;

    this.headers = new Headers({ 'x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});

let url = threadPostUrl+"/"+newReply.threadId+"/note";
// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
return this.http.post(url ,newReply, this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}


updateNotesCount(threadGetUrl,threadId,notesCount,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   //this.threadId = threadId;
    this.headers = new Headers({ 'x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});
let threadObj = {
    "operation": "replace",
    "attributeName": "notesCount",
    "newValue": notesCount,
    "threadId": threadId
};
let url = threadGetUrl+"/"+threadId;
//let url = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/d77e98ec-63f7-11e8-88e1-1b735a669b51";
// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
return this.http.patch(url ,threadObj, this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}



threadEdit(threadGetUrl, noteBody,threadId,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   //this.threadId = threadId;
    this.headers = new Headers({ 'x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});
let threadObj = {
    "operation":"replace",
    "attributeName":"threadName",
    "newValue": noteBody,
    "threadId": threadId
};
let url = threadGetUrl+"/"+threadId;
//let url = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/d77e98ec-63f7-11e8-88e1-1b735a669b51";
// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
return this.http.patch(url ,threadObj, this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}


threadUpdatedTimeEdit(threadGetUrl, updatedTime,threadId,xApiKey): Promise<any[]> {
  
    //this.jwtToken = jwttoken;
   // this.apikey = apiKey;
   //this.threadId = threadId;
    this.headers = new Headers({ 'x-api-key': xApiKey});
    this.options = new RequestOptions({ headers: this.headers});
let threadObj = {
    "operation":"replace",
    "attributeName":"updatedTime",
    "newValue": updatedTime,
    "threadId": threadId
};
let url = threadGetUrl+"/"+threadId;
//let url = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/d77e98ec-63f7-11e8-88e1-1b735a669b51";
// this.xapikey = "PQpmCzUDF1kWhIHR7QHY2mGM8AATDIPard7cEjqd";
// this.mrdServiceUrl = "https://byr5crypk1.execute-api.us-east-1.amazonaws.com/dev/thread/c89a8855-541f-11e8-a291-29a009ad8e6e/note?limit=10&asc=false";
return this.http.patch(url ,threadObj, this.options)
    .toPromise()
    .then(res => {
        if (res.json()) {
            return res.json() as any[]
        } else {
            return null;
        }
    }).catch(this.handleError)
}



private handleError(error: any): Promise<any> {
  return Promise.reject(error.message || error);
}

}
