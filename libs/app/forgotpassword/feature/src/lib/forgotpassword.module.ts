import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ForgotpasswordPage } from './forgotpassword.component';
import { ForgotpasswordRouting } from './forgotpassword.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, ForgotpasswordRouting, ],
  declarations: [ForgotpasswordPage],
  providers: [],
})
export class ForgotpasswordModule {}