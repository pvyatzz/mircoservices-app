import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

/** Full-page overlay spinner displayed while any HTTP request is in-flight */
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  // Injected so the template can use async pipe directly on loading$
  constructor(public loadingService: LoadingService) {}
}
