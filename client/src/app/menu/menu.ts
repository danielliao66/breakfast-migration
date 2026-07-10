import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuItems: any;
  orderedItems: any;
  length: any;
  indexMap: any

  router = inject(Router);
  
  ngOnInit() {
    const cacheMenu = localStorage.getItem('menuItems');
    const cacheOrder = localStorage.getItem('orderedItems');
    const cacheIndex = localStorage.getItem('indexMap');
    
    
    if (cacheMenu) {
      this.menuItems = JSON.parse(cacheMenu);
    }
    else {
      this.router.navigate([""]);
    }

    if (cacheOrder) {
      this.orderedItems = JSON.parse(cacheOrder);
    }
    else {
      this.orderedItems = [];
    }

    if (cacheIndex) {
      this.indexMap = JSON.parse(cacheIndex);
    }
    else {
      this.indexMap = {};
    }

    this.length = this.orderedItems.reduce(
      (accumulator: any, current: any) => accumulator+current.quantity, 0
    );
  }
  handleAdd(index: number) {
    if (!Object.hasOwn(this.indexMap, index)) {
      this.indexMap[index] = this.orderedItems.length;
      localStorage.setItem("indexMap", JSON.stringify(this.indexMap));
      let { imgUrl: _imgUrl, ...orderedItem } = this.menuItems[index];
      orderedItem.quantity = 0;
      this.orderedItems.push(orderedItem);
    }
    this.orderedItems[this.indexMap[index]].quantity += 1;
    localStorage.setItem('orderedItems', JSON.stringify(this.orderedItems));
    this.length += 1;
  }
  handleCheckout() {
    if (this.orderedItems.length > 0) {
      this.router.navigate(["/checkout"]);
    }
  }
}