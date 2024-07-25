// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  loading: boolean = false;

  handleNewMessage(message: { role: 'user' | 'assistant', content: string }) {
    this.messages.push(message);
  }

  handleLoadingStatus(status: boolean) {
    this.loading = status;
  }
}