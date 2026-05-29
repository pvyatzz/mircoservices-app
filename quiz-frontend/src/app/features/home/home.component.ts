import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../core/services/question.service';

/**
 * HomeComponent — Dashboard landing page.
 * Calls getAllQuestions() on init to display stats and prime the categories cache
 * (used later by the Create Quiz form without a second network request).
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  totalQuestions = 0;
  categories: string[] = [];
  isLoading = true;
  backendOnline = true;

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all questions to populate stats and prime the QuestionService categories cache
    this.questionService.getAllQuestions().subscribe({
      next: questions => {
        this.totalQuestions = questions.length;
        this.categories = [...new Set(questions.map(q => q.category))].sort();
        this.isLoading = false;
      },
      error: () => {
        // Backend may be offline during development — still render the page
        this.isLoading = false;
        this.backendOnline = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
