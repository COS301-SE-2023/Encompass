import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { UserProfileState } from "./user-profile.state";
import { UserProfileApi } from "./user-profile.api";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([UserProfileState])],
  providers: [UserProfileApi]
})

export class UserProfileModule{}