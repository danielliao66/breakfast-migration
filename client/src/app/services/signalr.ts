import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private apiUrl = environment.apiUrl;
  public order = signal<any>({});

  constructor() {
    this.startConnection();
    this.addStatusListener();
  }

  private startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Started!'))
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  private addStatusListener = () => {
    this.hubConnection.on('UpdateForCustomer', (order: any) => {
      this.order.set(order);
    });
    this.hubConnection.on('UpdateForKitchen', (order: any) => {
      this.order.set(order);
    });
  }
  
  public async UpdateForCustomer(order: any) {
    try {
      await this.hubConnection.invoke('UpdateForCustomer', order);
    } catch (err) {
      console.error(err);
    }
  }

  public stopConnection() {
    this.hubConnection.stop();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService } from './services/signalr.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px;">
      <h3>Real-Time Broadcast Room</h3>
      
      <div *ngFor="let msg of signalrService.messages()">
        <strong>{{ msg.user }}:</strong> {{ msg.message }}
      </div>

      <input [(ngModel)]="username" placeholder="Name" />
      <input [(ngModel)]="messageText" placeholder="Message" />
      <button (click)="send()">Send Message</button>
    </div>
  `
})
export class ChatComponent {
  public signalrService = inject(SignalrService);
  
  username = '';
  messageText = '';

  send() {
    if (this.username && this.messageText) {
      this.signalrService.sendMessage(this.username, this.messageText);
      this.messageText = '';
    }
  }
}