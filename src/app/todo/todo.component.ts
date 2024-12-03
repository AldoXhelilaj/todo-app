import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { signal, computed } from '@angular/core';
import { FormsModule, NgModelGroup } from '@angular/forms';
import { TodoItem } from '../models/todo-models';
import { TodoService } from '../todo.service';
import { response } from 'express';
import { first, firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../api.service';
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule,],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'

})
export class TodoComponent implements OnInit {

  constructor(private todoService: TodoService, public auth: AuthService, private apiService: ApiService, private intervalService: IntervalService) {
    effect(() => {
      console.log("Todos Count:", this.todosCount())
    })
  }

  ngOnInit(): void {
    this.apiService.isAuthenticatedSync().subscribe(isAuth => {
      if (isAuth) {
        this.loadTodos();
      }
    })
    this.intervalService.customObservable(5).subscribe({
      next:(count:number) => {
        console.log("this interval is executed until count is", count)
      },
      complete: () => {
        console.log("this interval is completed at", )
      }
    })
  }
  todos = signal<TodoItem[]>([]);

  newTodo = signal<string>('');
  priority = signal<'low' | 'medium' | 'high'>('low');

  todosCount = computed(() => this.todos().length);
  isSaving: boolean = false;

  addTodo() {
    if (this.newTodo().length < 1) {
      return;
    }

    const newTodoItem: Omit<TodoItem, '_id'> = {
      title: this.newTodo(),
      completed: false,
      subtasks: [],
      editing: false,
      priority: this.priority()
    };

    // Send the new todo item to the backend
    this.todoService.addTodo(newTodoItem).subscribe({
      next: (response) => {
        console.log('Todo added:', response);
        // Update the local state only after confirming that the todo was added
        this.todos.update((todos) => [...todos, response]); // Assuming response contains the new todo
      },
      error: (err) => {
        console.error('Error adding todo:', err);
      }
    });

    // Clear input fields
    this.newTodo.set('');
    this.priority.set('low');
  }


  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos)
      },
      error: (error) => {
        console.error("Error Fetching todos:,", error)
      }
    })
  }

  async toggleTodoCompletion(todo: TodoItem) {
    if (!todo._id) {
      console.error('Todo ID is missing');
      return;
    }

    // Optimistically update the UI
    this.todos.update(todos =>
      todos.map(t =>
        t._id === todo._id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      const updatedTodo = await firstValueFrom(this.todoService.completedTodo(todo._id));
      // Update with the server response to ensure consistency
      this.todos.update(todos =>
        todos.map(t =>
          t._id === updatedTodo._id ? updatedTodo : t
        )
      )
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      // Revert the optimistic update on error
      this.todos.update(todos =>
        todos.map(t =>
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  }

  removeTodo(todo: TodoItem) {
    this.todoService.deleteTodo(todo._id as string).subscribe({
      next: () => {
        // Filter out the deleted todo from the local `todos` array
        this.todos.update((todos) => todos.filter((t) => t._id !== todo._id));
      },
      error: (err) => {
        console.error('Error deleting todo:', err);
      }
    });
  }


  editTodo(todo: TodoItem) {
    todo.originalTitle = todo.title; // Store the original title
    todo.editing = true;

  }


  cancelEdit(todo: TodoItem) {

    if (!this.isSaving) {
      todo.editing = false;
      todo.title = todo.originalTitle as string; // Reset the title if canceled
    }
  }

  saveEdit(todo: TodoItem) {
    // Disable editing mode locally
    this.isSaving = true

    // Call the service to save the updated title in the backend
    this.todoService.updateTodoTitle(todo).subscribe({
      next: (updatedTodo) => {
        // Update the local todo with the updated data
        this.todos.update(todos =>
          todos.map(t => (t._id === updatedTodo._id ? updatedTodo : t))
        );
        todo.editing = false;
        this.isSaving = false
      },
      error: (err) => {
        console.error("Error updating todo title:", err);
      }
    });
  }







}
