import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { QuizzesRoutingModule } from './quizzes-routing.module';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { QuizTakeComponent } from './quiz-take/quiz-take.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';

/** Lazy-loaded Quizzes feature module — create, take, result pages */
@NgModule({
  declarations: [QuizCreateComponent, QuizTakeComponent, QuizResultComponent],
  imports: [SharedModule, QuizzesRoutingModule]
})
export class QuizzesModule {}
