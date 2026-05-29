import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { QuestionsRoutingModule } from './questions-routing.module';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionAddComponent } from './question-add/question-add.component';

/** Lazy-loaded Questions feature module — list and add-question pages */
@NgModule({
  declarations: [QuestionListComponent, QuestionAddComponent],
  imports: [SharedModule, QuestionsRoutingModule]
})
export class QuestionsModule {}
