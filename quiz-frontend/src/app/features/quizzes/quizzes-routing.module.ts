import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { QuizTakeComponent } from './quiz-take/quiz-take.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';

/** Feature routes — all prefixed with /quizzes via app-routing.module.ts */
const routes: Routes = [
  { path: 'create', component: QuizCreateComponent },   // /quizzes/create
  { path: 'take',   component: QuizTakeComponent },     // /quizzes/take
  { path: 'result', component: QuizResultComponent },   // /quizzes/result
  { path: '',       redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizzesRoutingModule {}
