import {Component, inject, Input} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] = [];

  @Input()
  extraQuestions: Question[] = [];

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  /**
   * Player is allowed to change a question, as long as there are extra questions left
   * @param index : index of the question to swap
   */
  swapQuestion(index:number) {
    const shiftedQuestion = this.extraQuestions.shift()
    if(shiftedQuestion) this.questions[index] = shiftedQuestion
  }
}
