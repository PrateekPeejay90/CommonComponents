import {Component,Renderer2,OnInit,Inject} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

declare var NAV_BAR: any;

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopBarComponent {
    
    logoutUrl: string;

    constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document) {}

    public ngOnInit() {
        
        //this.logoutUrl = environment.logoutUrl;
        if(!window.location.origin){
            let value = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            Object.defineProperty(window.location,'origin',{value, enumerable: true});
        }
        this.logoutUrl = window.location.origin + "/logoff.do";

        let s = this._renderer2.createElement('script');
        s.src = environment.navBarJs;
        s.type = 'text/javascript';
        s.setAttribute('API_DOMAIN',environment.apiDomain);

        this._renderer2.appendChild(this._document.body, s);

        //adjust body height
        var headerHeight = this._document.querySelector('.topbar').clientHeight + 2;
        this._document.body.style.paddingTop = headerHeight + 'px';
    }

    openMenu(){
         if(this._document.getElementById('global-nav-bar').classList.contains('show-global-nav')){
             NAV_BAR.hide();
         }else{
             NAV_BAR.show({"top":"31px"});
         }
    }

}
