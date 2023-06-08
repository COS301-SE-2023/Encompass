import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreatePostComponent } from './create-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { CreatePostState } from '@encompass/app/create-post/data-access';
// import { ProfileRouting } from './profile.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, NgxsModule.forFeature([CreatePostState])],
  declarations: [CreatePostComponent],
  providers: [],
})
export class CreatePostModule {}