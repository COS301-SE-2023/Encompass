import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreateCommunityComponent } from './create-community.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
// import { CreateCommunityState } from '@encompass/app/create-community/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  declarations: [CreateCommunityComponent],
  providers: [],
})
export class CreateCommunityModule {}