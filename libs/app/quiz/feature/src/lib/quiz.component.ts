import { Component } from '@angular/core';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizPage {
  questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  fillPercentage = 0;
  fillNumber = 0;
  totalNumber = 15;
  LessThanHalf = true;
  MoreThanHalf = false;
  points = 0;

  fillCircle() {
    this.fillPercentage += 1 / this.totalNumber; // Increase by 1/totalNumber
    this.fillNumber += 1;
    this.points += 50;
    if (this.fillPercentage >= 1) {
      this.fillPercentage = 0;
      this.fillNumber = 0;
      this.LessThanHalf = true;
      this.MoreThanHalf = false;
      this.points = 0;
    }

    if (this.fillNumber > Math.floor(this.totalNumber / 2) + 1) {
      this.LessThanHalf = false;
      this.MoreThanHalf = true;
    }
  }
}
