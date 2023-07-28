import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FeedPage } from './feed.component';
import { FeedRouting } from './feed.routing';
import { NgxsModule } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';


@NgModule({
  imports: [CommonModule, IonicModule, FeedRouting, NgxsModule.forFeature([HomeState])],
  declarations: [FeedPage],
  providers: [],
})
export class FeedModule {}