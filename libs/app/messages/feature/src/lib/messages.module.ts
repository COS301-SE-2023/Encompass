import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesPage } from './messages.component';
import { MessagesRouting } from './messages.routing';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatScrollDirective } from './chat-scroll.directive';

// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, MessagesRouting, FormsModule, ReactiveFormsModule, NgxsModule.forFeature([ProfileState])],
  declarations: [MessagesPage,ChatScrollDirective],
  providers: [],
})
export class MessagesModule {}