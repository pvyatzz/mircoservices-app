import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionAddComponent } from './question-add/question-add.component';

/** Feature routes — all prefixed with /questions via app-routing.module.ts */
const routes: Routes = [
  { path: '',    component: QuestionListComponent },   // /questions
  { path: 'add', component: QuestionAddComponent }    // /questions/add
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule {}
