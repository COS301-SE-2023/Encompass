import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignUpPage } from './sign-up.component';
import { SignUpRouting } from './sign-up.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, SignUpRouting,],
  declarations: [SignUpPage],
  providers: [],
})
export class SignUpModule {}