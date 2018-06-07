import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class PermissionsService {

  private headers: Headers;
  private options: RequestOptions;

  // Flag to check if the permission is loaded 
  private isLoaded: boolean = false;
  private allowedPermissionNames: string[] = [];

  constructor(private http: Http) {}

  // Method to load permissions.
  load(p_url, jwtToken): Promise<void> {
    let me = this;
    
    if(me.isLoaded) {
      return;
    }
    
    if(me.isEmpty(p_url)) {
      me.handleError('Unable to load permission, Loading url not found.');
      return null;
    }
    
    if(me.isEmpty(jwtToken)) {
      me.handleError('Unable to load permission, JWT not found.');
      return null;
    }

    let jwtTokenDecoded = me.parseJwt(jwtToken);
    let permissionIds = jwtTokenDecoded.permissions;
    const url = p_url;
    const body = JSON.stringify(permissionIds);

    this.headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': jwtToken});
    this.options = new RequestOptions({ headers: this.headers});

    return this.http
      .post(url, body, this.options)
      .toPromise()
      .then(res => {
          if (res.json()) {
            me.isLoaded = true;
            
            // Initialize the permission JSON in load.
            let permissionArray = res.json();
            me.loadPermissions(permissionArray);
            return true;
          } else {
            return false;
          }
      }).catch(this.handleHttpError);
  }

  loadPermissions(permissionArray) {
    let me = this;
    
    if(me.isEmpty(permissionArray)) {
      me.handleError('Unable to load permission, Permission object not found.');
      return null;
    }

    permissionArray.forEach((item)=>{
      me.allowedPermissionNames.push(item.label);
    });
  }
  
  // Method to reload permissions
  reload(p_url, jwtToken): Promise<void> {
    const me = this;

    if(me.isEmpty(p_url)) {
      me.handleError('Unable to load permission, Loading url not found.');
      return null;
    }

    if(me.isEmpty(jwtToken)) {
      me.handleError('Unable to reload permission, JWT not found.');
      return null;
    }

    me.isLoaded = false;
    me.allowedPermissionNames.length = 0;

    return me.load(p_url, jwtToken);
  }

  // method to check specific permission 
  hasPermission(permissionName): boolean {
    const me = this;
    let result = false;

    if(me.isEmpty(permissionName)) {
      me.handleError('The permission name is not valid');
      return result;
    }

    // Check if the permission is present is the available list
    if( me.allowedPermissionNames.indexOf(permissionName) > -1 ) {
      result = true;
    }

    return result;
  }

  private handleHttpError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private handleError(errorMsg: any) {
    return errorMsg;
  }

  private isEmpty(value) {
    if (typeof value === 'object') {
        if (value instanceof Object && !Object.keys(value).length && value.constructor === Object) {
            return true;
        }

        return false;
    } else {
        return (!value);
    }
  }

  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
