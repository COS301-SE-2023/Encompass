import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ProfileState } from "./profile.state";
import { ProfileApi } from "./profile.api";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([ProfileState])],
  providers: [ProfileApi],
})

export class ProfileModule{}