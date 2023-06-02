import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpInterior2Page } from './sign-up-interior2.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpInterior2Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpInterior2Routing {}
