import { bootstrapApplication } from '@angular/platform-browser';
 import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthModule, provideAuth0 } from '@auth0/auth0-angular';
import { ApplicationConfig } from "@angular/core";
import { environment } from './environments/environment';


console.log('Environment:', environment.production);


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
