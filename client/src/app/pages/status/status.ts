import { Component, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SignalrService } from '../../services/signalr';

@Component({
  selector: 'status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  signalrService = inject(SignalrService);
  ordersPreparingInitial = signal<any[]>([]);
  ordersReadyInitial = signal<any>([]);
  ordersPreparingUpdates = signal<any[]>([]);
  ordersReadyUpdates = signal<any>([]);
  ordersPreparing = linkedSignal({
    source: this.ordersPreparingInitial,
    computation: (orders) => [...orders]
  });
  ordersReady = linkedSignal({
    source: this.ordersReadyInitial,
    computation: (orders) => [...orders]
  });
  initialized = false;

  constructor() {
    effect(() => {
      const updatedOrder = this.signalrService.updateForCustomer();
      if (!updatedOrder) {
        return;
      }
      if (this.initialized) {
        const ordersPreparingUpdates = untracked(this.ordersPreparingUpdates);
        const ordersReadyUpdates = untracked(this.ordersReadyUpdates);
        let ordersPreparing = untracked(this.ordersPreparing);
        let ordersReady = untracked(this.ordersReady);
        if (ordersPreparingUpdates.length) {
          const ordersPreparingUpdatesFiltered = ordersPreparingUpdates
            .filter(updatedOrder => !ordersPreparing.some(order => order.id === updatedOrder.id));
          this.ordersPreparing.set([...ordersPreparing, ...ordersPreparingUpdatesFiltered]);
          this.ordersPreparingUpdates.set([]);
        }
        if (ordersReadyUpdates.length) {
          const ordersReadyUpdatesFiltered = ordersReadyUpdates
            .filter((updatedOrder: any) => !ordersReady.some(order => order.id === updatedOrder.id));
          this.ordersReady.set([...ordersReady, ...ordersReadyUpdatesFiltered]);
          this.ordersReadyUpdates.set([]);
        }
        ordersPreparing = untracked(this.ordersPreparing);
        ordersReady = untracked(this.ordersReady);
        if (updatedOrder.status === "preparing") {
          if (!ordersPreparing.some(order => order.id === updatedOrder.id)) {
            this.ordersPreparing.set([...ordersPreparing, updatedOrder]);
          }
        }
        else {
          if (!ordersReady.some(order => order.id === updatedOrder.id)) {
            const index = ordersPreparing.findIndex(order => order.id == updatedOrder.id);
            this.ordersPreparing.set(ordersPreparing.toSpliced(index, 1));
            this.ordersReady.set([...ordersReady, updatedOrder]);
          }
        }
      }
      else {
        if (updatedOrder.status === "preparing") {
          const ordersPreparingUpdates = untracked(this.ordersPreparingUpdates);
          this.ordersPreparingUpdates.set([...ordersPreparingUpdates, updatedOrder]);
        }
        else {
          const ordersReadyUpdates = untracked(this.ordersReadyUpdates);
          this.ordersReadyUpdates.set([...ordersReadyUpdates, updatedOrder]);
        }
      }      
    });
  }
  ngOnInit() {
    this.http.get(`${this.apiUrl}/orders-customer`).subscribe({
      next: (data: any) => {
        this.filterOrders(data);
        this.initialized = true;
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });    
  }
  filterOrders(orders: any) {
    this.ordersPreparingInitial.set(orders.filter((order: any) => order.status === "preparing"));
    this.ordersReadyInitial.set(orders.filter((order: any) => order.status === "ready"));
  }
  handleTaken(index: any) {
    const updatedOrder = {...this.ordersReady()[index], status: "taken"};
    this.http.put(`${this.apiUrl}/orders`, updatedOrder).subscribe({
      next: (response) => {
        console.log('API request succeeded:', response);
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
    this.ordersReady.set(this.ordersReady().toSpliced(index, 1));
  }
  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
