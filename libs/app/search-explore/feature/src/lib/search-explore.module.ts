import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchExploreComponent } from './search-explore.component';
import { SearchExploreRouting } from './search-explore.routing';


@NgModule({
  imports: [CommonModule, IonicModule, SearchExploreRouting, ],
  declarations: [SearchExploreComponent],
  providers: [],
})
export class SearchExploreModule {

    
}