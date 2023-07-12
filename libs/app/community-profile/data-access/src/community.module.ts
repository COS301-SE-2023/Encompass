import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { CommunityState } from "./community.state";
import { CommunityApi } from "./community.api";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([CommunityState])],
  providers: [CommunityApi],
})

export class CommunityModule{}