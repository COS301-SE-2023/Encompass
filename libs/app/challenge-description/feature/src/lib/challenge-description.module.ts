import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChallengeDescriptionComponent } from './challenge-description.component';
import { ChallengeDescriptionRouting } from './challenge-description.routing';
import { NgxsModule } from '@ngxs/store';
//import { ChallengeDescriptionState } from '@encompass/app/challenge-description/data-access';


@NgModule({
  imports: [CommonModule, IonicModule, ChallengeDescriptionRouting], 
  declarations: [ChallengeDescriptionComponent],
  providers: [],
})
export class ChallengeDescriptionModule {}