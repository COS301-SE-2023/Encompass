import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EventPage } from './event.component';
import { EventRouting } from './event.routing';
import { NgxsModule } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule,EventRouting, NgxsModule.forFeature([HomeState])],
  declarations: [EventPage],
  providers: [],
})
export class EventModule {}