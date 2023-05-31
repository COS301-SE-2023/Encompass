import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile.component';
import { ProfileRouting } from './profile.routing';
// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, ProfileRouting,],
  declarations: [ProfilePage],
  providers: [],
})
export class ProfileModule {}