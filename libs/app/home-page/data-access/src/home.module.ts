import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomeApi } from "./home.api";
import { HomeState } from "./home.state";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([HomeState, HttpClientModule])],
  providers: [HomeApi],
})

export class HomeModule{}