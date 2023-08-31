import { NgModule } from '@angular/core';
import {calendarPopoverComponent} from './calendarPopover.component';
import { CommonModule } from '@angular/common';
//import { NgxsModule } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [CommonModule, IonicModule], // NgxsModule.forFeature([CreatePostState])],
  declarations: [calendarPopoverComponent],
  providers: [],
})
export class calendarPopoverModule {}