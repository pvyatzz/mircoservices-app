import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * LoadingInterceptor — automatically shows/hides the global spinner for every
 * outgoing HTTP request. Tracks concurrent requests to avoid flicker when
 * multiple requests are in-flight simultaneously.
 *
 * Registered in CoreModule via HTTP_INTERCEPTORS multi-provider.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  /** Tracks how many HTTP requests are currently active */
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Show spinner when the FIRST request starts
    if (++this.activeRequests === 1) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        // Hide spinner only after ALL concurrent requests have completed
        if (--this.activeRequests === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}
