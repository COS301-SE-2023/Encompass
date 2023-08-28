import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { EventApi } from "./event.api";
import { EventState } from "./event.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([EventState])],
  providers: [EventApi],
})

export class EventModule{}