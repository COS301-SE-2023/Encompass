import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizPage } from './quiz.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: QuizPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRouting {}
