/** Request body for creating a new quiz via POST /quiz-service/quiz/create */
export interface QuizDto {
  /** Human-readable name for the quiz */
  title: string;
  /** Category to draw questions from (must match a category in the Question Service) */
  categoryName: string;
  /** How many random questions to include (1–20) */
  numQuestions: number;
}

/** Quiz entity stored in the Quiz Service database (table: quiz) */
export interface Quiz {
  id: number;
  title: string;
  /** IDs of questions included — stored as @ElementCollection in JPA */
  questionIds: number[];
}
