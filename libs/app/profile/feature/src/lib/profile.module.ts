import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile.component';
import { ProfileRouting } from './profile.routing';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, ProfileRouting, NgxsModule.forFeature([ProfileState]), FormsModule, ReactiveFormsModule],
  declarations: [ProfilePage],
  providers: [],
})
export class ProfileModule {}