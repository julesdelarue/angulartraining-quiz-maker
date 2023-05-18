import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
import {QuizService} from '../quiz.service';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  ANY_CATEGORY: Category = {name: "Any category", id: "0", subCategories: []}

  selectableDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"]
  selectableSubCategories: Category[] = [];
  categories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;
  quizForm = new FormGroup({
    mainCategories: new FormControl<Category>(this.ANY_CATEGORY),
    subCategories: new FormControl<Category | undefined>(undefined),
    difficulty: new FormControl<Difficulty>("Easy"),
  });

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories()
    this.quizForm.get('mainCategories')?.valueChanges.subscribe(selectedCategory => {

      // User changed first input, reset 2nd input anyway
      this.quizForm.get('subCategories')?.reset()

      // Set subcategories if possible
      this.selectableSubCategories = selectedCategory?.subCategories ?? []
      if (this.selectableSubCategories.length > 0) {
        this.quizForm.get('subCategories')?.setValue(this.selectableSubCategories[0])
      }
    })
  }

  createQuiz(): void {
    let category = this.quizForm.value.subCategories?.id ? this.quizForm.value.subCategories?.id : this.quizForm.value.mainCategories?.id
    this.questions$ = this.quizService.createQuiz(category ?? this.ANY_CATEGORY.id, this.quizForm.value.difficulty!);
  }
}
