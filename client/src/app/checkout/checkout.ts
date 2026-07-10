import { Component, inject,  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  
  orderedItems: any;

  router = inject(Router);

  total: any;
  
  ngOnInit() {
    const cacheOrder = localStorage.getItem('orderedItems');

    if (cacheOrder) {
      this.orderedItems = JSON.parse(cacheOrder);
    }
    else {
      this.router.navigate(["menu"]);
    }

    this.total = this.orderedItems.reduce(
      (accumulator: any, current: any) => accumulator+current.price*current.quantity, 0
    );
  }
  handleAdd(index: number) {
    this.orderedItems[index].quantity += 1;
    localStorage.setItem('orderedItems', JSON.stringify(this.orderedItems));
    this.total += this.orderedItems[index].price;
  }
  handleRemove(index: number) {
    if (this.orderedItems[index].quantity > 0) {
      this.orderedItems[index].quantity -= 1;
      localStorage.setItem('orderedItems', JSON.stringify(this.orderedItems));
      this.total -= this.orderedItems[index].price;
    }
  }
  handleCheckout() {
    if (this.total > 0) {
      this.router.navigate(["pay"]);
    }
  }
}
