// src/app/app.component.ts
import { Component } from '@angular/core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Prompt Refiner v4o-mini'; // Updated title
  messages: Message[] = [];
  loading: boolean = false;

  onNewMessage(message: Message) {
    this.messages.push(message);
  }

  onLoadingStatus(loading: boolean) {
    this.loading = loading;
  }
}