import { Component } from '@angular/core';

/** AppComponent — root shell. Hosts the fixed navbar, router outlet, and global loading spinner. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'QuizApp';
}
