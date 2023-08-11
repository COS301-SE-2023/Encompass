import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HelpPage } from './help.component';
import {FormsModule} from '@angular/forms';
import { HelpRouting } from './help.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, HelpRouting, FormsModule],
  declarations: [HelpPage],
  providers: [],
})
export class HelpModule {}