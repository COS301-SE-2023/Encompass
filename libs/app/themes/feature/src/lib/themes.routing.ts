import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemesPage } from './themes.component';

const routes: Routes = [
  {
    path: '',
    component: ThemesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemesRouting {}
