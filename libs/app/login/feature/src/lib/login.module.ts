import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.component';
import { LoginRouting } from './login.routing';
import { NgxsModule } from '@ngxs/store';
import { LoginState } from '@encompass/app/login/data-access';
import { FormsModule } from '@angular/forms';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, LoginRouting, NgxsModule.forFeature([LoginState]), FormsModule],
  declarations: [LoginPage],
  providers: [],
})
export class LoginModule {}