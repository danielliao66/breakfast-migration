import { Component, inject, signal } from '@angular/core';
import { Start } from './start/start';
import { Menu } from './menu/menu';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [Start, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  state = "start";
  http = inject(HttpClient);
  apiUrl = "http://localhost:5094";
  menuItems: any;

  changeToMenu() {
    this.state = "menu";
  }
  changeToCheckout() {
    this.state = "checkout";
  }
  changeToStart() {
    this.state = "start";
  }
  ngOnInit() {
    this.http.get(`${this.apiUrl}/menu`).subscribe({
      next: (data) => {
        this.menuItems = data;
        console.log(this.menuItems)
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
  }
}
