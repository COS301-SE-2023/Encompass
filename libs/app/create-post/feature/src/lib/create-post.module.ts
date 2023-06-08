import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreatePostComponent } from './create-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CreatePostState } from '@encompass/app/create-post/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, NgxsModule.forFeature([CreatePostState])],
  declarations: [CreatePostComponent],
  providers: [],
})
export class CreatePostModule {}