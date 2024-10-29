import { bootstrapApplication } from '@angular/platform-browser';
 import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthModule, provideAuth0 } from '@auth0/auth0-angular';
import { ApplicationConfig } from "@angular/core";

// const authConfig = {
//   domain: 'dev-xkp8v214xycxwk2f.us.auth0.com',
//   clientId: 'ZlGNI953zEaMolkWQ1Vmjv9klrmksC4V',
//   authorizationParams: {
//     audience: "8QquRBRXI2peaFd1nU-bLrxx_MNKxY-7XNzP5T8YauKnjlyCa6PpYKgf2ES02XCt"
//   }

// }
// const appConfig: ApplicationConfig = {
//   providers:
//     [
//       provideAuth0(authConfig)
//     ]
// }

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
