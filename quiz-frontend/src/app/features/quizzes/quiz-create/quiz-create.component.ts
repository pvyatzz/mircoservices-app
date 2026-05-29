import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizService } from '../../../core/services/quiz.service';
import { QuestionService } from '../../../core/services/question.service';

/**
 * QuizCreateComponent — form to create a new quiz via the Quiz Service.
 * Categories are fetched from the Question Service (cached in QuestionService).
 *
 * API: POST /quiz-service/quiz/create  (body: QuizDto)
 *
 * ⚠️  Backend limitation: the response is the string "Success" — not the quiz ID.
 *     After creation the user is redirected to "Take Quiz" to enter the ID manually.
 *     TODO: Ask the backend team to return the created entity ID.
 */
@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {
  quizForm!: FormGroup;
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private questionService: QuestionService,
    private router: Router,
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
      next: () => {
        this.snackBar.open(
          'Quiz created! Enter the quiz ID on the next page to start.',
          'Got it',
          { duration: 6000 }
        );
        this.router.navigate(['/quizzes/take']);
      },
      error: () => {
        this.snackBar.open(
          'Failed to create quiz. Check that all services are running.',
          'Close',
          { duration: 4000, panelClass: 'snack-error' }
        );
      }
    });
  }

  get f() { return this.quizForm.controls; }
}
