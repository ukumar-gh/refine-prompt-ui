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
  title = 'refine-prompt-ui';
  messages: Message[] = [];
  loading: boolean = false;

  onNewMessage(message: Message) {
    this.messages.push(message);
  }

  onLoadingStatus(loading: boolean) {
    this.loading = loading;
  }
}