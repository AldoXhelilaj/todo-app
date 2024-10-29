import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { TodoComponent } from './app/todo/todo.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;