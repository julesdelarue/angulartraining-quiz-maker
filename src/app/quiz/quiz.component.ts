import {Component, inject, Input} from '@angular/core';
import {EMPTY_QUIZ, Quiz} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  quiz: Quiz = EMPTY_QUIZ;

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  submit(): void {
    this.quizService.computeScore(this.quiz.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  /**
   * Player is allowed to change a question, as long as there are extra questions left
   * @param index : index of the question to swap
   */
  swapQuestion(index:number) {
    const shiftedQuestion = this.quiz.extraQuestions.shift()
    if(shiftedQuestion) this.quiz.questions[index] = shiftedQuestion
  }
}
