import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpInterior1Page } from './sign-up-interior1.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpInterior1Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpInterior1Routing {}
