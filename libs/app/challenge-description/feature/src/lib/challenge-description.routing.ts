import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeDescriptionComponent } from './challenge-description.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChallengeDescriptionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengeDescriptionRouting {}