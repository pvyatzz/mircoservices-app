import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Question, QuestionWrapper, QuizResponse } from '../../features/questions/models/question.model';

/**
 * QuestionService — wraps all Question Service REST endpoints.
 * All calls go through the API Gateway.
 *
 * Endpoint map (gateway prefix: /question-service/question):
 *   GET  /allQuestions                                 → List<Question>
 *   GET  /category/{category}                          → List<Question>
 *   POST /add                          body: Question  → "success"
 *   GET  /generate?categoryName=&numQuestions=         → List<Integer>
 *   POST /getQuestions                 body: number[]  → List<QuestionWrapper>
 *   POST /getScore                     body: Response[]→ Integer
 */
@Injectable({ providedIn: 'root' })
export class QuestionService {
  /** Base URL constructed from environment — empty string in dev (proxy handles it) */
  private readonly base = `${environment.apiGatewayUrl}/question-service/question`;

  /** Internal cache of all questions used to derive available categories */
  private allQuestionsCache = new BehaviorSubject<Question[]>([]);

  /** Observable of distinct, sorted category names — derived from cached questions */
  readonly categories$ = this.allQuestionsCache.pipe(
    map(questions => [...new Set(questions.map(q => q.category))].sort())
  );

  constructor(private http: HttpClient) {}

  // ─── GET /allQuestions ───────────────────────────────────────────────────────
  /** Fetches all questions and populates the categories$ cache */
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.base}/allQuestions`).pipe(
      tap(questions => this.allQuestionsCache.next(questions))
    );
  }

  // ─── GET /category/{category} ───────────────────────────────────────────────
  /** Returns questions filtered by the given category */
  getByCategory(category: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.base}/category/${category}`);
  }

  // ─── POST /add ──────────────────────────────────────────────────────────────
  /** Adds a new question; backend responds with plain text "success" */
  addQuestion(question: Question): Observable<string> {
    return this.http.post(`${this.base}/add`, question, { responseType: 'text' });
  }

  // ─── GET /generate ──────────────────────────────────────────────────────────
  /** Asks the backend to randomly select question IDs for a given category */
  generateQuestionIds(categoryName: string, numQuestions: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.base}/generate`, {
      params: { categoryName, numQuestions: numQuestions.toString() }
    });
  }

  // ─── POST /getQuestions ─────────────────────────────────────────────────────
  /** Returns QuestionWrapper objects (no rightAnswer) for the given question IDs */
  getQuestionsByIds(ids: number[]): Observable<QuestionWrapper[]> {
    return this.http.post<QuestionWrapper[]>(`${this.base}/getQuestions`, ids);
  }

  // ─── POST /getScore ─────────────────────────────────────────────────────────
  /** Submits user responses and returns the integer score */
  getScore(responses: QuizResponse[]): Observable<number> {
    return this.http.post<number>(`${this.base}/getScore`, responses);
  }
}
