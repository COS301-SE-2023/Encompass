import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TsandcsPage } from './tsandcs.component';
import { TsandcsRouting } from './tsandcs.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, TsandcsRouting, ],
  declarations: [TsandcsPage],
  providers: [],
})
export class TsandcsModule {}