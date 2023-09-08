import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuizPage } from './quiz.component';
import { QuizRouting } from './quiz.routing';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, IonicModule, QuizRouting, FormsModule, ReactiveFormsModule],
  declarations: [QuizPage],
  providers: [],
})
export class QuizModule {}