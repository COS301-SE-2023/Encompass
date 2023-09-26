import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home-page.component';
import { HomeRouting } from './home.routing';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { NgxsModule } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { AuthGuard } from '../auth.guard';

@NgModule({
  imports: [CommonModule, IonicModule, HomeRouting, NgxsModule.forFeature([HomeState])],
  declarations: [HomePage],
  providers: [DatePipe, AuthGuard],
})
export class HomeModule {}