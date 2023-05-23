import {Component} from '@angular/core';
import {Category, Difficulty, EMPTY_QUIZ, Quiz} from '../data.models';
import {map, Observable} from 'rxjs';
import {QuizService} from '../quiz.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DropdownOption} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  protected  readonly DEFAULT_DIFFICULTY: Difficulty = "Easy"
  protected readonly EMPTY_QUIZ = EMPTY_QUIZ;

  difficulties: Difficulty[] = [this.DEFAULT_DIFFICULTY, "Medium", "Hard"]
  selectableSubCategories: DropdownOption<Category>[] = [];
  categories$: Observable<DropdownOption<Category>[]>;

  quiz$!: Observable<Quiz>;

  quizForm = new FormGroup({
    mainCategories: new FormControl<Category | undefined>(undefined, Validators.required),
    subCategories: new FormControl<Category | undefined>(undefined),
    difficulty: new FormControl<Difficulty>(this.DEFAULT_DIFFICULTY, Validators.required),
  });

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(map(c => c.map(x => this.toDropdownOption(x))))

    // TODO remember obs
    this.quizForm.get('mainCategories')?.valueChanges.subscribe(selectedCategory => {
      // User changed first input, reset 2nd input anyway
      this.quizForm.get('subCategories')?.setValidators([])
      this.quizForm.get('subCategories')?.reset()
      // Set subcategories if possible
      this.selectableSubCategories = selectedCategory?.subCategories?.map(x => this.toDropdownOption(x)) ?? []
      if (this.selectableSubCategories.length > 0) {
        this.quizForm.get('subCategories')?.setValidators(Validators.required);
        this.quizForm.get('subCategories')?.setValue(this.selectableSubCategories[0])
      }
    })
  }

  private toDropdownOption(category: Category):DropdownOption<Category> {
    return {...category, id: category.id, label: category.name};
  }

  createFromForm():{categoryId:string, difficulty:Difficulty} {
    const subCategoryId = this.quizForm.value.subCategories?.id;
    const categoryId = subCategoryId ? subCategoryId : this.quizForm.value.mainCategories?.id
    const difficulty = this.quizForm.value.difficulty ?? this.DEFAULT_DIFFICULTY
    return {categoryId:categoryId ?? "0",difficulty}
  }

  createQuiz(): void {
    if (this.quizForm.valid) {
      const quiz = this.createFromForm();
      this.quiz$ = this.quizService.createQuiz(quiz.categoryId, quiz.difficulty);
    }
  }

  // https://angular.io/guide/form-validation#built-in-validator-functions
  get mainCategory() {
    return this.quizForm.get('mainCategories');
  }

  get subCategory() {
    return this.quizForm.get('subCategories');
  }
}
