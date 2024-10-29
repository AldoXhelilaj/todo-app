import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import  { LoginBtnComponent } from './login-btn/login-btn.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoComponent,LoginBtnComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app-angular';
}
