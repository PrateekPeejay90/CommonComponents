import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule,DropdownModule,CalendarModule,InputTextModule,TooltipModule,ButtonModule,DialogModule,
	DataListModule,DataTableModule,ConfirmDialogModule,SidebarModule,CheckboxModule,
	SelectButtonModule,ToggleButtonModule,AutoCompleteModule, InputSwitchModule} from 'primeng/primeng';
import { TopfilterComponent,FilterObjectComponent } from './topfilter.component';
import { FilterPanelComponent } from './filterpanel.component';
import { MultiselectComponent } from '../core/multiselect.component';
import { SingleselectComponent } from '../core/singleselect/singleselect.component';
import { BroadcastCalendar } from '../core/broadcastcalendar/broadcastcalendar.component';
import { InputComponent } from '../core/input/input.component';
import { CheckBoxComponent } from '../core/checkbox/checkbox.component';
import { TimePickerComponent } from '../core/timepicker.component';
import { DaysPickerComponent } from '../core/dayspicker.component';
import { DaysandtimesComponent } from '../core/daysandtimes.component';
import { MSEditComboboxComponent } from '../core/combobox/msedit.combobox.component';
import { LoadingIndicatorComponent } from '../core/indicators/loading.indicator.component';
import { SearchKeywordPipe } from '../core/pipes/search.keyword.pipe';
import { InfiniteScrollModule } from '../core/virtual-scroll/infinite.scroll.module';
import { EffectiveDatesComponent } from '../core/effectivedates/effectivedates.component';
import { I18NModule } from '../i18n/i18n.module';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../i18n/lang-en';
import { SharedService } from '../core/shared.service';
import { DaysComboboxComponent } from '../core/days-combox/days.combobox.component';
import { ErrorDialogComponent } from '../common/error-dialog';
import { IndexFilterComponent} from '../core/index/index-filter.component';
import {ButtonComponent} from '../core/button/button.component';


import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PermissionCheckPipe } from '../permissions/permissioncheck.pipe';

const resourceBundle: any = {};
resourceBundle[LANG_EN_NAME] = LANG_EN_TRANS;

@NgModule({
  imports: [
  	BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DialogModule,
    DataListModule,
    DataTableModule,
    ConfirmDialogModule,
    SidebarModule,
    CheckboxModule,
    ToggleButtonModule,
    SelectButtonModule,
    AutoCompleteModule,
    InfiniteScrollModule,
    MessagesModule,
    MessageModule,
    InputSwitchModule,
    I18NModule.forRoot(resourceBundle)
  ],
  declarations: [
  	TopfilterComponent,
  	FilterObjectComponent,
  	MultiselectComponent,
  	SingleselectComponent,
  	BroadcastCalendar,
  	FilterPanelComponent,
  	InputComponent,
  	DaysandtimesComponent,
  	DaysPickerComponent,
  	TimePickerComponent,
  	MSEditComboboxComponent,
  	LoadingIndicatorComponent,
  	SearchKeywordPipe,
  	EffectiveDatesComponent,
    CheckBoxComponent,
    DaysComboboxComponent,
    ErrorDialogComponent,
    IndexFilterComponent,
    PermissionCheckPipe,
    ButtonComponent
  ],
  exports: [TopfilterComponent,FilterPanelComponent,MultiselectComponent,EffectiveDatesComponent, BroadcastCalendar,
    MSEditComboboxComponent,PermissionCheckPipe,DaysandtimesComponent,DaysComboboxComponent],
  providers: [SharedService]
})
export class FilterPanelModule { }
