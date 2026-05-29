import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../../core/services/question.service';

/**
 * QuestionAddComponent — reactive form to submit a new question.
 * On success, navigates back to the question list.
 * API: POST /question-service/question/add
 */
@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.scss']
})
export class QuestionAddComponent implements OnInit {
  questionForm!: FormGroup;

  /** Options for the difficulty level select */
  difficultyLevels = ['Easy', 'Medium', 'Hard'];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // All fields are required; questionTitle has minimum length for quality
    this.questionForm = this.fb.group({
      questionTitle: ['', [Validators.required, Validators.minLength(10)]],
      option1:       ['', Validators.required],
      option2:       ['', Validators.required],
      option3:       ['', Validators.required],
      option4:       ['', Validators.required],
      rightAnswer:   ['', Validators.required],
      difficultylevel: ['Medium', Validators.required],
      category:      ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.questionForm.invalid) return;

    // POST new question to Question Service via API Gateway
    this.questionService.addQuestion(this.questionForm.value).subscribe({
      next: () => {
        this.snackBar.open('Question added successfully!', 'Dismiss', {
          duration: 3000,
          panelClass: 'snack-success'
        });
        this.router.navigate(['/questions']);
      },
      error: () => {
        this.snackBar.open('Failed to add question. Is Question Service running?', 'Close', {
          duration: 4000,
          panelClass: 'snack-error'
        });
      }
    });
  }

  /** Shorthand accessor for template form control references */
  get f() { return this.questionForm.controls; }
}
