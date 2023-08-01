import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchExploreComponent } from './search-explore.component';
import { SearchExploreRouting } from './search-explore.routing';
import { NgxsModule } from '@ngxs/store';
import { SearchState } from '@encompass/app/search-explore/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, IonicModule, SearchExploreRouting, NgxsModule.forFeature([SearchState]), FormsModule, ReactiveFormsModule],
  declarations: [SearchExploreComponent],
  providers: [],
})
export class SearchExploreModule {}