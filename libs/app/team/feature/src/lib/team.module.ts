import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeamPage } from './team.component';
import { TeamRouting } from './team.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, TeamRouting, ],
  declarations: [TeamPage],
  providers: [],
})
export class TeamModule {}