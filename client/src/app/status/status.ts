import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SignalrService } from '../services/signalr';

@Component({
  selector: 'status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {
  ordersPreparing = signal<any[]>([]);
  ordersReady = signal<any>([]);
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  signalrService = inject(SignalrService);

  constructor() {
    effect(() => {
      const updatedOrder = this.signalrService.order();
      if (updatedOrder.status === "preparing") {
        const ordersPreparing = this.ordersPreparing();
        if (!ordersPreparing.some(order => order.id === updatedOrder.id)) {
          this.ordersPreparing.set([...ordersPreparing, updatedOrder]);
        }
      }
      else {
        const ordersReady = this.ordersReady();
        if (!ordersReady.some((order: any) => order.id === updatedOrder.id)) {
          this.ordersPreparing.set([...ordersReady, updatedOrder]);
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    const cacheStatus = localStorage.getItem('status');

    if (cacheStatus) {
      this.filterOrders(JSON.parse(cacheStatus));
    }
    else {
      this.http.get(`${this.apiUrl}/orders`).subscribe({
        next: (data: any) => {
          localStorage.setItem("status", JSON.stringify(data));
          this.filterOrders(data);
        },
        error: (err) => {
          console.error('API request failed:', err);
        }
      });
    }    
  }
  filterOrders(orders: any) {
    this.ordersPreparing.set(orders.filter((order: any) => order.status === "preparing"));
    this.ordersReady.set(orders.filter((order: any) => order.status === "ready"));
  }
  handleTaken(index: any) {
    this.http.put(`${this.apiUrl}/orders`, this.ordersReady()[index]).subscribe({
      next: (response) => {
        console.log('API request succeeded:', response);
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
    this.ordersReady.set(this.ordersReady().filter((_: any, i: any) => i !== index));
  }
  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
