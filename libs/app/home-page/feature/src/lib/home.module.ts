import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home-page.component';
import { HomeRouting } from './home.routing';
import { HomeApi } from '@encompass/app/home-page/data-access';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, HomeRouting,],
  declarations: [HomePage],
  providers: [HomeApi],
})
export class HomeModule {}