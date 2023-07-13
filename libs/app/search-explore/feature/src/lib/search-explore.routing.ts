import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchExploreComponent } from './search-explore.component';

const routes: Routes = [
  {
    path: '',
    component: SearchExploreComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchExploreRouting {
    
}
