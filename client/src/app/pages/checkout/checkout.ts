import { Component, inject,  } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderedItem, Order } from '../../entities/entities';

@Component({
  selector: 'checkout',
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  orderedItems!: OrderedItem[];
  private router = inject(Router);
  total!: OrderedItem["price"];
  option!: Order["option"];
  
  ngOnInit() {
    const cacheOrder = localStorage.getItem('orderedItems');

    if (cacheOrder) {
      this.orderedItems = JSON.parse(cacheOrder);
    }
    else {
      this.router.navigate(["menu"]);
    }

    this.total = this.orderedItems.reduce(
      (accumulator: OrderedItem["price"], current: OrderedItem) => accumulator+current.price*current.quantity, 0
    );

    const cacheOption = localStorage.getItem('option');

    if (cacheOption) {
      this.option = JSON.parse(cacheOption);
    }
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
  handleOption() {
    localStorage.setItem("option", JSON.stringify(this.option));
  }
}
