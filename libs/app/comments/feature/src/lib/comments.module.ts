import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommentsComponent } from './comments.component';
import { CommentsRouting } from './comments.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, CommentsRouting,],
  declarations: [CommentsComponent],
  providers: [],
})
export class CommentsModule {}