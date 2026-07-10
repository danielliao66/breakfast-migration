import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class Start {
  http = inject(HttpClient);
  apiUrl = "http://localhost:5094";
  router = inject(Router);

  ngOnInit() {
    this.http.get(`${this.apiUrl}/menu`).subscribe({
      next: (data) => {
        localStorage.setItem('menuItems', JSON.stringify(data));
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
  }
  handleStart() {
    this.router.navigate(["menu"]);
  }
}
