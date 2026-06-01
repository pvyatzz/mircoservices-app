import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { QuizService } from '../../../core/services/quiz.service';
import { QuestionWrapper, QuizResponse } from '../../questions/models/question.model';

/**
 * QuizTakeComponent — two-phase component:
 *   Phase 1: User enters a Quiz ID → GET /quiz-service/quiz/get/{id}
 *   Phase 2: MatStepper shows one question per step with radio-button answers
 *            → Submit → POST /quiz-service/quiz/submit/{id}
 *
 * Score + total are passed to QuizResultComponent via Angular Router state.
 */
@Component({
  selector: 'app-quiz-take',
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.scss']
})
export class QuizTakeComponent implements OnInit {
  /** Phase 1: form for entering the quiz ID */
  idForm!: FormGroup;

  /** Quiz ID confirmed after loading */
  quizId: number | null = null;

  /** Questions fetched from Quiz Service */
  questions: QuestionWrapper[] = [];

  /** Maps question ID → user's selected answer text */
  answers: { [questionId: number]: string } = {};

  /** Whether phase 2 (question answering) is active */
  questionsLoaded = false;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idForm = this.fb.group({
      quizId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  /** Phase 1 submit — loads questions for the given quiz ID */
  loadQuiz(): void {
    if (this.idForm.invalid) return;
    this.quizId = +this.idForm.value.quizId;

    // POST /quiz-service/quiz/get/{id} with empty body (backend requirement)
    this.quizService.getQuizQuestions(this.quizId).subscribe({
      next: questions => {
        if (questions.length === 0) {
          this.snackBar.open('No questions found for this quiz ID.', 'Close', { duration: 3000 });
          return;
        }
        this.questions = questions;
        this.questionsLoaded = true;
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.status === 404
          ? `No quiz found with ID ${this.quizId}. Check the ID or create a new quiz.`
          : err.status === 0
          ? 'Cannot reach the server. Make sure all services are running (Service Registry → API Gateway → Question Service → Quiz Service).'
          : `Failed to load quiz (error ${err.status}). Make sure all services are running.`;
        this.snackBar.open(msg, 'Close', { duration: 6000 });
      }
    });
  }

  /** Record user's answer for a question */
  selectAnswer(questionId: number, answer: string): void {
    this.answers[questionId] = answer;
  }

  /** Returns true if the user has selected an answer for the given question */
  isAnswered(questionId: number): boolean {
    return !!this.answers[questionId];
  }

  /** Count of answered questions — drives the progress bar */
  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  /** Phase 2 submit — sends all responses and navigates to result page */
  submitQuiz(): void {
    if (!this.quizId) return;

    // Build the Response[] array the backend expects
    const responses: QuizResponse[] = this.questions.map(q => ({
      id: q.id,
      response: this.answers[q.id] || ''
    }));

    // POST /quiz-service/quiz/submit/{id} — returns integer score
    this.quizService.submitQuiz(this.quizId, responses).subscribe({
      next: score => {
        // Pass data to QuizResultComponent via Router navigation state
        this.router.navigate(['/quizzes/result'], {
          state: { score, total: this.questions.length, quizId: this.quizId }
        });
      },
      error: () => {
        this.snackBar.open('Failed to submit quiz. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
