import { NgModule } from "@angular/core";
import { ThemesApi } from "./themes.api";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { ThemesState } from "./themes.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([ThemesState])],
  providers: [ThemesApi],
})

export class ThemesModule{}