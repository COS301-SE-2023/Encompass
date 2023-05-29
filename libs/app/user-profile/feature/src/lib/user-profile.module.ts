import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserProfile } from './user-profile.component';
import { UserProfileRouting } from './user-profile.routing';
// import { HomeApi } from '@encompass/app/home-page/data-access';
import { NgxsModule } from '@ngxs/store';
// import { HomeState } from '@encompass/app/home-page/data-access';

@NgModule({
  imports: [CommonModule, IonicModule, UserProfileRouting],
  declarations: [UserProfile],
  providers: [],
})
export class UserProfileModule {}


// NgxsModule.forFeature([HomeState])
//HomeApi