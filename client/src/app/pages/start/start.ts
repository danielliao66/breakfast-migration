import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/orderService';
import { MenuItem } from '../../entities/entities';

@Component({
  selector: 'start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class Start {
  private orderService = inject(OrderService);
  private router = inject(Router);

  ngOnInit() {
    this.orderService.getMenu().subscribe({
      next: (menu: MenuItem[]) => {
        localStorage.setItem('menuItems', JSON.stringify(menu));
      },
      error: (err) => {
        console.error('get menu request failed:', err);
      }
    });
  }
  handleStart() {
    this.router.navigate(["menu"]);
  }
}
