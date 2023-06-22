import { NgModule } from "@angular/core";
import { CreateCommunityApi } from "./create-community.api";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { CreateCommunityState } from "./create-community.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([CreateCommunityState])],
  providers: [CreateCommunityApi],
})

export class CreateCommunityModule{}