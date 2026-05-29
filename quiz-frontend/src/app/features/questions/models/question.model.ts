/** Full question entity stored in the Question Service database (table: question) */
export interface Question {
  /** Auto-generated primary key */
  id?: number;
  /** The question text */
  questionTitle: string;
  /** Answer option A */
  option1: string;
  /** Answer option B */
  option2: string;
  /** Answer option C */
  option3: string;
  /** Answer option D */
  option4: string;
  /** Correct answer — must exactly match one of option1–option4 */
  rightAnswer: string;
  /** Difficulty level: Easy | Medium | Hard */
  difficultylevel: string;
  /** Subject category, e.g. Java, Python, SQL */
  category: string;
}

/**
 * Reduced question DTO returned when a quiz is being taken.
 * The rightAnswer is intentionally excluded by the backend.
 */
export interface QuestionWrapper {
  id: number;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

/**
 * User's answer for a single question — sent as part of the score request.
 * Named QuizResponse to avoid collision with the browser's built-in Response.
 */
export interface QuizResponse {
  /** The question's ID */
  id: number;
  /** The user's selected answer text */
  response: string;
}
