import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizMakerComponent} from './quiz-maker.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GameStatsComponent', () => {
  let component: QuizMakerComponent;
  let fixture: ComponentFixture<QuizMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QuizMakerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
