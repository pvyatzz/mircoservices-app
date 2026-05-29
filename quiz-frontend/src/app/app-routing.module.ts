import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Root application routes — all feature modules are lazy loaded (separate JS chunks).
 * All HTTP traffic flows through the API Gateway at localhost:8765.
 *
 * Startup order for backend services:
 *   1. Service Registry (port 8761)
 *   2. Question Service  (port 8080)
 *   3. Quiz Service      (port 8090)
 *   4. API Gateway       (port 8765)  ← Angular talks to this
 */
const routes: Routes = [
  {
    // Dashboard — lazy loaded
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    // Question list + add question — lazy loaded
    path: 'questions',
    loadChildren: () => import('./features/questions/questions.module').then(m => m.QuestionsModule)
  },
  {
    // Quiz create + take + result — lazy loaded
    path: 'quizzes',
    loadChildren: () => import('./features/quizzes/quizzes.module').then(m => m.QuizzesModule)
  },
  // Redirect unknown paths back to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

