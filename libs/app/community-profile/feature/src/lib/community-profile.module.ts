import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommunityProfileComponent } from './community-profile.component';
import { CommunityProfileRouting } from './community-profile.routing';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, CommunityProfileRouting, FormsModule, ReactiveFormsModule],
  declarations: [CommunityProfileComponent],
  providers: [],
})
export class CommunityProfileModule {}