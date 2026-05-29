import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionService } from '../../../core/services/question.service';
import { Question } from '../models/question.model';

/**
 * QuestionListComponent — sortable, paginated Material table of all questions.
 * Supports category filtering via chip row and a live search input.
 *
 * API calls:
 *   GET /question-service/question/allQuestions        — initial load
 *   GET /question-service/question/category/{category} — category filter
 */
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterViewInit {
  /** Columns rendered in the Material table */
  displayedColumns = ['id', 'questionTitle', 'category', 'difficultylevel', 'actions'];

  /** DataSource wires the data to MatTable with built-in sort/filter/paginate */
  dataSource = new MatTableDataSource<Question>();

  /** Distinct categories derived from loaded questions */
  categories: string[] = [];

  /** Currently selected category chip — null means "All" */
  selectedCategory: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadAllQuestions();
  }

  ngAfterViewInit(): void {
    // Must be wired after view init — paginator/sort won't exist before this
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Fetch all questions and populate the category filter list */
  private loadAllQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: questions => {
        this.dataSource.data = questions;
        this.categories = [...new Set(questions.map(q => q.category))].sort();
      }
    });
  }

  /** Filter by category chip — null resets to all questions */
  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    if (category) {
      // Call category filter endpoint
      this.questionService.getByCategory(category).subscribe({
        next: questions => (this.dataSource.data = questions)
      });
    } else {
      this.loadAllQuestions();
    }
  }

  /** Live text search across all columns (built into MatTableDataSource) */
  applySearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  /** Returns a CSS class name used to colour the difficulty badge */
  difficultyClass(level: string): string {
    const map: { [key: string]: string } = { easy: 'easy', medium: 'medium', hard: 'hard' };
    return map[level?.toLowerCase()] ?? 'medium';
  }
}
