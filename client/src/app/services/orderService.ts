import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Order, MenuItem } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  public getOrdersKitchen() {
    return this.http.get<Order[]>(`${this.apiUrl}/orders-kitchen`);
  }
  public updateOrder(updatedOrder: Order) {
    return this.http.put<Order>(`${this.apiUrl}/orders`, updatedOrder);
  }
  public getOrderNumber() {
    return this.http.get<Order["number"]>(`${this.apiUrl}/order-number`);
  }
  public createOrder(order: Order) {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }
  public getMenu() {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu`);
  }
  public getOrdersCustomer() {
    return this.http.get<Order[]>(`${this.apiUrl}/orders-customer`);
  }
}