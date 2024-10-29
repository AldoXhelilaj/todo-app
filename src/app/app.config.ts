import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular'; // Ensure you have the correct import
import { routes } from './app.routes'; // Adjust the import based on your file structure
import { AuthHttpInterceptor } from '@auth0/auth0-angular'; // Import the interceptor if needed
import { environment as env } from '../enviroments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Provide the HttpClient module
    provideAuth0({
      ...env.auth,
      httpInterceptor: {
        ...env.httpInterceptor,
      },
      
    }),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor, // Use Auth0's interceptor if you want to add tokens automatically
      multi: true, // Allow multiple interceptors
    },
  ],
};
