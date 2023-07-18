import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamPage } from './team.component';

const routes: Routes = [
  {
    path: '',
    component: TeamPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRouting {}
