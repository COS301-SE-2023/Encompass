import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignUpPage } from './sign-up.component';
import { SignUpRouting } from './sign-up.routing';
import { SignUpApi } from '@encompass/app/sign-up/data-access';
import { NgxsModule } from '@ngxs/store';
import { SignUpState } from '@encompass/app/sign-up/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, SignUpRouting, NgxsModule.forFeature([SignUpState])],
  declarations: [SignUpPage],
  providers: [],
})
export class SignUpModule {}