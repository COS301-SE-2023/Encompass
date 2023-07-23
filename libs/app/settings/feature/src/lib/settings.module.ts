import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SettingsPage } from './settings.component';
import { SettingsRouting } from './settings.routing';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { FormsModule } from '@angular/forms';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, SettingsRouting, NgxsModule.forFeature([ProfileState]), FormsModule],
  declarations: [SettingsPage],
  providers: [],
})
export class SettingsModule {
}