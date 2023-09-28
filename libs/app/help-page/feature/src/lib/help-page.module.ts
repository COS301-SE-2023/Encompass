import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HelpPagePage } from './help-page.component';
import { HelpPageRouting } from './help-page.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, HelpPageRouting, ],
  declarations: [HelpPagePage],
  providers: [],
})
export class HelpPageModule {}