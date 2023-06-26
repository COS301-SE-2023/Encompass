import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FeedPage } from './feed.component';
import { FeedRouting } from './feed.routing';


@NgModule({
  imports: [CommonModule, IonicModule, FeedRouting, ],
  declarations: [FeedPage],
  providers: [],
})
export class FeedModule {}