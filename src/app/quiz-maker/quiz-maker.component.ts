import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {map, Observable} from 'rxjs';
import {QuizService} from '../quiz.service';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {DropdownOption} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  // TODO decide if we get rid of any category
  ANY_CATEGORY: Category = {name: "Any category", id: "0", subCategories: []}

  selectableDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"]
  selectableSubCategories: DropdownOption<Category>[] = [];
  categories$: Observable<DropdownOption<Category>[]>;
  questions$!: Observable<Question[]>;
  extraQuestions$!: Observable<Question[]>;

  quizForm = new FormGroup({
    mainCategories: new FormControl<Category| undefined>(undefined, Validators.required),
    subCategories: new FormControl<Category | undefined>(undefined),
    difficulty: new FormControl<Difficulty>("Easy", Validators.required),
  });

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(map(c => c.map(x => ({...x, id:x.id, label:x.name}))))
    this.quizForm.get('mainCategories')?.valueChanges.subscribe(selectedCategory => {

      // User changed first input, reset 2nd input anyway
      this.quizForm.get('subCategories')?.reset()

      // Set subcategories if possible
      this.selectableSubCategories = selectedCategory?.subCategories?.map(x => ({...x, id:x.id, label:x.name})) ?? []
      if (this.selectableSubCategories.length > 0) {
        this.quizForm.get('subCategories')?.setValue(this.selectableSubCategories[0])
      }
    })
  }

  createQuiz(): void {
    let category = this.quizForm.value.subCategories?.id ? this.quizForm.value.subCategories?.id : this.quizForm.value.mainCategories?.id
    this.questions$ = this.quizService.createQuiz(category ?? this.ANY_CATEGORY.id, this.quizForm.value.difficulty!);
    this.extraQuestions$ = this.quizService.createQuiz(category ?? this.ANY_CATEGORY.id, this.quizForm.value.difficulty!, 1);
  }

  // https://angular.io/guide/form-validation#built-in-validator-functions
  get mainCategory():any{ return this.quizForm.get('mainCategories'); }

}
