import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizService } from '../../../core/services/quiz.service';
import { QuestionService } from '../../../core/services/question.service';

/**
 * QuizCreateComponent — form to create a new quiz via the Quiz Service.
 * Categories are fetched from the Question Service (cached in QuestionService).
 *
 * API: POST /quiz-service/quiz/create  (body: QuizDto)
 * Response: quiz ID as plain string (e.g. "3")
 */
@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {
  quizForm!: FormGroup;
  categories: string[] = [];
  createdQuizId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      title:        ['', [Validators.required, Validators.minLength(3)]],
      categoryName: ['', Validators.required],
      numQuestions: [5,  [Validators.required, Validators.min(1), Validators.max(20)]]
    });

    // Use the QuestionService cache — getAllQuestions was likely already called by HomeComponent
    this.questionService.getAllQuestions().subscribe({
      next: questions => {
        this.categories = [...new Set(questions.map(q => q.category))].sort();
      }
    });
  }

  onSubmit(): void {
    if (this.quizForm.invalid) return;

    this.quizService.createQuiz(this.quizForm.value).subscribe({
      next: (idStr) => {
        this.createdQuizId = +idStr;
        this.snackBar.open(
          `Quiz created! Your Quiz ID is ${this.createdQuizId}.`,
          'Got it',
          { duration: 6000 }
        );
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.status === 0
          ? 'Cannot reach the server. Make sure all services are running (Service Registry → API Gateway → Question Service → Quiz Service).'
          : `Failed to create quiz (error ${err.status}). Check that all services are running.`;
        this.snackBar.open(msg, 'Close', { duration: 6000, panelClass: 'snack-error' });
      }
    });
  }

  get f() { return this.quizForm.controls; }
}
