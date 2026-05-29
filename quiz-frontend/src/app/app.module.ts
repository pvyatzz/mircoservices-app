import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// CoreModule — singleton services + HTTP loading interceptor (import ONCE here)
import { CoreModule } from './core/core.module';

// SharedModule — needed in AppModule so AppComponent can use NavbarComponent
// and LoadingSpinnerComponent (both declared inside SharedModule)
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Required for all Angular Material animations
    AppRoutingModule,
    CoreModule,               // Registers HttpClient + LoadingInterceptor globally
    SharedModule              // Exposes NavbarComponent + LoadingSpinnerComponent to AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
