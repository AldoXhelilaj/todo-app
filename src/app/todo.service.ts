import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { TodoItem } from "./models/todo-models";
import { from, map, Observable, switchMap, take } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import config from '../auth_config.json'
import {environment} from '../environments/environment'
import { response } from "express";



@Injectable({
    providedIn: 'root'
})


export class TodoService {
    constructor(private auth: AuthService, private http: HttpClient) {

    }
    addTodo(todo: TodoItem): Observable<any> {
        return this.auth.getAccessTokenSilently().pipe(
            take(1),
            switchMap(token => {
                const headers = new HttpHeaders({
                    Authorization: `Bearer ${token}`
                });
                console.log(token)

                return this.http.post(`${environment.apiUri}/api/todos`, todo, { headers });
            })
        );
    }

    getTodos(): Observable<TodoItem[]> {
        return this.auth.getAccessTokenSilently().pipe(
            take(1),
            switchMap(token => {
                const headers = new HttpHeaders({
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Ensure the content type is set
                });
                console.log(token)

                return this.http.get<TodoItem[]>(`${environment.apiUri}/api/todos`, { headers });
            })
        );
    }
    private getAuthHeaders() {
        return this.auth.getAccessTokenSilently().pipe(
            switchMap(token => {
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                });
                return from([{ headers }]);
            })
        );
    }
    completedTodo(todoId: string): Observable<TodoItem> {
        return this.getAuthHeaders().pipe(
            switchMap(({ headers }) => {
                return this.http.patch<TodoItem>(
                    `${environment.apiUri}/api/todos/${todoId}/toggle`,
                    {}, // Add empty body as second parameter
                    { headers } // Add headers as third parameter in options object
                );
            })
        );
    }

    deleteTodo(todoId:string): Observable<TodoItem> {
        return this.getAuthHeaders().pipe(
            switchMap(({ headers }) => {
                return this.http.delete<TodoItem>(
                    `${environment.apiUri}/api/todos/${todoId}`,
                    { headers } // Add headers as third parameter in options object
                );
            })
        )
    }

    updateTodoTitle(todo: TodoItem): Observable<TodoItem> {
        return this.auth.getAccessTokenSilently().pipe(
          take(1),
          switchMap(token => {
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            });
            return this.http.patch<TodoItem>(
              `${environment.apiUri}/api/todos/${todo._id}/edit`,
              { title: todo.title },
              { headers }
            );
          })
        );
      }
      




}


