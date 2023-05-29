import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SignUpApi } from "./sign-up.api";
import { SignUpState } from "./sign-up.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([SignUpState]) ],
  providers: [SignUpApi],
})

export class SignUpModule{}
