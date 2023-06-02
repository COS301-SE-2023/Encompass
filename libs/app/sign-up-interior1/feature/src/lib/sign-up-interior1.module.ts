import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignUpInterior1Page } from './sign-up-interior1.component';
import { SignUpInterior1Routing } from './sign-up-interior1.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, SignUpInterior1Routing,],
  declarations: [SignUpInterior1Page],
  providers: [],
})
export class SignUpInterior1Module {}