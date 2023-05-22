import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Category, Difficulty, ApiQuestion, Question, Results} from './data.models';

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
      map(res => this.nestCategories(res.trivia_categories))
    );
  }

  /**
   * Group the categories together
   * @param trivia_categories
   * @private
   */
  nestCategories(trivia_categories: Category[]):Category[] {
    return trivia_categories.reduce((mainCategories, current) => {

      // TODO refacto/clean code
      // This can be splitted in main and sub categories
      if (current.name.includes(":")) {
        const [categoryName, subCategoryName] = current.name.split(":")
        const existingCategory = mainCategories.find(e => e.name === categoryName)
        if (existingCategory) {
          existingCategory.subCategories?.push({name: subCategoryName.trim(), id: current.id})
        } else {
          mainCategories.push({
            name: categoryName,
            subCategories: [{name: subCategoryName.trim(), id: current.id}],
            id: current.id
          })
        }
      } else {
        mainCategories.push({...current})
      }
      return mainCategories
    }, new Array<Category>());
  }

  createQuiz(categoryId: string, difficulty: Difficulty, questionAmount=5): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=${questionAmount}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
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
