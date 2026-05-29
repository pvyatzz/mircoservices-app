import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * LoadingService — single source of truth for the global HTTP loading state.
 * The LoadingInterceptor writes here; the LoadingSpinnerComponent reads via async pipe.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  // Starts as false (no request in flight)
  private _loading = new BehaviorSubject<boolean>(false);

  /** Stream that components subscribe to for showing/hiding the spinner */
  readonly loading$: Observable<boolean> = this._loading.asObservable();

  show(): void { this._loading.next(true); }
  hide(): void { this._loading.next(false); }
}
