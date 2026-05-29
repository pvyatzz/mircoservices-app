import { Component } from '@angular/core';
import { Router } from '@angular/router';

/** Top navigation bar — always visible in the app shell */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public router: Router) {}
}
