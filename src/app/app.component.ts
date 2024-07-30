import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  loading: boolean = false;
  userPrompt: string = '';

  handleNewMessage(message: { role: 'user' | 'assistant', content: string }) {
    this.messages.push(message);
    if (message.role === 'user') {
      this.userPrompt = message.content;
    }
  }

  handleLoadingStatus(status: boolean) {
    this.loading = status;
  }

  handleStreamComplete() {
    this.loading = false;
  }
}