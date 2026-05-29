import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ── Angular Material Modules ─────────────────────────────────────────────────
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
// ─────────────────────────────────────────────────────────────────────────────

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

/** All Material modules used across feature modules — collected for easy re-export */
const MATERIAL_MODULES = [
  MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatSortModule,
  MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule,
  MatSnackBarModule, MatStepperModule,
  MatProgressBarModule, MatProgressSpinnerModule,
  MatDividerModule, MatRippleModule, MatTooltipModule
];

/**
 * SharedModule — imported in AppModule and every feature module that needs
 * Material components, routing directives, or shared UI components.
 * Do NOT import CoreModule here — CoreModule belongs in AppModule only.
 */
@NgModule({
  declarations: [
    NavbarComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    LoadingSpinnerComponent,
    ...MATERIAL_MODULES
  ]
})
export class SharedModule {}
