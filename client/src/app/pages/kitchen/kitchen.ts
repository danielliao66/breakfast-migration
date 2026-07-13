import { Component, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { SignalrService } from '../../services/signalr';
import { SlicePipe } from '@angular/common';
import { Order, MenuItem } from '../../entities/entities';
import { OrderService } from '../../services/orderService';

@Component({
  selector: 'kitchen',
  imports: [SlicePipe],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css',
})

export class Kitchen {
  private orderService = inject(OrderService);
  private signalrService = inject(SignalrService);
  private ordersInitial = signal<Order[]>([]);
  private ordersUpdates = signal<Order[]>([]);
  private orders = linkedSignal({
    source: this.ordersInitial,
    computation: (orders) => [...orders]
  });
  private initialized = false;
  private expandedMap: Record<Order["id"], boolean> = {};
  private checkedMap: Record<Order["id"], Record<Order["id"], boolean>> = {};

  constructor() {
    effect(() => {
      const updatedOrder = this.signalrService.updateForKitchen();
      if (!updatedOrder) {
        return;
      }
      if (this.initialized) {
        const ordersUpdates = untracked(this.ordersUpdates);
        let orders = untracked(this.orders);
        if (ordersUpdates.length) {
          const ordersUpdatesFiltered = ordersUpdates
            .filter(updatedOrder => !orders.some(order => order.id === updatedOrder.id));
          this.orders.set([...orders, ...ordersUpdatesFiltered]);
          this.ordersUpdates.set([]);
        }
        orders = untracked(this.orders);
        if (!orders.some(order => order.id === updatedOrder.id)) {
          this.orders.set([...orders, updatedOrder]);
        }
      }
      else {
        const ordersUpdates = untracked(this.ordersUpdates);
        this.ordersUpdates.set([...ordersUpdates, updatedOrder]);
      }      
    });
  }
  ngOnInit() {
    this.orderService.getOrdersKitchen().subscribe({
      next: (orders: any) => {
        this.orders.set(orders);
        for (const order of orders) {
          this.expandedMap[order.id] = false;
        }
        this.initialized = true;
      },
      error: (err) => {
        console.error('get orders request failed:', err);
      }
    });
    
    const cacheChecked = localStorage.getItem('checkedMap');

    if (cacheChecked) {
      this.checkedMap = JSON.parse(cacheChecked);
    }
  }
  toggleExpand(orderId: Order["id"]) {
    this.expandedMap[orderId] = !this.expandedMap[orderId];
  }
  handleComplete(index: number) {
    const orders = this.orders();
    const updatedOrder = {...orders[index], status: "ready"};
    this.orderService.updateOrder(updatedOrder).subscribe({
      next: (response) => {
        console.log('update order request succeeded:', response);
      },
      error: (err) => {
        console.error('update order request failed:', err);
      }
    });
    delete updatedOrder.items;
    this.signalrService.UpdateForCustomer(updatedOrder);
    delete this.checkedMap[updatedOrder.id];
    if (orders.length == 1) {
      localStorage.removeItem("checkedMap");
    }
    this.orders.set(this.orders().toSpliced(index, 1));
  }
  handleChecked(orderId: Order["id"], itemId: MenuItem["id"]) {
    if (this.checkedMap[orderId] && this.checkedMap[orderId][itemId]) {
      this.checkedMap[orderId][itemId] = false;
    }
    else {
      this.checkedMap[orderId] = {};
      this.checkedMap[orderId][itemId] = true;
    }
    localStorage.setItem("checkedMap", JSON.stringify(this.checkedMap));
  }
  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
