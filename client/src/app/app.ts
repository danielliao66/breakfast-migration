import { Component, signal } from '@angular/core';
import { RouteReuseStrategy, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    {
      provide: RouteReuseStrategy,
      useValue: {
        shouldDetach: () => false,
        store: () => null,
        retrieve: () => null,
        shouldAttach: () => false,
        shouldReuseRoute: () => false
      }
    }
  ]
})
export class App {
  protected readonly title = signal('client');
}
