import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PrivacyPage } from './privacy.component';
import { PrivacyRouting } from './privacy.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, PrivacyRouting, ],
  declarations: [PrivacyPage],
  providers: [],
})
export class PrivacyModule {}