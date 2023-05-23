import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [QuizComponent],
    });
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render questions', () => {
    // GIVEN
    component.quiz.questions = [
      {question:"Mock question", all_answers:["0", "1", "2", "3"], correct_answer:"0", incorrect_answers:["1", "2", "3"]},
      {question:"Mock question 2", all_answers:["4", "5", "6", "7"], correct_answer:"7", incorrect_answers:["4", "5", "6"]},
    ]
    component.quiz.extraQuestions = [];

    //WHEN
    fixture.detectChanges()

    //THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-question').length).toBe(2)
  });

  it('should render change question button', () => {
    // GIVEN
    component.quiz.questions = [
      {question:"Mock question", all_answers:["0", "1", "2", "3"], correct_answer:"0", incorrect_answers:["1", "2", "3"]}
    ]
    component.quiz.extraQuestions = [{question:"Mock question 2", all_answers:["4", "5", "6", "7"], correct_answer:"7", incorrect_answers:["4", "5", "6"]},];

    //WHEN
    fixture.detectChanges()

    //THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[aria-label]')?.textContent).toContain("Change question")
  });

  it('should not render change question button', () => {
    // GIVEN
    component.quiz.questions = [
      {question:"Mock question", all_answers:["0", "1", "2", "3"], correct_answer:"0", incorrect_answers:["1", "2", "3"]}
    ]
    component.quiz.extraQuestions = [];

    //WHEN
    fixture.detectChanges()

    //THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[aria-label]')).toBeNull()
  });
});
