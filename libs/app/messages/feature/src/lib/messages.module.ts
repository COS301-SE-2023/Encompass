import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessagesPage } from './messages.component';
import { MessagesRouting } from './messages.routing';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, MessagesRouting, FormsModule, ReactiveFormsModule],
  declarations: [MessagesPage],
  providers: [],
})
export class MessagesModule {}