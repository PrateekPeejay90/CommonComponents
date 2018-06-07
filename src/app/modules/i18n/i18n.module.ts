import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { TranslateService, TRANSLATIONS_TOKEN } from './translate.service';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [],
  declarations: [
    TranslatePipe
  ],
  exports: [
    TranslatePipe
  ]
})
export class I18NModule {

  static forRoot(resources: any): ModuleWithProviders {
    return {
      ngModule: I18NModule,
      providers: [
        TranslateService,
        translationProvider(resources)
      ]
    };
  }
}


export function translationProvider(resources: any): any {
  return [
    { provide: TRANSLATIONS_TOKEN, useValue: resources }
  ];
}
