import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreatePostComponent } from './create-post.component';
// import { ProfileRouting } from './profile.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CreatePostComponent],
  providers: [],
})
export class CreatePostModule {}