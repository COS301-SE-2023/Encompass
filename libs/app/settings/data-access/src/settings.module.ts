import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SettingsState } from "./settings.state";
import { SettingsApi } from './settings.api'

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([SettingsState])],
  providers: [SettingsApi],
})

export class SettingsModule{}