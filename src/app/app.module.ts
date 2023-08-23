import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { provideErrorTailorConfig } from '@ngneat/error-tailor';
import { Form2Component } from './form/form2.component';
import { AdminViewComponent } from './admin-view/admin-view.component';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination';

// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { CrudsAdministrarComponent } from './cruds-administrar/cruds-administrar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    Form2Component,
    AdminViewComponent,
    CrudsAdministrarComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    NgxPaginationModule,
    ToastrModule.forRoot({
      maxOpened: 6,
      preventDuplicates: true,
    }),
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-6u46zsblfibecxhy.us.auth0.com',
      clientId: 'E9wJUyuiznYjVgHBbhJ2NlGA8rfS7JDJ',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideErrorTailorConfig({
      errors: {
        useValue: {
          required: 'Este campo es requerido',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (error) => `Address isn't valid`,
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
