import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'done',
  imports: [],
  templateUrl: './done.html',
  styleUrl: './done.css',
})
export class Done {
  router = inject(Router);

  handleDone() {
    this.router.navigate([""]);
  }
}
