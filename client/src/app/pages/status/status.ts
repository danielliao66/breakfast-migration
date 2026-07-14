import { Component, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { SignalrService } from '../../services/signalr';
import { OrderService } from '../../services/orderService';
import { Order } from '../../entities/entities';

@Component({
  selector: 'status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {
  private orderService = inject(OrderService);
  private signalrService = inject(SignalrService);
  private ordersPreparingInitial = signal<Order[] | null>(null);
  private ordersReadyInitial = signal<Order[] | null>(null);
  private ordersPreparingUpdates = signal<Order[]>([]);
  private ordersReadyUpdates = signal<Order[]>([]);
  ordersPreparing = linkedSignal({
    source: this.ordersPreparingInitial,
    computation: (orders) => [...orders!]
  });
  ordersReady = linkedSignal({
    source: this.ordersReadyInitial,
    computation: (orders) => [...orders!]
  });
  private initialized = false;

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
            .filter((updatedOrder: Order) => !ordersReady.some(order => order.id === updatedOrder.id));
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
    this.orderService.getOrdersCustomer().subscribe({
      next: (orders: Order[]) => {
        this.filterOrders(orders);
        this.initialized = true;
      },
      error: (err) => {
        console.error('get orders request failed:', err);
      }
    });    
  }
  filterOrders(orders: Order[]) {
    this.ordersPreparingInitial.set(orders.filter((order: Order) => order.status === "preparing"));
    this.ordersReadyInitial.set(orders.filter((order: Order) => order.status === "ready"));
  }
  handleTaken(index: number) {
    const updatedOrder = {...this.ordersReady()[index], status: "taken"};
    this.orderService.updateOrder(updatedOrder).subscribe({
      next: (response) => {
        console.log('update order request succeeded:', response);
      },
      error: (err) => {
        console.error('update order request failed:', err);
      }
    });
    this.ordersReady.set(this.ordersReady().toSpliced(index, 1));
  }
  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
