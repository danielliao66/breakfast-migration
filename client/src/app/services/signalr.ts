import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private apiUrl = environment.apiUrl;
  public updateForCustomer = signal<any>(null);
  public updateForKitchen = signal<any>(null);

  constructor() {
    this.startConnection();
    this.addStatusListener();
  }

  private startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/statusHub`, {
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
      this.updateForCustomer.set(order);
    });
    this.hubConnection.on('UpdateForKitchen', (order: any) => {
      this.updateForKitchen.set(order);
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