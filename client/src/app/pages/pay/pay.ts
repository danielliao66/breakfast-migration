import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/orderService';
import { OrderedItem, Order } from '../../entities/entities';

@Component({
  selector: 'pay',
  imports: [],
  templateUrl: './pay.html',
  styleUrl: './pay.css',
})
export class Pay {
  orderService = inject(OrderService);
  router = inject(Router);
  orderedItems: OrderedItem[] = [];
  total: OrderedItem["price"] = 0;
  orderNumber = signal(1);
  option: Order["option"] = "";

  ngOnInit() {
    const cacheOrder = localStorage.getItem('orderedItems');
    const cacheNumber = localStorage.getItem('orderNumber');
    const cacheOption = localStorage.getItem('option');

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
      this.orderService.getOrderNumber().subscribe({
        next: (number: any) => {
          localStorage.setItem('orderNumber', JSON.stringify(number));
          this.orderNumber.set(number);
        },
        error: (err) => {
          console.error('get number request failed:', err);
        }
      });
    }

    if (cacheOption) {
      this.option = JSON.parse(cacheOption);
    }

    this.total = this.orderedItems.reduce(
      (accumulator: OrderedItem["price"], current: OrderedItem) => accumulator+current.price*current.quantity, 0
    );
  }
  handlePay() {
    const order = { items: this.orderedItems, number: this.orderNumber(), option: this.option };
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        console.log('API request succeeded:', response);
      },
      error: (err) => {
        console.error('API request failed:', err);
      }
    });
    localStorage.removeItem("orderedItems");
    localStorage.removeItem("indexMap");
    localStorage.removeItem("orderNumber");
    localStorage.removeItem("option");
    this.router.navigate(["done"]);
  }
}
