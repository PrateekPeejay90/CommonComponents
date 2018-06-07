import { Injectable, Inject, InjectionToken } from '@angular/core';

export const TRANSLATIONS_TOKEN = new InjectionToken('translations');
const DEFAULT_LANG_CODE = 'en';

@Injectable()
export class TranslateService {
  private _currentLang: string;

  constructor( @Inject(TRANSLATIONS_TOKEN) private translations: any) {
  }

  public get currentLang() {
    return this._currentLang;
  }

  public use(lang: string): void {
    this._currentLang = lang;
  }

  private translate(key: string): string {
    const translation = key;
    if(!this.currentLang){
      this.use(this.getLangCode());
    }
    const dictionary = this.translations[this.currentLang];
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    return translation;
  }

  public instant(key: string) {
    return this.translate(key);
  }

  public getLangCode() {
    const nav: any = window.navigator;
    const langName = nav.languages ? nav.languages[0] : (nav.language || nav.userLanguage);
    // tslint:disable-next-line:no-console
    if (langName) {
      if (langName.indexOf('-') >= 0) {
        return langName.split('-')[0];
      }
      return langName;
    }
    return DEFAULT_LANG_CODE;
  }

}
