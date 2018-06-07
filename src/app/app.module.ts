import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FilterPanelModule } from './modules/filterpanel/filterpanel.module';
import { TopBarModule } from './modules/topbar/topbar.module';
import { CommentsPopupModule } from './modules/commentspopup/commentspopup.module';
import { ConfirmPopupModule } from './modules/confirmpopup/confirmpopup.module';
import { ExportModule } from './modules/export/export.module';
import { CustomTreeModule} from './modules/core/treetable/customtree.module';
import { ButtonModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { LANG_EN_NAME, LANG_EN_TRANS } from './modules/i18n/lang-en';
import { I18NModule } from './modules/i18n/i18n.module';
import {BookSelectorModule} from './modules/bookselector/bookselector.module';
import {DialogModule} from 'primeng/dialog';


const resourceBundle: any = {};
resourceBundle[LANG_EN_NAME] = LANG_EN_TRANS;

@NgModule({
  declarations: [
    AppComponent
  
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    FilterPanelModule,
    TopBarModule,
    CommentsPopupModule,
    ConfirmPopupModule,
    ExportModule,
    CustomTreeModule,
    BookSelectorModule,
    DialogModule,
    I18NModule.forRoot(resourceBundle),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
