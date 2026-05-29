import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

/**
 * CoreModule — import ONCE in AppModule only.
 * Contains singleton services (QuestionService, QuizService, LoadingService)
 * and the global HTTP loading interceptor.
 *
 * The guard constructor throws if a second import is detected
 * (e.g. accidentally imported in a lazy-loaded feature module).
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule   // Provides the single HttpClient instance for the whole app
  ],
  providers: [
    // Register LoadingInterceptor for every outgoing HTTP request
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
