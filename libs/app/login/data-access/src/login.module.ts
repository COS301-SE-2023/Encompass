import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { LoginState } from "./login.state";
import { LoginApi } from "./login.api";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([LoginState])],
  providers: [LoginApi],
})

export class LoginModule{}