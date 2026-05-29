import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * QuizResultComponent — score screen shown after quiz submission.
 * Receives score, total, and quizId from Angular Router navigation state
 * (set in QuizTakeComponent via router.navigate(['/quizzes/result'], { state: {...} })).
 */
@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {
  score = 0;
  total = 0;
  quizId: number | null = null;

  /** Score as a percentage (0–100) */
  get percentage(): number {
    return this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
  }

  /** Grade based on percentage — drives the emoji, label and colour */
  get grade(): { emoji: string; label: string; color: string } {
    if (this.percentage >= 80) return { emoji: '🏆', label: 'Excellent!',     color: '#2e7d32' };
    if (this.percentage >= 60) return { emoji: '👍', label: 'Good Job!',      color: '#f57f17' };
    if (this.percentage >= 40) return { emoji: '📚', label: 'Keep Studying!', color: '#e65100' };
    return                            { emoji: '💪', label: 'Try Again!',     color: '#c62828' };
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Router state is set by QuizTakeComponent — redirect if arrived directly
    const state = history.state as { score?: number; total?: number; quizId?: number };
    if (state?.score === undefined) {
      this.router.navigate(['/quizzes/take']);
      return;
    }
    this.score  = state.score;
    this.total  = state.total ?? 0;
    this.quizId = state.quizId ?? null;
  }
}
