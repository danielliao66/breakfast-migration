import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'pay',
  imports: [],
  templateUrl: './pay.html',
  styleUrl: './pay.css',
})
export class Pay {
  http = inject(HttpClient);
  apiUrl = "http://localhost:5094";
  router = inject(Router);
  orderedItems: any;
  total: any;
  orderNumber = signal(1);

  ngOnInit() {
    const cacheOrder = localStorage.getItem('orderedItems');
    const cacheNumber = localStorage.getItem('orderNumber');

    if (cacheOrder) {
      this.orderedItems = JSON.parse(cacheOrder);
    }
    else {
      this.router.navigate(["checkout"]);
    }

    if (cacheNumber) {
      this.orderNumber.set(JSON.parse(cacheNumber));
    }
    else {
      this.http.get(`${this.apiUrl}/order-number`).subscribe({
        next: (data: any) => {
          localStorage.setItem('orderNumber', JSON.stringify(data));
          this.orderNumber.set(data);
        },
        error: (err) => {
          console.error('API request failed:', err);
          this.ngOnInit();
        }
      });
    }

    this.total = this.orderedItems.reduce(
      (accumulator: any, current: any) => accumulator+current.price*current.quantity, 0
    );
  }
  handlePay() {
    this.http.post(`${this.apiUrl}/orders`, { items: this.orderedItems, number: this.orderNumber() }).subscribe({
      next: (response) => {
        console.error('API request succeeded:', response);
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
    
    this.router.navigate(["done"]);
  }
}
