import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Order } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  public getOrdersKitchen() {
    return this.http.get(`${this.apiUrl}/orders-kitchen`);
  }
  public updateOrder(updatedOrder: Order) {
    return this.http.put(`${this.apiUrl}/orders`, updatedOrder);
  }
  public getOrderNumber() {
    return this.http.get(`${this.apiUrl}/order-number`);
  }
  public createOrder(order: Order) {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
}