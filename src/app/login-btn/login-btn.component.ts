import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-btn.component.html',
  styleUrls: ['./login-btn.component.scss']  // Corrected from styleUrl to styleUrls
})
export class LoginBtnComponent implements OnInit {
  isAuthenticated: boolean = false; // Track authentication status

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    // Subscribe to the authentication state

  }

  login() {
    this.auth.loginWithRedirect().subscribe({
      next: () => {
        console.log("Login successful");
      },
      error: err => {
        console.error("Login failed", err);
      }
    });
  }

  logout() {
    this.auth.logout({logoutParams:{ returnTo: window.location.origin }});
  }

  ping() {
    console.log("Ping API test");
    this.api.ping$().subscribe({
      next: (res) => {
        console.log("Ping response:", res);
      },
      error: (err) => {
        console.error("Ping failed", err);
      }
    });
  }
}
