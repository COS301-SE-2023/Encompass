import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignUpInterior2Page } from './sign-up-interior2.component';
import { SignUpInterior2Routing } from './sign-up-interior2.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, SignUpInterior2Routing,],
  declarations: [SignUpInterior2Page],
  providers: [],
})
export class SignUpInterior2Module {}