import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Category, Difficulty, ApiQuestion, Question, Results, Quiz} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      map(res => this.reduceCategories(res.trivia_categories))
    );
  }

  /**
   * Group the categories together
   * @param trivia_categories
   * @private
   */
  reduceCategories(trivia_categories: Category[]):Category[] {
    return trivia_categories.reduce((categories, current) => {

      if (this.isSubcategory(current)) {
        this.addOrCreateSubcategory(current, categories);
      } else {
        categories.push({...current})
      }
      return categories
    }, new Array<Category>());
  }

  private addOrCreateSubcategory(current: Category, categories: Category[]) {
    const [mainCategoryName, subCategoryName] = current.name.split(":")
    const existingCategory = categories.find(e => e.name === mainCategoryName)

    if (existingCategory) {
      // Add
      existingCategory.subCategories?.push({name: subCategoryName.trim(), id: current.id})
    } else {
      // Create
      categories.push({
        name: mainCategoryName,
        subCategories: [{name: subCategoryName.trim(), id: current.id}],
        id: current.id
      })
    }
  }

  private isSubcategory(current: Category) {
    return current.name.includes(":");
  }

  createQuiz(categoryId: string, difficulty: Difficulty, questionAmount=5, extraQuestionAmount=1): Observable<Quiz> {
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=${questionAmount+extraQuestionAmount}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const questions: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));

          return {
            questions:questions.splice(0,questionAmount),
            extraQuestions:questions
          };
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}
