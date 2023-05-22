import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WelcomePage } from './welcome.component';
import { WelcomeRouting } from './welcome.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, WelcomeRouting,],
  declarations: [WelcomePage],
  providers: [],
})
export class WelcomeModule {}