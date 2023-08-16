import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EventPage } from './event.component';
import { EventRouting } from './event.routing';
import { NgxsModule } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';


@NgModule({
  imports: [CommonModule, IonicModule, EventRouting, NgxsModule.forFeature([HomeState])],
  declarations: [EventPage],
  providers: [],
})
export class EventModule {}