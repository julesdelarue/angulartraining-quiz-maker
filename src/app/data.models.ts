export interface Category {
  id: string;
  name: string;
  subCategories?:Category[]
}

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Quiz{
  questions:Question[];
  extraQuestions:Question[];
}
export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface Results {
  questions: Question[];
  answers: string[];
  score: number;
}


export type Difficulty = "Easy" | "Medium" | "Hard";

export const EMPTY_QUIZ:Quiz = {questions:[], extraQuestions:[]}
