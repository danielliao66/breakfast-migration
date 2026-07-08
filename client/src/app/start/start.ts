import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class Start {
  @Output() changeState = new EventEmitter<void>();
  
  handleStart() {
    this.changeState.emit();
  }
}
