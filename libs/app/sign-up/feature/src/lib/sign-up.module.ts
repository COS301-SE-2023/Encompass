import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignUpComponent } from './sign-up.component';
import { SignUpRouting } from './sign-up.routing';
import { NgxsModule } from '@ngxs/store';
import { SignUpState } from '@encompass/app/sign-up/data-access';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, SignUpRouting, NgxsModule.forFeature([SignUpState]), FormsModule],
  declarations: [SignUpComponent],
  providers: [],
})
export class SignUpModule {}