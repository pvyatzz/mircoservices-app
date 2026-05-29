import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuizDto } from '../../features/quizzes/models/quiz.model';
import { QuestionWrapper, QuizResponse } from '../../features/questions/models/question.model';

/**
 * QuizService — wraps all Quiz Service REST endpoints.
 * All calls go through the API Gateway.
 *
 * Endpoint map (gateway prefix: /quiz-service/quiz):
 *   POST /create       body: QuizDto            → "Success" (plain text)
 *   POST /get/{id}     body: []                 → List<QuestionWrapper>
 *   POST /submit/{id}  body: List<Response>     → Integer (score)
 *
 * ⚠️  Known limitation: POST /create returns "Success" — not the quiz ID.
 *     Users must check the database or ask the backend team for their quiz ID.
 *     TODO: Backend should return the created entity ID for better UX.
 */
@Injectable({ providedIn: 'root' })
export class QuizService {
  /** Base URL constructed from environment — empty string in dev (proxy handles it) */
  private readonly base = `${environment.apiGatewayUrl}/quiz-service/quiz`;

  constructor(private http: HttpClient) {}

  // ─── POST /create ────────────────────────────────────────────────────────────
  /** Creates a quiz with random questions from the chosen category */
  createQuiz(quizDto: QuizDto): Observable<string> {
    return this.http.post(`${this.base}/create`, quizDto, { responseType: 'text' });
  }

  // ─── POST /get/{id} ──────────────────────────────────────────────────────────
  /**
   * Fetches questions for a quiz (without rightAnswer).
   * The backend expects a POST body even though it's empty — this is a backend quirk.
   */
  getQuizQuestions(quizId: number): Observable<QuestionWrapper[]> {
    return this.http.post<QuestionWrapper[]>(`${this.base}/get/${quizId}`, []);
  }

  // ─── POST /submit/{id} ───────────────────────────────────────────────────────
  /** Submits user answers and receives the integer score from Question Service (via Feign) */
  submitQuiz(quizId: number, responses: QuizResponse[]): Observable<number> {
    return this.http.post<number>(`${this.base}/submit/${quizId}`, responses);
  }
}
