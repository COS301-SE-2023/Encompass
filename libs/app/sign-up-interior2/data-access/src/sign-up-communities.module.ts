import { NgModule } from "@angular/core";
import { SignUpCommunitiesApi } from "./sign-up-communities.api";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { SignUpCommunitiesState } from "./sign-up-communities.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([SignUpCommunitiesState])],
  providers: [SignUpCommunitiesApi],
})

export class SignUpCommunitiesModule{}